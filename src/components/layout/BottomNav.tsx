'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Tag, Wallet, Settings, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslations } from '@/hooks/useTranslations';

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations();

  const NAV_ITEMS = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/transactions', label: t('nav.transactions'), icon: ArrowLeftRight },
    { href: '/import', label: 'Import', icon: Upload },
    { href: '/categories', label: t('nav.categories'), icon: Tag },
    { href: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
              active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
