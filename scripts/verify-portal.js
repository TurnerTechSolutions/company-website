/* eslint-disable no-console */
// ──────────────────────────────────────────────────────────────
// Verifies the portal's tenant-isolation rules at the Firestore
// layer (not the UI). Runs whatever the provided credentials
// allow:
//
//   node --env-file=.env scripts/verify-portal.js
//     → anonymous checks only (everything must be denied)
//
//   SEED_EMAIL=... SEED_PASSWORD=... \
//   SEED_CLIENT_PASSWORD=... \
//   node --env-file=.env scripts/verify-portal.js
//     → full pass: anonymous + client-role isolation + staff access
//
// Exits 0 if every executed check passes, 1 otherwise.
// ──────────────────────────────────────────────────────────────
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const {
  getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where, limit,
} = require('firebase/firestore');

const CLIENT_ID = 'demo-acme';
const CLIENT_EMAIL = 'demo@acmeplumbing.test';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let pass = 0;
let fail = 0;

function report(ok, label, detail = '') {
  if (ok) { pass += 1; console.log(`  PASS  ${label}`); }
  else    { fail += 1; console.log(`  FAIL  ${label}${detail ? ` (${detail})` : ''}`); }
}

// expect('denied' | 'allowed', label, fn)
async function expect(outcome, label, fn) {
  try {
    const result = await fn();
    report(outcome === 'allowed', label, outcome === 'denied' ? 'was allowed' : '');
    return result;
  } catch (err) {
    const denied = err.code === 'permission-denied';
    report(outcome === 'denied' && denied, label, `error: ${err.code || err.message}`);
    return null;
  }
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // ── Anonymous: everything must be denied ────────────────────
  console.log('\nAnonymous (signed out):');
  await expect('denied', 'read clients/demo-acme',
    () => getDoc(doc(db, 'clients', CLIENT_ID)));
  await expect('denied', 'read leads',
    () => getDocs(query(collection(db, 'leads'), limit(1))));
  await expect('denied', 'read a user profile',
    () => getDoc(doc(db, 'users', 'any-uid')));

  // ── Client role: own data only, client-visible only ─────────
  if (process.env.SEED_CLIENT_PASSWORD) {
    console.log(`\nClient role (${CLIENT_EMAIL}):`);
    const cred = await signInWithEmailAndPassword(auth, CLIENT_EMAIL, process.env.SEED_CLIENT_PASSWORD);
    const uid = cred.user.uid;

    await expect('allowed', 'read own profile',
      () => getDoc(doc(db, 'users', uid)));
    await expect('allowed', 'read own client doc',
      () => getDoc(doc(db, 'clients', CLIENT_ID)));
    await expect('denied', 'read another client doc',
      () => getDoc(doc(db, 'clients', 'some-other-client')));
    await expect('denied', 'list all clients',
      () => getDocs(collection(db, 'clients')));
    await expect('denied', 'read leads',
      () => getDocs(query(collection(db, 'leads'), limit(1))));
    await expect('denied', 'tasks query WITHOUT visibility filter',
      () => getDocs(collection(db, 'clients', CLIENT_ID, 'tasks')));
    await expect('denied', 'read another user profile',
      () => getDoc(doc(db, 'users', 'not-my-uid')));

    const tasks = await expect('allowed', 'tasks query WITH visibility filter',
      () => getDocs(query(
        collection(db, 'clients', CLIENT_ID, 'tasks'),
        where('visibility', '==', 'client')
      )));
    if (tasks) {
      const rows = tasks.docs.map((d) => d.data());
      report(rows.length === 13, `client sees 13 of 15 tasks (saw ${rows.length})`);
      report(rows.every((r) => r.visibility === 'client'), 'no internal task leaked');
    }

    const milestones = await expect('allowed', 'milestones query WITH visibility filter',
      () => getDocs(query(
        collection(db, 'clients', CLIENT_ID, 'milestones'),
        where('visibility', '==', 'client')
      )));
    if (milestones) {
      report(milestones.size === 5, `client sees 5 of 6 milestones (saw ${milestones.size})`);
    }

    await expect('allowed', 'read metrics',
      () => getDocs(collection(db, 'clients', CLIENT_ID, 'metrics')));

    // Team & invites (memberships are clientIds arrays)
    await expect('allowed', 'list own org team members',
      () => getDocs(query(collection(db, 'users'), where('clientIds', 'array-contains', CLIENT_ID))));
    await expect('denied', "list another org's team members",
      () => getDocs(query(collection(db, 'users'), where('clientIds', 'array-contains', 'some-other-client'))));
    await expect('allowed', 'list own org invites',
      () => getDocs(query(collection(db, 'invites'), where('clientId', '==', CLIENT_ID))));
    await expect('denied', 'create invite for ANOTHER org',
      () => setDoc(doc(db, 'invites', 'attacker@evil.test'), {
        clientId: 'some-other-client', role: 'client',
      }));
    await expect('denied', 'create invite with staff role',
      () => setDoc(doc(db, 'invites', 'sneaky@evil.test'), {
        clientId: CLIENT_ID, role: 'staff',
      }));
    await expect('denied', 'write metrics as client',
      () => setDoc(doc(db, 'clients', CLIENT_ID, 'metrics', '2099-01_gsc'), {
        source: 'gsc', period: '2099-01', values: { clicks: 1 },
      }));

    await signOut(auth);
  } else {
    console.log('\nClient role: skipped (set SEED_CLIENT_PASSWORD to run)');
  }

  // ── Staff role: full access ──────────────────────────────────
  if (process.env.SEED_EMAIL && process.env.SEED_PASSWORD) {
    console.log(`\nStaff role (${process.env.SEED_EMAIL}):`);
    await signInWithEmailAndPassword(auth, process.env.SEED_EMAIL, process.env.SEED_PASSWORD);

    const clients = await expect('allowed', 'list all clients',
      () => getDocs(collection(db, 'clients')));
    if (clients) {
      report(clients.docs.some((d) => d.id === CLIENT_ID), 'demo-acme present in client list');
    }
    const staffTasks = await expect('allowed', 'tasks query without filter',
      () => getDocs(collection(db, 'clients', CLIENT_ID, 'tasks')));
    if (staffTasks) {
      report(staffTasks.size === 15, `staff sees all 15 tasks (saw ${staffTasks.size})`);
    }
    await expect('allowed', 'read leads',
      () => getDocs(query(collection(db, 'leads'), limit(1))));

    await signOut(auth);
  } else {
    console.log('\nStaff role: skipped (set SEED_EMAIL and SEED_PASSWORD to run)');
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Verification aborted:', err.code || '', err.message);
  process.exit(1);
});
