// ──────────────────────────────────────────────────────────────
// Client portal data layer (Firestore)
//
// Tenant layout: all client data lives under clients/{clientId}/…
// Security rules are the real boundary; this module additionally
// appends where('visibility','==','client') to every client-role
// query, because rules REJECT unfiltered queries outright rather
// than filtering them (see firestore.rules).
//
// ── Onboarding a client login ─────────────────────────────────
// Staff: use the "Add client login" form (new-client form or the
// Account tab). It calls /api/portal/create-user (Admin SDK) and
// then createClientLogin() below sends Firebase's password-setup
// email. Clients can also invite teammates themselves via the
// invites/ + /join flow. Staff never knows anyone's password.
// ──────────────────────────────────────────────────────────────
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  collection, doc, onSnapshot, query, where, setDoc, addDoc, deleteDoc,
  getDoc, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { VISIBILITY } from './portalConstants';

const logError = (label, onError) => (err) => {
  console.error(`[portal] ${label} error`, err);
  if (onError) onError(err);
};

// Client-role queries MUST carry the visibility filter (rules enforce it).
function scopedQuery(colRef, role) {
  return role === 'client'
    ? query(colRef, where('visibility', '==', VISIBILITY.CLIENT))
    : colRef;
}

const snapToRows = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

// ── Subscriptions (all live, all return an unsubscribe fn) ────

