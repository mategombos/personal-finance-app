'use client';

import { useState, useEffect, useCallback } from 'react';
import { FinanceStore } from '@/types';
import { readStore, writeStore } from '@/lib/storage';
import { STORAGE_KEY } from '@/lib/constants';
import { calculateNetWorth } from '@/lib/calculations';
import { syncToFirestore } from '@/lib/sync';
import { isFirebaseConfigured } from '@/lib/firebase';
import { getCurrentFirebaseUser } from './useFirebaseSync';
import { format } from 'date-fns';

// Creates or updates the current month's net worth snapshot.
// - No snapshot for this month yet   -> append one (month-rollover / first run).
// - Existing auto snapshot           -> refresh its value to live net worth.
// - Existing manual (pinned) snapshot -> leave untouched.
// Returns the SAME store reference when nothing changed, so callers can skip writes.
function syncCurrentMonthSnapshot(store: FinanceStore): FinanceStore {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const value = calculateNetWorth(store.assets);
  const existing = store.netWorthHistory.find((s) => s.date === currentMonth);

  if (!existing) {
    return {
      ...store,
      netWorthHistory: [...store.netWorthHistory, { date: currentMonth, value, manual: false }],
    };
  }
  if (existing.manual || existing.value === value) return store;
  return {
    ...store,
    netWorthHistory: store.netWorthHistory.map((s) =>
      s.date === currentMonth ? { ...s, value } : s
    ),
  };
}

export function useFinanceStore(): [FinanceStore, (updater: (prev: FinanceStore) => FinanceStore) => void] {
  const [store, setStore] = useState<FinanceStore>(() => {
    if (typeof window === 'undefined') {
      return {
        version: 3,
        settings: { currency: 'HUF', dateFormat: 'DD/MM/YYYY', theme: 'system', language: 'en' },
        transactions: [],
        categories: [],
        assets: [],
        netWorthHistory: [],
      };
    }
    return readStore();
  });

  const syncSnapshot = useCallback(() => {
    setStore((prev) => {
      const next = syncCurrentMonthSnapshot(prev);
      if (next !== prev) writeStore(next);
      return next;
    });
  }, []);

  // Trigger 1 (meaningful asset-state change) + Trigger 3 (mount backstop):
  // keyed on the live net-worth NUMBER, so cosmetic asset edits that don't move
  // the value are ignored, and no-op syncs return the same ref (no write/render).
  const liveNetWorth = calculateNetWorth(store.assets);
  useEffect(() => {
    syncSnapshot();
  }, [liveNetWorth, syncSnapshot]);

  // Trigger 2 (month rollover): re-check when the tab regains focus/visibility,
  // catching the app being left open across a month boundary with no asset change.
  useEffect(() => {
    const recheck = () => syncSnapshot();
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', recheck);
    return () => {
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', recheck);
    };
  }, [syncSnapshot]);

  // Cross-tab sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setStore(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const update = useCallback((updater: (prev: FinanceStore) => FinanceStore) => {
    setStore((prev) => {
      const next = updater(prev);
      writeStore(next);
      // Background Firebase sync
      if (isFirebaseConfigured()) {
        const user = getCurrentFirebaseUser();
        if (user) syncToFirestore(next, user.uid).catch(() => {});
      }
      return next;
    });
  }, []);

  return [store, update];
}
