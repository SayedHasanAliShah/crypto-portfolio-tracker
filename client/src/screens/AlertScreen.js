import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { getAlerts, createAlert, deleteAlert } from '../api/api';
import { colors, globalStyles } from '../styles/theme';

const AlertScreen = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newAlert, setNewAlert] = useState({
        symbol: '',
        targetPrice: '',
        condition: 'above',
    });

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const response = await getAlerts();
            setAlerts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading alerts:', error);
            setLoading(false);
        }
    };

    const handleAddAlert = async () => {
        if (!newAlert.symbol || !newAlert.targetPrice) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            await createAlert({
                symbol: newAlert.symbol.toLowerCase(),
                targetPrice: parseFloat(newAlert.targetPrice),
                condition: newAlert.condition,
            });
            setModalVisible(false);
            setNewAlert({ symbol: '', targetPrice: '', condition: 'above' });
            Alert.alert('Success', 'Price alert created!');
            loadAlerts(); // Reload alerts from server
        } catch (error) {
            Alert.alert('Error', 'Failed to create alert');
            console.error(error);
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            await deleteAlert(id);
            loadAlerts(); // Reload alerts from server
        } catch (error) {
            Alert.alert('Error', 'Failed to delete alert');
            console.error(error);
        }
    };

    const renderAlertItem = ({ item }) => {
        return (
            <View style={styles.alertCard}>
                <View style={styles.alertHeader}>
                    <View>
                        <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
                        <Text style={styles.condition}>
                            Alert when price goes {item.condition} ${item.targetPrice}
                        </Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {item.isActive ? 'Active' : 'Triggered'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAlert(item._id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.success} />
                <Text style={styles.loadingText}>Loading alerts...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Price Alerts</Text>
                <Text style={styles.headerSubtitle}>
                    Get notified when prices hit your targets
                </Text>
            </View>

            <FlatList
                data={alerts}
                renderItem={renderAlertItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No alerts set</Text>
                        <Text style={styles.emptySubtext}>
                            Create your first price alert to get started
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Create Alert</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Price Alert</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Symbol (e.g., bitcoin)"
                            placeholderTextColor={colors.textSecondary}
                            value={newAlert.symbol}
                            onChangeText={(text) => setNewAlert({ ...newAlert, symbol: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Target Price (USD)"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            value={newAlert.targetPrice}
                            onChangeText={(text) => setNewAlert({ ...newAlert, targetPrice: text })}
                        />

                        <View style={styles.conditionContainer}>
                            <Text style={styles.conditionLabel}>Alert when price goes:</Text>
                            <View style={styles.conditionButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.conditionButton,
                                        newAlert.condition === 'above' && styles.conditionButtonActive,
                                    ]}
                                    onPress={() => setNewAlert({ ...newAlert, condition: 'above' })}>
                                    <Text
                                        style={[
                                            styles.conditionButtonText,
                                            newAlert.condition === 'above' && styles.conditionButtonTextActive,
                                        ]}>
                                        Above
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.conditionButton,
                                        newAlert.condition === 'below' && styles.conditionButtonActive,
                                    ]}
                                    onPress={() => setNewAlert({ ...newAlert, condition: 'below' })}>
                                    <Text
                                        style={[
                                            styles.conditionButtonText,
                                            newAlert.condition === 'below' && styles.conditionButtonTextActive,
                                        ]}>
                                        Below
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleAddAlert}>
                                <Text style={styles.buttonText}>Create</Text>
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
    loadingText: {
        color: colors.text,
        marginTop: 16,
        fontSize: 16,
    },
    header: {
        padding: 20,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    listContent: {
        padding: 8,
    },
    alertCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    symbol: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    condition: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        backgroundColor: colors.success + '30',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.success,
    },
    statusText: {
        fontSize: 12,
        color: colors.success,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: colors.danger,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
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
        textAlign: 'center',
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
    conditionContainer: {
        marginBottom: 16,
    },
    conditionLabel: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 8,
    },
    conditionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    conditionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    conditionButtonActive: {
        backgroundColor: colors.accent,
        borderColor: colors.success,
    },
    conditionButtonText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    conditionButtonTextActive: {
        color: colors.text,
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

export default AlertScreen;
