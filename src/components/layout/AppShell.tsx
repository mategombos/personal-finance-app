'use client';

import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { HtmlRoot } from './HtmlRoot';
import { FirebaseSyncWatcher } from './FirebaseSyncWatcher';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <HtmlRoot />
      <FirebaseSyncWatcher />
      <Sidebar />
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
