import { Transaction, Category, Asset, CategoryTotal, MonthlyData, BudgetUsage } from '@/types';
import { format, parseISO, startOfMonth, isWithinInterval, subMonths } from 'date-fns';

export function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

export function filterByPeriod(
  transactions: Transaction[],
  period: 'month' | 'year' | 'all'
): Transaction[] {
  if (period === 'all') return transactions;
  const now = new Date();
  const start =
    period === 'month'
      ? startOfMonth(now)
      : new Date(now.getFullYear(), 0, 1);
  return transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start, end: now });
  });
}

export function groupByCategory(
  transactions: Transaction[],
  categories: Category[]
): CategoryTotal[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  const map = new Map<string, number>();
  for (const t of expenses) {
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  }
  return Array.from(map.entries())
    .map(([categoryId, amount]) => {
      const cat = categories.find((c) => c.id === categoryId);
      return {
        categoryId,
        name: cat?.name ?? 'Unknown',
        color: cat?.color ?? '#6b7280',
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function groupByMonth(transactions: Transaction[], monthCount = 12): MonthlyData[] {
  const now = new Date();
  const months: MonthlyData[] = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const label = format(date, 'MMM yyyy');
    const monthStart = startOfMonth(date);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const inMonth = transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    });
    months.push({
      month: label,
      income: sumByType(inMonth, 'income'),
      expense: sumByType(inMonth, 'expense'),
    });
  }
  return months;
}

export function calculateNetWorth(assets: Asset[]): number {
  return assets.filter((a) => !a.isArchived).reduce((sum, a) => sum + a.balance, 0);
}

export function getBudgetUsage(
  categories: Category[],
  transactions: Transaction[]
): BudgetUsage[] {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const thisMonth = transactions.filter((t) => {
    const d = parseISO(t.date);
    return t.type === 'expense' && isWithinInterval(d, { start: monthStart, end: now });
  });

  return categories
    .filter((c) => c.monthlyBudget && c.monthlyBudget > 0)
    .map((c) => {
      const spent = thisMonth
        .filter((t) => t.categoryId === c.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const budget = c.monthlyBudget!;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      return {
        categoryId: c.id,
        name: c.name,
        color: c.color,
        budget,
        spent,
        percentage,
        isOverBudget: spent > budget,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

export function calculateSavingsRate(totalIncome: number, totalExpenses: number): number {
  if (totalIncome <= 0) return 0;
  const rate = ((totalIncome - totalExpenses) / totalIncome) * 100;
  return Math.max(-100, Math.min(100, rate));
}

export function getPrevMonthTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  const prevMonth = subMonths(now, 1);
  const monthStart = startOfMonth(prevMonth);
  const monthEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
  return transactions.filter((t) => {
    const d = parseISO(t.date);
    return isWithinInterval(d, { start: monthStart, end: monthEnd });
  });
}
