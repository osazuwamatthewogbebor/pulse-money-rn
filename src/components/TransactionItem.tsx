// src/components/TransactionItem.tsx
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Transaction } from '../types';
import { formatTransactionAmount } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (tx: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const { formatted, isPositive } = formatTransactionAmount(
    transaction.amount
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={() => onPress?.(transaction)}
    >
      {/* 1. Left: Icon Pill */}
      <View style={[styles.iconWrap, { backgroundColor: transaction.iconBg }]}>
        <Feather
          name={transaction.icon as any}
          size={20}
          color={transaction.iconColor}
        />
      </View>

      {/* 2. Middle: Title & Category Stack */}
      <View style={styles.textColumn}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.subtitle}>
          {transaction.category} · {transaction.date}
        </Text>
      </View>

      {/* 3. Right: Amount */}
      <Text
        style={[
          styles.amount,
          isPositive ? styles.amountIncome : styles.amountExpense,
        ]}
      >
        {formatted}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  containerPressed: {
    backgroundColor: '#F1F5F9',
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md + 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md - 2,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  amountExpense: {
    color: Colors.textMain,
  },
  amountIncome: {
    color: Colors.successMain,
  },
});