const axios = require('axios');
const { checkAlerts } = require('./alertService');
const { enrichWithExchangeData } = require('./exchangeService');


// List of coins to track
const COINS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'];

let ioInstance = null;
let cachedPrices = null;
let lastFetchTime = 0;
let retryDelay = 60000; // Start with 60 seconds
let consecutiveErrors = 0;

// Cache TTL in milliseconds (30 seconds)
const CACHE_TTL = 30000;
// Base polling interval (60 seconds to respect rate limits)
const POLLING_INTERVAL = 60000;
// Max retry delay (5 minutes)
const MAX_RETRY_DELAY = 300000;

const fetchPrices = async () => {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedPrices && (now - lastFetchTime) < CACHE_TTL) {
        console.log('Using cached price data');
        return cachedPrices;
    }

    try {
        console.log('Fetching fresh price data from CoinGecko...');
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: COINS.join(','),
                vs_currencies: 'usd',
                include_24hr_change: true
            },
            timeout: 10000 // 10 second timeout
        });

        // Success - reset error tracking
        consecutiveErrors = 0;
        retryDelay = POLLING_INTERVAL;

        // Enrich with multi-exchange data
        const enrichedData = enrichWithExchangeData(response.data);

        // Update cache with enriched data
        cachedPrices = enrichedData;
        lastFetchTime = now;

        console.log('✓ Price data fetched and enriched with exchange data');

        if (ioInstance) {
            ioInstance.emit('price_update', enrichedData);
            // Check alerts with base prices (not exchange-specific)
            await checkAlerts(response.data, ioInstance);
        }

        return enrichedData;
    } catch (error) {
        consecutiveErrors++;

        if (error.response?.status === 429) {
            // Rate limited - implement exponential backoff
            retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
            console.error(`⚠ Rate limited (429). Backing off for ${retryDelay / 1000}s. Try reducing request frequency.`);
        } else {
            console.error('Error fetching prices:', error.message);
        }

        // Use cached data if available
        if (cachedPrices && ioInstance) {
            console.log('Using cached data due to fetch error');
            ioInstance.emit('price_update', cachedPrices);
            await checkAlerts(cachedPrices, ioInstance);
            return cachedPrices;
        }

        // Fallback to mock data only if no cache and multiple errors
        if (consecutiveErrors >= 3 && ioInstance) {
            console.log('⚠ Using mock data - API unavailable');
            const mockData = generateMockData();
            ioInstance.emit('price_update', mockData);
            await checkAlerts(mockData, ioInstance);
            return mockData;
        }

        return null;
    }
};

const generateMockData = () => {
    const mockData = {};
    COINS.forEach(coin => {
        // Generate realistic-looking prices
        const basePrices = {
            bitcoin: 43000,
            ethereum: 2300,
            solana: 100,
            cardano: 0.5,
            ripple: 0.6
        };

        mockData[coin] = {
            usd: basePrices[coin] * (0.95 + Math.random() * 0.1), // ±5% variation
            usd_24h_change: (Math.random() * 10) - 5
        };
    });

    // Enrich mock data with exchange information
    return enrichWithExchangeData(mockData);
};

const start = (io) => {
    ioInstance = io;

    console.log('🚀 Starting price service...');
    console.log(`📊 Tracking coins: ${COINS.join(', ')}`);
    console.log(`⏱️  Polling interval: ${POLLING_INTERVAL / 1000}s`);

    // Fetch immediately
    fetchPrices();

    // Fetch at regular intervals
    setInterval(() => {
        fetchPrices();
    }, POLLING_INTERVAL);
};

module.exports = { start, fetchPrices };
