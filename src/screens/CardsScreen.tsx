// src/screens/CardsScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { mockVirtualCard, mockBankAccounts } from '../data/mockData';
import { VirtualCard } from '../types';
import { formatCurrency } from '../utils/formatters';
import { triggerLocalNotification } from '../utils/notifications';

export const CardsScreen: React.FC = () => {
    // Interactive Multi-Card & Security States
    const [cards, setCards] = useState<VirtualCard[]>([mockVirtualCard]);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [showPin, setShowPin] = useState(false);
    const [isAddCardVisible, setIsAddCardVisible] = useState(false);
    const [cardName, setCardName] = useState('');
    const [cardLimit, setCardLimit] = useState('3000');

    const activeCard = cards[activeCardIndex] || cards[0];

    const toggleFreeze = () => {
        setCards((prev) =>
            prev.map((c, idx) =>
                idx === activeCardIndex ? { ...c, isFrozen: !c.isFrozen } : c
            )
        );
    };

    const toggleOnlinePay = () => {
        setCards((prev) =>
            prev.map((c, idx) =>
                idx === activeCardIndex
                    ? { ...c, onlinePayEnabled: !c.onlinePayEnabled }
                    : c
            )
        );
    };

    const handleCreateCard = () => {
        if (!cardName.trim()) return;

        const limitNum = parseFloat(cardLimit) || 3000;
        const lastFour = Math.floor(1000 + Math.random() * 9000);
        const newCard: VirtualCard = {
            id: `card-${Date.now()}`,
            name: cardName.trim(),
            brand: `Pulse ${cardName.trim()}`,
            cardNumber: `4829  ••••  ••••  ${lastFour}`,
            cardHolder: activeCard.cardHolder || 'JOHN DOE',
            expiry: '12/29',
            pin: String(Math.floor(1000 + Math.random() * 9000)),
            isFrozen: false,
            onlinePayEnabled: true,
            spendingLimit: limitNum,
            spentThisMonth: 0,
        };

        const nextCards = [...cards, newCard];
        setCards(nextCards);
        setActiveCardIndex(nextCards.length - 1);
        setIsAddCardVisible(false);
        setCardName('');
        setCardLimit('3000');

        triggerLocalNotification(
            'Virtual Card Activated',
            `Your new virtual card "${newCard.brand}" is active and ready to use.`
        );
    };

    const limitPercentage = Math.min(
        100,
        Math.round((activeCard.spentThisMonth / activeCard.spendingLimit) * 100)
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Header Row */}
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>My Cards</Text>
                    <Pressable
                        style={styles.addCardButton}
                        hitSlop={8}
                        onPress={() => setIsAddCardVisible(true)}
                    >
                        <Feather name="plus" size={16} color={Colors.brandPrimary} />
                        <Text style={styles.addCardText}>Add Card</Text>
                    </Pressable>
                </View>

                {/* Card Switcher Pills if multiple cards */}
                {cards.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardSwitcherRow}
                    >
                        {cards.map((c, idx) => {
                            const isSelected = idx === activeCardIndex;
                            return (
                                <Pressable
                                    key={c.id}
                                    style={[
                                        styles.cardSwitcherPill,
                                        isSelected && styles.cardSwitcherPillActive,
                                    ]}
                                    onPress={() => setActiveCardIndex(idx)}
                                >
                                    <Feather
                                        name="credit-card"
                                        size={14}
                                        color={isSelected ? Colors.brandPrimary : Colors.textMuted}
                                    />
                                    <Text
                                        style={[
                                            styles.cardSwitcherText,
                                            isSelected && styles.cardSwitcherTextActive,
                                        ]}
                                    >
                                        {c.brand}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                )}

                {/* 2. Hero Virtual Debit Card */}
                <View style={[styles.cardWrapper, activeCard.isFrozen && styles.cardFrozen]}>
                    {/* Card Background & Geometry */}
                    <View style={styles.cardTopRow}>
                        <Text style={styles.cardBrand}>{activeCard.brand}</Text>
                        <Feather name="wifi" size={20} color="#E0E7FF" style={styles.contactlessIcon} />
                    </View>

                    {/* EMV Metallic Gold Chip */}
                    <View style={styles.chipBox}>
                        <View style={styles.chipInnerLine} />
                    </View>

                    {/* Card Number */}
                    <Text
                        style={styles.cardNumberText}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.8}
                    >
                        {activeCard.cardNumber}
                    </Text>

                    {/* Card Bottom Row: Holder & Expiry */}
                    <View style={styles.cardBottomRow}>
                        <View>
                            <Text style={styles.cardMetaLabel}>CARDHOLDER</Text>
                            <Text style={styles.cardMetaValue}>{activeCard.cardHolder}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardMetaLabel}>EXPIRES</Text>
                            <Text style={styles.cardMetaValue}>{activeCard.expiry}</Text>
                        </View>
                    </View>

                    {/* Frozen Overlay Badge if Frozen */}
                    {activeCard.isFrozen && (
                        <View style={styles.frozenOverlay}>
                            <Feather name="lock" size={24} color="#FFFFFF" />
                            <Text style={styles.frozenBadgeText}>CARD FROZEN</Text>
                        </View>
                    )}
                </View>

                {/* 3. Interactive Quick Security Controls */}
                <View style={styles.controlsRow}>
                    {/* Freeze / Unfreeze Button */}
                    <Pressable
                        style={[
                            styles.controlItem,
                            activeCard.isFrozen && styles.controlItemActiveFrozen,
                        ]}
                        onPress={toggleFreeze}
                    >
                        <View
                            style={[
                                styles.controlIconWrap,
                                activeCard.isFrozen && { backgroundColor: Colors.dangerSoft },
                            ]}
                        >
                            <Feather
                                name={activeCard.isFrozen ? 'unlock' : 'lock'}
                                size={20}
                                color={activeCard.isFrozen ? Colors.dangerMain : Colors.textMain}
                            />
                        </View>
                        <Text
                            style={[
                                styles.controlLabel,
                                activeCard.isFrozen && { color: Colors.dangerMain, fontWeight: '700' },
                            ]}
                        >
                            {activeCard.isFrozen ? 'Unfreeze' : 'Freeze Card'}
                        </Text>
                    </Pressable>

                    {/* Online Pay Toggle */}
                    <Pressable
                        style={styles.controlItem}
                        onPress={toggleOnlinePay}
                    >
                        <View
                            style={[
                                styles.controlIconWrap,
                                activeCard.onlinePayEnabled && { backgroundColor: Colors.brandSoft },
                            ]}
                        >
                            <Feather
                                name="globe"
                                size={20}
                                color={activeCard.onlinePayEnabled ? Colors.brandPrimary : Colors.textMuted}
                            />
                        </View>
                        <Text style={styles.controlLabel}>
                            {activeCard.onlinePayEnabled ? 'Online: ON' : 'Online: OFF'}
                        </Text>
                    </Pressable>

                    {/* View PIN Toggle */}
                    <Pressable
                        style={styles.controlItem}
                        onPress={() => setShowPin((prev) => !prev)}
                    >
                        <View
                            style={[
                                styles.controlIconWrap,
                                showPin && { backgroundColor: Colors.successSoft },
                            ]}
                        >
                            <Feather
                                name={showPin ? 'eye-off' : 'eye'}
                                size={20}
                                color={showPin ? Colors.successMain : Colors.textMain}
                            />
                        </View>
                        <Text style={styles.controlLabel}>
                            {showPin ? `PIN: ${activeCard.pin}` : 'View PIN'}
                        </Text>
                    </Pressable>
                </View>

                {/* 4. Monthly Spending Limit Card */}
                <View style={styles.limitCard}>
                    <View style={styles.limitTopRow}>
                        <Text style={styles.limitLabel}>Monthly Spending Limit</Text>
                        <Text style={styles.limitValues}>
                            {formatCurrency(activeCard.spentThisMonth)} / {formatCurrency(activeCard.spendingLimit)}
                        </Text>
                    </View>
                    <View style={styles.limitTrack}>
                        <View
                            style={[
                                styles.limitFill,
                                { width: `${limitPercentage}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* 5. Linked Bank Accounts Section */}
                <View style={styles.banksSection}>
                    <Text style={styles.sectionTitle}>Linked Bank Accounts</Text>

                    <View style={styles.banksList}>
                        {mockBankAccounts.map((bank) => (
                            <View key={bank.id} style={styles.bankItem}>
                                <View style={styles.bankLeft}>
                                    <View style={styles.bankIconWrap}>
                                        <Feather name="shield" size={20} color={Colors.textMain} />
                                    </View>
                                    <View>
                                        <Text style={styles.bankName}>{bank.bankName}</Text>
                                        <Text style={styles.bankMeta}>•••• {bank.lastFour}</Text>
                                    </View>
                                </View>
                                <Text style={styles.bankBalance}>
                                    {formatCurrency(bank.balance)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            {/* Modal: Add New Virtual Card */}
            <Modal
                visible={isAddCardVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsAddCardVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setIsAddCardVisible(false)}
                >
                    <Pressable style={styles.addCardSheet} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.addCardTitle}>Create New Virtual Card</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Card Label / Purpose</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="e.g. Travel Card or Subscriptions"
                                placeholderTextColor={Colors.textLight}
                                value={cardName}
                                onChangeText={setCardName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Monthly Limit ($)</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="3000"
                                keyboardType="numeric"
                                placeholderTextColor={Colors.textLight}
                                value={cardLimit}
                                onChangeText={setCardLimit}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <Pressable
                                style={styles.cancelBtn}
                                onPress={() => setIsAddCardVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.createCardBtn,
                                    !cardName.trim() && { opacity: 0.5 },
                                ]}
                                disabled={!cardName.trim()}
                                onPress={handleCreateCard}
                            >
                                <Text style={styles.createCardBtnText}>Create Card</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
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
        paddingBottom: Spacing.xl + 40,
        gap: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.textMain,
        letterSpacing: -0.5,
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.brandSoft,
        paddingHorizontal: Spacing.md - 2,
        paddingVertical: Spacing.sm - 2,
        borderRadius: BorderRadius.full,
        gap: 4,
    },
    addCardText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.brandPrimary,
    },
    cardWrapper: {
        width: '100%',
        aspectRatio: 1.586, // Standard ID-1 credit card aspect ratio
        backgroundColor: '#1E1B4B', // Deep Midnight Indigo
        borderRadius: 20,
        padding: Spacing.lg,
        justifyContent: 'space-between',
        shadowColor: '#1E1B4B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    cardFrozen: {
        opacity: 0.7,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        fontSize: 13,
        fontWeight: '700',
        color: '#A5B4FC',
        letterSpacing: 0.8,
    },
    contactlessIcon: {
        transform: [{ rotate: '90deg' }],
    },
    chipBox: {
        width: 38,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#FCD34D', // Gold EMV chip
        borderWidth: 1,
        borderColor: '#D97706',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    chipInnerLine: {
        height: 1,
        backgroundColor: '#B45309',
        width: '100%',
    },
    cardNumberText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 2.5,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardMetaLabel: {
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: '600',
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    cardMetaValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    frozenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    frozenBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 2,
    },
    controlsRow: {
        flexDirection: 'row',
        gap: Spacing.sm + 2,
    },
    controlItem: {
        flex: 1,
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.borderSubtle,
    },
    controlItemActiveFrozen: {
        borderColor: Colors.dangerMain,
    },
    controlIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.bgMain,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textMain,
    },
    limitCard: {
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.borderSubtle,
        gap: Spacing.sm + 2,
    },
    limitTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    limitLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textMain,
    },
    limitValues: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.brandPrimary,
    },
    limitTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.borderSubtle,
        overflow: 'hidden',
    },
    limitFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: Colors.brandPrimary,
    },
    banksSection: {
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.textMain,
        letterSpacing: -0.3,
    },
    banksList: {
        gap: Spacing.sm,
    },
    bankItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.borderSubtle,
    },
    bankLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    bankIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.bgMain,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bankName: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textMain,
        marginBottom: 2,
    },
    bankMeta: {
        fontSize: 12,
        color: Colors.textMuted,
    },
    bankBalance: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textMain,
    },
      modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  addCardSheet: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  addCardTitle: {
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
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md - 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  createCardBtn: {
    flex: 2,
    backgroundColor: Colors.brandPrimary,
    paddingVertical: Spacing.md - 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  createCardBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSwitcherRow: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  cardSwitcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cardSwitcherPillActive: {
    borderColor: Colors.brandPrimary,
    backgroundColor: Colors.brandSoft,
  },
  cardSwitcherText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  cardSwitcherTextActive: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
});