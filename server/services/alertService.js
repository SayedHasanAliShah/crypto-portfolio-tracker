const Alert = require('../models/Alert');

const checkAlerts = async (prices, io) => {
    try {
        const activeAlerts = await Alert.find({ isActive: true });

        for (const alert of activeAlerts) {
            const coinId = alert.symbol.toLowerCase();
            // Map symbol to coinId if needed, for now assuming symbol matches coingecko id or we have a mapping
            // For simplicity, let's assume user enters 'bitcoin' as symbol

            if (prices[coinId]) {
                const currentPrice = prices[coinId].usd;
                let triggered = false;

                if (alert.condition === 'above' && currentPrice > alert.targetPrice) {
                    triggered = true;
                } else if (alert.condition === 'below' && currentPrice < alert.targetPrice) {
                    triggered = true;
                }

                if (triggered) {
                    io.emit('alert_triggered', {
                        message: `Price Alert: ${alert.symbol} is ${alert.condition} $${alert.targetPrice}. Current: $${currentPrice}`,
                        alertId: alert._id
                    });

                    // Deactivate alert or keep it? Let's deactivate to avoid spam
                    alert.isActive = false;
                    await alert.save();
                }
            }
        }
    } catch (error) {
        console.error('Error checking alerts:', error);
    }
};

module.exports = { checkAlerts };
