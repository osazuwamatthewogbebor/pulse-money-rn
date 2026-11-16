// src/screens/ReceiveMoneyModal.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { mockUser } from '../data/mockData';

interface ReceiveMoneyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({
  visible,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', 'Account number (••9021) and Pulse tag copied to clipboard.');
  };

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
          <Text style={styles.navTitle}>Receive Money</Text>
          <Pressable style={styles.navButton} hitSlop={8}>
            <Feather name="share-2" size={18} color={Colors.textMain} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. QR Code Card */}
          <View style={styles.qrCard}>
            {/* Visual QR Code Representation */}
            <View style={styles.qrMockBox}>
              <Feather name="maximize" size={160} color={Colors.textMain} />
              <View style={styles.qrCenterBadge}>
                <Feather name="zap" size={24} color={Colors.brandPrimary} />
              </View>
            </View>
            <Text style={styles.qrInstructions}>
              Scan this code from any Pulse app or banking app to pay instantly.
            </Text>
          </View>

          {/* 2. Account Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pulse Tag</Text>
              <Text style={styles.detailValueTag}>@johndoe</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Name</Text>
              <Text style={styles.detailValue}>{mockUser.name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Routing Number (ACH)</Text>
              <Text style={styles.detailValue}>021000021</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <Text style={styles.detailValue}>88291049021</Text>
            </View>
          </View>

          {/* 3. Copy Details Button */}
          <Pressable
            style={({ pressed }) => [
              styles.copyButton,
              copied && styles.copyButtonActive,
              pressed && { opacity: 0.9 },
            ]}
            onPress={handleCopy}
          >
            <Feather
              name={copied ? 'check' : 'copy'}
              size={18}
              color={copied ? Colors.successMain : '#FFFFFF'}
            />
            <Text
              style={[
                styles.copyButtonText,
                copied && { color: Colors.successMain },
              ]}
            >
              {copied ? 'Details Copied!' : 'Copy Bank Account Details'}
            </Text>
          </Pressable>
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: 'center',
  },
  qrCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.md,
  },
  qrMockBox: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  qrCenterBadge: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  qrInstructions: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.md,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textMain,
    fontWeight: '700',
  },
  detailValueTag: {
    fontSize: 14,
    color: Colors.brandPrimary,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  copyButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  copyButtonActive: {
    backgroundColor: Colors.successSoft,
    borderWidth: 1,
    borderColor: Colors.successMain,
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});