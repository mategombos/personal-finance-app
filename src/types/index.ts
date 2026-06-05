export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense' | 'both';
export type AssetType = 'cash' | 'bank' | 'investment' | 'personal';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  assetId?: string;
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
  defaultAssetId?: string;
}

export interface FinanceStore {
  version: number;
  settings: AppSettings;
  transactions: Transaction[];
  categories: Category[];
  assets: Asset[];
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
