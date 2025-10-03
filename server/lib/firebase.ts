// server/lib/firebase.ts
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId   = process.env.FIREBASE_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
const rawKey      = process.env.FIREBASE_PRIVATE_KEY || "";
const privateKey  = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;

if (!getApps().length) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const db = getFirestore();



