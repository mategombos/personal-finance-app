'use client';

import { Category } from '@/types';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 group">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color + '20' }}
        >
          <DynamicIcon name={category.icon} className="h-5 w-5" style={{ color: category.color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</p>
          <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{category.type}</p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={() => onEdit(category)} aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        {!category.isDefault && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(category)} aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
