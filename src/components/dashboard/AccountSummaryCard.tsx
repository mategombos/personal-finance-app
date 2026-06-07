'use client';

import { useState, useEffect } from 'react';
import { Asset, Transaction } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { filterByPeriod, sumByType } from '@/lib/calculations';
import { clsx } from 'clsx';

interface Props {
  assets: Asset[];
  transactions: Transaction[];
  currency: string;
}

export function AccountSummaryCard({ assets, transactions, currency }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeAssets = assets.filter((a) => !a.isArchived);
  if (!mounted || activeAssets.length === 0) return null;

  const thisMonth = filterByPeriod(transactions, 'month');

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Account Summary
      </h2>
      <ul className="space-y-3">
        {activeAssets.map((asset) => {
          const accountTx = thisMonth.filter((t) => t.assetId === asset.id);
          const netFlow = sumByType(accountTx, 'income') - sumByType(accountTx, 'expense');
          return (
            <li key={asset.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{asset.name}</span>
              </div>
              <div className="flex items-center gap-4 ml-2 flex-shrink-0 text-right">
                {accountTx.length > 0 && (
                  <span className={clsx(
                    'text-xs font-medium',
                    netFlow >= 0 ? 'text-green-600' : 'text-red-500'
                  )}>
                    {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow, currency)}
                  </span>
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(asset.balance, asset.currency)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
