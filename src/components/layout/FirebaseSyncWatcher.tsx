'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { useFirebaseSync } from '@/hooks/useFirebaseSync';

export function FirebaseSyncWatcher() {
  const [store] = useFinanceStore();
  const { status, signIn } = useFirebaseSync(store);
  const [signingIn, setSigningIn] = useState(false);

  if (status !== 'unauthenticated') return null;

  const handleSignIn = async () => {
    setSigningIn(true);
    await signIn();
    setSigningIn(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Sign in to sync</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Sign in with Google to back up your data and access it from any device.
      </p>
      <button
        onClick={handleSignIn}
        disabled={signingIn}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {signingIn ? 'Signing in…' : 'Sign in with Google'}
      </button>
    </div>
  );
}
