// src/screens/TopUpModal.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';

interface PaymentSource {
  id: string;
  name: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}

const PAYMENT_SOURCES: PaymentSource[] = [
  {
    id: 'chase',
    name: 'Chase Bank Checking (••9021)',
    subtitle: 'Instant · Fee: Free',
    icon: 'shield',
  },
  {
    id: 'debit',
    name: 'Debit Card (••1092)',
    subtitle: 'Instant · Fee: Free',
    icon: 'credit-card',
  },
  {
    id: 'applepay',
    name: 'Apple Pay / One-Tap',
    subtitle: 'Fast biometric transfer',
    icon: 'smartphone',
  },
];

const PRESET_AMOUNTS = [100, 250, 500, 1000];

interface TopUpModalProps {
  visible: boolean;
  currentBalance: number;
  onClose: () => void;
  onConfirmTopUp: (amount: number, sourceName: string) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  visible,
  currentBalance,
  onClose,
  onConfirmTopUp,
}) => {
  const [amountStr, setAmountStr] = useState<string>('500.00');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('chase');

  const numericAmount = parseFloat(amountStr) || 0;
  const isAmountValid = numericAmount > 0;

  const handleSelectPreset = (amt: number) => {
    setAmountStr(amt.toFixed(2));
  };

  const handleTopUp = () => {
    if (isAmountValid) {
      const selectedSource =
        PAYMENT_SOURCES.find((s) => s.id === selectedSourceId)?.name || 'Linked Bank';
      onConfirmTopUp(numericAmount, selectedSource);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          {/* 1. Header Bar */}
          <View style={styles.navBar}>
            <Pressable style={styles.navButton} onPress={onClose} hitSlop={8}>
              <Feather name="arrow-left" size={20} color={Colors.textMain} />
            </Pressable>
            <Text style={styles.navTitle}>Add Money</Text>
            <Pressable style={styles.navButton} hitSlop={8}>
              <Feather name="info" size={18} color={Colors.textMain} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* 2. Current Wallet Balance Pill */}
            <View style={styles.currentBalanceCard}>
              <Text style={styles.currentBalanceLabel}>Current Wallet Balance</Text>
              <Text style={styles.currentBalanceValue}>
                {formatCurrency(currentBalance)}
              </Text>
            </View>

            {/* 3. Amount Input Card */}
            <View style={styles.amountCard}>
              <Text style={styles.amountCardLabel}>
                How much would you like to add?
              </Text>
              <View style={styles.amountInputRow}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amountStr}
                  onChangeText={setAmountStr}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              {/* Chips Row */}
              <View style={styles.chipsRow}>
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = numericAmount === amt;
                  return (
                    <Pressable
                      key={amt}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => handleSelectPreset(amt)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        +${amt.toLocaleString()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 4. Payment Sources Selection */}
            <View style={styles.sourcesSection}>
              <Text style={styles.sectionLabel}>Select Payment Source</Text>
              <View style={styles.sourcesList}>
                {PAYMENT_SOURCES.map((source) => {
                  const isSelected = selectedSourceId === source.id;
                  return (
                    <Pressable
                      key={source.id}
                      style={[
                        styles.sourceItem,
                        isSelected && styles.sourceItemActive,
                      ]}
                      onPress={() => setSelectedSourceId(source.id)}
                    >
                      <View style={styles.sourceLeft}>
                        <View
                          style={[
                            styles.sourceIconWrap,
                            isSelected && { backgroundColor: Colors.brandSoft },
                          ]}
                        >
                          <Feather
                            name={source.icon}
                            size={18}
                            color={
                              isSelected ? Colors.brandPrimary : Colors.textMain
                            }
                          />
                        </View>
                        <View>
                          <Text style={styles.sourceName}>{source.name}</Text>
                          <Text style={styles.sourceSub}>{source.subtitle}</Text>
                        </View>
                      </View>

                      {/* Custom Radio Button */}
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 5. Zero Fee Instant Guarantee Banner */}
            <View style={styles.banner}>
              <Feather name="zap" size={20} color={Colors.brandPrimary} />
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerTitle}>Instant Arrival • Zero Fee</Text>
                <Text style={styles.bannerSub}>
                  Funds reflect in your wallet balance immediately.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* 6. Sticky Bottom Action & Security Seal */}
          <View style={styles.bottomBar}>
            <Pressable
              disabled={!isAmountValid}
              style={({ pressed }) => [
                styles.topUpButton,
                !isAmountValid && styles.topUpButtonDisabled,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleTopUp}
            >
              <Text style={styles.topUpButtonText}>
                Add ${numericAmount.toFixed(2)} Instantly
              </Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </Pressable>

            <View style={styles.securityBadge}>
              <Feather name="shield" size={12} color={Colors.textMuted} />
              <Text style={styles.securityBadgeText}>
                256-bit encryption • FDIC Insured up to $250k
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  keyboardAvoid: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textMain,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  currentBalanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  currentBalanceLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  currentBalanceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain,
  },
  amountCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
  },
  amountCardLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textMuted,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.textMain,
    minWidth: 140,
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
  },
  chip: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm - 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgMain,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brandPrimary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  sourcesSection: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  sourcesList: {
    gap: Spacing.sm,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sourceItemActive: {
    borderColor: Colors.brandPrimary,
  },
  sourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
  },
  sourceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 2,
  },
  sourceSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.brandPrimary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brandPrimary,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandSoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandDark,
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomBar: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  topUpButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  topUpButtonDisabled: {
    opacity: 0.5,
  },
  topUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  securityBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  securityBadgeText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});