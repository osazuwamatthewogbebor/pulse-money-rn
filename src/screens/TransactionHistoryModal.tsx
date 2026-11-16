// src/screens/TransactionHistoryModal.tsx
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Transaction } from '../types';
import { TransactionItem } from '../components/TransactionItem';

type FilterType = 'all' | 'income' | 'expenses' | 'transfers';

interface TransactionHistoryModalProps {
  visible: boolean;
  transactions: Transaction[];
  onClose: () => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

export const TransactionHistoryModal: React.FC<
  TransactionHistoryModalProps
> = ({ visible, transactions, onClose, onSelectTransaction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Combined real-time search & category filter using useMemo
  const filteredList = useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'income' && tx.amount > 0) ||
        (activeFilter === 'expenses' && tx.amount < 0 && tx.category !== 'Transfer') ||
        (activeFilter === 'transfers' && tx.category === 'Transfer');

      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchQuery, activeFilter]);

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'transfers', label: 'Transfers' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 1. Header Bar */}
        <View style={styles.navBar}>
          <Pressable style={styles.navButton} onPress={onClose} hitSlop={8}>
            <Feather name="arrow-left" size={20} color={Colors.textMain} />
          </Pressable>
          <Text style={styles.navTitle}>Transaction History</Text>
          <Pressable style={styles.exportButton} hitSlop={8}>
            <Feather name="download" size={16} color={Colors.textMain} />
            <Text style={styles.exportText}>Export</Text>
          </Pressable>
        </View>

        {/* 2. Interactive Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search merchants, tags or amount..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Feather name="x-circle" size={16} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* 3. Category Filter Pills */}
        <View style={styles.filterPillsRow}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
                onPress={() => setActiveFilter(tab.id)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 4. Transactions Feed */}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredList.length > 0 ? (
            filteredList.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={onSelectTransaction}
              />
            ))
          ) : (
            /* Empty State */
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Feather name="search" size={28} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                No transactions matched your search "{searchQuery}"
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: 4,
  },
  exportText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMain,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
  },
  filterPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.xs + 2,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.sm,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMain,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});