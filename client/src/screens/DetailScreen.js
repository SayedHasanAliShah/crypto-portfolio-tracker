import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { formatCurrency, formatPercentage, getCoinName } from '../utils/formatters';
import { colors, globalStyles } from '../styles/theme';

const DetailScreen = ({ route }) => {
    const { coinId, data } = route.params;
    const priceChange = data.usd_24h_change || 0;
    const isPositive = priceChange >= 0;

    return (
        <ScrollView style={globalStyles.container}>
            <View style={styles.header}>
                <Text style={styles.coinName}>{getCoinName(coinId)}</Text>
                <Text style={styles.coinSymbol}>{coinId.toUpperCase()}</Text>
            </View>

            <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Current Price</Text>
                <Text style={styles.price}>{formatCurrency(data.usd)}</Text>
                <Text
                    style={[
                        styles.priceChange,
                        { color: isPositive ? colors.success : colors.danger },
                    ]}>
                    {formatPercentage(priceChange)} (24h)
                </Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Market Information</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>24h Change:</Text>
                    <Text
                        style={[
                            styles.infoValue,
                            { color: isPositive ? colors.success : colors.danger },
                        ]}>
                        {formatPercentage(priceChange)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Price (USD):</Text>
                    <Text style={styles.infoValue}>{formatCurrency(data.usd)}</Text>
                </View>
            </View>

            {/* Exchange Comparison Section */}
            {data.exchanges && (
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Exchange Prices</Text>
                    <Text style={styles.sectionSubtitle}>
                        Compare prices across multiple exchanges
                    </Text>

                    {Object.entries(data.exchanges).map(([exchange, exchangeData]) => (
                        <View key={exchange} style={styles.exchangeRow}>
                            <View style={styles.exchangeInfo}>
                                <Text style={styles.exchangeName}>{exchange}</Text>
                                <Text style={styles.exchangeVolume}>
                                    Vol: ${(exchangeData.volume24h / 1000000).toFixed(1)}M
                                </Text>
                            </View>
                            <Text style={styles.exchangePrice}>
                                {formatCurrency(exchangeData.price)}
                            </Text>
                        </View>
                    ))}

                    {data.bestPrices && (
                        <View style={styles.bestPricesContainer}>
                            <View style={styles.bestPriceRow}>
                                <Text style={styles.bestPriceLabel}>🟢 Best Buy:</Text>
                                <View style={styles.bestPriceValue}>
                                    <Text style={styles.bestPriceExchange}>
                                        {data.bestPrices.bestBuy.exchange}
                                    </Text>
                                    <Text style={styles.bestPriceAmount}>
                                        {formatCurrency(data.bestPrices.bestBuy.price)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.bestPriceRow}>
                                <Text style={styles.bestPriceLabel}>🔴 Best Sell:</Text>
                                <View style={styles.bestPriceValue}>
                                    <Text style={styles.bestPriceExchange}>
                                        {data.bestPrices.bestSell.exchange}
                                    </Text>
                                    <Text style={styles.bestPriceAmount}>
                                        {formatCurrency(data.bestPrices.bestSell.price)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.spreadContainer}>
                                <Text style={styles.spreadLabel}>Spread:</Text>
                                <Text style={styles.spreadValue}>
                                    {formatCurrency(data.bestPrices.spread)} ({data.bestPrices.spreadPercentage}%)
                                </Text>
                            </View>
                        </View>
                    )}

                    {data.averagePrice && (
                        <View style={styles.averagePriceContainer}>
                            <Text style={styles.averagePriceLabel}>Average Price:</Text>
                            <Text style={styles.averagePriceValue}>
                                {formatCurrency(data.averagePrice)}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>About {getCoinName(coinId)}</Text>
                <Text style={styles.description}>
                    {coinId === 'bitcoin' && 'Bitcoin is the first decentralized cryptocurrency. It was created in 2009 by an unknown person using the alias Satoshi Nakamoto.'}
                    {coinId === 'ethereum' && 'Ethereum is a decentralized platform that runs smart contracts. It was proposed in 2013 by Vitalik Buterin.'}
                    {coinId === 'solana' && 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.'}
                    {coinId === 'cardano' && 'Cardano is a proof-of-stake blockchain platform founded on peer-reviewed research and developed through evidence-based methods.'}
                    {coinId === 'ripple' && 'XRP is a digital asset built for payments. It is the native digital asset on the XRP Ledger.'}
                    {!['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple'].includes(coinId) && 'Cryptocurrency information not available.'}
                </Text>
            </View>


            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                    ⚠️ This is for informational purposes only. Not financial advice.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.card,
        marginBottom: 16,
    },
    coinName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    coinSymbol: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    priceCard: {
        backgroundColor: colors.card,
        margin: 16,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    priceLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    price: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    priceChange: {
        fontSize: 18,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: colors.card,
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    description: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 22,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    exchangeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    exchangeInfo: {
        flex: 1,
    },
    exchangeName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    exchangeVolume: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    exchangePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.success,
    },
    bestPricesContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: colors.background,
        borderRadius: 8,
    },
    bestPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bestPriceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    bestPriceValue: {
        alignItems: 'flex-end',
    },
    bestPriceExchange: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    bestPriceAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    spreadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    spreadLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    spreadValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.warning,
    },
    averagePriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        padding: 12,
        backgroundColor: colors.accent,
        borderRadius: 8,
    },
    averagePriceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    averagePriceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    disclaimer: {
        margin: 16,
        padding: 16,
        backgroundColor: colors.warning + '20',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.warning,
    },
    disclaimerText: {
        fontSize: 12,
        color: colors.warning,
        textAlign: 'center',
    },
});

export default DetailScreen;
