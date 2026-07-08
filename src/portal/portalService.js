// ──────────────────────────────────────────────────────────────
// Client portal data layer (Firestore)
//
// Tenant layout: all client data lives under clients/{clientId}/…
// Security rules are the real boundary; this module additionally
// appends where('visibility','==','client') to every client-role
// query, because rules REJECT unfiltered queries outright rather
// than filtering them (see firestore.rules).
//
// ── Runbook: onboarding a new client login (v1) ───────────────
// 1. Firebase console → Authentication → Add user (their email,
//    any throwaway password). Copy the new UID.
// 2. Firestore → users/{that UID} → create doc:
//      { role: 'client', clientId: '<their clients/{id} slug>',
//        displayName: '…', email: '…' }
//    (Or run scripts/seed-portal.js style set() as staff.)
// 3. Console → Authentication → send them a password reset email
//    so they set their own password. Staff never knows it.
// ──────────────────────────────────────────────────────────────
import {
  collection, doc, onSnapshot, query, where, setDoc, addDoc, deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
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
