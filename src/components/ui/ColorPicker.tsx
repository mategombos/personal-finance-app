'use client';

import { clsx } from 'clsx';
import { COLOR_PALETTE } from '@/lib/constants';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={clsx(
              'h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              value === color && 'ring-2 ring-offset-2'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {value === color && <Check className="mx-auto h-4 w-4 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
