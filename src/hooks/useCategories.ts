'use client';

import { Category } from '@/types';
import { CategoryFormData } from '@/lib/validators';
import { useFinanceStore } from './useFinanceStore';

export function useCategories() {
  const [store, update] = useFinanceStore();

  const addCategory = (data: CategoryFormData) => {
    const newCat: Category = {
      ...data,
      id: crypto.randomUUID(),
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    update((prev) => ({ ...prev, categories: [...prev.categories, newCat] }));
    return newCat;
  };

  const updateCategory = (id: string, data: Partial<CategoryFormData>) => {
    update((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }));
  };

  const deleteCategory = (id: string) => {
    update((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
  };

  return {
    categories: store.categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
