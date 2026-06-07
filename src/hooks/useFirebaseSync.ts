'use client';

import { useState, useEffect, useRef } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { loadFromFirestore, syncToFirestore } from '@/lib/sync';
import { FinanceStore } from '@/types';
import { writeStore } from '@/lib/storage';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'unconfigured' | 'unauthenticated';

let _currentUser: User | null = null;

export function getCurrentFirebaseUser(): User | null {
  return _currentUser;
}

const SESSION_KEY = 'firebase_synced_v1';

export function useFirebaseSync(store: FinanceStore): {
  status: SyncStatus;
  signIn: () => Promise<void>;
} {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    isFirebaseConfigured() ? 'idle' : 'unconfigured'
  );
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSyncStatus('unauthenticated');
        return;
      }

      _currentUser = user;

      const alreadySynced = sessionStorage.getItem(SESSION_KEY) === user.uid;
      if (alreadySynced) {
        setSyncStatus('synced');
        return;
      }

      setSyncStatus('syncing');
      try {
        const remote = await loadFromFirestore(user.uid);
        if (remote && remote.transactions.length > 0) {
          writeStore(remote);
          sessionStorage.setItem(SESSION_KEY, user.uid);
          window.location.reload();
          return;
        } else {
          await syncToFirestore(storeRef.current, user.uid);
        }
        sessionStorage.setItem(SESSION_KEY, user.uid);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    if (!isFirebaseConfigured()) return;
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch {
      setSyncStatus('error');
    }
  };

  return { status: syncStatus, signIn };
}
