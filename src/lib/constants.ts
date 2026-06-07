import { AssetType } from '@/types';

export const STORAGE_KEY = 'finance_app_v1';
export const CURRENT_VERSION = 3;

export const ASSET_TYPES: { value: AssetType; icon: string }[] = [
  { value: 'cash', icon: 'banknotes' },
  { value: 'bank', icon: 'landmark' },
  { value: 'investment', icon: 'trending-up' },
  { value: 'personal', icon: 'car' },
];

export const CURRENCIES = [
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
];

export const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#ec4899', '#64748b',
];

export const ICON_LIST = [
  'utensils', 'shopping-basket', 'car', 'fuel', 'home', 'zap',
  'heart-pulse', 'film', 'shopping-bag', 'book-open', 'plane',
  'repeat', 'scissors', 'gift', 'briefcase', 'briefcase-business',
  'wallet', 'landmark', 'trending-up', 'trending-down', 'piggy-bank',
  'credit-card', 'banknotes', 'circle-ellipsis', 'package', 'laptop',
  'coffee', 'music', 'gamepad-2', 'baby', 'paw-print', 'wrench',
  'shirt', 'tv', 'smartphone', 'dumbbell', 'bike', 'train',
];

export const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/01/2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/31/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-01-31)' },
];
