// ──────────────────────────────────────────────────────────────
// Leads data layer (Firestore)
// ──────────────────────────────────────────────────────────────
import {
  collection, doc, onSnapshot, updateDoc, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { normalizeDataset } from './normalizeCompass';

const COL = 'leads';

// Live subscription — calls cb(leadsArray) whenever data changes.
export function subscribeLeads(cb, onError) {
  return onSnapshot(
    collection(db, COL),
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cb(rows);
    },
    (err) => { console.error('[leads] subscribe error', err); onError && onError(err); }
  );
}

// Import scraped leads. Uses merge so existing `contacted`/`notes`/`status`
// are NEVER overwritten on re-import — only the scraped fields refresh.
// Firestore batches are capped at 500 writes, so we chunk.
export async function importLeads(raw) {
  const normalized = normalizeDataset(raw);
  if (!normalized.length) return { imported: 0, total: 0 };

  const chunks = [];
  for (let i = 0; i < normalized.length; i += 450) chunks.push(normalized.slice(i, i + 450));

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((lead) => {
      const { id, ...fields } = lead;
      const ref = doc(db, COL, id);
      batch.set(
        ref,
        { ...fields, importedAt: serverTimestamp() },
        { merge: true } // <-- preserves contacted / notes / status
      );
    });
    await batch.commit();
  }
  return { imported: normalized.length, total: normalized.length };
}

// Update a single lead (contacted toggle, notes, status…)
export function updateLead(id, partial) {
  return updateDoc(doc(db, COL, id), { ...partial, updatedAt: serverTimestamp() });
}

// ── Optional: pull straight from an Apify dataset ──────────────
// Accepts a dataset ID or any Apify URL containing one, plus your
// Apify API token. Runs client-side, so this only fetches — it does
// not store the token. See SETUP notes re: token exposure.
export async function fetchApifyDataset(datasetIdOrUrl, token) {
  const m = String(datasetIdOrUrl).match(/datasets\/([a-zA-Z0-9]+)/)
        ||  String(datasetIdOrUrl).match(/^([a-zA-Z0-9]+)$/);
  const datasetId = m && m[1];
  if (!datasetId) throw new Error('Could not find a dataset ID in that input.');

  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&format=json`
            + (token ? `&token=${encodeURIComponent(token)}` : '');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Apify responded ${res.status}. Check the dataset ID and token.`);
  return res.json();
}
