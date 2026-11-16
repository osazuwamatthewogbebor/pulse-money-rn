// src/data/mockData.ts
import { UserProfile, Transaction, Recipient, SpendingCategory, VirtualCard, BankAccount } from '../types';
import { Colors } from '../constants/theme';

export const mockUser: UserProfile = {
  name: 'John Doe',
  initials: 'JD',
  totalBalance: 24580.40,
  currency: 'USD ($)',
  monthlyGrowthPercent: 8.4,
  unreadNotifications: true,
};

// in src/data/mockData.ts
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Apple Store',
    category: 'Electronics',
    date: 'Today',
    amount: -129.00,
    type: 'expense',
    icon: 'smartphone',
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
  },
  {
    id: 'tx-2',
    title: 'Starbucks Coffee',
    category: 'Food & Drink',
    date: 'Today',
    amount: -6.45,
    type: 'expense',
    icon: 'coffee',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: 'tx-3',
    title: 'Salary Deposit',
    category: 'Payroll',
    date: 'Yesterday',
    amount: 4250.00,
    type: 'income',
    icon: 'arrow-down-left',
    iconBg: Colors.successSoft,
    iconColor: Colors.successMain,
  },
  {
    id: 'tx-4',
    title: 'Whole Foods Market',
    category: 'Groceries',
    date: 'Yesterday',
    amount: -84.20,
    type: 'expense',
    icon: 'shopping-cart',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
  },
  {
    id: 'tx-5',
    title: 'Spotify Family',
    category: 'Subscription',
    date: '2d ago',
    amount: -16.99,
    type: 'expense',
    icon: 'music',
    iconBg: Colors.dangerSoft,
    iconColor: Colors.dangerMain,
  },
  {
    id: 'tx-6',
    title: 'Uber Ride',
    category: 'Transport',
    date: '3d ago',
    amount: -24.50,
    type: 'expense',
    icon: 'navigation',
    iconBg: '#F3E8FF',
    iconColor: '#A855F7',
  },
  {
    id: 'tx-7',
    title: 'Netflix Premium',
    category: 'Subscription',
    date: '4d ago',
    amount: -19.99,
    type: 'expense',
    icon: 'tv',
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
  },
];

export const mockRecipients: Recipient[] =  [
  { id: 'rec-1', name: 'Sarah M.', initials: 'SM', bg: '#FEE2E2', color: '#EF4444' },
  { id: 'rec-2', name: 'Alex K.', initials: 'AK', bg: '#E0E7FF', color: '#4F46E5' },
  { id: 'rec-3', name: 'Emma W.', initials: 'EW', bg: '#FEF3C7', color: '#D97706' },
  { id: 'rec-4', name: 'David O.', initials: 'DO', bg: '#DCFCE7', color: '#16A34A' },
];

export const mockSpendingCategories: SpendingCategory[] = [
  { id: 'cat-1', name: 'Shopping & Retail', amount: 1120.00, percentage: 33, color: '#3B82F6' },
  { id: 'cat-2', name: 'Food & Groceries', amount: 890.50, percentage: 26, color: '#10B981' },
  { id: 'cat-3', name: 'Rent & Utilities', amount: 850.00, percentage: 25, color: '#8B5CF6' },
  { id: 'cat-4', name: 'Entertainment', amount: 340.00, percentage: 10, color: '#F59E0B' },
  { id: 'cat-5', name: 'Transport', amount: 220.00, percentage: 6, color: '#EF4444' },
];

export const mockVirtualCard: VirtualCard = {
  id: 'card-1',
  name: 'Primary Debit',
  brand: 'Pulse Black Edition',
  cardNumber: '4829  ••••  ••••  9021',
  cardHolder: 'JOHN DOE',
  expiry: '08/28',
  pin: '4829',
  isFrozen: false,
  onlinePayEnabled: true,
  spendingLimit: 5000,
  spentThisMonth: 1450,
};

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Chase Checking',
    accountType: 'Checking',
    lastFour: '9021',
    balance: 18450.00,
  },
  {
    id: 'bank-2',
    bankName: 'Wells Fargo Savings',
    accountType: 'Savings',
    lastFour: '3310',
    balance: 6130.40,
  },
];

