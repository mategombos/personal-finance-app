'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useAssets } from '@/hooks/useAssets';
import { useSettings } from '@/hooks/useSettings';
import { transactionSchema, TransactionFormData } from '@/lib/validators';
import { todayISO } from '@/lib/formatters';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Transaction } from '@/types';
import { clsx } from 'clsx';

interface TransactionFormProps {
  initial?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const { categories } = useCategories();
  const { assets } = useAssets();
  const { settings } = useSettings();
  const [type, setType] = useState<'income' | 'expense'>(initial?.type ?? 'expense');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    amount: initial?.amount?.toString() ?? '',
    categoryId: initial?.categoryId ?? '',
    description: initial?.description ?? '',
    date: initial?.date ?? todayISO(),
    assetId: initial?.assetId ?? '',
  });

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'both'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = transactionSchema.safeParse({
      type,
      amount: parseFloat(form.amount),
      categoryId: form.categoryId,
      description: form.description,
      date: form.date,
      assetId: form.assetId || undefined,
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

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Income / Expense toggle */}
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setType(t); set('categoryId', ''); }}
            className={clsx(
              'flex-1 py-2 text-sm font-medium capitalize transition-colors',
              type === t
                ? t === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Input
        label="Amount"
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
        label="Category"
        id="categoryId"
        value={form.categoryId}
        onChange={(e) => set('categoryId', e.target.value)}
        error={errors.categoryId}
      >
        <option value="">Select category</option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>

      <Input
        label="Description"
        id="description"
        placeholder="What was this for?"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        error={errors.description}
      />

      <Input
        label="Date"
        id="date"
        type="date"
        value={form.date}
        onChange={(e) => set('date', e.target.value)}
        error={errors.date}
      />

      <Select
        label={`Asset (${settings.currency})`}
        id="assetId"
        value={form.assetId}
        onChange={(e) => set('assetId', e.target.value)}
      >
        <option value="">No specific asset</option>
        {assets.filter((a) => !a.isArchived).map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </Select>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Transaction'}</Button>
      </div>
    </form>
  );
}
