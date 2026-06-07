'use client';

import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';
import { useAssets } from './useAssets';
import { useFinanceStore } from './useFinanceStore';
import {
  sumByType,
  filterByPeriod,
  groupByCategory,
  groupByMonth,
  calculateNetWorth,
  getBudgetUsage,
  calculateSavingsRate,
  getPrevMonthTransactions,
} from '@/lib/calculations';

export type DashboardPeriod = 'month' | 'year' | 'all';

export function useDashboard(period: DashboardPeriod = 'month') {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { assets } = useAssets();
  const [store] = useFinanceStore();

  const filtered = useMemo(() => filterByPeriod(transactions, period), [transactions, period]);
  const totalIncome = useMemo(() => sumByType(filtered, 'income'), [filtered]);
  const totalExpenses = useMemo(() => sumByType(filtered, 'expense'), [filtered]);
  const netBalance = totalIncome - totalExpenses;
  const categoryTotals = useMemo(() => groupByCategory(filtered, categories), [filtered, categories]);
  const monthlyData = useMemo(() => groupByMonth(transactions, 12), [transactions]);
  const netWorth = useMemo(() => calculateNetWorth(assets), [assets]);
  const recentTransactions = useMemo(() => transactions.slice(0, 10), [transactions]);
  const budgetUsage = useMemo(() => getBudgetUsage(categories, transactions), [categories, transactions]);
  const savingsRate = useMemo(() => calculateSavingsRate(
    sumByType(filterByPeriod(transactions, 'month'), 'income'),
    sumByType(filterByPeriod(transactions, 'month'), 'expense')
  ), [transactions]);
  const prevMonthSavingsRate = useMemo(() => {
    const prev = getPrevMonthTransactions(transactions);
    return calculateSavingsRate(sumByType(prev, 'income'), sumByType(prev, 'expense'));
  }, [transactions]);
  const netWorthHistory = store.netWorthHistory;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    monthlyData,
    netWorth,
    recentTransactions,
    assets,
    budgetUsage,
    savingsRate,
    prevMonthSavingsRate,
    netWorthHistory,
  };
}
