// src/screens/TransferReceiptModal.tsx
import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Recipient } from '../types';
import { formatCurrency } from '../utils/formatters';

export interface TransferReceiptData {
  recipient: Recipient;
  amount: number;
  referenceNumber: string;
  date: string;
}

interface TransferReceiptModalProps {
  visible: boolean;
  data: TransferReceiptData | null;
  onDone: () => void;
  onShare?: () => void;
}

export const TransferReceiptModal: React.FC<TransferReceiptModalProps> = ({
  visible,
  data,
  onDone,
  onShare,
}) => {
  if (!data) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onDone}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Success Hero Badge */}
          <View style={styles.badgeWrapper}>
            <View style={styles.successBadge}>
              <Feather name="check" size={36} color={Colors.successMain} />
            </View>
            <Text style={styles.title}>Transfer Successful!</Text>
            <Text style={styles.subtitle}>
              Your payment has been sent to {data.recipient.name}
            </Text>
            <Text style={styles.amountText}>{formatCurrency(data.amount)}</Text>
          </View>

          {/* 2. Receipt Details Breakdown Card */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.label}>Recipient</Text>
              <Text style={styles.value}>{data.recipient.name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Destination Bank</Text>
              <Text style={styles.value}>Chase Bank (••9021)</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Transfer Method</Text>
              <Text style={styles.value}>Instant ACH Transfer</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Reference Number</Text>
              <Text style={[styles.value, styles.referenceText]}>
                {data.referenceNumber}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Transfer Fee</Text>
              <Text style={[styles.value, styles.feeFree]}>$0.00 (Free)</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Date & Time</Text>
              <Text style={styles.value}>{data.date}</Text>
            </View>
          </View>
        </ScrollView>

        {/* 3. Bottom Actions */}
        <View style={styles.bottomBar}>
          <Pressable
            style={({ pressed }) => [
              styles.doneButton,
              pressed && { opacity: 0.9 },
            ]}
            onPress={onDone}
          >
            <Text style={styles.doneButtonText}>Back to Home</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.shareButton,
              pressed && { backgroundColor: Colors.bgMain },
            ]}
            onPress={onShare}
          >
            <Feather name="share" size={18} color={Colors.textMain} />
            <Text style={styles.shareButtonText}>Share PDF Receipt</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  badgeWrapper: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  successBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.successSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.5,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: Colors.textMain,
    fontWeight: '600',
  },
  referenceText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
  },
  feeFree: {
    color: Colors.successMain,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  bottomBar: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  doneButton: {
    backgroundColor: Colors.brandPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md - 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  shareButtonText: {
    color: Colors.textMain,
    fontSize: 15,
    fontWeight: '600',
  },
});