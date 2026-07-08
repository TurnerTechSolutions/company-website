// ──────────────────────────────────────────────────────────────
// Firebase Admin SDK (server-side only, used by API routes).
//
// Needs FIREBASE_SERVICE_ACCOUNT in the environment: the full
// service-account JSON as a single line. Generate it in the
// Firebase console → Project settings → Service accounts →
// "Generate new private key". Add it to .env.local locally and to
// the Vercel project env vars for production. NEVER commit it.
// ──────────────────────────────────────────────────────────────
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function adminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT env var is missing. See src/lib/firebaseAdmin.js for setup.'
    );
  }
  let svc;
  try {
    svc = JSON.parse(raw);
  } catch {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT is not valid JSON. It must be the whole service-account file on a single line.'
    );
  }
  const expected = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (expected && svc.project_id !== expected) {
    throw new Error(
      `Service account is for project "${svc.project_id}" but this app uses "${expected}". Generate the key from the correct Firebase project.`
    );
  }
  return initializeApp({ credential: cert(svc) });
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb   = () => getFirestore(adminApp());
