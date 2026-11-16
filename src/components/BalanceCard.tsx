import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';


interface BalanceCardProps {
    balance: number;
    currencyLabel?: string;
    growthPercent?: number;
    onSendPress?: () => void;
    onReceivePress?: () => void;
    onTopUpPress?: () => void;
    onCardsPress?: () => void;
}


export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    currencyLabel = 'USD ($)',
    growthPercent = 8.4,
    onSendPress,
    onReceivePress,
    onTopUpPress,
    onCardsPress,
}) => {
    const formattedBalance = formatCurrency(balance);
    const actions = [
        { id: 'send', label: 'Send', icon: 'arrow-up-right' as const, onPress: onSendPress },
        { id: 'receive', label: 'Receive', icon: 'arrow-down-left' as const, onPress: onReceivePress },
        { id: 'topup', label: 'Top up', icon: 'plus' as const, onPress: onTopUpPress },
        { id: 'cards', label: 'Cards', icon: 'credit-card' as const, onPress: onCardsPress },
    ];

    const isPositiveGrowth = growthPercent > 0;

    return (
        <View style={styles.cardContainer}>
            {/* 1. Card Top: Label & Currency Pill */}
            <View style={styles.topRow}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <View style={styles.currencyPill}>
                    <Text style={styles.currencyText}>{currencyLabel}</Text>
                </View>
            </View>

            {/* 2. Amount Row: Formatted Balance & Growth Badge */}
            <View style={styles.amountRow}>
                <Text style={styles.amountText}>{formattedBalance}</Text>
                {growthPercent !== undefined && (
                    <View style={styles.growthBadge}>
                        <Feather
                            name={isPositiveGrowth ? "arrow-up" : "arrow-down"}
                            size={12}
                            color={isPositiveGrowth ? Colors.successMain : Colors.dangerMain} />
                        <Text style={isPositiveGrowth ? styles.growthText : styles.growTextNegative}>{
                            growthPercent > 0
                                ? `+${growthPercent}`
                                : `${growthPercent}`
                        }%
                        </Text>
                    </View>
                )}
            </View>

            {/* 3. Divider */}
            <View style={styles.divider} />

            {/* 4. Action Buttons Grid */}
            <View style={styles.actionsRow}>
                {actions.map((action) => (
                    <Pressable
                        key={action.id}
                        style={({ pressed }) => [
                            styles.actionItem,
                            pressed && { opacity: 0.75 },
                        ]}
                        hitSlop={8}
                        onPress={action.onPress}
                    >
                        <View style={styles.actionCircle}>
                            <Feather name={action.icon} size={20} color="#F8FAFC" />
                        </View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                    </Pressable>
                ))}
            </View>

        </View>
    )

};


const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.surfaceDark,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginHorizontal: Spacing.md,
        marginTop: Spacing.md,
        shadowColor: Colors.surfaceDark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8, // Android depth
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    balanceLabel: {
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    currencyPill: {
        backgroundColor: Colors.surfaceDarkSubtle,
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    currencyText: {
        fontSize: 11,
        color: '#E2E8F0',
        fontWeight: '600',
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: 4,
    },
    amountText: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.textWhite,
        letterSpacing: -0.5,
    },
    growthBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
        gap: 2,
    },
    growthText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.successMain,
    },
    growTextNegative: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.dangerMain,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginVertical: Spacing.lg,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionItem: {
        alignItems: 'center',
        gap: Spacing.xs + 2,
    },
    actionCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.surfaceDarkSubtle,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    actionCirclePressed: {
        backgroundColor: Colors.brandPrimary,
        transform: [{ scale: 0.95 }],
    },
    actionLabel: {
        fontSize: 12,
        color: '#E2E8F0',
        fontWeight: '600',
    },
});