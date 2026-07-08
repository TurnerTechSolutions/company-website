// ──────────────────────────────────────────────────────────────
// Staff-only: create (or link) a client login.
//
// POST { email, displayName, clientId } with a Firebase ID token
// in the Authorization header. Creates the Auth user with a random
// throwaway password and writes users/{uid} = {role:'client', …}.
// The caller then triggers Firebase's password-setup email
// (sendPasswordResetEmail) so the client picks their own password;
// nobody ever knows the throwaway one.
// ──────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '../../../../lib/firebaseAdmin';

const err = (status, error) => NextResponse.json({ error }, { status });

export async function POST(req) {
  try {
    // Config problems (bad/missing service account) surface as 500
    // with the real message, never disguised as a token error.
    let auth;
    let db;
    try {
      auth = adminAuth();
      db = adminDb();
    } catch (e) {
      return err(500, e.message);
    }

    // ── Caller must be signed-in staff ──
    const header = req.headers.get('authorization') || '';
    if (!header.startsWith('Bearer ')) return err(401, 'Missing auth token.');
    let decoded;
    try {
      decoded = await auth.verifyIdToken(header.slice(7));
    } catch {
      return err(401, 'Invalid auth token. Sign out and back in, then retry.');
    }
    const caller = await db.doc(`users/${decoded.uid}`).get();
    if (!caller.exists || caller.data().role !== 'staff') {
      return err(403, 'Staff only.');
    }

    // ── Validate input ──
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const displayName = String(body.displayName || '').trim();
    const clientId = String(body.clientId || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email.');
    if (!clientId) return err(400, 'Missing clientId.');
    const clientSnap = await db.doc(`clients/${clientId}`).get();
    if (!clientSnap.exists) return err(400, `Client "${clientId}" does not exist.`);

    // ── Create the Auth user (or reuse an existing account) ──
    let userRecord;
    let created = false;
    try {
      userRecord = await auth.createUser({
        email,
        displayName: displayName || undefined,
        password: `${randomUUID()}Aa1!`, // random throwaway; replaced via setup email
      });
      created = true;
    } catch (e) {
      if (e.code !== 'auth/email-already-exists') throw e;
      userRecord = await auth.getUserByEmail(email);
    }

    // An existing client login gets this org ADDED to its
    // memberships (multi-business support); staff emails are refused.
    const profileRef = db.doc(`users/${userRecord.uid}`);
    const existingProfile = await profileRef.get();
    if (existingProfile.exists && existingProfile.data().role === 'staff') {
      return err(409, 'That email belongs to a staff account.');
    }

    if (existingProfile.exists) {
      await profileRef.set({
        role: 'client',
        clientIds: FieldValue.arrayUnion(clientId),
      }, { merge: true });
    } else {
      await profileRef.set({
        role: 'client',
        clientIds: [clientId],
        displayName: displayName || email,
        email,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    // linked = an existing login gained access (no password email needed)
    return NextResponse.json({ ok: true, uid: userRecord.uid, created, linked: !created });
  } catch (e) {
    console.error('[create-user]', e);
    return err(500, 'Could not create the login. Check the server logs.');
  }
}
