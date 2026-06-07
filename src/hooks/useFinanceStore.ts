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

function takeNetWorthSnapshot(store: FinanceStore): FinanceStore {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const alreadyHas = store.netWorthHistory.some((s) => s.date === currentMonth);
  if (alreadyHas) return store;
  const value = calculateNetWorth(store.assets);
  return {
    ...store,
    netWorthHistory: [...store.netWorthHistory, { date: currentMonth, value }],
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

  // Take net worth snapshot once on mount
  useEffect(() => {
    setStore((prev) => {
      const next = takeNetWorthSnapshot(prev);
      if (next !== prev) writeStore(next);
      return next;
    });
  }, []);

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
