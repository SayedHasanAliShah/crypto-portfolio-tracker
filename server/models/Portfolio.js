const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    symbol: { type: String, required: true, uppercase: true }, // e.g., BTC
    name: { type: String, required: true }, // e.g., Bitcoin
    quantity: { type: Number, required: true },
    buyPrice: { type: Number, required: true }, // Average buy price
    addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
