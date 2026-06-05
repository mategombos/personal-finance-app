'use client';

import { Asset } from '@/types';
import { AssetFormData } from '@/lib/validators';
import { useFinanceStore } from './useFinanceStore';

export function useAssets() {
  const [store, update] = useFinanceStore();

  const addAsset = (data: AssetFormData) => {
    const now = new Date().toISOString();
    const newAsset: Asset = {
      ...data,
      id: crypto.randomUUID(),
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };
    update((prev) => ({ ...prev, assets: [...prev.assets, newAsset] }));
    return newAsset;
  };

  const updateAsset = (id: string, data: Partial<Asset>) => {
    update((prev) => ({
      ...prev,
      assets: prev.assets.map((a) =>
        a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
      ),
    }));
  };

  const deleteAsset = (id: string) => {
    update((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.id !== id),
    }));
  };

  return {
    assets: store.assets,
    addAsset,
    updateAsset,
    deleteAsset,
  };
}
