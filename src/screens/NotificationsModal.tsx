// src/screens/NotificationsModal.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'transaction' | 'security' | 'promo';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Salary Deposit Received',
    message: '+$4,250.00 from Acme Corp has been deposited into your wallet balance.',
    time: '10m ago',
    type: 'transaction',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Security Notice',
    message: 'A new session was authenticated using Face ID on your device.',
    time: '2h ago',
    type: 'security',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Card Payment Approved',
    message: 'Apple Store purchase of $129.00 was approved via Pulse Black Card.',
    time: 'Yesterday',
    type: 'transaction',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Cashback Boost Active',
    message: 'Earn 3% extra cashback this weekend on all grocery purchases.',
    time: '3d ago',
    type: 'promo',
    read: true,
  },
];

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onClearUnread: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  onClearUnread,
}) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onClearUnread();
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'transaction':
        return { name: 'arrow-down-left' as const, color: Colors.successMain, bg: Colors.successSoft };
      case 'security':
        return { name: 'shield' as const, color: '#3B82F6', bg: '#EFF6FF' };
      case 'promo':
        return { name: 'zap' as const, color: Colors.brandPrimary, bg: Colors.brandSoft };
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
        {/* Nav Bar */}
        <View style={styles.navBar}>
          <Pressable style={styles.navButton} onPress={onClose} hitSlop={8}>
            <Feather name="arrow-left" size={20} color={Colors.textMain} />
          </Pressable>
          <Text style={styles.navTitle}>Notifications</Text>
          <Pressable onPress={handleMarkAllRead} hitSlop={8}>
            <Text style={styles.markReadText}>Mark read</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((item) => {
            const iconConfig = getIcon(item.type);
            return (
              <View
                key={item.id}
                style={[
                  styles.notificationCard,
                  !item.read && styles.notificationCardUnread,
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: iconConfig.bg },
                  ]}
                >
                  <Feather
                    name={iconConfig.name}
                    size={20}
                    color={iconConfig.color}
                  />
                </View>

                <View style={styles.textCol}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <Text style={styles.message}>{item.message}</Text>
                </View>

                {!item.read && <View style={styles.unreadDot} />}
              </View>
            );
          })}
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
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.brandPrimary,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.md - 2,
    position: 'relative',
  },
  notificationCardUnread: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FBFBFF',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  message: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
    marginTop: 4,
  },
});