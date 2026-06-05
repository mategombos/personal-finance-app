'use client';

import { Asset } from '@/types';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface AssetCardProps {
  asset: Asset;
  onEdit: (a: Asset) => void;
  onDelete: (a: Asset) => void;
}

export function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 group">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0"
          style={{ backgroundColor: asset.color + '20' }}
        >
          <DynamicIcon name={asset.icon} className="h-5 w-5" style={{ color: asset.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{asset.name}</p>
          {asset.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{asset.description}</p>
          )}
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
            {formatCurrency(asset.balance, asset.currency)}
          </p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(asset)} aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(asset)} aria-label="Delete">
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
