// src/screens/InsightsScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Timeframe, SpendingCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TimeframeDataset {
  label: string;
  totalSpent: number;
  savingsText: string;
  isSaving: boolean;
  tip: string;
  categories: SpendingCategory[];
}

const TIMEFRAME_DATA: Record<Timeframe, TimeframeDataset> = {
  week: {
    label: 'Total Spent This Week',
    totalSpent: 820.50,
    savingsText: '4% less',
    isSaving: true,
    tip: 'On track! You have $180 remaining in your weekly dining out budget.',
    categories: [
      { id: 'w-1', name: 'Food & Dining', amount: 310.00, percentage: 38, color: '#10B981' },
      { id: 'w-2', name: 'Shopping & Retail', amount: 240.50, percentage: 29, color: '#3B82F6' },
      { id: 'w-3', name: 'Transport & Uber', amount: 150.00, percentage: 18, color: '#EF4444' },
      { id: 'w-4', name: 'Entertainment', amount: 120.00, percentage: 15, color: '#F59E0B' },
    ],
  },
  month: {
    label: 'Total Spent in November',
    totalSpent: 3420.50,
    savingsText: '12% less',
    isSaving: true,
    tip: 'Great job! You spent $420 less than last month on dining out.',
    categories: [
      { id: 'm-1', name: 'Shopping & Retail', amount: 1120.00, percentage: 33, color: '#3B82F6' },
      { id: 'm-2', name: 'Food & Groceries', amount: 890.50, percentage: 26, color: '#10B981' },
      { id: 'm-3', name: 'Rent & Utilities', amount: 850.00, percentage: 25, color: '#8B5CF6' },
      { id: 'm-4', name: 'Entertainment', amount: 340.00, percentage: 10, color: '#F59E0B' },
      { id: 'm-5', name: 'Transport', amount: 220.00, percentage: 6, color: '#EF4444' },
    ],
  },
  year: {
    label: 'Total Spent in 2026',
    totalSpent: 38450.00,
    savingsText: '8% more',
    isSaving: false,
    tip: 'Your highest spending month this year was August ($4,210.00).',
    categories: [
      { id: 'y-1', name: 'Rent & Housing', amount: 12000.00, percentage: 31, color: '#8B5CF6' },
      { id: 'y-2', name: 'Food & Dining', amount: 9450.00, percentage: 25, color: '#10B981' },
      { id: 'y-3', name: 'Shopping & Goods', amount: 7200.00, percentage: 19, color: '#3B82F6' },
      { id: 'y-4', name: 'Travel & Flights', amount: 5800.00, percentage: 15, color: '#0EA5E9' },
      { id: 'y-5', name: 'Entertainment', amount: 4000.00, percentage: 10, color: '#F59E0B' },
    ],
  },
};

const AVAILABLE_PERIODS: Record<
  Timeframe,
  { label: string; sub: string; displayLabel: string }[]
> = {
  week: [
    {
      label: 'Nov 10 - Nov 16 (Current)',
      sub: 'This Week · Week 46',
      displayLabel: 'Nov 10 - Nov 16, 2026 (Week 46)',
    },
    {
      label: 'Nov 03 - Nov 09',
      sub: 'Last Week · Week 45',
      displayLabel: 'Nov 03 - Nov 09, 2026 (Week 45)',
    },
    {
      label: 'Oct 27 - Nov 02',
      sub: '2 Weeks Ago · Week 44',
      displayLabel: 'Oct 27 - Nov 02, 2026 (Week 44)',
    },
  ],
  month: [
    {
      label: 'November 2026 (Current)',
      sub: 'Current Billing Cycle',
      displayLabel: 'November 2026',
    },
    {
      label: 'October 2026',
      sub: 'Previous Month',
      displayLabel: 'October 2026',
    },
    {
      label: 'September 2026',
      sub: 'Q3 Closing',
      displayLabel: 'September 2026',
    },
    {
      label: 'August 2026',
      sub: 'Summer Period',
      displayLabel: 'August 2026',
    },
    {
      label: 'July 2026',
      sub: 'Mid-Year',
      displayLabel: 'July 2026',
    },
  ],
  year: [
    {
      label: '2026 (Fiscal YTD)',
      sub: 'Jan - Dec 2026',
      displayLabel: 'Full Year 2026 (Jan - Dec)',
    },
    {
      label: '2025 (Full Year)',
      sub: 'Jan - Dec 2025',
      displayLabel: 'Full Year 2025',
    },
    {
      label: '2024 (Full Year)',
      sub: 'Jan - Dec 2024',
      displayLabel: 'Full Year 2024',
    },
  ],
};

