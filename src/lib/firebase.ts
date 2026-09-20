import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBw8Iti_bKw-oXX0SJDaicBdMUlXxxbZrA",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "edisem5-f5f5b.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "edisem5-f5f5b",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "edisem5-f5f5b.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "3170667734",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:3170667734:web:5576f624ae0d1b228dcd77",
  measurementId: "G-EWP7F4XWHZ"
};

// Suppress Firestore idle gRPC connection noise
setLogLevel('error');

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export { app };

