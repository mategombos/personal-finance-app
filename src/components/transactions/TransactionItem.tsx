'use client';

import { Transaction, Category } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { useTranslations } from '@/hooks/useTranslations';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  currency: string;
  dateFormat: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export function TransactionItem({
  transaction: tx,
  category,
  currency,
  dateFormat,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const t = useTranslations();

  return (
    <li className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category?.color ?? '#6b7280' }}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{tx.description}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {category?.name ?? t('common.unknown')} · {formatDate(tx.date, dateFormat)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <span
          className={clsx(
            'text-sm font-semibold',
            tx.type === 'income' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onEdit(tx)} aria-label={t('common.edit')}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(tx)} aria-label={t('common.delete')}>
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </div>
    </li>
  );
}
