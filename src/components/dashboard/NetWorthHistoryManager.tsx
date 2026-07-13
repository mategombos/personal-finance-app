'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { NetWorthSnapshot } from '@/types';
import { NetWorthSnapshotFormData } from '@/lib/validators';
import { useNetWorth } from '@/hooks/useNetWorth';
import { useTranslations } from '@/hooks/useTranslations';
import { interpolate } from '@/lib/translations';
import { formatCurrency } from '@/lib/formatters';
import { NetWorthHistoryChart } from './NetWorthHistoryChart';
import { NetWorthSnapshotForm } from './NetWorthSnapshotForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
  currency: string;
}

function monthLabel(date: string): string {
  try {
    return format(parseISO(`${date}-01`), 'MMM yyyy');
  } catch {
    return date;
  }
}

export function NetWorthHistoryManager({ currency }: Props) {
  const { history, setSnapshot, deleteSnapshot } = useNetWorth();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<NetWorthSnapshot | null>(null);
  const [deleting, setDeleting] = useState<NetWorthSnapshot | null>(null);

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));

  // Client-only data — avoid SSR/client hydration mismatch (see AccountSummaryCard).
  if (!mounted) return null;

  const handleAdd = (data: NetWorthSnapshotFormData) => {
    setSnapshot(data.date, data.value);
    setAddOpen(false);
  };
  const handleEdit = (data: NetWorthSnapshotFormData) => {
    setSnapshot(data.date, data.value);
    setEditing(null);
  };
  const handleDelete = () => {
    if (!deleting) return;
    deleteSnapshot(deleting.date);
    setDeleting(null);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t('netWorth.title')}
        </h2>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> {t('netWorth.addDataPoint')}
        </Button>
      </div>

      <NetWorthHistoryChart data={history} currency={currency} />

      {sorted.length > 0 && (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {sorted.map((snap) => (
            <li key={snap.date} className="flex items-center justify-between py-2 group">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {monthLabel(snap.date)}
                </span>
                {snap.manual && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {t('netWorth.manualBadge')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                  {formatCurrency(snap.value, currency)}
                </span>
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(snap)} aria-label={t('netWorth.editDataPoint')}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleting(snap)} aria-label={t('common.delete')}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t('netWorth.addDataPoint')}>
        <NetWorthSnapshotForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('netWorth.editDataPoint')}>
        {editing && (
          <NetWorthSnapshotForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={t('netWorth.deleteTitle')}
        description={interpolate(t('netWorth.deleteConfirm'), { month: deleting ? monthLabel(deleting.date) : '' })}
        confirmLabel={t('common.delete')}
        dangerous
      />
    </div>
  );
}
