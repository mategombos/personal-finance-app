'use client';

import { useSettings } from './useSettings';
import { getT } from '@/lib/translations';

export function useTranslations() {
  const { settings } = useSettings();
  return getT(settings.language ?? 'en');
}
