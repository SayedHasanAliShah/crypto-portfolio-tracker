const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    symbol: { type: String, required: true, uppercase: true },
    targetPrice: { type: Number, required: true },
    condition: { type: String, enum: ['above', 'below'], required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', alertSchema);
