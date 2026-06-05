'use client';

import Link from 'next/link';
import { Asset, AssetType } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { ArrowRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ASSET_TYPES } from '@/lib/constants';
import { useTranslations } from '@/hooks/useTranslations';

interface NetWorthCardProps {
  assets: Asset[];
  currency: string;
}

export function NetWorthCard({ assets, currency }: NetWorthCardProps) {
  const t = useTranslations();
  const active = assets.filter((a) => !a.isArchived);
  const netWorth = active.reduce((sum, a) => sum + a.balance, 0);

  const byType = ASSET_TYPES.map(({ value }) => ({
    type: value as AssetType,
    label: t(`assets.types.${value}` as Parameters<typeof t>[0]),
    total: active.filter((a) => a.type === value).reduce((s, a) => s + a.balance, 0),
  })).filter((g) => g.total !== 0);

  return (
    <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.netWorth')}</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(netWorth, currency)}</p>
        </div>
        <Link
          href="/assets"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t('dashboard.manage')} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {byType.length === 0 ? (
        <div className="flex h-24 items-center justify-center text-sm text-gray-400">
          {t('dashboard.noAssetsYet')}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {byType.map((g) => (
            <li key={g.type} className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-2">
                <DynamicIcon name={ASSET_TYPES.find((t) => t.value === g.type)?.icon ?? 'wallet'} className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{g.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(g.total, currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
