import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#0f3460',
    success: '#00d4aa',
    danger: '#e94560',
    warning: '#f39c12',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#2d2d44',
    card: '#1e1e30',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        color: colors.text,
    },
    textSecondary: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    button: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
