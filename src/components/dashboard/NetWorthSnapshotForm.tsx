'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { NetWorthSnapshot } from '@/types';
import { makeNetWorthSnapshotSchema, NetWorthSnapshotFormData } from '@/lib/validators';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface NetWorthSnapshotFormProps {
  initial?: NetWorthSnapshot;
  onSubmit: (data: NetWorthSnapshotFormData) => void;
  onCancel: () => void;
}

export function NetWorthSnapshotForm({ initial, onSubmit, onCancel }: NetWorthSnapshotFormProps) {
  const t = useTranslations();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<NetWorthSnapshotFormData>({
    date: initial?.date ?? format(new Date(), 'yyyy-MM'),
    value: initial?.value ?? 0,
  });

  const set = <K extends keyof NetWorthSnapshotFormData>(key: K, value: NetWorthSnapshotFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = makeNetWorthSnapshotSchema({
      monthInvalid: t('validation.monthInvalid'),
      valueRequired: t('validation.valueRequired'),
    });
    const parsed = schema.safeParse(form);
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
        label={t('netWorth.month')}
        id="date"
        type="month"
        value={form.date}
        onChange={(e) => set('date', e.target.value)}
        error={errors.date}
        // The month is the entry's key; keep it fixed while editing an existing point.
        disabled={!!initial}
      />

      <Input
        label={t('netWorth.value')}
        id="value"
        type="number"
        step="any"
        value={form.value.toString()}
        onChange={(e) => set('value', parseFloat(e.target.value) || 0)}
        error={errors.value}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit">{initial ? t('common.saveChanges') : t('netWorth.addDataPoint')}</Button>
      </div>
    </form>
  );
}
