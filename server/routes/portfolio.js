const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// GET all portfolio items
router.get('/', async (req, res) => {
    try {
        const items = await Portfolio.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST add new item
router.post('/', async (req, res) => {
    const { symbol, name, quantity, buyPrice } = req.body;

    try {
        // Check if exists, if so update quantity/avg price (simplified logic: just add new entry for now or update)
        // For this task, let's just create a new entry or update if symbol exists
        let item = await Portfolio.findOne({ symbol: symbol.toUpperCase() });

        if (item) {
            // Update weighted average price
            const totalCost = (item.quantity * item.buyPrice) + (quantity * buyPrice);
            const totalQty = item.quantity + quantity;
            item.buyPrice = totalCost / totalQty;
            item.quantity = totalQty;
            await item.save();
            res.json(item);
        } else {
            const newItem = new Portfolio({
                symbol,
                name,
                quantity,
                buyPrice
            });
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE item
router.delete('/:id', async (req, res) => {
    try {
        await Portfolio.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