export function subscribeClient(clientId, cb, onError) {
  return onSnapshot(
    doc(db, 'clients', clientId),
    (snap) => cb(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    logError('client', onError)
  );
}

// Staff only (rules deny this to client roles).
export function subscribeClients(cb, onError) {
  return onSnapshot(
    collection(db, 'clients'),
    (snap) => cb(snapToRows(snap)),
    logError('clients', onError)
  );
}

export function subscribeEngagement(clientId, cb, onError) {
  return onSnapshot(
    doc(db, 'clients', clientId, 'engagement', 'current'),
    (snap) => cb(snap.exists() ? snap.data() : null),
    logError('engagement', onError)
  );
}

// Sorted client-side by `order` to avoid composite indexes for now.
export function subscribeMilestones(clientId, role, cb, onError) {
  return onSnapshot(
    scopedQuery(collection(db, 'clients', clientId, 'milestones'), role),
    (snap) => cb(snapToRows(snap).sort(byOrder)),
    logError('milestones', onError)
  );
}

export function subscribeTasks(clientId, role, cb, onError) {
  return onSnapshot(
    scopedQuery(collection(db, 'clients', clientId, 'tasks'), role),
    (snap) => cb(snapToRows(snap).sort(byOrder)),
    logError('tasks', onError)
  );
}

export function subscribeComments(clientId, taskId, role, cb, onError) {
  return onSnapshot(
    scopedQuery(collection(db, 'clients', clientId, 'tasks', taskId, 'comments'), role),
    (snap) => cb(snapToRows(snap).sort(
      (a, b) => (toDate(a.createdAt)?.getTime() ?? 0) - (toDate(b.createdAt)?.getTime() ?? 0)
    )),
    logError('comments', onError)
  );
}

export function subscribeMetrics(clientId, cb, onError) {
  return onSnapshot(
    collection(db, 'clients', clientId, 'metrics'),
    (snap) => cb(snapToRows(snap).sort((a, b) => (a.period || '').localeCompare(b.period || ''))),
    logError('metrics', onError)
  );
}

// Team = users docs whose memberships include this org. Clients may
// read members of orgs they belong to (rules enforce the filter).
export function subscribeTeam(clientId, cb, onError) {
  return onSnapshot(
    query(collection(db, 'users'), where('clientIds', 'array-contains', clientId)),
    (snap) => cb(snap.docs.map((d) => ({ uid: d.id, ...d.data() }))),
    logError('team', onError)
  );
}

export function subscribeInvites(clientId, cb, onError) {
  return onSnapshot(
    query(collection(db, 'invites'), where('clientId', '==', clientId)),
    (snap) => cb(snap.docs.map((d) => ({ email: d.id, ...d.data() }))),
    logError('invites', onError)
  );
}

// ── Staff writes ──────────────────────────────────────────────
// Every write also bumps clients/{id}.updatedAt so the admin
// staleness indicator ("updated N days ago") stays honest.

export function updateClient(clientId, partial) {
  return setDoc(
    doc(db, 'clients', clientId),
    { ...partial, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

const touchClient = (clientId) => updateClient(clientId, {});

export async function createTask(clientId, data) {
  const ref = await addDoc(collection(db, 'clients', clientId, 'tasks'), {
    description: '',
    links: [],
    approvalStatus: 'not_required',
    shippedAt: null,
    approvedAt: null,
    approvedByUid: null,
    order: Date.now(),
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await touchClient(clientId);
  return ref;
}

export async function updateTask(clientId, taskId, partial) {
  await setDoc(
    doc(db, 'clients', clientId, 'tasks', taskId),
    { ...partial, updatedAt: serverTimestamp() },
    { merge: true }
  );
  await touchClient(clientId);
}

export async function deleteTask(clientId, taskId) {
  await deleteDoc(doc(db, 'clients', clientId, 'tasks', taskId));
  await touchClient(clientId);
}

export async function updateMilestone(clientId, milestoneId, partial) {
  await setDoc(
    doc(db, 'clients', clientId, 'milestones', milestoneId),
    { ...partial, updatedAt: serverTimestamp() },
    { merge: true }
  );
  await touchClient(clientId);
}

export async function addMilestone(clientId, data) {
  const ref = await addDoc(collection(db, 'clients', clientId, 'milestones'), {
    status: 'upcoming',
    visibility: 'client',
    description: '',
    targetDate: null,
    completedAt: null,
    order: Date.now(),
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await touchClient(clientId);
  return ref;
}

export async function deleteMilestone(clientId, milestoneId) {
  await deleteDoc(doc(db, 'clients', clientId, 'milestones', milestoneId));
  await touchClient(clientId);
}

// Swap two milestones' order values (the ↑/↓ reorder buttons).
export function swapMilestoneOrder(clientId, a, b) {
  return Promise.all([
    updateMilestone(clientId, a.id, { order: b.order ?? 0 }),
    updateMilestone(clientId, b.id, { order: a.order ?? 0 }),
  ]);
}

export async function updateEngagement(clientId, partial) {
  await setDoc(
    doc(db, 'clients', clientId, 'engagement', 'current'),
    { ...partial, updatedAt: serverTimestamp() },
    { merge: true }
  );
  await touchClient(clientId);
}

// Staff-only: new client org + engagement stub.
export async function createClient(clientId, data) {
  await setDoc(doc(db, 'clients', clientId), {
    status: 'active',
    health: 'green',
    healthNote: '',
    planScope: [],
    serviceLinks: [],
    nextCheckIn: null,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await setDoc(doc(db, 'clients', clientId, 'engagement', 'current'), {
    phase: 1,
    phaseLabel: 'Phase 1 · Foundation',
    monthsTotal: 12,
    summary: '',
    goals: [],
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ── Comments (clients and staff) ──────────────────────────────

export async function addComment(clientId, taskId, { body, author, visibility }) {
  await addDoc(collection(db, 'clients', clientId, 'tasks', taskId, 'comments'), {
    body,
    authorUid: author.uid,
    authorName: author.displayName || author.email || 'Unknown',
    authorRole: author.role,
    visibility,
    createdAt: serverTimestamp(),
  });
  if (author.role === 'staff') await touchClient(clientId);
}

// Staff-only: create the client's Auth login server-side (Admin
// SDK route), then send Firebase's password-setup email. The
// client clicks the link, picks a password, and signs in.
export async function createClientLogin({ email, displayName, clientId }) {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch('/api/portal/create-user', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, displayName, clientId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not create the login.');
  // Only brand-new accounts need the password-setup email; linking an
  // existing login to another business leaves their password alone.
  if (data.created) {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
  }
  return data;
}

// Staff-only: permanently delete a client org, its data tree, its
// logins, and its invites. confirmName must match the client name
// exactly (typed by the user, re-verified server-side).
export async function deleteClientOrg(clientId, confirmName) {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch('/api/portal/delete-client', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clientId, confirmName }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Delete failed.');
  return data;
}

// ── Team invites ──────────────────────────────────────────────
// Rules restrict clients to inviting into their own org only.

export function createInvite(email, { clientId, invitedByUid, invitedByName }) {
  return setDoc(doc(db, 'invites', email.trim().toLowerCase()), {
    clientId,
    role: 'client',
    invitedByUid,
    invitedByName,
    createdAt: serverTimestamp(),
  });
}

export function deleteInvite(email) {
  return deleteDoc(doc(db, 'invites', email.trim().toLowerCase()));
}

// Join flow, called right after createUserWithEmailAndPassword:
// read the invite for this account's email, create the users/{uid}
// profile (rules verify it matches the invite), consume the invite.
export async function acceptInvite(user, displayName) {
  const email = (user.email || '').toLowerCase();
  const inviteSnap = await getDoc(doc(db, 'invites', email));
  if (!inviteSnap.exists()) {
    const err = new Error('No invitation found for this email address.');
    err.code = 'portal/no-invite';
    throw err;
  }
  const invite = inviteSnap.data();
  await setDoc(doc(db, 'users', user.uid), {
    role: 'client',
    clientIds: [invite.clientId],
    displayName: displayName || email,
    email,
    createdAt: serverTimestamp(),
  });
  await deleteInvite(email);
  return invite.clientId;
}

// ── Metrics entry ─────────────────────────────────────────────
// Deterministic IDs ({period}_{source}) keep the future API sync a
// drop-in: it writes the same docs with enteredBy:'api'.

export async function saveMetricSnapshot(clientId, { source, period, values, enteredBy = 'manual' }) {
  const periodStart = new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)) - 1, 1);
  await setDoc(doc(db, 'clients', clientId, 'metrics', `${period}_${source}`), {
    source,
    period,
    periodStart,
    values,
    enteredBy,
    isBaseline: false,
    createdAt: serverTimestamp(),
  }, { merge: true });
  await touchClient(clientId);
}

// CSV import: long format with headers period,source,metric,value
// e.g.  2026-06,gsc,clicks,210
export async function importMetricsCsv(clientId, rows) {
  const snapshots = new Map();
  let skipped = 0;
  rows.forEach((row) => {
    const period = String(row.period || '').trim();
    const source = String(row.source || '').trim().toLowerCase();
    const metric = String(row.metric || '').trim();
    const value = Number(row.value);
    if (!/^\d{4}-\d{2}$/.test(period) || !source || !metric || Number.isNaN(value)) {
      skipped += 1;
      return;
    }
    const key = `${period}_${source}`;
    if (!snapshots.has(key)) snapshots.set(key, { period, source, values: {} });
    snapshots.get(key).values[metric] = value;
  });

  if (snapshots.size === 0) return { imported: 0, skipped };

  const batch = writeBatch(db);
  snapshots.forEach(({ period, source, values }, key) => {
    const periodStart = new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)) - 1, 1);
    batch.set(doc(db, 'clients', clientId, 'metrics', key), {
      source, period, periodStart, values,
      enteredBy: 'csv',
      isBaseline: false,
      createdAt: serverTimestamp(),
    }, { merge: true });
  });
  await batch.commit();
  await touchClient(clientId);
  return { imported: snapshots.size, skipped };
}

// ── Pure helpers ──────────────────────────────────────────────

// Firestore Timestamp | Date | ISO string → Date (or null).
export function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// 1-based calendar month of the engagement. Derived, never stored,
// so "Month 4 of 6" can never go stale.
export function monthOfEngagement(startDate) {
  const start = toDate(startDate);
  if (!start) return null;
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12
               + (now.getMonth() - start.getMonth()) + 1;
  return Math.max(1, months);
}

export function daysSince(value) {
  const d = toDate(value);
  if (!d) return null;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

export function formatDate(value) {
  const d = toDate(value);
  if (!d) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// 'YYYY-MM' month bucket key for a date (defaults to now).
export function monthKeyOf(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// 'YYYY-MM' → 'March 2026'
export function monthLabel(key) {
  if (!key) return '';
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
