'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryTotal } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { PieChart as PieIcon } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface SpendingByCategoryChartProps {
  data: CategoryTotal[];
  currency: string;
}

export function SpendingByCategoryChart({ data, currency }: SpendingByCategoryChartProps) {
  const t = useTranslations();

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.spendingByCategory')}</h3>
        <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-400">
          <PieIcon className="h-10 w-10" />
          <p className="text-sm">{t('dashboard.noExpenseData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.spendingByCategory')}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currency)}
          />
          <Legend
            formatter={(value) => <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-2">
        {data.slice(0, 5).map((item) => (
          <div key={item.categoryId} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 ml-2 flex-shrink-0">
              <span className="text-gray-500 dark:text-gray-400">{formatPercent(item.percentage)}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(item.amount, currency)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
