export type TransactionType = 'expense' | 'income';

export interface Transaction {
    id: string;
    title: string;
    category: string;
    date: string;
    amount: number;
    type: TransactionType;
    icon: string // The icon name;
    iconBg: string; // The pill bg color
    iconColor: string // Icon tint color
}

export interface QuickActionItem {
    id: string;
    label: string;
    icon: string;
    action: () => void;
}

export interface UserProfile {
    name: string;
    initials: string;
    totalBalance: number;
    currency: string;
    monthlyGrowthPercent: number;
    unreadNotifications: boolean;
}

export type TabType = 'home' | 'analytics' | 'cards' | 'profile';

export interface Recipient {
    id: string;
    name: string;
    initials: string;
    bg: string;
    color: string;
};

export type Timeframe = 'week' | 'month' | 'year';

export interface SpendingCategory {
    id: string;
    name: string;
    amount: number;
    percentage: number;
    color: string;
};

export interface VirtualCard {
  id: string;
  name: string;
  brand: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  pin: string;
  isFrozen: boolean;
  onlinePayEnabled: boolean;
  spendingLimit: number;
  spentThisMonth: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  lastFour: string;
  balance: number;
};