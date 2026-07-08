'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  subscribeClients, createClient, createClientLogin, daysSince, toDate,
} from '../../portal/portalService';
import { HEALTH_LABELS, PLAN_TIERS } from '../../portal/portalConstants';
import styles from './AdminClients.module.css';

const slugify = (name) => name.toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function updatedText(days) {
  if (days === null) return 'never updated';
  if (days === 0) return 'updated today';
  if (days === 1) return 'updated yesterday';
  return `updated ${days} days ago`;
}

export default function AdminClients() {
  const [clients, setClients] = useState(null);

  useEffect(() => subscribeClients(setClients), []);

  // Least recently updated first, so neglected portals surface at the top.
  const sorted = (clients || []).slice().sort((a, b) => {
    const ta = toDate(a.updatedAt)?.getTime() ?? 0;
    const tb = toDate(b.updatedAt)?.getTime() ?? 0;
    return ta - tb;
  });

  return (
    <div>
      <div className="eyebrow">staff</div>
      <h1 className={styles.title}>Clients</h1>
      <p className={styles.sub}>
        Sorted by least recently updated, so anything going stale shows up first.
      </p>

      <NewClientForm existingIds={(clients || []).map((c) => c.id)} />

      {clients === null && <div className={styles.loading}>// loading…</div>}

      {clients !== null && sorted.length === 0 && (
        <p className={styles.emptyText}>
          No clients yet. Run scripts/seed-portal.js to create the demo client.
        </p>
      )}

      <ul className={styles.list}>
        {sorted.map((c) => {
          const staleDays = daysSince(c.updatedAt);
          const health = c.health || 'green';
          return (
            <li key={c.id}>
              <Link href={`/portal?client=${c.id}`} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.name}>{c.name}</span>
                  <span className={styles.meta}>
                    {c.planTier ? `${c.planTier} plan` : 'No plan set'}
                    {c.status && c.status !== 'active' ? ` · ${c.status}` : ''}
                  </span>
                </div>
                <div className={styles.rowSide}>
                  <span className={`${styles.health} ${styles[`health_${health}`]}`}>
                    <span className={styles.dot} aria-hidden="true" />
                    {HEALTH_LABELS[health] || health}
                  </span>
                  <span className={staleDays !== null && staleDays > 14 ? styles.stale : styles.updated}>
                    {updatedText(staleDays)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NewClientForm({ existingIds }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [planTier, setPlanTier] = useState('Growth');
  const [dealValue, setDealValue] = useState('');
  const [domain, setDomain] = useState('');
  const [startDate, setStartDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    const clientId = slugify(name);
    if (!clientId) { setError('Enter a client name.'); return; }
    if (existingIds.includes(clientId)) {
      setError(`A client with the ID "${clientId}" already exists.`);
      return;
    }
    setBusy(true);
    try {
      await createClient(clientId, {
        name: name.trim(),
        planTier,
        dealValue: Number(dealValue) || 0,
        primaryDomain: domain.trim(),
        startDate: startDate ? new Date(`${startDate}T12:00:00`) : new Date(),
      });
      if (contactEmail.trim()) {
        const result = await createClientLogin({
          email: contactEmail.trim(),
          displayName: contactName.trim(),
          clientId,
        });
        setNotice(result.linked
          ? `Client created and added to ${contactEmail.trim()}'s existing login.`
          : `Client created. ${contactEmail.trim()} received an email to set their password.`);
      } else {
        setNotice('Client created. Add a login from their Account tab whenever you are ready.');
      }
      setTimeout(() => router.push(`/portal/account?client=${clientId}`), 1600);
    } catch (err) {
      setError(err.message.startsWith('Could not') ? err.message : `Could not finish setup: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button className={styles.addToggle} type="button" onClick={() => setOpen(true)}>
        + New client
      </button>
    );
  }

  return (
    <form className={styles.addForm} onSubmit={submit}>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select className={styles.selectInput} value={planTier} onChange={(e) => setPlanTier(e.target.value)}>
          {PLAN_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          className={styles.input}
          type="number"
          min="0"
          placeholder="Deal value per lead ($)"
          value={dealValue}
          onChange={(e) => setDealValue(e.target.value)}
        />
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Primary domain (example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <input
          className={styles.input}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label="Engagement start date"
        />
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Client contact name (optional)"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Client login email (optional, sends setup email)"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </div>
      <div className={styles.addRow}>
        <button className={styles.addBtn} type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create client'}
        </button>
        <button className={styles.cancelBtn} type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      {name && <p className={styles.slugPreview}>Portal ID: {slugify(name) || '…'}</p>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  );
}
