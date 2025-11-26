import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import socketService from '../api/socket';
import { formatCurrency, formatPercentage, getCoinName } from '../utils/formatters';
import { colors, globalStyles } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Set a timeout to stop loading after 15 seconds
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setError('Unable to connect to server. Please ensure the server is running.');
            }
        }, 15000);

        // Connect to socket with error handler
        socketService.connect((errorMessage) => {
            setError(errorMessage);
            setLoading(false);
        });

        // Listen for price updates
        socketService.on('price_update', (data) => {
            console.log('Received price update:', Object.keys(data));
            setPrices(data);
            setLoading(false);
            setRefreshing(false);
            setError(null);
            clearTimeout(loadingTimeout);
        });

        // Listen for alerts
        socketService.on('alert_triggered', (alert) => {
            console.log('Alert triggered:', alert.message);
            // You could show a notification here
        });

        return () => {
            clearTimeout(loadingTimeout);
            socketService.disconnect();
        };
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        // Prices will update automatically via socket
        setTimeout(() => setRefreshing(false), 2000);
    };

    const renderCoinItem = ({ item }) => {
        const [coinId, data] = item;
        const priceChange = data.usd_24h_change || 0;
        const isPositive = priceChange >= 0;

        return (
            <TouchableOpacity
                style={styles.coinCard}
                onPress={() => navigation.navigate('Detail', { coinId, data })}>
                <View style={styles.coinHeader}>
                    <Text style={styles.coinName}>{getCoinName(coinId)}</Text>
                    <Text style={styles.coinPrice}>{formatCurrency(data.usd)}</Text>
                </View>
                <View style={styles.coinFooter}>
                    <Text style={styles.coinSymbol}>{coinId.toUpperCase()}</Text>
                    <Text
                        style={[
                            styles.priceChange,
                            { color: isPositive ? colors.success : colors.danger },
                        ]}>
                        {formatPercentage(priceChange)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.success} />
                <Text style={styles.loadingText}>Connecting to market data...</Text>
                <Text style={styles.loadingSubtext}>Please wait...</Text>
            </View>
        );
    }

    if (error && Object.keys(prices).length === 0) {
        return (
            <View style={[globalStyles.container, styles.centered]}>
                <Text style={styles.errorText}>⚠️ Connection Error</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        socketService.disconnect();
                        socketService.connect((errorMessage) => {
                            setError(errorMessage);
                            setLoading(false);
                        });
                    }}>
                    <Text style={styles.retryButtonText}>Retry Connection</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const coinList = Object.entries(prices);

    return (
        <View style={globalStyles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Live Market Prices</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigation.navigate('Portfolio')}>
                        <Text style={styles.navButtonText}>Portfolio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigation.navigate('Alerts')}>
                        <Text style={styles.navButtonText}>Alerts</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={coinList}
                renderItem={renderCoinItem}
                keyExtractor={(item) => item[0]}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.success}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.text,
        marginTop: 16,
        fontSize: 16,
    },
    loadingSubtext: {
        color: colors.textSecondary,
        marginTop: 8,
        fontSize: 14,
    },
    errorText: {
        color: colors.danger,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    errorMessage: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 32,
    },
    retryButton: {
        backgroundColor: colors.success,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    navButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    navButtonText: {
        color: colors.text,
        fontWeight: '600',
    },
    listContent: {
        padding: 8,
    },
    coinCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    coinHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    coinPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.success,
    },
    coinFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinSymbol: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    priceChange: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default HomeScreen;
