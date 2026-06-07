'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { makeCategorySchema, CategoryFormData } from '@/lib/validators';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { IconPicker } from '@/components/ui/IconPicker';
import { COLOR_PALETTE } from '@/lib/constants';

interface CategoryFormProps {
  initial?: Category;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const t = useTranslations();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CategoryFormData>({
    name: initial?.name ?? '',
    type: initial?.type ?? 'expense',
    color: initial?.color ?? COLOR_PALETTE[0],
    icon: initial?.icon ?? 'circle-ellipsis',
    monthlyBudget: initial?.monthlyBudget,
  });
  const [budgetStr, setBudgetStr] = useState(initial?.monthlyBudget?.toString() ?? '');

  const set = <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = makeCategorySchema({
      nameRequired: t('validation.nameRequired'),
      colorInvalid: t('validation.colorInvalid'),
      iconRequired: t('validation.iconRequired'),
    });
    const data: CategoryFormData = {
      ...form,
      monthlyBudget: budgetStr ? parseFloat(budgetStr) : undefined,
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errs[issue.path[0]?.toString() ?? 'root'] = issue.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('categories.form.name')}
        id="name"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
        placeholder={t('categories.form.namePlaceholder')}
      />

      <Select
        label={t('categories.form.type')}
        id="type"
        value={form.type}
        onChange={(e) => set('type', e.target.value as CategoryFormData['type'])}
      >
        <option value="expense">{t('common.expense')}</option>
        <option value="income">{t('common.income')}</option>
        <option value="both">{t('common.both')}</option>
      </Select>

      <Input
        label="Monthly Budget (optional)"
        id="monthlyBudget"
        type="number"
        min="0"
        step="any"
        placeholder="Leave empty for no limit"
        value={budgetStr}
        onChange={(e) => setBudgetStr(e.target.value)}
        error={errors.monthlyBudget}
      />

      <ColorPicker label={t('categories.form.color')} value={form.color} onChange={(c) => set('color', c)} />
      <IconPicker label={t('categories.form.icon')} value={form.icon} onChange={(i) => set('icon', i)} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit">{initial ? t('common.saveChanges') : t('categories.addCategory')}</Button>
      </div>
    </form>
  );
}
