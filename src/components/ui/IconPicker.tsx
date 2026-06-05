'use client';

import { clsx } from 'clsx';
import { ICON_LIST } from '@/lib/constants';
import { DynamicIcon } from './DynamicIcon';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
        {ICON_LIST.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={clsx(
              'h-9 w-9 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
              value === icon && 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
            )}
            aria-label={icon}
            title={icon}
          >
            <DynamicIcon name={icon} className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
