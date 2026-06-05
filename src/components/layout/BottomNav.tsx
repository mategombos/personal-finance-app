'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Wallet, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/assets', label: 'Assets', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

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
