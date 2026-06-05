'use client';

import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';
import { useAssets } from './useAssets';
import {
  sumByType,
  filterByPeriod,
  groupByCategory,
  groupByMonth,
  calculateNetWorth,
} from '@/lib/calculations';

export type DashboardPeriod = 'month' | 'year' | 'all';

export function useDashboard(period: DashboardPeriod = 'month') {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { assets } = useAssets();

  const filtered = useMemo(() => filterByPeriod(transactions, period), [transactions, period]);
  const totalIncome = useMemo(() => sumByType(filtered, 'income'), [filtered]);
  const totalExpenses = useMemo(() => sumByType(filtered, 'expense'), [filtered]);
  const netBalance = totalIncome - totalExpenses;
  const categoryTotals = useMemo(() => groupByCategory(filtered, categories), [filtered, categories]);
  const monthlyData = useMemo(() => groupByMonth(transactions, 6), [transactions]);
  const netWorth = useMemo(() => calculateNetWorth(assets), [assets]);
  const recentTransactions = useMemo(() => transactions.slice(0, 10), [transactions]);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    monthlyData,
    netWorth,
    recentTransactions,
    assets,
  };
}
