'use client';

import { useState, useEffect, useCallback } from 'react';
import { FinanceStore } from '@/types';
import { readStore, writeStore } from '@/lib/storage';
import { STORAGE_KEY } from '@/lib/constants';

export function useFinanceStore(): [FinanceStore, (updater: (prev: FinanceStore) => FinanceStore) => void] {
  const [store, setStore] = useState<FinanceStore>(() => {
    if (typeof window === 'undefined') {
      return {
        version: 1,
        settings: { currency: 'HUF', dateFormat: 'DD/MM/YYYY', theme: 'system', language: 'en' },
        transactions: [],
        categories: [],
        assets: [],
      };
    }
    return readStore();
  });

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
      return next;
    });
  }, []);

  return [store, update];
}
