'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useTranslations } from '@/hooks/useTranslations';
import { interpolate } from '@/lib/translations';
import { Category } from '@/types';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Tag } from 'lucide-react';
import { CategoryFormData } from '@/lib/validators';
import { clsx } from 'clsx';

type Tab = 'expense' | 'income' | 'both';

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const t = useTranslations();
  const [tab, setTab] = useState<Tab>('expense');
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const visible = categories.filter((c) => c.type === tab || (tab !== 'both' && c.type === 'both'));

  const handleAdd = (data: CategoryFormData) => {
    addCategory(data);
    setAddOpen(false);
  };

  const handleEdit = (data: CategoryFormData) => {
    if (!editing) return;
    updateCategory(editing.id, data);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteCategory(deleting.id);
    setDeleting(null);
  };

  const TAB_LABELS: Record<Tab, string> = {
    expense: t('common.expense'),
    income: t('common.income'),
    both: t('common.both'),
  };

  return (
    <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categories.title')}</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> {t('categories.addCategory')}
        </Button>
      </div>

      <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-gray-700 p-1 w-fit bg-white dark:bg-gray-900">
        {(['expense', 'income', 'both'] as Tab[]).map((tabValue) => (
          <button
            key={tabValue}
            onClick={() => setTab(tabValue)}
            className={clsx(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              tab === tabValue
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            )}
          >
            {TAB_LABELS[tabValue]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Tag}
          title={t('categories.noCategories')}
          description={t('categories.noCategoriesDesc')}
          action={<Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> {t('categories.addCategory')}</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={t('categories.addCategory')}>
        <CategoryForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('categories.editCategory')}>
        {editing && (
          <CategoryForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={t('categories.deleteTitle')}
        description={interpolate(t('categories.deleteConfirm'), { name: deleting?.name ?? '' })}
        confirmLabel={t('common.delete')}
        dangerous
      />
    </div>
  );
}
