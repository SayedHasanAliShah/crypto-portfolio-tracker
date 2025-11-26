export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
};

export const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
    }).format(value);
};

export const getCoinName = (id) => {
    const names = {
        bitcoin: 'Bitcoin',
        ethereum: 'Ethereum',
        solana: 'Solana',
        cardano: 'Cardano',
        ripple: 'XRP',
    };
    return names[id] || id;
};

export const getCoinSymbol = (id) => {
    const symbols = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        solana: 'SOL',
        cardano: 'ADA',
        ripple: 'XRP',
    };
    return symbols[id] || id.toUpperCase();
};
