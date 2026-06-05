'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { categorySchema, CategoryFormData } from '@/lib/validators';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CategoryFormData>({
    name: initial?.name ?? '',
    type: initial?.type ?? 'expense',
    color: initial?.color ?? COLOR_PALETTE[0],
    icon: initial?.icon ?? 'circle-ellipsis',
  });

  const set = <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = categorySchema.safeParse(form);
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
        label="Name"
        id="name"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
        placeholder="e.g. Groceries"
      />

      <Select
        label="Type"
        id="type"
        value={form.type}
        onChange={(e) => set('type', e.target.value as CategoryFormData['type'])}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
        <option value="both">Both</option>
      </Select>

      <ColorPicker label="Color" value={form.color} onChange={(c) => set('color', c)} />
      <IconPicker label="Icon" value={form.icon} onChange={(i) => set('icon', i)} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Category'}</Button>
      </div>
    </form>
  );
}
