'use client';

import { AppSettings } from '@/types';
import { useFinanceStore } from './useFinanceStore';

export function useSettings() {
  const [store, update] = useFinanceStore();

  const updateSettings = (patch: Partial<AppSettings>) => {
    update((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  };

  return { settings: store.settings, updateSettings };
}
