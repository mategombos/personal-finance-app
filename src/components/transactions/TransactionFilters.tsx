'use client';

import { Category } from '@/types';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export interface TransactionFiltersState {
  type: '' | 'income' | 'expense';
  categoryId: string;
  dateFrom: string;
  dateTo: string;
}

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  categories: Category[];
  onChange: (f: TransactionFiltersState) => void;
  onReset: () => void;
}

export function TransactionFilters({ filters, categories, onChange, onReset }: TransactionFiltersProps) {
  const t = useTranslations();
  const set = (key: keyof TransactionFiltersState, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActive = filters.type || filters.categoryId || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Select
        label={t('transactions.filters.type')}
        value={filters.type}
        onChange={(e) => set('type', e.target.value)}
        className="w-36"
      >
        <option value="">{t('transactions.filters.allTypes')}</option>
        <option value="income">{t('common.income')}</option>
        <option value="expense">{t('common.expense')}</option>
      </Select>

      <Select
        label={t('transactions.filters.category')}
        value={filters.categoryId}
        onChange={(e) => set('categoryId', e.target.value)}
        className="w-44"
      >
        <option value="">{t('transactions.filters.allCategories')}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>

      <Input
        label={t('transactions.filters.from')}
        type="date"
        value={filters.dateFrom}
        onChange={(e) => set('dateFrom', e.target.value)}
        className="w-40"
      />

      <Input
        label={t('transactions.filters.to')}
        type="date"
        value={filters.dateTo}
        onChange={(e) => set('dateTo', e.target.value)}
        className="w-40"
      />

      {hasActive && (
        <Button variant="ghost" size="sm" onClick={onReset} className="self-end mb-0.5">
          <X className="h-4 w-4" /> {t('transactions.filters.clear')}
        </Button>
      )}
    </div>
  );
}
