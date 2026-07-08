// ──────────────────────────────────────────────────────────────
// Staff-only: permanently delete a client org.
//
// POST { clientId, confirmName } with a staff ID token. The
// confirmName must exactly match the client's name (the UI makes
// the user type it; this re-checks server-side). Deletes:
//   - the clients/{id} doc and its ENTIRE subcollection tree
//   - every users/{uid} profile in the org + their Auth accounts
//   - any pending invites for the org
// This is irreversible by design.
// ──────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '../../../../lib/firebaseAdmin';

const err = (status, error) => NextResponse.json({ error }, { status });

export async function POST(req) {
  try {
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

    // ── Validate the typed confirmation ──
    const body = await req.json();
    const clientId = String(body.clientId || '').trim();
    const confirmName = String(body.confirmName || '').trim();
    if (!clientId) return err(400, 'Missing clientId.');
    const clientRef = db.doc(`clients/${clientId}`);
    const clientSnap = await clientRef.get();
    if (!clientSnap.exists) return err(404, 'Client not found.');
    if (confirmName !== clientSnap.data().name) {
      return err(400, 'Confirmation name does not match the client name.');
    }

    // ── Remove this org from member logins; delete logins that
    //    belong to no other business ──
    const members = await db.collection('users')
      .where('clientIds', 'array-contains', clientId).get();
    let loginsDeleted = 0;
    let loginsUnlinked = 0;
    for (const m of members.docs) {
      if (m.data().role === 'staff') continue; // never touch staff
      const remaining = (m.data().clientIds || []).filter((id) => id !== clientId);
      if (remaining.length > 0) {
        await m.ref.update({ clientIds: FieldValue.arrayRemove(clientId) });
        loginsUnlinked += 1;
      } else {
        await auth.deleteUser(m.id).catch(() => {}); // Auth account may already be gone
        await m.ref.delete();
        loginsDeleted += 1;
      }
    }
    const invites = await db.collection('invites').where('clientId', '==', clientId).get();
    for (const inv of invites.docs) await inv.ref.delete();

    // ── Delete the client doc and its whole subcollection tree ──
    await db.recursiveDelete(clientRef);

    return NextResponse.json({
      ok: true,
      loginsDeleted,
      loginsUnlinked,
      invitesDeleted: invites.size,
    });
  } catch (e) {
    console.error('[delete-client]', e);
    return err(500, 'Delete failed. Check the server logs.');
  }
}
