'use client';

import { useRef } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CURRENCIES, DATE_FORMATS } from '@/lib/constants';
import { clearStore, readStore } from '@/lib/storage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useState } from 'react';
import { FinanceStore } from '@/types';
import { writeStore } from '@/lib/storage';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [store, setStoreRaw] = useFinanceStore();
  const [resetOpen, setResetOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financeapp-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as FinanceStore;
        if (!parsed.transactions || !parsed.categories || !parsed.assets) {
          alert('Invalid backup file.');
          return;
        }
        writeStore(parsed);
        window.location.reload();
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    clearStore();
    window.location.reload();
  };

  return (
    <div className="px-4 py-6 md:px-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Preferences</h2>
        <Select
          label="Default Currency"
          value={settings.currency}
          onChange={(e) => updateSettings({ currency: e.target.value })}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
          ))}
        </Select>

        <Select
          label="Date Format"
          value={settings.dateFormat}
          onChange={(e) => updateSettings({ dateFormat: e.target.value })}
        >
          {DATE_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Data Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All data is stored locally in your browser. Export a backup to keep your data safe.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>Export Backup (JSON)</Button>
          <Button variant="secondary" onClick={() => importRef.current?.click()}>
            Import Backup
          </Button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950 space-y-3">
        <h2 className="text-base font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
        <p className="text-sm text-red-600 dark:text-red-400">
          Resetting will permanently delete all your data and restore default categories.
        </p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>Reset All Data</Button>
      </section>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset All Data"
        description="This will permanently delete all transactions, assets, and custom categories. This cannot be undone."
        confirmLabel="Reset Everything"
        dangerous
      />
    </div>
  );
}
