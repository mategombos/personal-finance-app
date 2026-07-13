'use client';

import { useRef, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { useAssets } from '@/hooks/useAssets';
import { useTranslations } from '@/hooks/useTranslations';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CURRENCIES, DATE_FORMATS } from '@/lib/constants';
import { clearStore } from '@/lib/storage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { writeStore } from '@/lib/storage';
import { isFirebaseConfigured } from '@/lib/firebase';
import { financeStoreImportSchema } from '@/lib/validators';
import { FinanceStore, AppSettings } from '@/types';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Magyar' },
] as const;

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [store] = useFinanceStore();
  const { assets } = useAssets();
  const [resetOpen, setResetOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  // Pending settings: user edits these; saved + reloaded only on Save
  const [pending, setPending] = useState<AppSettings>(() => ({ ...settings }));
  const isDirty = JSON.stringify(pending) !== JSON.stringify(settings);

  const activeAssets = assets.filter((a) => !a.isArchived);

  const handleSave = () => {
    updateSettings(pending);
    window.location.reload();
  };

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
    setImportError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const result = financeStoreImportSchema.safeParse(raw);
        if (!result.success) {
          const msg = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
          setImportError(`Invalid backup file — ${msg}`);
          return;
        }
        writeStore(result.data as FinanceStore);
        window.location.reload();
      } catch {
        setImportError('Failed to parse backup file. Make sure it is a valid JSON file.');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>

      {/* Preferences */}
      <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('settings.preferences')}</h2>
        <Select
          label={t('settings.defaultCurrency')}
          value={pending.currency}
          onChange={(e) => setPending((p) => ({ ...p, currency: e.target.value }))}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
          ))}
        </Select>

        <Select
          label={t('settings.dateFormat')}
          value={pending.dateFormat}
          onChange={(e) => setPending((p) => ({ ...p, dateFormat: e.target.value }))}
        >
          {DATE_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </Select>

        <Select
          label={t('settings.language')}
          value={pending.language ?? 'en'}
          onChange={(e) => setPending((p) => ({ ...p, language: e.target.value as 'en' | 'hu' }))}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </Select>

        {activeAssets.length > 0 && (
          <Select
            label={t('settings.defaultAccount')}
            value={pending.defaultAssetId ?? ''}
            onChange={(e) => setPending((p) => ({ ...p, defaultAssetId: e.target.value || undefined }))}
          >
            <option value="">{t('settings.noDefaultAccount')}</option>
            {activeAssets.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
        )}

        <div className="pt-2">
          <Button onClick={handleSave} disabled={!isDirty}>
            {t('common.saveChanges')}
          </Button>
        </div>
      </section>

      {/* Cloud Sync */}
      {isFirebaseConfigured() && (
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 space-y-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('settings.cloudSync')}</h2>
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
            {t('settings.cloudSyncDesc')}
          </p>
        </section>
      )}

      {/* Data Management */}
      <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('settings.dataManagement')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('settings.dataDesc')}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>{t('settings.exportBackup')}</Button>
          <Button variant="secondary" onClick={() => importRef.current?.click()}>
            {t('settings.importBackup')}
          </Button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⚠ {t('settings.exportWarning')}
        </p>
        {importError && (
          <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
        )}
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950 space-y-3">
        <h2 className="text-base font-semibold text-red-700 dark:text-red-400">{t('settings.dangerZone')}</h2>
        <p className="text-sm text-red-600 dark:text-red-400">
          {t('settings.dangerDesc')}
        </p>
        <Button variant="danger" onClick={() => setResetOpen(true)}>{t('settings.resetAllData')}</Button>
      </section>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title={t('settings.resetTitle')}
        description={t('settings.resetConfirm')}
        confirmLabel={t('settings.resetButton')}
        dangerous
      />
    </div>
  );
}
