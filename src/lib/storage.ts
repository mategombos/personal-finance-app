import { FinanceStore, AppSettings } from '@/types';
import { STORAGE_KEY, CURRENT_VERSION } from './constants';
import { DEFAULT_CATEGORIES, DEFAULT_ASSETS } from './defaults';

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'HUF',
  dateFormat: 'DD/MM/YYYY',
  theme: 'system',
  language: 'en',
};

const now = () => new Date().toISOString();

function buildDefaultStore(): FinanceStore {
  const ts = now();
  return {
    version: CURRENT_VERSION,
    settings: DEFAULT_SETTINGS,
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c, createdAt: ts })),
    assets: DEFAULT_ASSETS.map((a) => ({ ...a, createdAt: ts, updatedAt: ts })),
    transactions: [],
    netWorthHistory: [],
  };
}

function migrateStore(store: FinanceStore): FinanceStore {
  let s = store;
  if (s.version < 2) {
    s = {
      ...s,
      version: 2,
      settings: {
        ...s.settings,
        language: (s.settings as AppSettings & { language?: 'en' | 'hu' }).language ?? 'en',
      },
    };
  }
  if (s.version < 3) {
    s = {
      ...s,
      version: 3,
      netWorthHistory: [],
      transactions: s.transactions.map((t) => ({
        ...t,
        isRecurring: t.isRecurring ?? false,
      })),
    };
  }
  return { ...s, version: CURRENT_VERSION };
}

export function readStore(): FinanceStore {
  if (typeof window === 'undefined') return buildDefaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = buildDefaultStore();
      writeStore(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw) as FinanceStore;
    if (parsed.version !== CURRENT_VERSION) {
      const migrated = migrateStore(parsed);
      writeStore(migrated);
      return migrated;
    }
    return parsed;
  } catch {
    const fresh = buildDefaultStore();
    writeStore(fresh);
    return fresh;
  }
}

export function writeStore(store: FinanceStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function clearStore(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
