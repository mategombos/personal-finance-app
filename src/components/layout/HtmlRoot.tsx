'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export function HtmlRoot() {
  const { settings } = useSettings();
  useEffect(() => {
    document.documentElement.lang = settings.language ?? 'en';
  }, [settings.language]);
  return null;
}
