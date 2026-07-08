/* eslint-disable no-console */
// ──────────────────────────────────────────────────────────────
// One-time migration: users/{uid}.clientId (string) →
// clientIds (string[]). Staff get []. Idempotent: docs already
// migrated are skipped. Run as staff, BEFORE or AFTER the rules
// deploy (staff may write users docs under both versions):
//
//   SEED_EMAIL=... SEED_PASSWORD=... \
//   node --env-file=.env scripts/migrate-clientids.js
// ──────────────────────────────────────────────────────────────
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const {
  getFirestore, collection, getDocs, doc, updateDoc, deleteField,
} = require('firebase/firestore');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing env var ${name}.`); process.exit(1); }
  return v;
}

const firebaseConfig = {
  apiKey:            requireEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         requireEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, requireEnv('SEED_EMAIL'), requireEnv('SEED_PASSWORD'));

  const snap = await getDocs(collection(db, 'users'));
  let migrated = 0;
  let skipped = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (Array.isArray(data.clientIds)) {
      // Already migrated; just clear a leftover legacy field if any.
      if ('clientId' in data) {
        await updateDoc(doc(db, 'users', d.id), { clientId: deleteField() });
        console.log(`  cleaned legacy field: ${data.email || d.id}`);
      } else {
        skipped += 1;
      }
      continue;
    }
    const clientIds = data.role === 'client' && data.clientId ? [data.clientId] : [];
    await updateDoc(doc(db, 'users', d.id), {
      clientIds,
      clientId: deleteField(),
    });
    console.log(`  migrated ${data.role}: ${data.email || d.id} → [${clientIds.join(', ')}]`);
    migrated += 1;
  }

  console.log(`\nDone. ${migrated} migrated, ${skipped} already current.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err.code || '', err.message);
  process.exit(1);
});
