'use client';

import { useState } from 'react';
import { Asset } from '@/types';
import { assetSchema, AssetFormData } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { IconPicker } from '@/components/ui/IconPicker';
import { ASSET_TYPES, CURRENCIES, COLOR_PALETTE } from '@/lib/constants';

interface AssetFormProps {
  initial?: Asset;
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

export function AssetForm({ initial, onSubmit, onCancel }: AssetFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<AssetFormData>({
    name: initial?.name ?? '',
    type: initial?.type ?? 'cash',
    balance: initial?.balance ?? 0,
    currency: initial?.currency ?? 'HUF',
    color: initial?.color ?? COLOR_PALETTE[4],
    icon: initial?.icon ?? 'wallet',
    description: initial?.description ?? '',
  });

  const set = <K extends keyof AssetFormData>(key: K, value: AssetFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = assetSchema.safeParse(form);
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
        placeholder="e.g. OTP Bank Account"
      />

      <Select
        label="Asset Type"
        id="type"
        value={form.type}
        onChange={(e) => set('type', e.target.value as AssetFormData['type'])}
      >
        {ASSET_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Current Balance / Value"
          id="balance"
          type="number"
          step="any"
          value={form.balance.toString()}
          onChange={(e) => set('balance', parseFloat(e.target.value) || 0)}
          error={errors.balance}
        />
        <Select
          label="Currency"
          id="currency"
          value={form.currency}
          onChange={(e) => set('currency', e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
          ))}
        </Select>
      </div>

      <Input
        label="Description (optional)"
        id="description"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="e.g. 2021 Honda CBR"
      />

      <ColorPicker label="Color" value={form.color} onChange={(c) => set('color', c)} />
      <IconPicker label="Icon" value={form.icon} onChange={(i) => set('icon', i)} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Asset'}</Button>
      </div>
    </form>
  );
}
