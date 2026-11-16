// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants/theme';
import { mockUser, mockTransactions } from '../data/mockData';
import { Transaction, Recipient } from '../types';
import { dollarsToCents, centsToDollars } from '../utils/formatters';
import { Header } from '../components/Header';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionItem } from '../components/TransactionItem';
import { SendMoneyModal } from './SendMoneyModal';
import {
  TransferReceiptModal,
  TransferReceiptData,
} from './TransferReceiptModal';
import { TopUpModal } from './TopUpModal';
import { TransactionHistoryModal } from './TransactionHistoryModal';
import { TabType } from '../types';
import { NotificationsModal } from './NotificationsModal';
import { ReceiveMoneyModal } from './ReceiveMoneyModal';
import { triggerLocalNotification } from '../utils/notifications';


interface HomeScreenProps {
  onNavigateToTab?: (tab: TabType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToTab }) => {
  // 1. Reactive State for Balance & Transactions
  const [balance, setBalance] = useState<number>(mockUser.totalBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(
    mockTransactions
  );

  // 2. Modal Visibility States
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState<TransferReceiptData | null>(
    null
  );
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);


  // 3. Handlers
  const handleAvatarPress = () => console.log('Avatar tapped');
  const handleSend = () => setIsSendModalVisible(true);
  const handleTopUp = () => setIsTopUpModalVisible(true);
  const handleCards = () => onNavigateToTab?.('cards');
  const handleSeeAll = () => setIsHistoryModalVisible(true);
  const handleNotificationPress = () => setIsNotifModalVisible(true);
  const handleReceive = () => setIsReceiveModalVisible(true);

  // 4. The Core Transfer Execution Logic
  const handleConfirmTransfer = (recipient: Recipient, amount: number) => {
    // Prevent float math errors: convert to integer cents, subtract, convert back
    const currentCents = dollarsToCents(balance);
    const transferCents = dollarsToCents(amount);
    const newBalance = centsToDollars(Math.max(0, currentCents - transferCents));

    // Create the new transaction item
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: recipient.name,
      category: 'Transfer',
      date: 'Just now',
      amount: -amount,
      type: 'expense',
      icon: 'send',
      iconBg: recipient.bg,
      iconColor: recipient.color,
    };

    // Update state
    setBalance(newBalance);
    setTransactions((prev) => [newTx, ...prev]);

    // Prepare receipt data
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} · ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const receipt: TransferReceiptData = {
      recipient,
      amount,
      referenceNumber: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      date: formattedDate,
    };

    // Close Send modal, Open Receipt modal!
    setIsSendModalVisible(false);
    setReceiptData(receipt);

    // Trigger native local push notification
    triggerLocalNotification(
      'Transfer Sent',
      `Sent $${amount.toFixed(2)} to ${recipient.name}. Ref: ${receipt.referenceNumber}`
    );
  };

  // Deposit Execution Handler
  const handleConfirmTopUp = (amount: number, sourceName: string) => {
    // Safe integer math: add cents
    const currentCents = dollarsToCents(balance);
    const depositCents = dollarsToCents(amount);
    const newBalance = centsToDollars(currentCents + depositCents);

    // Create deposit transaction
    const depositTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: sourceName.split('(')[0].trim() || 'Wallet Top Up',
      category: 'Deposit',
      date: 'Just now',
      amount: amount, // Positive for income
      type: 'income',
      icon: 'arrow-down-left',
      iconBg: Colors.successSoft,
      iconColor: Colors.successMain,
    };

    setBalance(newBalance);
    setTransactions((prev) => [depositTx, ...prev]);
    setIsTopUpModalVisible(false);

    // Trigger native local push notification
    triggerLocalNotification(
      'Deposit Received',
      `Added $${amount.toFixed(2)} from ${sourceName.split('(')[0].trim()}.`
    );
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header */}
        <Header
          user={{ ...mockUser, totalBalance: balance, unreadNotifications: hasUnreadNotifs }}
          onNotificationPress={handleNotificationPress}
          onAvatarPress={handleAvatarPress}
        />

        {/* 2. Hero Balance Card (Shows reactive balance!) */}
        <BalanceCard
          balance={balance}
          currencyLabel={mockUser.currency}
          growthPercent={mockUser.monthlyGrowthPercent}
          onSendPress={handleSend}
          onReceivePress={handleReceive}
          onTopUpPress={handleTopUp}
          onCardsPress={handleCards}
        />

        {/* 3. Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable
            hitSlop={8}
            onPress={handleSeeAll}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        {/* 4. Transactions List (Shows reactive list!) */}
        <View style={styles.transactionsList}>
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={(selected) => console.log('Tapped tx:', selected.title)}
            />
          ))}
        </View>
      </ScrollView>

      {/* 5. Modals */}
      <SendMoneyModal
        visible={isSendModalVisible}
        onClose={() => setIsSendModalVisible(false)}
        onConfirmTransfer={handleConfirmTransfer}
      />

      <TransferReceiptModal
        visible={receiptData !== null}
        data={receiptData}
        onDone={() => setReceiptData(null)}
        onShare={() => console.log('Share receipt tapped!')}
      />

      <TopUpModal
        visible={isTopUpModalVisible}
        currentBalance={balance}
        onClose={() => setIsTopUpModalVisible(false)}
        onConfirmTopUp={handleConfirmTopUp}
      />

      <TransactionHistoryModal
        visible={isHistoryModalVisible}
        transactions={transactions}
        onClose={() => setIsHistoryModalVisible(false)}
      />

      <NotificationsModal
        visible={isNotifModalVisible}
        onClose={() => setIsNotifModalVisible(false)}
        onClearUnread={() => setHasUnreadNotifs(false)}
      />

      <ReceiveMoneyModal
        visible={isReceiveModalVisible}
        onClose={() => setIsReceiveModalVisible(false)}
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
    paddingBottom: Spacing.xl + 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  transactionsList: {
    paddingHorizontal: Spacing.md,
  },
});