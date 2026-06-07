'use client';

import { BudgetUsage } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { clsx } from 'clsx';

interface Props {
  budgetUsage: BudgetUsage[];
  currency: string;
}

export function BudgetProgressCard({ budgetUsage, currency }: Props) {
  if (budgetUsage.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Monthly Budgets
      </h2>
      <ul className="space-y-4">
        {budgetUsage.map((item) => {
          const pct = Math.min(item.percentage, 100);
          const isWarning = item.percentage >= 80 && !item.isOverBudget;
          return (
            <li key={item.categoryId}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </span>
                </div>
                <span className={clsx(
                  'text-xs font-medium',
                  item.isOverBudget ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {formatCurrency(item.spent, currency)} / {formatCurrency(item.budget, currency)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={clsx(
                    'h-2 rounded-full transition-all',
                    item.isOverBudget
                      ? 'bg-red-600'
                      : isWarning
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {item.isOverBudget && (
                <p className="mt-0.5 text-xs text-red-500">
                  Over by {formatCurrency(item.spent - item.budget, currency)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
