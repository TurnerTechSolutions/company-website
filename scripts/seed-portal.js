/* eslint-disable no-console */
// ──────────────────────────────────────────────────────────────
// Seed the client portal with one realistic demo client
// ("Acme Plumbing Co") so every screen has data to render.
//
// Runs with the CLIENT SDK signed in as a staff user, so every
// write passes the production security rules. A successful run
// is itself a rules smoke test.
//
// Idempotent: fixed doc IDs + set(..., {merge:true}). Re-running
// refreshes the demo data without duplicating anything.
//
// Usage (Node 20+, from the repo root):
//   SEED_EMAIL=you@example.com \
//   SEED_PASSWORD=... \
//   SEED_CLIENT_PASSWORD=... \
//   node --env-file=.env scripts/seed-portal.js
//
//   SEED_EMAIL / SEED_PASSWORD   staff login (must match the
//                                bootstrap email in firestore.rules
//                                on first ever run)
//   SEED_CLIENT_PASSWORD         password for the demo client login
//                                demo@acmeplumbing.test (created on
//                                first run, reused after)
//   SEED_CLIENT_UID (optional)   skip client auth handling and use
//                                this UID for the demo client user
// ──────────────────────────────────────────────────────────────
const { initializeApp } = require('firebase/app');
const {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
} = require('firebase/auth');
const {
  getFirestore, doc, setDoc, writeBatch, serverTimestamp, Timestamp,
} = require('firebase/firestore');

