'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { subscribeClients, daysSince, toDate } from '../../portal/portalService';
import { HEALTH_LABELS } from '../../portal/portalConstants';
import styles from './AdminClients.module.css';

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
