'use client';

import { useState } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { useSettings } from '@/hooks/useSettings';
import { useTranslations } from '@/hooks/useTranslations';
import { interpolate } from '@/lib/translations';
import { Asset } from '@/types';
import { AssetCard } from '@/components/assets/AssetCard';
import { AssetForm } from '@/components/assets/AssetForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { calculateNetWorth } from '@/lib/calculations';
import { ASSET_TYPES } from '@/lib/constants';
import { AssetFormData } from '@/lib/validators';

export default function AssetsPage() {
  const { assets, addAsset, updateAsset, deleteAsset } = useAssets();
  const { settings } = useSettings();
  const t = useTranslations();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [deleting, setDeleting] = useState<Asset | null>(null);

  const active = assets.filter((a) => !a.isArchived);
  const netWorth = calculateNetWorth(active);

  const handleAdd = (data: AssetFormData) => { addAsset(data); setAddOpen(false); };
  const handleEdit = (data: AssetFormData) => {
    if (!editing) return;
    updateAsset(editing.id, data);
    setEditing(null);
  };
  const handleDelete = () => {
    if (!deleting) return;
    deleteAsset(deleting.id);
    setDeleting(null);
  };

  return (
    <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('assets.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('assets.netWorth')}: <span className="font-semibold text-blue-600">{formatCurrency(netWorth, settings.currency)}</span>
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> {t('assets.addAsset')}
        </Button>
      </div>

      {active.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={t('assets.noAssets')}
          description={t('assets.noAssetsDesc')}
          action={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> {t('assets.addAsset')}</Button>}
        />
      ) : (
        <div className="space-y-6">
          {ASSET_TYPES.map(({ value }) => {
            const group = active.filter((a) => a.type === value);
            if (group.length === 0) return null;
            const groupTotal = group.reduce((s, a) => s + a.balance, 0);
            const label = t(`assets.types.${value}` as Parameters<typeof t>[0]);
            return (
              <div key={value}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {label}
                  </h2>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(groupTotal, settings.currency)}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} onEdit={setEditing} onDelete={setDeleting} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t('assets.addAsset')}>
        <AssetForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('assets.editAsset')}>
        {editing && (
          <AssetForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={t('assets.deleteTitle')}
        description={interpolate(t('assets.deleteConfirm'), { name: deleting?.name ?? '' })}
        confirmLabel={t('common.delete')}
        dangerous
      />
    </div>
  );
}
