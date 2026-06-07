'use client';

import { NetWorthSnapshot } from '@/types';
import { formatCompact } from '@/lib/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface Props {
  data: NetWorthSnapshot[];
  currency: string;
}

export function NetWorthHistoryChart({ data, currency }: Props) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Net Worth Over Time
      </h2>
      {sorted.length < 2 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center">
          Net worth history builds up month by month. Check back next month to see your trend.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={sorted} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="text-gray-500 dark:text-gray-400"
            />
            <YAxis
              tickFormatter={(v) => formatCompact(v)}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              className="text-gray-500 dark:text-gray-400"
            />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number'
                  ? new Intl.NumberFormat('hu-HU', {
                      style: 'currency',
                      currency,
                      maximumFractionDigits: 0,
                    }).format(value)
                  : value
              }
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
