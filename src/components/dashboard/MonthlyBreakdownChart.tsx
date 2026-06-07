'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyData } from '@/types';
import { formatCurrency, formatCompact } from '@/lib/formatters';
import { useTranslations } from '@/hooks/useTranslations';
import { BarChart2 } from 'lucide-react';

interface MonthlyBreakdownChartProps {
  data: MonthlyData[];
  currency: string;
}

export function MonthlyBreakdownChart({ data, currency }: MonthlyBreakdownChartProps) {
  const t = useTranslations();

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          {t('dashboard.monthlyBreakdown')}
        </h3>
        <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-400">
          <BarChart2 className="h-10 w-10" />
          <p className="text-sm">{t('dashboard.noMonthlyData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        {t('dashboard.monthlyBreakdown')}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--chart-axis)' }} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--chart-axis)' }}
            tickFormatter={(v) => formatCompact(v)}
          />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value), currency),
              name === 'income' ? t('common.income') : t('common.expense'),
            ]}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {value === 'income' ? t('common.income') : t('common.expense')}
              </span>
            )}
          />
          <Bar dataKey="income" fill="#22c55e" radius={[3, 3, 0, 0]} name="income" />
          <Bar dataKey="expense" fill="#ef4444" radius={[3, 3, 0, 0]} name="expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
