// src/screens/PrivacyTermsModal.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface PrivacyTermsModalProps {
  visible: boolean;
  onClose: () => void;
}

type LegalTab = 'privacy' | 'terms' | 'cardholder';

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Nav Bar */}
        <View style={styles.navBar}>
          <Pressable style={styles.navButton} onPress={onClose} hitSlop={8}>
            <Feather name="arrow-left" size={20} color={Colors.textMain} />
          </Pressable>
          <Text style={styles.navTitle}>Legal & Privacy</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          {(['privacy', 'terms', 'cardholder'] as LegalTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              privacy: 'Privacy Policy',
              terms: 'Terms of Use',
              cardholder: 'Card Agreement',
            };
            return (
              <Pressable
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isActive && styles.tabButtonTextActive,
                  ]}
                >
                  {labels[tab]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'privacy' && (
            <View style={styles.legalBody}>
              <Text style={styles.heading}>Pulse Privacy Policy</Text>
              <Text style={styles.updatedDate}>Last updated: November 2026</Text>

              <Text style={styles.sectionHeader}>1. Bank-Grade Data Protection</Text>
              <Text style={styles.paragraph}>
                Pulse Financial Technologies ("Pulse") encrypts all customer identifiers, account tokens, and ledger balances at rest using AES-256 GCM encryption and in transit using TLS 1.3. We strictly adhere to Gramm-Leach-Bliley Act (GLBA) and SOC-2 Type II standards.
              </Text>

              <Text style={styles.sectionHeader}>2. Information We Collect</Text>
              <Text style={styles.paragraph}>
                We collect identity verification data (full name, government ID numbers, verified address), transactional telemetry (time, counterparty, amount, device metadata), and biometric hardware signals (Face ID / Fingerprint enrollment status). Biometric face vectors never leave your secure device enclave.
              </Text>

              <Text style={styles.sectionHeader}>3. Zero Data-Selling Guarantee</Text>
              <Text style={styles.paragraph}>
                Pulse does not sell, rent, or trade your personal or transaction data to third-party ad networks or brokers. Your data is used exclusively to route settlements, maintain audit ledgers, and prevent fraud.
              </Text>
            </View>
          )}

          {activeTab === 'terms' && (
            <View style={styles.legalBody}>
              <Text style={styles.heading}>Pulse Terms of Service</Text>
              <Text style={styles.updatedDate}>Last updated: November 2026</Text>

              <Text style={styles.sectionHeader}>1. Banking Partnership</Text>
              <Text style={styles.paragraph}>
                Pulse is a financial technology company, not an FDIC-insured bank. Banking services, debit card issuance, and fund custody are provided by our FDIC-member partner banks (Evolve Bank & Trust / JPMorgan Chase Bank, N.A.).
              </Text>

              <Text style={styles.sectionHeader}>2. Account Security & PIN</Text>
              <Text style={styles.paragraph}>
                You are responsible for maintaining confidentiality of your 4-digit security PIN and biometric credentials. Pulse is not liable for unauthorized transfers resulting from compromised user devices where multi-factor authentication was bypassed by user consent.
              </Text>

              <Text style={styles.sectionHeader}>3. Instant Transfer Finality</Text>
              <Text style={styles.paragraph}>
                Instant peer-to-peer transfers are irrevocable once authenticated by biometric or PIN prompt. Verify recipient Pulse tags prior to confirming transactions.
              </Text>
            </View>
          )}

          {activeTab === 'cardholder' && (
            <View style={styles.legalBody}>
              <Text style={styles.heading}>Virtual Debit Cardholder Agreement</Text>
              <Text style={styles.updatedDate}>Visa / Mastercard Network Rules</Text>

              <Text style={styles.sectionHeader}>1. Virtual Card Issuance</Text>
              <Text style={styles.paragraph}>
                Virtual cards issued under your Pulse profile are linked directly to your digital ledger wallet. Spending limits configured in the Cards tab are enforced programmatically at the network authorization stage.
              </Text>

              <Text style={styles.sectionHeader}>2. Zero Liability Protection</Text>
              <Text style={styles.paragraph}>
                Under Visa/Mastercard Zero Liability policy, cardholders are not held responsible for unauthorized transactions provided the card is frozen immediately upon detecting suspicious activity.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgMain,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    gap: Spacing.xs,
  },
  tabButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: BorderRadius.full,
  },
  tabButtonActive: {
    backgroundColor: Colors.brandSoft,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabButtonTextActive: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  legalBody: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm + 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.5,
  },
  updatedDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textMain,
    marginTop: Spacing.xs,
  },
  paragraph: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
