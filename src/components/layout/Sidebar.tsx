'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Wallet,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/categories', label: 'Categories', icon: Tag },
  { href: '/assets', label: 'Assets', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 md:min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">FinanceApp</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
