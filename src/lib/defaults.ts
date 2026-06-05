import { Category, Asset } from '@/types';

export const DEFAULT_CATEGORIES: Omit<Category, 'createdAt'>[] = [
  // Expense categories
  { id: 'cat_food', name: 'Food & Dining', type: 'expense', color: '#f97316', icon: 'utensils', isDefault: true },
  { id: 'cat_groceries', name: 'Groceries', type: 'expense', color: '#84cc16', icon: 'shopping-basket', isDefault: true },
  { id: 'cat_transport', name: 'Transport', type: 'expense', color: '#3b82f6', icon: 'car', isDefault: true },
  { id: 'cat_fuel', name: 'Fuel', type: 'expense', color: '#6366f1', icon: 'fuel', isDefault: true },
  { id: 'cat_housing', name: 'Housing & Rent', type: 'expense', color: '#8b5cf6', icon: 'home', isDefault: true },
  { id: 'cat_utilities', name: 'Utilities', type: 'expense', color: '#06b6d4', icon: 'zap', isDefault: true },
  { id: 'cat_health', name: 'Healthcare', type: 'expense', color: '#ef4444', icon: 'heart-pulse', isDefault: true },
  { id: 'cat_entertainment', name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'film', isDefault: true },
  { id: 'cat_shopping', name: 'Shopping', type: 'expense', color: '#f59e0b', icon: 'shopping-bag', isDefault: true },
  { id: 'cat_education', name: 'Education', type: 'expense', color: '#14b8a6', icon: 'book-open', isDefault: true },
  { id: 'cat_travel', name: 'Travel', type: 'expense', color: '#0ea5e9', icon: 'plane', isDefault: true },
  { id: 'cat_subscriptions', name: 'Subscriptions', type: 'expense', color: '#a855f7', icon: 'repeat', isDefault: true },
  { id: 'cat_personal', name: 'Personal Care', type: 'expense', color: '#fb7185', icon: 'scissors', isDefault: true },
  { id: 'cat_gifts', name: 'Gifts & Donations', type: 'expense', color: '#10b981', icon: 'gift', isDefault: true },
  { id: 'cat_business', name: 'Business Expenses', type: 'expense', color: '#64748b', icon: 'briefcase-business', isDefault: true },
  { id: 'cat_other_expense', name: 'Other Expense', type: 'expense', color: '#6b7280', icon: 'circle-ellipsis', isDefault: true },
  // Income categories
  { id: 'cat_salary', name: 'Salary', type: 'income', color: '#22c55e', icon: 'briefcase', isDefault: true },
  { id: 'cat_freelance', name: 'Freelance', type: 'income', color: '#16a34a', icon: 'laptop', isDefault: true },
  { id: 'cat_investment_return', name: 'Investment Return', type: 'income', color: '#4ade80', icon: 'trending-up', isDefault: true },
  { id: 'cat_gift_received', name: 'Gift Received', type: 'income', color: '#86efac', icon: 'package', isDefault: true },
  { id: 'cat_other_income', name: 'Other Income', type: 'income', color: '#6b7280', icon: 'circle-ellipsis', isDefault: true },
];

export const DEFAULT_ASSETS: Omit<Asset, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'asset_wallet',
    name: 'Wallet',
    type: 'cash',
    balance: 0,
    currency: 'HUF',
    color: '#10b981',
    icon: 'wallet',
    isArchived: false,
  },
  {
    id: 'asset_bank',
    name: 'Bank Account',
    type: 'bank',
    balance: 0,
    currency: 'HUF',
    color: '#3b82f6',
    icon: 'landmark',
    isArchived: false,
  },
];
