'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  savingsRate: number;
  prevMonthSavingsRate: number;
}

export function SavingsRateCard({ savingsRate, prevMonthSavingsRate }: Props) {
  const pct = Math.round(savingsRate * 10) / 10;
  const diff = Math.round((savingsRate - prevMonthSavingsRate) * 10) / 10;

  const color = pct >= 20 ? 'text-green-600' : pct >= 10 ? 'text-amber-500' : 'text-red-500';
  const bg = pct >= 20 ? 'bg-green-50 dark:bg-green-950' : pct >= 10 ? 'bg-amber-50 dark:bg-amber-950' : 'bg-red-50 dark:bg-red-950';

  return (
    <div className={clsx('rounded-xl p-6 shadow-sm', bg)}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Savings Rate</p>
      <div className="flex items-end gap-3">
        <span className={clsx('text-4xl font-bold', color)}>
          {pct >= 0 ? pct : 0}%
        </span>
        {prevMonthSavingsRate > 0 || savingsRate > 0 ? (
          <span className={clsx(
            'flex items-center gap-0.5 text-sm font-medium mb-1',
            diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-500'
          )}>
            {diff > 0 ? <TrendingUp className="h-4 w-4" /> : diff < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            {diff > 0 ? '+' : ''}{diff}% vs last month
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {pct >= 20
          ? 'Great — you\'re hitting the 20% savings target!'
          : pct >= 10
          ? 'Getting there — aim for 20% to build financial resilience.'
          : 'Experts recommend saving at least 20% of income.'}
      </p>
    </div>
  );
}