export const InsightsScreen: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('month');
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState('November 2026');
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [calendarTab, setCalendarTab] = useState<Timeframe>('month');

  const activeData = TIMEFRAME_DATA[selectedTimeframe];

  const handleSelectTimeframe = (tf: Timeframe) => {
    setSelectedTimeframe(tf);
    if (tf === 'week') {
      setSelectedPeriodLabel('Nov 10 - Nov 16, 2026 (Week 46)');
    } else if (tf === 'month') {
      setSelectedPeriodLabel('November 2026');
    } else {
      setSelectedPeriodLabel('Full Year 2026 (Jan - Dec)');
    }
  };

  const handleOpenCalendar = () => {
    setCalendarTab(selectedTimeframe);
    setIsCalendarModalVisible(true);
  };

  const summaryCardLabel =
    selectedTimeframe === 'week'
      ? 'Total Spent This Week'
      : selectedTimeframe === 'year'
      ? 'Total Spent in 2026'
      : `Total Spent in ${selectedPeriodLabel.split(' ')[0]}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Analytics & Insights</Text>
            <Text style={styles.headerSub}>{selectedPeriodLabel}</Text>
          </View>
          <Pressable
            style={styles.calendarButton}
            hitSlop={8}
            onPress={handleOpenCalendar}
          >
            <Feather name="calendar" size={18} color={Colors.textMain} />
          </Pressable>
        </View>

        {/* 2. Segmented Timeframe Switcher */}
        <View style={styles.segmentedContainer}>
          {(['week', 'month', 'year'] as Timeframe[]).map((tf) => {
            const isActive = selectedTimeframe === tf;
            return (
              <Pressable
                key={tf}
                style={[
                  styles.segmentButton,
                  isActive && styles.segmentButtonActive,
                ]}
                onPress={() => handleSelectTimeframe(tf)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 3. Dynamic Summary Hero Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{summaryCardLabel}</Text>
          <View style={styles.amountRow}>
            <Text style={styles.totalAmountText}>
              {formatCurrency(activeData.totalSpent)}
            </Text>
            <View
              style={[
                styles.savingsPill,
                !activeData.isSaving && { backgroundColor: Colors.dangerSoft },
              ]}
            >
              <Feather
                name={activeData.isSaving ? 'arrow-down' : 'arrow-up'}
                size={12}
                color={activeData.isSaving ? Colors.successMain : Colors.dangerMain}
              />
              <Text
                style={[
                  styles.savingsText,
                  !activeData.isSaving && { color: Colors.dangerMain },
                ]}
              >
                {activeData.savingsText}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. AI Insight Tip Banner */}
        <View style={styles.tipCard}>
          <Feather name="zap" size={20} color={Colors.brandPrimary} />
          <Text style={styles.tipText}>{activeData.tip}</Text>
        </View>

        {/* 5. Dynamic Category Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Top Categories</Text>

          <View style={styles.categoriesCard}>
            {activeData.categories.map((cat) => (
              <View key={cat.id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryNameRow}>
                    <View
                      style={[styles.categoryDot, { backgroundColor: cat.color }]}
                    />
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </View>
                  <View style={styles.categoryAmountRow}>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(cat.amount)}
                    </Text>
                    <Text style={styles.categoryPercent}>
                      ({cat.percentage}%)
                    </Text>
                  </View>
                </View>

                {/* Animated Progress Bar Track & Fill */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Calendar Period Picker Modal */}
      <Modal
        visible={isCalendarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCalendarModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsCalendarModalVisible(false)}
        >
          <Pressable style={styles.monthPickerCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.monthPickerTitle}>Select Billing Period</Text>

            {/* In-Modal Tab Switcher */}
            <View style={styles.modalTabsRow}>
              {(['week', 'month', 'year'] as Timeframe[]).map((tf) => {
                const isTabActive = calendarTab === tf;
                return (
                  <Pressable
                    key={tf}
                    style={[
                      styles.modalTabBtn,
                      isTabActive && styles.modalTabBtnActive,
                    ]}
                    onPress={() => setCalendarTab(tf)}
                  >
                    <Text
                      style={[
                        styles.modalTabTxt,
                        isTabActive && styles.modalTabTxtActive,
                      ]}
                    >
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* List of Periods for Selected Tab */}
            {AVAILABLE_PERIODS[calendarTab].map((item) => {
              const isSelected = selectedPeriodLabel === item.displayLabel;
              return (
                <Pressable
                  key={item.label}
                  style={[
                    styles.monthItem,
                    isSelected && styles.monthItemActive,
                  ]}
                  onPress={() => {
                    setSelectedTimeframe(calendarTab);
                    setSelectedPeriodLabel(item.displayLabel);
                    setIsCalendarModalVisible(false);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.monthText,
                        isSelected && styles.monthTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.monthSubText}>{item.sub}</Text>
                  </View>
                  {isSelected && (
                    <Feather name="check" size={16} color={Colors.brandPrimary} />
                  )}
                </Pressable>
              );
            })}
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
  headerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  segmentButtonActive: {
    backgroundColor: Colors.brandPrimary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  totalAmountText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.5,
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 3,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.successMain,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandSoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.brandDark,
    fontWeight: '600',
    lineHeight: 18,
  },
  breakdownSection: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain,
    letterSpacing: -0.3,
  },
  categoriesCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.lg - 4,
  },
  categoryItem: {
    gap: Spacing.xs + 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMain,
  },
  categoryAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
  },
  categoryPercent: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  monthPickerCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  monthPickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: Spacing.xs,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  monthItemActive: {
    backgroundColor: Colors.brandSoft,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMain,
  },
  monthTextActive: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  monthSubText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  modalTabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgMain,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.xs,
  },
  modalTabBtn: {
    flex: 1,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  modalTabBtnActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modalTabTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modalTabTxtActive: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
});