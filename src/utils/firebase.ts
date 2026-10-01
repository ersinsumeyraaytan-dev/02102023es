import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, Database } from 'firebase/database';
import { AppConfig } from '../types';

export interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let firebaseApp: FirebaseApp | null = null;
let realtimeDb: Database | null = null;

export function isFirebaseConfigured(config: FirebaseConfigType): boolean {
  return (
    Boolean(config.apiKey) &&
    config.apiKey !== 'YOUR_API_KEY' &&
    Boolean(config.databaseURL) &&
    !config.databaseURL.includes('YOUR_PROJECT')
  );
}

export function initFirebase(config: FirebaseConfigType): Database | null {
  if (!isFirebaseConfigured(config)) {
    return null;
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    realtimeDb = getDatabase(firebaseApp);
    return realtimeDb;
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
    return null;
  }
}

export function subscribeToFirebaseConfig(
  config: FirebaseConfigType,
  onData: (data: AppConfig) => void
): () => void {
  const db = initFirebase(config);
  if (!db) {
    return () => {};
  }

  try {
    const configRef = ref(db, 'bizim3yilimiz/appConfig');
    const unsubscribe = onValue(
      configRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          if (val) {
            onData(val);
          }
        }
      },
      (error) => {
        console.warn('Firebase Realtime Database read notice:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firebase subscription error:', err);
    return () => {};
  }
}

export async function saveToFirebase(
  config: FirebaseConfigType,
  appConfig: AppConfig
): Promise<boolean> {
  const db = initFirebase(config);
  if (!db) {
    return false;
  }

  try {
    const configRef = ref(db, 'bizim3yilimiz/appConfig');
    await set(configRef, appConfig);
    return true;
  } catch (err) {
    console.error('Firebase save error:', err);
    return false;
  }
}
