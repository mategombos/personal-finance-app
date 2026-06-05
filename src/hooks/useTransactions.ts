'use client';

import { Transaction } from '@/types';
import { TransactionFormData } from '@/lib/validators';
import { useFinanceStore } from './useFinanceStore';

export function useTransactions() {
  const [store, update] = useFinanceStore();

  const addTransaction = (data: TransactionFormData) => {
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    update((prev) => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
    return newTx;
  };

  const updateTransaction = (id: string, data: Partial<TransactionFormData>) => {
    update((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
      ),
    }));
  };

  const deleteTransaction = (id: string) => {
    update((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  return {
    transactions: store.transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
