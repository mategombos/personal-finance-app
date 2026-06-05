'use client';

import { icons, LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const iconName = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as keyof typeof icons;
  const Icon = icons[iconName];
  if (!Icon) return null;
  return <Icon {...props} />;
}
