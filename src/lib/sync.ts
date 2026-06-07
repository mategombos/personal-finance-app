import {
  collection,
  doc,
  getDocs,
  writeBatch,
  getDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { FinanceStore } from '@/types';
import { DEFAULT_CATEGORIES, DEFAULT_ASSETS } from './defaults';
import { CURRENT_VERSION } from './constants';

function sub(userId: string, name: string) {
  return collection(getFirebaseDb(), 'users', userId, name);
}

export async function syncToFirestore(store: FinanceStore, userId: string): Promise<void> {
  const db = getFirebaseDb();
  // Strip any legacy openAiApiKey that may linger in old localStorage data
  const { openAiApiKey: _omit, ...safeSettings } = store.settings as unknown as Record<string, unknown>;

  const batch = writeBatch(db);

  batch.set(doc(db, 'users', userId, 'settings', 'main'), safeSettings);

  for (const snap of store.netWorthHistory) {
    batch.set(doc(db, 'users', userId, 'netWorthHistory', snap.date), snap);
  }
  for (const t of store.transactions) {
    batch.set(doc(db, 'users', userId, 'transactions', t.id), t);
  }
  for (const c of store.categories) {
    batch.set(doc(db, 'users', userId, 'categories', c.id), c);
  }
  for (const a of store.assets) {
    batch.set(doc(db, 'users', userId, 'assets', a.id), a);
  }

  await batch.commit();
}

export async function loadFromFirestore(userId: string): Promise<FinanceStore | null> {
  const db = getFirebaseDb();
  try {
    const [txSnap, catSnap, assetSnap, settingsSnap, nwhSnap] = await Promise.all([
      getDocs(sub(userId, 'transactions')),
      getDocs(sub(userId, 'categories')),
      getDocs(sub(userId, 'assets')),
      getDoc(doc(db, 'users', userId, 'settings', 'main')),
      getDocs(sub(userId, 'netWorthHistory')),
    ]);

    if (!settingsSnap.exists() && txSnap.empty) return null;

    const ts = new Date().toISOString();
    return {
      version: CURRENT_VERSION,
      settings: settingsSnap.exists()
        ? (settingsSnap.data() as FinanceStore['settings'])
        : { currency: 'HUF', dateFormat: 'DD/MM/YYYY', theme: 'system', language: 'en' },
      transactions: txSnap.docs.map((d) => d.data() as FinanceStore['transactions'][0]),
      categories: catSnap.empty
        ? DEFAULT_CATEGORIES.map((c) => ({ ...c, createdAt: ts }))
        : catSnap.docs.map((d) => d.data() as FinanceStore['categories'][0]),
      assets: assetSnap.empty
        ? DEFAULT_ASSETS.map((a) => ({ ...a, createdAt: ts, updatedAt: ts }))
        : assetSnap.docs.map((d) => d.data() as FinanceStore['assets'][0]),
      netWorthHistory: nwhSnap.docs.map((d) => d.data() as FinanceStore['netWorthHistory'][0]),
    };
  } catch {
    return null;
  }
}
