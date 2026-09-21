import 'dotenv/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import { Firestore, initializeFirestore, setLogLevel } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
export const isFirebaseConfigured = requiredConfigKeys.every(key => Boolean(firebaseConfig[key]));

// Suppress Firestore idle gRPC connection noise
setLogLevel('error');

export const app = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;
export const auth = app ? getAuth(app) : null;
export const db: Firestore | null = app
  ? initializeFirestore(
      app,
      { experimentalAutoDetectLongPolling: true },
      process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '(default)'
    )
  : null;

export async function ensureFirebaseAuthentication(): Promise<User | null> {
  if (!app || !auth) return null;

  if (process.env.FIREBASE_AUTH_MODE !== 'anonymous') {
    throw new Error('Firebase is configured but FIREBASE_AUTH_MODE is not set to anonymous. Refusing to use Firestore without authentication.');
  }

  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}

