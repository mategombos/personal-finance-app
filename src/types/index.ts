export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense' | 'both';
export type AssetType = 'cash' | 'bank' | 'investment' | 'personal';
export type RecurringInterval = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  assetId?: string;
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval;
  nextDueDate?: string; // "YYYY-MM-DD"
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  isDefault: boolean;
  monthlyBudget?: number;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  description?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hu';
  defaultAssetId?: string;
}

export interface NetWorthSnapshot {
  date: string; // "YYYY-MM"
  value: number;
  manual?: boolean; // true = user-set, never auto-overwritten
}

export interface FinanceStore {
  version: number;
  settings: AppSettings;
  transactions: Transaction[];
  categories: Category[];
  assets: Asset[];
  netWorthHistory: NetWorthSnapshot[];
}

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface MonthlyData {
  month: string; // "Jan 2026"
  income: number;
  expense: number;
}

export interface BudgetUsage {
  categoryId: string;
  name: string;
  color: string;
  budget: number;
  spent: number;
  percentage: number;
  isOverBudget: boolean;
}
