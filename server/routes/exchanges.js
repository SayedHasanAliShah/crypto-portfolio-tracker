const express = require('express');
const router = express.Router();
const { getExchangeDataForCoin, EXCHANGES } = require('../services/exchangeService');

// Get list of supported exchanges
router.get('/', (req, res) => {
    res.json({
        exchanges: EXCHANGES,
        count: EXCHANGES.length,
        description: 'Simulated cryptocurrency exchange integrations'
    });
});

// Get exchange data for a specific coin
router.get('/:coinId', (req, res) => {
    const { coinId } = req.params;
    const { price } = req.query;

    if (!price) {
        return res.status(400).json({
            error: 'Price parameter is required',
            usage: '/api/exchanges/:coinId?price=50000'
        });
    }

    const basePrice = parseFloat(price);
    if (isNaN(basePrice) || basePrice <= 0) {
        return res.status(400).json({ error: 'Invalid price value' });
    }

    const exchangeData = getExchangeDataForCoin(coinId, basePrice);
    res.json(exchangeData);
});

module.exports = router;
