import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    Alert,
    Modal,
} from 'react-native';
import { getPortfolio, addToPortfolio, deleteFromPortfolio } from '../api/api';
import socketService from '../api/socket';
import { formatCurrency, formatNumber, getCoinSymbol } from '../utils/formatters';
import { colors, globalStyles } from '../styles/theme';

const PortfolioScreen = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCoin, setNewCoin] = useState({
        symbol: '',
        name: '',
        quantity: '',
        buyPrice: '',
    });

    useEffect(() => {
        loadPortfolio();

        // Connect to socket for real-time prices
        socketService.connect();
        socketService.on('price_update', (data) => {
            setPrices(data);
        });

        return () => {
            socketService.disconnect();
        };
    }, []);

    const loadPortfolio = async () => {
        try {
            const response = await getPortfolio();
            setPortfolio(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading portfolio:', error);
            setLoading(false);
        }
    };

    const handleAddCoin = async () => {
        if (!newCoin.symbol || !newCoin.name || !newCoin.quantity || !newCoin.buyPrice) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            await addToPortfolio({
                symbol: newCoin.symbol.toLowerCase(),
                name: newCoin.name,
                quantity: parseFloat(newCoin.quantity),
                buyPrice: parseFloat(newCoin.buyPrice),
            });
            setModalVisible(false);
            setNewCoin({ symbol: '', name: '', quantity: '', buyPrice: '' });
            loadPortfolio();
        } catch (error) {
            Alert.alert('Error', 'Failed to add coin');
            console.error(error);
        }
    };

    const handleDeleteCoin = async (id) => {
        try {
            await deleteFromPortfolio(id);
            loadPortfolio();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete coin');
            console.error(error);
        }
    };

    const calculateTotalValue = () => {
        return portfolio.reduce((total, item) => {
            const coinId = item.symbol.toLowerCase();
            const currentPrice = prices[coinId]?.usd || 0;
            return total + (currentPrice * item.quantity);
        }, 0);
    };

    const calculateTotalProfit = () => {
        return portfolio.reduce((total, item) => {
            const coinId = item.symbol.toLowerCase();
            const currentPrice = prices[coinId]?.usd || 0;
            const profit = (currentPrice - item.buyPrice) * item.quantity;
            return total + profit;
        }, 0);
    };

    const renderPortfolioItem = ({ item }) => {
        const coinId = item.symbol.toLowerCase();
        const currentPrice = prices[coinId]?.usd || 0;
        const value = currentPrice * item.quantity;
        const profit = (currentPrice - item.buyPrice) * item.quantity;
        const profitPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;
        const isProfit = profit >= 0;

        return (
            <View style={styles.portfolioCard}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.coinName}>{item.name}</Text>
                        <Text style={styles.coinSymbol}>{getCoinSymbol(coinId)}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleDeleteCoin(item._id)}
                        style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Quantity:</Text>
                        <Text style={styles.value}>{formatNumber(item.quantity)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Buy Price:</Text>
                        <Text style={styles.value}>{formatCurrency(item.buyPrice)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Current Price:</Text>
                        <Text style={styles.value}>{formatCurrency(currentPrice)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Value:</Text>
                        <Text style={[styles.value, styles.highlight]}>{formatCurrency(value)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Profit/Loss:</Text>
                        <Text style={[styles.value, { color: isProfit ? colors.success : colors.danger }]}>
                            {formatCurrency(profit)} ({profitPercent.toFixed(2)}%)
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.success} />
            </View>
        );
    }

    const totalValue = calculateTotalValue();
    const totalProfit = calculateTotalProfit();
    const isProfitable = totalProfit >= 0;

    return (
        <View style={globalStyles.container}>
            <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Portfolio Summary</Text>
                <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
                <Text style={[styles.totalProfit, { color: isProfitable ? colors.success : colors.danger }]}>
                    {isProfitable ? '+' : ''}{formatCurrency(totalProfit)}
                </Text>
            </View>

            <FlatList
                data={portfolio}
                renderItem={renderPortfolioItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No coins in portfolio</Text>
                        <Text style={styles.emptySubtext}>Add your first coin to get started</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Coin</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Coin to Portfolio</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Symbol (e.g., bitcoin)"
                            placeholderTextColor={colors.textSecondary}
                            value={newCoin.symbol}
                            onChangeText={(text) => setNewCoin({ ...newCoin, symbol: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Name (e.g., Bitcoin)"
                            placeholderTextColor={colors.textSecondary}
                            value={newCoin.name}
                            onChangeText={(text) => setNewCoin({ ...newCoin, name: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            value={newCoin.quantity}
                            onChangeText={(text) => setNewCoin({ ...newCoin, quantity: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Buy Price (USD)"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            value={newCoin.buyPrice}
                            onChangeText={(text) => setNewCoin({ ...newCoin, buyPrice: text })}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleAddCoin}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    summary: {
        backgroundColor: colors.card,
        padding: 20,
        margin: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    summaryTitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    totalProfit: {
        fontSize: 18,
        fontWeight: '600',
    },
    listContent: {
        padding: 8,
    },
    portfolioCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    coinSymbol: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    deleteButton: {
        backgroundColor: colors.danger,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    deleteButtonText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    value: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '600',
    },
    highlight: {
        fontSize: 16,
        color: colors.success,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        color: colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    addButton: {
        backgroundColor: colors.success,
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 24,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: colors.secondary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        color: colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.accent,
    },
    confirmButton: {
        backgroundColor: colors.success,
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PortfolioScreen;
