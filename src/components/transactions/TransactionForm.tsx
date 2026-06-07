'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useAssets } from '@/hooks/useAssets';
import { useSettings } from '@/hooks/useSettings';
import { useTranslations } from '@/hooks/useTranslations';
import { makeTransactionSchema, TransactionFormData } from '@/lib/validators';
import { todayISO } from '@/lib/formatters';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ReceiptScanner } from './ReceiptScanner';
import { Transaction, RecurringInterval } from '@/types';
import { clsx } from 'clsx';

interface TransactionFormProps {
  initial?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

const RECURRING_INTERVALS: { value: RecurringInterval; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const { categories } = useCategories();
  const { assets } = useAssets();
  const { settings } = useSettings();
  const t = useTranslations();

  const defaultAssetId = initial?.assetId ?? settings.defaultAssetId ?? '';

  const [type, setType] = useState<'income' | 'expense'>(initial?.type ?? 'expense');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    amount: initial?.amount?.toString() ?? '',
    categoryId: initial?.categoryId ?? '',
    description: initial?.description ?? '',
    date: initial?.date ?? todayISO(),
    assetId: defaultAssetId,
    isRecurring: initial?.isRecurring ?? false,
    recurringInterval: (initial?.recurringInterval ?? 'monthly') as RecurringInterval,
    nextDueDate: initial?.nextDueDate ?? '',
  });

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  );

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = makeTransactionSchema({
      amountRequired: t('validation.amountRequired'),
      categoryRequired: t('validation.categoryRequired'),
      descriptionRequired: t('validation.descriptionRequired'),
      dateInvalid: t('validation.dateInvalid'),
    });
    const parsed = schema.safeParse({
      type,
      amount: parseFloat(form.amount),
      categoryId: form.categoryId,
      description: form.description,
      date: form.date,
      assetId: form.assetId || undefined,
      isRecurring: form.isRecurring || undefined,
      recurringInterval: form.isRecurring ? form.recurringInterval : undefined,
      nextDueDate: form.isRecurring ? (form.nextDueDate || form.date) : undefined,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() ?? 'root';
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header: type toggle + receipt scanner */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {(['expense', 'income'] as const).map((txType) => (
            <button
              key={txType}
              type="button"
              onClick={() => { setType(txType); set('categoryId', ''); }}
              className={clsx(
                'flex-1 py-2 text-sm font-medium transition-colors',
                type === txType
                  ? txType === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              {txType === 'expense' ? t('common.expense') : t('common.income')}
            </button>
          ))}
        </div>
        <ReceiptScanner
          onResult={(data) => {
            if (data.amount) set('amount', data.amount.toString());
            if (data.description) set('description', data.description);
            if (data.date) set('date', data.date);
          }}
        />
      </div>

      {/* Account — top position, auto-selected */}
      <Select
        label="Account"
        id="assetId"
        value={form.assetId}
        onChange={(e) => set('assetId', e.target.value)}
      >
        <option value="">No specific account</option>
        {assets.filter((a) => !a.isArchived).map((a) => (
          <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
        ))}
      </Select>

      <Input
        label={t('transactions.form.amount')}
        id="amount"
        type="number"
        min="0"
        step="any"
        placeholder="0"
        value={form.amount}
        onChange={(e) => set('amount', e.target.value)}
        error={errors.amount}
      />

      <Select
        label={t('transactions.form.category')}
        id="categoryId"
        value={form.categoryId}
        onChange={(e) => set('categoryId', e.target.value)}
        error={errors.categoryId}
      >
        <option value="">{t('transactions.form.selectCategory')}</option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>

      <Input
        label={t('transactions.form.description')}
        id="description"
        placeholder={t('transactions.form.descriptionPlaceholder')}
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        error={errors.description}
      />

      <Input
        label={t('transactions.form.date')}
        id="date"
        type="date"
        value={form.date}
        onChange={(e) => set('date', e.target.value)}
        error={errors.date}
      />

      {/* Recurring toggle */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isRecurring}
            onChange={(e) => set('isRecurring', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recurring transaction
          </span>
        </label>

        {form.isRecurring && (
          <div className="ml-7 space-y-3">
            <Select
              label="Repeat every"
              id="recurringInterval"
              value={form.recurringInterval}
              onChange={(e) => set('recurringInterval', e.target.value)}
            >
              {RECURRING_INTERVALS.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </Select>
            <Input
              label="Next due date"
              id="nextDueDate"
              type="date"
              value={form.nextDueDate || form.date}
              onChange={(e) => set('nextDueDate', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit">{initial ? t('common.saveChanges') : t('transactions.addTransaction')}</Button>
      </div>
    </form>
  );
}
