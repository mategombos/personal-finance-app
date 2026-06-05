'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { DashboardPeriod } from '@/hooks/useDashboard';
import { clsx } from 'clsx';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
  period: DashboardPeriod;
  onPeriodChange: (p: DashboardPeriod) => void;
}

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

export function SummaryCards({
  totalIncome,
  totalExpenses,
  netBalance,
  currency,
  period,
  onPeriodChange,
}: SummaryCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => onPeriodChange(p.value)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              period === p.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Total Income
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome, currency)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Total Expenses
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses, currency)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Wallet className="h-4 w-4 text-blue-500" />
            Net Balance
          </div>
          <p className={clsx('text-2xl font-bold', netBalance >= 0 ? 'text-blue-600' : 'text-red-600')}>
            {formatCurrency(netBalance, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
