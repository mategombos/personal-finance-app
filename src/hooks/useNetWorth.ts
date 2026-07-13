'use client';

import { NetWorthSnapshot } from '@/types';
import { useFinanceStore } from './useFinanceStore';

export function useNetWorth() {
  const [store, update] = useFinanceStore();

  // Upsert a user-set (pinned) snapshot for the given "YYYY-MM" month.
  // Handles both add and edit; a pinned entry is never auto-overwritten.
  const setSnapshot = (date: string, value: number) => {
    update((prev) => {
      const exists = prev.netWorthHistory.some((s) => s.date === date);
      const netWorthHistory = exists
        ? prev.netWorthHistory.map((s) =>
            s.date === date ? { ...s, value, manual: true } : s
          )
        : [...prev.netWorthHistory, { date, value, manual: true } as NetWorthSnapshot];
      return { ...prev, netWorthHistory };
    });
  };

  const deleteSnapshot = (date: string) => {
    update((prev) => ({
      ...prev,
      netWorthHistory: prev.netWorthHistory.filter((s) => s.date !== date),
    }));
  };

  return {
    history: store.netWorthHistory,
    setSnapshot,
    deleteSnapshot,
  };
}
