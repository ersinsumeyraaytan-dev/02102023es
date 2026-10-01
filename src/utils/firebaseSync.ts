import { AppConfig, FirebaseSettings } from '../types';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, Database, Unsubscribe } from 'firebase/database';
import { getFirestore, doc, onSnapshot, setDoc, Firestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

export const EMPTY_FIREBASE_CONFIG: FirebaseSettings = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export function isFirebaseConfigured(settings?: FirebaseSettings): boolean {
  if (appletConfig && appletConfig.projectId && appletConfig.apiKey) {
    return true;
  }
  if (!settings) return false;
  return Boolean(
    (settings.databaseURL && settings.databaseURL.trim().length > 5) ||
      (settings.apiKey && settings.apiKey.trim().length > 5 && settings.projectId && settings.projectId.trim().length > 2)
  );
}

let activeApp: FirebaseApp | null = null;
let activeFirestore: Firestore | null = null;
let activeRtdb: Database | null = null;

function getOrInitFirebase(settings?: FirebaseSettings): {
  app: FirebaseApp;
  firestore: Firestore | null;
  rtdb: Database | null;
} | null {
  try {
    const effectiveApiKey = settings?.apiKey || appletConfig.apiKey;
    const effectiveProjectId = settings?.projectId || appletConfig.projectId;
    const effectiveAuthDomain = settings?.authDomain || appletConfig.authDomain;
    const effectiveStorageBucket = settings?.storageBucket || appletConfig.storageBucket;
    const effectiveAppId = settings?.appId || appletConfig.appId;
    const effectiveMessagingSenderId = settings?.messagingSenderId || appletConfig.messagingSenderId;

    if (!effectiveApiKey || !effectiveProjectId) {
      return null;
    }

    if (!activeApp) {
      const existingApps = getApps();
      if (existingApps.length > 0) {
        activeApp = getApp();
      } else {
        activeApp = initializeApp({
          apiKey: effectiveApiKey,
          authDomain: effectiveAuthDomain,
          projectId: effectiveProjectId,
          storageBucket: effectiveStorageBucket,
          messagingSenderId: effectiveMessagingSenderId,
          appId: effectiveAppId,
          databaseURL: settings?.databaseURL || undefined,
        });
      }
    }

    if (!activeFirestore && activeApp) {
      try {
        const dbId = (appletConfig as Record<string, string>).firestoreDatabaseId;
        activeFirestore = dbId ? getFirestore(activeApp, dbId) : getFirestore(activeApp);
      } catch (e) {
        console.warn('[Firebase] Firestore init note:', e);
      }
    }

    if (!activeRtdb && activeApp && settings?.databaseURL) {
      try {
        activeRtdb = getDatabase(activeApp, settings.databaseURL);
      } catch (e) {
        console.warn('[Firebase] RTDB init note:', e);
      }
    }

    return activeApp ? { app: activeApp, firestore: activeFirestore, rtdb: activeRtdb } : null;
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
    return null;
  }
}

/**
 * Listens to Firestore (/app_data/main) or RTDB (/appData) and calls onDataReceived
 */
export function listenToFirebaseData(
  settings: FirebaseSettings,
  onDataReceived: (remoteData: AppConfig) => void
): Unsubscribe | null {
  try {
    const initialized = getOrInitFirebase(settings);
    if (!initialized) return null;

    // 1. Prefer Firestore if provisioned
    if (initialized.firestore) {
      const docRef = doc(initialized.firestore, 'app_data', 'main');
      const unsub = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data && typeof data === 'object') {
              console.log('[Firebase Firestore] Realtime data updated from /app_data/main');
              onDataReceived(data as AppConfig);
            }
          }
        },
        (err) => {
          console.warn('[Firebase Firestore] Listener error:', err.message);
        }
      );
      return unsub;
    }

    // 2. Fallback to RTDB if configured
    if (initialized.rtdb) {
      const dataRef = ref(initialized.rtdb, 'appData');
      const unsub = onValue(
        dataRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const remoteVal = snapshot.val();
            if (remoteVal && typeof remoteVal === 'object') {
              console.log('[Firebase RTDB] Realtime data received from /appData');
              onDataReceived(remoteVal as AppConfig);
            }
          }
        },
        (error) => {
          console.warn('[Firebase RTDB] Database read error:', error.message);
        }
      );
      return unsub;
    }

    return null;
  } catch (err) {
    console.warn('[Firebase] Listener registration error:', err);
    return null;
  }
}

/**
 * Pushes updated AppConfig to Firebase Firestore and/or RTDB
 */
export async function pushToFirebase(
  settings: FirebaseSettings,
  config: AppConfig
): Promise<boolean> {
  try {
    const initialized = getOrInitFirebase(settings);
    if (!initialized) return false;

    let anySuccess = false;

    // 1. Write to Firestore
    if (initialized.firestore) {
      try {
        const docRef = doc(initialized.firestore, 'app_data', 'main');
        await setDoc(docRef, {
          ...config,
          updatedAt: new Date().toISOString(),
        });
        console.log('[Firebase Firestore] Successfully synced data to /app_data/main');
        anySuccess = true;
      } catch (err) {
        console.warn('[Firebase Firestore] Write error:', err);
      }
    }

    // 2. Write to RTDB if available
    if (initialized.rtdb) {
      try {
        const dataRef = ref(initialized.rtdb, 'appData');
        await set(dataRef, {
          ...config,
          updatedAt: new Date().toISOString(),
        });
        console.log('[Firebase RTDB] Successfully synced data to /appData');
        anySuccess = true;
      } catch (err) {
        console.warn('[Firebase RTDB] Write error:', err);
      }
    }

    return anySuccess;
  } catch (err) {
    console.warn('[Firebase] Database sync error:', err);
    return false;
  }
}
