const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get all alerts
router.get('/', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new alert
router.post('/', async (req, res) => {
    const alert = new Alert({
        symbol: req.body.symbol,
        targetPrice: req.body.targetPrice,
        condition: req.body.condition,
        isActive: true,
    });

    try {
        const newAlert = await alert.save();
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete alert
router.delete('/:id', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndDelete(req.params.id);
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }
        res.json({ message: 'Alert deleted', alert });
    } catch (error) {
        console.error('Delete alert error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update alert (toggle active status)
router.patch('/:id', async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }
        if (req.body.isActive !== undefined) {
            alert.isActive = req.body.isActive;
        }
        const updatedAlert = await alert.save();
        res.json(updatedAlert);
    } catch (error) {
        console.error('Update alert error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
