'use client';

import Link from 'next/link';
import { Transaction, Category } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslations } from '@/hooks/useTranslations';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  dateFormat: string;
}

export function RecentTransactionsList({
  transactions,
  categories,
  currency,
  dateFormat,
}: RecentTransactionsListProps) {
  const t = useTranslations();

  return (
    <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.recentTransactions')}</h3>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t('dashboard.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {transactions.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          {t('dashboard.noTransactionsYet')}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((tx) => {
            const cat = categories.find((c) => c.id === tx.categoryId);
            return (
              <li key={tx.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat?.color ?? '#6b7280' }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat?.name ?? t('common.unknown')} · {formatDate(tx.date, dateFormat)}
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(
                    'ml-4 text-sm font-semibold flex-shrink-0',
                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
