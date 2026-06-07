'use client';

import { Transaction, Category } from '@/types';
import { getUpcomingRecurring, advanceNextDueDate, daysUntilDue } from '@/lib/recurring';
import { formatCurrency } from '@/lib/formatters';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionFormData } from '@/lib/validators';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { todayISO } from '@/lib/formatters';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
}

export function UpcomingRecurringCard({ transactions, categories, currency }: Props) {
  const { addTransaction, updateTransaction } = useTransactions();
  const upcoming = getUpcomingRecurring(transactions, 7);

  if (upcoming.length === 0) return null;

  const handleMarkPaid = (tx: Transaction) => {
    // Create a new one-time transaction for today
    const data: TransactionFormData = {
      type: tx.type,
      amount: tx.amount,
      categoryId: tx.categoryId,
      description: tx.description,
      date: todayISO(),
      assetId: tx.assetId,
    };
    addTransaction(data);
    // Advance the recurring template's nextDueDate
    updateTransaction(tx.id, { nextDueDate: advanceNextDueDate(tx) });
  };

  return (
    <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <RefreshCw className="h-4 w-4 text-blue-500" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Upcoming Recurring ({upcoming.length})
        </h2>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {upcoming.map((tx) => {
          const cat = categories.find((c) => c.id === tx.categoryId);
          const days = daysUntilDue(tx.nextDueDate!);
          const overdue = days < 0;
          const today = days === 0;
          return (
            <li key={tx.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat?.color ?? '#6b7280' }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {tx.description}
                  </p>
                  <p className={clsx(
                    'text-xs',
                    overdue ? 'text-red-500 font-medium' : today ? 'text-amber-500 font-medium' : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {overdue
                      ? `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`
                      : today
                      ? 'Due today'
                      : `Due in ${days} day${days !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span className={clsx(
                  'text-sm font-semibold',
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMarkPaid(tx)}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mark Paid</span>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
