// src/screens/SendMoneyModal.tsx
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
import { Recipient } from '../types';
import { mockRecipients as initialRecipients } from '../data/mockData';

interface SendMoneyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmTransfer: (recipient: Recipient, amount: number) => void;
}

const PRESET_AMOUNTS = [50, 100, 250, 500];

const PALETTE = [
  { bg: '#FEE2E2', color: '#EF4444' },
  { bg: '#E0E7FF', color: '#4F46E5' },
  { bg: '#FEF3C7', color: '#D97706' },
  { bg: '#DCFCE7', color: '#16A34A' },
  { bg: '#F3E8FF', color: '#9333EA' },
];

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  visible,
  onClose,
  onConfirmTransfer,
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient>(
    recipients[0]
  );
  const [amountStr, setAmountStr] = useState<string>('350.00');

  // "Add Payee" Sheet State
  const [isAddPayeeVisible, setIsAddPayeeVisible] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeHandle, setNewPayeeHandle] = useState('');

  const handlePresetSelect = (preset: number) => {
    setAmountStr(preset.toFixed(2));
  };

  const numericAmount = parseFloat(amountStr) || 0;
  const isTransferValid = numericAmount > 0;

  const handleTransfer = () => {
    if (isTransferValid) {
      onConfirmTransfer(selectedRecipient, numericAmount);
    }
  };

  // Add new payee handler
  const handleSaveNewPayee = () => {
    if (!newPayeeName.trim()) return;

    const parts = newPayeeName.trim().split(' ');
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : newPayeeName.slice(0, 2).toUpperCase();

    const randomStyle = PALETTE[Math.floor(Math.random() * PALETTE.length)];

    const created: Recipient = {
      id: `rec-${Date.now()}`,
      name: newPayeeName.trim(),
      initials,
      bg: randomStyle.bg,
      color: randomStyle.color,
    };

    setRecipients((prev) => [created, ...prev]);
    setSelectedRecipient(created);
    setNewPayeeName('');
    setNewPayeeHandle('');
    setIsAddPayeeVisible(false);
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
          {/* 1. Nav Bar */}
          <View style={styles.navBar}>
            <Pressable style={styles.navButton} onPress={onClose} hitSlop={8}>
              <Feather name="arrow-left" size={20} color={Colors.textMain} />
            </Pressable>
            <Text style={styles.navTitle}>Send Money</Text>
            <Pressable style={styles.navButton} hitSlop={8}>
              <Feather name="more-horizontal" size={20} color={Colors.textMain} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* 2. Recent Recipients Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Recent Recipients</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recipientsRow}
              >
                {/* "+ New" Action Button */}
                <Pressable
                  style={styles.recipientItem}
                  onPress={() => setIsAddPayeeVisible(true)}
                >
                  <View style={[styles.avatarCircle, styles.addAvatarCircle]}>
                    <Feather name="plus" size={20} color={Colors.brandPrimary} />
                  </View>
                  <Text style={styles.recipientName}>New</Text>
                </Pressable>

                {/* Recipient Avatars */}
                {recipients.map((rec) => {
                  const isSelected = selectedRecipient.id === rec.id;
                  return (
                    <Pressable
                      key={rec.id}
                      style={styles.recipientItem}
                      onPress={() => setSelectedRecipient(rec)}
                    >
                      <View
                        style={[
                          styles.avatarCircle,
                          { backgroundColor: rec.bg },
                          isSelected && styles.selectedAvatarCircle,
                        ]}
                      >
                        <Text style={[styles.avatarInitials, { color: rec.color }]}>
                          {rec.initials}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.recipientName,
                          isSelected && styles.selectedRecipientName,
                        ]}
                        numberOfLines={1}
                      >
                        {rec.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* 3. Transfer Amount Card */}
            <View style={styles.amountCard}>
              <Text style={styles.amountCardLabel}>Enter Transfer Amount</Text>

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

              {/* Quick Amount Chips */}
              <View style={styles.chipsRow}>
                {PRESET_AMOUNTS.map((amt) => {
                  const isChipActive = numericAmount === amt;
                  return (
                    <Pressable
                      key={amt}
                      style={[styles.chip, isChipActive && styles.activeChip]}
                      onPress={() => handlePresetSelect(amt)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isChipActive && styles.activeChipText,
                        ]}
                      >
                        ${amt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 4. Payment Method Card */}
            <View style={styles.paymentMethodCard}>
              <View style={styles.paymentMethodLeft}>
                <View style={styles.cardIconWrap}>
                  <Feather name="credit-card" size={20} color={Colors.brandPrimary} />
                </View>
                <View>
                  <Text style={styles.paymentTitle}>Primary Checking (••4829)</Text>
                  <Text style={styles.paymentSub}>Available: $18,450.00</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={Colors.textMuted} />
            </View>
          </ScrollView>

          {/* 5. Sticky Bottom Action & Security Seal */}
          <View style={styles.bottomBar}>
            <Pressable
              disabled={!isTransferValid}
              style={({ pressed }) => [
                styles.transferButton,
                !isTransferValid && styles.transferButtonDisabled,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleTransfer}
            >
              <Text style={styles.transferButtonText}>
                Confirm & Transfer ${numericAmount.toFixed(2)}
              </Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </Pressable>

            <View style={styles.securityNote}>
              <Feather name="lock" size={12} color={Colors.successMain} />
              <Text style={styles.securityText}>
                Bank-grade 256-bit SSL encrypted transfer
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Sheet Overlay: Add New Recipient */}
        {isAddPayeeVisible && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setIsAddPayeeVisible(false)}
            >
              <Pressable style={styles.addPayeeSheet} onPress={(e) => e.stopPropagation()}>
                <Text style={styles.addPayeeTitle}>Add New Recipient</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Michael Brown"
                    placeholderTextColor={Colors.textLight}
                    value={newPayeeName}
                    onChangeText={setNewPayeeName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Pulse Handle or Account Number</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. @michaelb or ••4920"
                    placeholderTextColor={Colors.textLight}
                    value={newPayeeHandle}
                    onChangeText={setNewPayeeHandle}
                  />
                </View>

                <View style={styles.addPayeeActions}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setIsAddPayeeVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.savePayeeButton,
                      !newPayeeName.trim() && { opacity: 0.5 },
                    ]}
                    disabled={!newPayeeName.trim()}
                    onPress={handleSaveNewPayee}
                  >
                    <Text style={styles.savePayeeButtonText}>Save Recipient</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </View>
        )}
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
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  recipientsRow: {
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  recipientItem: {
    alignItems: 'center',
    gap: 6,
    width: 60,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAvatarCircle: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    borderStyle: 'dashed',
  },
  selectedAvatarCircle: {
    borderWidth: 2.5,
    borderColor: Colors.brandPrimary,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
  },
  recipientName: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedRecipientName: {
    color: Colors.brandPrimary,
    fontWeight: '700',
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
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgMain,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  activeChip: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brandPrimary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeChipText: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 2,
  },
  paymentSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bottomBar: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  transferButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  transferButtonDisabled: {
    opacity: 0.5,
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  addPayeeSheet: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  addPayeeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  textInput: {
    backgroundColor: Colors.bgMain,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    fontSize: 14,
    color: Colors.textMain,
  },
  addPayeeActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md - 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  savePayeeButton: {
    flex: 2,
    backgroundColor: Colors.brandPrimary,
    paddingVertical: Spacing.md - 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  savePayeeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});