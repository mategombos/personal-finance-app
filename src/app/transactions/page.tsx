'use client';

import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import { useTranslations } from '@/hooks/useTranslations';
import { interpolate } from '@/lib/translations';
import { Transaction } from '@/types';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { TransactionFilters, TransactionFiltersState } from '@/components/transactions/TransactionFilters';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, ArrowLeftRight } from 'lucide-react';
import { parseISO, isWithinInterval } from 'date-fns';
import { TransactionFormData } from '@/lib/validators';

const EMPTY_FILTERS: TransactionFiltersState = { type: '', categoryId: '', dateFrom: '', dateTo: '' };
const PAGE_SIZE = 25;

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const t = useTranslations();

  const [filters, setFilters] = useState<TransactionFiltersState>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.type && tx.type !== filters.type) return false;
      if (filters.categoryId && tx.categoryId !== filters.categoryId) return false;
      if (filters.dateFrom || filters.dateTo) {
        const date = parseISO(tx.date);
        const start = filters.dateFrom ? parseISO(filters.dateFrom) : new Date(0);
        const end = filters.dateTo ? parseISO(filters.dateTo) : new Date(9999, 0);
        if (!isWithinInterval(date, { start, end })) return false;
      }
      return true;
    });
  }, [transactions, filters]);

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < filtered.length;

  const handleAdd = (data: TransactionFormData) => {
    addTransaction(data);
    setAddOpen(false);
  };

  const handleEdit = (data: TransactionFormData) => {
    if (!editing) return;
    updateTransaction(editing.id, data);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteTransaction(deleting.id);
    setDeleting(null);
  };

  const resetFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  return (
    <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactions.title')}</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> {t('transactions.add')}
        </Button>
      </div>

      <TransactionFilters
        filters={filters}
        categories={categories}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={resetFilters}
      />

      <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title={t('transactions.noTransactions')}
            description={t('transactions.noTransactionsDesc')}
            action={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> {t('transactions.addTransaction')}</Button>}
          />
        ) : (
          <>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {paged.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  category={categories.find((c) => c.id === tx.categoryId)}
                  currency={settings.currency}
                  dateFormat={settings.dateFormat}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </ul>
            {hasMore && (
              <div className="flex justify-center p-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                  {t('transactions.loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t('transactions.addTransaction')}>
        <TransactionForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('transactions.editTransaction')}>
        {editing && (
          <TransactionForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={t('transactions.deleteTitle')}
        description={interpolate(t('transactions.deleteConfirm'), { name: deleting?.description ?? '' })}
        confirmLabel={t('common.delete')}
        dangerous
      />
    </div>
  );
}
