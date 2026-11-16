// src/screens/PersonalInfoModal.tsx
import React from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { mockUser } from '../data/mockData';

interface PersonalInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const handleRequestUpdate = () => {
    Alert.alert(
      'Information Update Request',
      'For regulatory compliance and account security, updating your legal name or address requires submitting proof of identity to our compliance desk.',
      [{ text: 'Understood' }]
    );
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
          <Text style={styles.navTitle}>Personal Information</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* KYC Status Banner */}
          <View style={styles.kycCard}>
            <View style={styles.kycIconWrap}>
              <Feather name="shield" size={20} color={Colors.successMain} />
            </View>
            <View style={styles.kycTextCol}>
              <View style={styles.kycTitleRow}>
                <Text style={styles.kycTitle}>Tier 2 Identity Verified</Text>
                <Feather name="check" size={14} color={Colors.successMain} />
              </View>
              <Text style={styles.kycSub}>
                Full banking and transfer privileges unlocked under federal compliance guidelines.
              </Text>
            </View>
          </View>

          {/* Details Table */}
          <View style={styles.detailsGroup}>
            <Text style={styles.groupLabel}>LEGAL IDENTITY</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Legal Full Name</Text>
                <Text style={styles.value}>John Michael Doe</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Date of Birth</Text>
                <Text style={styles.value}>March 14, 1994</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Tax ID / SSN</Text>
                <Text style={styles.value}>•••-••-4829</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Citizenship</Text>
                <Text style={styles.value}>United States (W-9 Verified)</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsGroup}>
            <Text style={styles.groupLabel}>CONTACT & ADDRESS</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Registered Email</Text>
                <Text style={styles.value}>john.doe@pulse.finance</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Mobile Phone</Text>
                <Text style={styles.value}>+1 (555) 382-9021</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.rowStacked}>
                <Text style={styles.label}>Residential Address</Text>
                <Text style={styles.valueAddress}>
                  742 Evergreen Terrace, Suite 4B{'\n'}
                  Springfield, OR 97477
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            style={({ pressed }) => [
              styles.updateButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleRequestUpdate}
          >
            <Feather name="edit-2" size={16} color={Colors.brandPrimary} />
            <Text style={styles.updateButtonText}>Request Information Update</Text>
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
  },
  kycCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md - 2,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  kycIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycTextCol: {
    flex: 1,
  },
  kycTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kycTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  kycSub: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
  detailsGroup: {
    gap: 6,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md - 2,
  },
  rowStacked: {
    paddingVertical: Spacing.md - 2,
    gap: 4,
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
  valueAddress: {
    fontSize: 13,
    color: Colors.textMain,
    fontWeight: '600',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  updateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandSoft,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
});
