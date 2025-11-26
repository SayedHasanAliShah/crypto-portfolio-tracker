// Exchange Simulation Service
// Simulates price data from multiple cryptocurrency exchanges

const EXCHANGES = ['Binance', 'Coinbase', 'Kraken'];

/**
 * Simulates price variations across different exchanges
 * Real exchanges have slight price differences due to liquidity, fees, and market dynamics
 */
const simulateExchangePrices = (basePrice) => {
    const exchangePrices = {};

    EXCHANGES.forEach(exchange => {
        // Simulate price variation (±0.5% from base price)
        const variation = (Math.random() - 0.5) * 0.01; // -0.5% to +0.5%
        const exchangePrice = basePrice * (1 + variation);

        // Simulate trading volume (random between 1M and 100M)
        const volume24h = Math.floor(Math.random() * 99000000) + 1000000;

        exchangePrices[exchange] = {
            price: parseFloat(exchangePrice.toFixed(2)),
            volume24h: volume24h,
            lastUpdate: new Date().toISOString()
        };
    });

    return exchangePrices;
};

/**
 * Calculates the best price across all exchanges
 */
const getBestPrice = (exchangePrices) => {
    let bestBuyPrice = Infinity;
    let bestSellPrice = -Infinity;
    let bestBuyExchange = '';
    let bestSellExchange = '';

    Object.entries(exchangePrices).forEach(([exchange, data]) => {
        if (data.price < bestBuyPrice) {
            bestBuyPrice = data.price;
            bestBuyExchange = exchange;
        }
        if (data.price > bestSellPrice) {
            bestSellPrice = data.price;
            bestSellExchange = exchange;
        }
    });

    return {
        bestBuy: {
            exchange: bestBuyExchange,
            price: bestBuyPrice
        },
        bestSell: {
            exchange: bestSellExchange,
            price: bestSellPrice
        },
        spread: parseFloat((bestSellPrice - bestBuyPrice).toFixed(2)),
        spreadPercentage: parseFloat(((bestSellPrice - bestBuyPrice) / bestBuyPrice * 100).toFixed(2))
    };
};

/**
 * Calculates average price across all exchanges
 */
const getAveragePrice = (exchangePrices) => {
    const prices = Object.values(exchangePrices).map(data => data.price);
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return parseFloat((sum / prices.length).toFixed(2));
};

/**
 * Enriches price data with multi-exchange information
 */
const enrichWithExchangeData = (priceData) => {
    const enrichedData = {};

    Object.entries(priceData).forEach(([coinId, data]) => {
        const basePrice = data.usd;
        const exchangePrices = simulateExchangePrices(basePrice);
        const bestPrices = getBestPrice(exchangePrices);
        const averagePrice = getAveragePrice(exchangePrices);

        enrichedData[coinId] = {
            ...data,
            exchanges: exchangePrices,
            bestPrices: bestPrices,
            averagePrice: averagePrice,
            priceSource: 'aggregated'
        };
    });

    return enrichedData;
};

/**
 * Gets exchange-specific data for a single coin
 */
const getExchangeDataForCoin = (coinId, basePrice) => {
    const exchangePrices = simulateExchangePrices(basePrice);
    const bestPrices = getBestPrice(exchangePrices);
    const averagePrice = getAveragePrice(exchangePrices);

    return {
        coinId,
        exchanges: exchangePrices,
        bestPrices,
        averagePrice,
        totalVolume24h: Object.values(exchangePrices).reduce((sum, data) => sum + data.volume24h, 0)
    };
};

module.exports = {
    EXCHANGES,
    simulateExchangePrices,
    getBestPrice,
    getAveragePrice,
    enrichWithExchangeData,
    getExchangeDataForCoin
};
