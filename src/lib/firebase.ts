// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ---- Read env (Vite only injects variables that start with VITE_) ----
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Helpful diagnostics (does not print actual key)
const missing = Object.entries(cfg)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  const msg =
    `[Firebase config] Missing env(s): ${missing.join(", ")}. ` +
    `Remember: in Vite they must start with VITE_.`;
  if (import.meta.env.DEV) {
    // Make it loud in dev
    throw new Error(msg);
  } else {
    // In prod, at least log it
    console.error(msg);
  }
}

// ---- Initialize once (singleton) ----
export const app = getApps().length ? getApp() : initializeApp(cfg as any);
export const db = getFirestore(app);
export const auth = getAuth(app);

