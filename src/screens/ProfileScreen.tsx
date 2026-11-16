// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { mockUser } from '../data/mockData';
import { PersonalInfoModal } from './PersonalInfoModal';
import { HelpCenterModal } from './HelpCenterModal';
import { PrivacyTermsModal } from './PrivacyTermsModal';
import {
  requestNotificationPermissions,
  triggerLocalNotification,
} from '../utils/notifications';

interface ProfileScreenProps {
  onLockApp?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLockApp }) => {
  // Interactive Toggles
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Modal Visibility States
  const [isPersonalInfoVisible, setIsPersonalInfoVisible] = useState(false);
  const [isHelpCenterVisible, setIsHelpCenterVisible] = useState(false);
  const [isPrivacyTermsVisible, setIsPrivacyTermsVisible] = useState(false);

  // Handle Biometric Switch Toggle with Real Native Hardware Prompt
  const handleToggleFaceId = async (nextValue: boolean) => {
    if (nextValue) {
      if (Platform.OS === 'web') {
        setFaceIdEnabled(true);
        return;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometrics Unavailable',
          'Your device does not have biometric hardware or no Face ID / Fingerprint is enrolled in system settings.'
        );
        setFaceIdEnabled(false);
        return;
      }

      // Prompt real native hardware authentication!
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric protection',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setFaceIdEnabled(true);
        Alert.alert('Protected', 'Face ID and biometrics are now enabled for app unlock.');
      } else {
        setFaceIdEnabled(false);
      }
    } else {
      setFaceIdEnabled(false);
    }
  };

  // Handle Push Notification Toggle
  const handleToggleNotifications = async (nextValue: boolean) => {
    setNotificationsEnabled(nextValue);
    if (nextValue) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        triggerLocalNotification(
          'Pulse Notifications Active',
          'You will now receive real-time fraud alerts and transfer updates.'
        );
      }
    }
  };

  // Native Destructive Logout Dialog
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your Pulse Money account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            onLockApp?.();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Title */}
        <Text style={styles.screenTitle}>Profile & Settings</Text>

        {/* 2. Profile Hero Card */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>{mockUser.initials}</Text>
          </View>
          <View style={styles.userInfoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{mockUser.name}</Text>
              <Feather name="check-circle" size={16} color={Colors.brandPrimary} />
            </View>
            <Text style={styles.userEmail}>john.doe@pulse.finance</Text>
          </View>

          {/* Premium Membership Pill */}
          <View style={styles.tierPill}>
            <Feather name="award" size={14} color={Colors.brandPrimary} />
            <Text style={styles.tierText}>Pulse Premium Member</Text>
          </View>
        </View>

        {/* 3. Account Settings Group */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupHeaderLabel}>ACCOUNT SETTINGS</Text>
          <View style={styles.groupCard}>
            {/* Personal Info */}
            <Pressable
              style={styles.settingRow}
              hitSlop={6}
              onPress={() => setIsPersonalInfoVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Feather name="user" size={18} color={Colors.textMain} />
                </View>
                <Text style={styles.settingTitle}>Personal Information</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textMuted} />
            </Pressable>

            <View style={styles.rowDivider} />

            {/* Face ID & Biometrics (with Native Switch) */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Feather name="lock" size={18} color={Colors.textMain} />
                </View>
                <Text style={styles.settingTitle}>Face ID & Biometrics</Text>
              </View>
              <Switch
                value={faceIdEnabled}
                onValueChange={handleToggleFaceId}
                trackColor={{ false: Colors.borderSubtle, true: Colors.brandPrimary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.rowDivider} />

            {/* Notifications (with Native Switch) */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Feather name="bell" size={18} color={Colors.textMain} />
                </View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: Colors.borderSubtle, true: Colors.brandPrimary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* 4. Security Lock Action */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupHeaderLabel}>APP SECURITY</Text>
          <View style={styles.groupCard}>
            <Pressable
              style={styles.settingRow}
              hitSlop={6}
              onPress={() => onLockApp?.()}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconWrap, { backgroundColor: Colors.brandSoft }]}>
                  <Feather name="shield" size={18} color={Colors.brandPrimary} />
                </View>
                <Text style={styles.settingTitle}>Lock App with PIN Now</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* 5. Support & Legal Group */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupHeaderLabel}>SUPPORT & LEGAL</Text>
          <View style={styles.groupCard}>
            {/* Help Center */}
            <Pressable
              style={styles.settingRow}
              hitSlop={6}
              onPress={() => setIsHelpCenterVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Feather name="help-circle" size={18} color={Colors.textMain} />
                </View>
                <Text style={styles.settingTitle}>Help Center & Support</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textMuted} />
            </Pressable>

            <View style={styles.rowDivider} />

            {/* Privacy Policy */}
            <Pressable
              style={styles.settingRow}
              hitSlop={6}
              onPress={() => setIsPrivacyTermsVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconWrap}>
                  <Feather name="file-text" size={18} color={Colors.textMain} />
                </View>
                <Text style={styles.settingTitle}>Privacy Policy & Terms</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* 6. Destructive Log Out Button */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color={Colors.dangerMain} />
          <Text style={styles.logoutText}>Log Out of Account</Text>
        </Pressable>

        {/* App Version Info */}
        <Text style={styles.versionText}>Pulse Money v1.0.4 (Build 284)</Text>
      </ScrollView>

      {/* Sub-Modals */}
      <PersonalInfoModal
        visible={isPersonalInfoVisible}
        onClose={() => setIsPersonalInfoVisible(false)}
      />

      <HelpCenterModal
        visible={isHelpCenterVisible}
        onClose={() => setIsHelpCenterVisible(false)}
      />

      <PrivacyTermsModal
        visible={isPrivacyTermsVisible}
        onClose={() => setIsPrivacyTermsVisible(false)}
      />
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
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  profileHeroCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarTextLarge: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.brandPrimary,
  },
  userInfoCol: {
    alignItems: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginTop: 4,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  settingsGroup: {
    gap: Spacing.xs + 2,
    marginTop: 4,
  },
  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md - 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMain,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dangerSoft,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dangerMain,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
});