const CLIENT_ID = 'demo-acme';
const CLIENT_EMAIL = 'demo@acmeplumbing.test';

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var ${name}. See the usage notes at the top of this script.`);
    process.exit(1);
  }
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

// ── Date helpers (all relative to "now" so the demo never goes stale) ──
const now = new Date();
const monthStart = (offset) => new Date(now.getFullYear(), now.getMonth() + offset, 1);
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const ts = (d) => Timestamp.fromDate(d);
const daysFromNow = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);

// Engagement started 6 full months ago → currently "Month 7 of 12".
const START = monthStart(-6);
// Six completed months of metrics: months -6 … -1.
const METRIC_MONTHS = [-6, -5, -4, -3, -2, -1].map(monthStart);

async function resolveClientUid(auth) {
  if (process.env.SEED_CLIENT_UID) return process.env.SEED_CLIENT_UID;
  const password = requireEnv('SEED_CLIENT_PASSWORD');
  try {
    const cred = await createUserWithEmailAndPassword(auth, CLIENT_EMAIL, password);
    console.log(`Created demo client auth user ${CLIENT_EMAIL} (${cred.user.uid})`);
    return cred.user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, CLIENT_EMAIL, password);
      return cred.user.uid;
    }
    throw err;
  }
}

async function main() {
  const staffEmail = requireEnv('SEED_EMAIL');
  const staffPassword = requireEnv('SEED_PASSWORD');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const clientUid = await resolveClientUid(auth);
  await signOut(auth);

  const staffCred = await signInWithEmailAndPassword(auth, staffEmail, staffPassword);
  const staffUid = staffCred.user.uid;
  console.log(`Signed in as staff ${staffEmail} (${staffUid})`);

  // The staff profile MUST be committed before everything else:
  // rules get() reads pre-batch state, so isStaff() checks on the
  // remaining writes only pass once this doc actually exists.
  await setDoc(doc(db, 'users', staffUid), {
    role: 'staff', clientIds: [],
    displayName: 'Antonio Turner', email: staffEmail,
    createdAt: serverTimestamp(),
  }, { merge: true });
  console.log('Staff profile in place.');

  const batch = writeBatch(db);
  const put = (path, data) => batch.set(doc(db, ...path), data, { merge: true });

  // ── Profiles ────────────────────────────────────────────────
  put(['users', clientUid], {
    role: 'client', clientIds: [CLIENT_ID],
    displayName: 'Dana Acme', email: CLIENT_EMAIL,
    createdAt: serverTimestamp(),
  });

  // ── Client org ──────────────────────────────────────────────
  put(['clients', CLIENT_ID], {
    name: 'Acme Plumbing Co',
    status: 'active',
    type: 'local',
    planTier: 'Growth',
    planScope: [
      'Local SEO and Google Business Profile management',
      'Two SEO content pieces per month',
      'Monthly reporting and strategy check-in',
      'AI search (GEO) visibility tracking',
    ],
    dealValue: 450,
    conversionMetric: 'gbp.calls',
    serviceLinks: [
      { label: 'Production site', url: 'https://acmeplumbing.test' },
      { label: 'Dev site', url: 'https://dev.acmeplumbing.test' },
    ],
    health: 'green',
    healthNote: 'Rankings and calls are trending up. Content cluster two is the current focus.',
    primaryDomain: 'acmeplumbing.test',
    startDate: ts(START),
    nextCheckIn: ts(daysFromNow(9)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  put(['clients', CLIENT_ID, 'engagement', 'current'], {
    phase: 2,
    phaseLabel: 'Phase 2 · Authority Building',
    monthsTotal: 12,
    summary:
      'Foundation work is live: the site is technically clean, the Google Business Profile is fully built out, and the first money page is ranking. Phase 2 grows topical authority with content clusters and steady local signals.',
    goals: [
      'Rank top 3 for "emergency plumber alpharetta"',
      'Grow organic calls to 25 or more per month',
      'Ship two content clusters covering water heaters and repiping',
    ],
    updatedAt: serverTimestamp(),
  });

  // ── Milestones ──────────────────────────────────────────────
  const milestones = [
    ['ms-01', 'Technical SEO foundation complete', 'Site speed, crawlability, schema, and indexing issues resolved.', 'done', -5, 'client'],
    ['ms-02', 'Google Business Profile optimized', 'Categories, services, photos, and weekly posting cadence in place.', 'done', -4, 'client'],
    ['ms-03', 'First money page live and ranking', 'Emergency plumbing service page published and climbing for target terms.', 'done', -2, 'client'],
    ['ms-04', 'First content cluster shipped', 'Water heater cluster: pillar page plus four supporting articles.', 'in_progress', 0, 'client'],
    ['ms-05', 'Review generation engine running', 'Automated review requests after every completed job.', 'upcoming', 2, 'client'],
    ['ms-06', 'Renewal risk assessment', 'Internal: evaluate engagement health ahead of the month 10 renewal conversation.', 'upcoming', 3, 'internal'],
  ];
  milestones.forEach(([id, title, description, status, offset, visibility], i) => {
    put(['clients', CLIENT_ID, 'milestones', id], {
      title, description, status, visibility,
      order: i + 1,
      targetDate: ts(monthStart(offset)),
      completedAt: status === 'done' ? ts(monthStart(offset)) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  // ── Tasks & deliverables ────────────────────────────────────
  const M0 = monthKey(monthStart(0));   // current month
  const M1 = monthKey(monthStart(-1));  // last month
  const M2 = monthKey(monthStart(-2));

  const tasks = [
    // [id, title, type, status, visibility, month, approval, links]
    ['task-001', 'Technical SEO audit', 'deliverable', 'done', 'client', M2, 'approved',
      [{ label: 'Audit report', url: 'https://drive.google.com/example-audit' }]],
    ['task-002', 'Fix crawl errors and redirect chains', 'task', 'done', 'client', M2, 'not_required', []],
    ['task-003', 'LocalBusiness schema rollout', 'task', 'done', 'client', M2, 'not_required', []],
    ['task-004', 'GBP category and service overhaul', 'task', 'done', 'client', M2, 'not_required', []],
    ['task-005', 'Emergency plumbing service page', 'deliverable', 'done', 'client', M1, 'approved',
      [{ label: 'Live page', url: 'https://acmeplumbing.test/emergency-plumber-alpharetta' }]],
    ['task-006', 'Monthly report', 'deliverable', 'done', 'client', M1, 'not_required',
      [{ label: 'Report', url: 'https://drive.google.com/example-monthly-report' }]],
    ['task-007', 'Water heater pillar page draft', 'deliverable', 'in_review', 'client', M0, 'pending',
      [{ label: 'Draft for review', url: 'https://docs.google.com/example-pillar-draft' }]],
    ['task-008', 'Supporting article: tankless vs tank', 'deliverable', 'in_review', 'client', M0, 'pending',
      [{ label: 'Draft for review', url: 'https://docs.google.com/example-article-draft' }]],
    ['task-009', 'Content brief: water heater repair cost', 'deliverable', 'in_review', 'client', M0, 'pending',
      [{ label: 'Brief', url: 'https://docs.google.com/example-brief' }]],
    ['task-010', 'GBP weekly posts', 'task', 'in_progress', 'client', M0, 'not_required', []],
    ['task-011', 'Citation cleanup: top 20 directories', 'task', 'in_progress', 'client', M0, 'not_required', []],
    ['task-012', 'Review request SMS templates', 'task', 'not_started', 'client', M0, 'not_required', []],
    ['task-013', 'Waiting on client photos for service pages', 'task', 'blocked', 'client', M0, 'not_required', []],
    // Internal-only rows: clients must never see these.
    ['task-014', 'Competitor gap analysis for upsell pitch', 'task', 'in_progress', 'internal', M0, 'not_required', []],
    ['task-015', 'Internal: renegotiate content writer rate', 'task', 'not_started', 'internal', M0, 'not_required', []],
  ];
  tasks.forEach(([id, title, type, status, visibility, month, approvalStatus, links], i) => {
    put(['clients', CLIENT_ID, 'tasks', id], {
      title,
      description: '',
      type, status, visibility, month, links, approvalStatus,
      shippedAt: status === 'done' ? ts(monthStart(month === M2 ? -2 : month === M1 ? -1 : 0)) : null,
      approvedAt: approvalStatus === 'approved' ? ts(monthStart(-1)) : null,
      approvedByUid: approvalStatus === 'approved' ? clientUid : null,
      order: i + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  // ── Metrics: 6 months × 3 sources, plausible upward curve ───
  const gsc  = [
    { clicks: 38,  impressions: 2900,  avgPosition: 28.4 },
    { clicks: 55,  impressions: 4700,  avgPosition: 24.1 },
    { clicks: 79,  impressions: 7600,  avgPosition: 19.8 },
    { clicks: 112, impressions: 10800, avgPosition: 16.5 },
    { clicks: 158, impressions: 14200, avgPosition: 13.6 },
    { clicks: 210, impressions: 18500, avgPosition: 11.2 },
  ];
  const gbp  = [
    { calls: 6,  directionRequests: 11, views: 480,  reviews: 14, rating: 4.5 },
    { calls: 8,  directionRequests: 14, views: 610,  reviews: 15, rating: 4.5 },
    { calls: 10, directionRequests: 19, views: 780,  reviews: 17, rating: 4.6 },
    { calls: 13, directionRequests: 24, views: 960,  reviews: 19, rating: 4.7 },
    { calls: 16, directionRequests: 29, views: 1180, reviews: 21, rating: 4.7 },
    { calls: 19, directionRequests: 34, views: 1450, reviews: 23, rating: 4.8 },
  ];
  const rank = [
    { trackedKeywords: 40, top3: 0, top10: 3,  avgPosition: 41 },
    { trackedKeywords: 40, top3: 1, top10: 5,  avgPosition: 36 },
    { trackedKeywords: 40, top3: 2, top10: 8,  avgPosition: 31 },
    { trackedKeywords: 40, top3: 3, top10: 11, avgPosition: 27 },
    { trackedKeywords: 40, top3: 5, top10: 14, avgPosition: 22 },
    { trackedKeywords: 40, top3: 6, top10: 17, avgPosition: 19 },
  ];
  METRIC_MONTHS.forEach((m, i) => {
    const period = monthKey(m);
    const common = {
      period, periodStart: ts(m), isBaseline: i === 0,
      enteredBy: 'manual', createdAt: serverTimestamp(),
    };
    put(['clients', CLIENT_ID, 'metrics', `${period}_gsc`],  { source: 'gsc',  values: gsc[i],  ...common });
    put(['clients', CLIENT_ID, 'metrics', `${period}_gbp`],  { source: 'gbp',  values: gbp[i],  ...common });
    put(['clients', CLIENT_ID, 'metrics', `${period}_rank`], { source: 'rank', values: rank[i], ...common });
  });

  // ── Recommendations ─────────────────────────────────────────
  const recs = [
    ['rec-01', 'Add a dedicated water heater installation page', 'Search volume in your area is strong and competitors rank with thin content. A dedicated page should reach page one within the quarter.', '30d', 'proposed', 'client'],
    ['rec-02', 'Launch a review generation campaign', 'You are 9 reviews behind the top competitor. Automated post-job requests close that gap in about two months.', '30d', 'accepted', 'client'],
    ['rec-03', 'Expand to the Milton and Roswell service areas', 'Once Alpharetta rankings hold top 3, adjacent-city pages are the natural next step for lead growth.', '90d', 'proposed', 'client'],
  ];
  recs.forEach(([id, title, body, horizon, status, visibility], i) => {
    put(['clients', CLIENT_ID, 'recommendations', id], {
      title, body, horizon, status, visibility,
      order: i + 1, createdAt: serverTimestamp(),
    });
  });

  // ── Messages ────────────────────────────────────────────────
  const messages = [
    ['msg-01', 'Kickoff call recap: goals confirmed, access granted for GBP and Analytics. Roadmap shared.', staffUid, 'Antonio Turner', 'staff', 'meeting_note', 'resolved', -170],
    ['msg-02', 'Month 3 check-in recap: rankings moving, agreed to prioritize the emergency page.', staffUid, 'Antonio Turner', 'staff', 'meeting_note', 'resolved', -100],
    ['msg-03', 'Can we get the new financing option mentioned on the water heater pages?', clientUid, 'Dana Acme', 'client', 'request', 'open', -6],
    ['msg-04', 'Absolutely. It is being added to the pillar page draft that is in review now.', staffUid, 'Antonio Turner', 'staff', 'note', 'open', -5],
  ];
  messages.forEach(([id, body, authorUid, authorName, authorRole, kind, status, dayOffset]) => {
    put(['clients', CLIENT_ID, 'messages', id], {
      body, authorUid, authorName, authorRole, kind, status,
      visibility: 'client',
      createdAt: ts(daysFromNow(dayOffset)),
    });
  });

  // ── Invoices (reference only) ───────────────────────────────
  put(['clients', CLIENT_ID, 'invoices', 'inv-01'], {
    label: `Retainer · ${monthKey(monthStart(-1))}`, amount: 1500, status: 'paid',
    dueDate: ts(monthStart(-1)), url: 'https://billing.example.com/inv-01', visibility: 'client',
  });
  put(['clients', CLIENT_ID, 'invoices', 'inv-02'], {
    label: `Retainer · ${monthKey(monthStart(0))}`, amount: 1500, status: 'due',
    dueDate: ts(daysFromNow(12)), url: 'https://billing.example.com/inv-02', visibility: 'client',
  });

  await batch.commit();

  console.log('');
  console.log('Seed complete.');
  console.log(`  Staff profile:  users/${staffUid} (role: staff)`);
  console.log(`  Client login:   ${CLIENT_EMAIL} → users/${clientUid} (client of ${CLIENT_ID})`);
  console.log(`  Demo client:    clients/${CLIENT_ID} (Acme Plumbing Co)`);
  console.log('  Docs written:   2 users, 1 client, 1 engagement, 6 milestones,');
  console.log('                  15 tasks, 18 metric snapshots, 3 recommendations,');
  console.log('                  4 messages, 2 invoices');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.code || '', err.message);
  if (err.code === 'permission-denied') {
    console.error(
      'Permission denied usually means the staff bootstrap failed. The first run must use\n' +
      'the owner email hard-coded in firestore.rules (users bootstrap clause), and the new\n' +
      'rules must be deployed first: firebase deploy --only firestore:rules'
    );
  }
  process.exit(1);
});
