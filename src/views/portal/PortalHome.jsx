'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useClientScope } from '../../portal/ClientScope';
import { useAuth } from '../../context/AuthProvider';
import {
  subscribeEngagement, subscribeMilestones, updateMilestone,
  monthOfEngagement, daysSince, formatDate,
} from '../../portal/portalService';
import {
  HEALTH_LABELS, MILESTONE_STATUS_LABELS,
} from '../../portal/portalConstants';
import styles from './PortalHome.module.css';

function updatedText(days) {
  if (days === null) return null;
  if (days === 0) return 'updated today';
  if (days === 1) return 'updated yesterday';
  return `updated ${days} days ago`;
}

export default function PortalHome() {
  const { clientId, client, isStaffView } = useClientScope();
  const { role } = useAuth();
  const [engagement, setEngagement] = useState(null);
  const [milestones, setMilestones] = useState(null);

  useEffect(() => {
    if (!clientId) return undefined;
    return subscribeEngagement(clientId, setEngagement);
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !role) return undefined;
    return subscribeMilestones(clientId, role, setMilestones);
  }, [clientId, role]);

  const changeMilestoneStatus = (ms, status) => {
    updateMilestone(clientId, ms.id, {
      status,
      completedAt: status === 'done' ? new Date() : null,
    });
  };

  if (!clientId) {
    return (
      <div className={styles.empty}>
        <div className="eyebrow">client portal</div>
        <h1 className={styles.emptyTitle}>No client selected</h1>
        {isStaffView ? (
          <p className={styles.emptyText}>
            Pick a client to view their portal exactly as they see it.{' '}
            <Link className={styles.emptyLink} href="/portal/admin">Browse clients</Link>
          </p>
        ) : (
          <p className={styles.emptyText}>
            Your account is not linked to a client workspace yet.
            Contact Turner Tech Solutions and we will get you connected.
          </p>
        )}
      </div>
    );
  }

  if (!client) {
    return <div className={styles.loading}>// loading…</div>;
  }

  const month = monthOfEngagement(client.startDate);
  const monthsTotal = engagement ? engagement.monthsTotal : null;
  const monthClamped = monthsTotal ? Math.min(month || 1, monthsTotal) : month;
  const progress = monthsTotal ? Math.min((monthClamped || 0) / monthsTotal, 1) : 0;
  const health = client.health || 'green';
  const updated = updatedText(daysSince(client.updatedAt));

  return (
    <div className={styles.home}>
      <header className={styles.head}>
        <div>
          <div className="eyebrow">engagement overview</div>
          <h1 className={styles.title}>{client.name}</h1>
          <div className={styles.chips}>
            {client.planTier && <span className={styles.chip}>{client.planTier} plan</span>}
            {client.primaryDomain && <span className={styles.chip}>{client.primaryDomain}</span>}
            {client.status && client.status !== 'active' && (
              <span className={styles.chip}>{client.status}</span>
            )}
          </div>
        </div>

        <div className={`${styles.health} ${styles[`health_${health}`]}`}>
          <span className={styles.healthDot} aria-hidden="true" />
          <div>
            <div className={styles.healthLabel}>{HEALTH_LABELS[health] || health}</div>
            {updated && <div className={styles.healthMeta}>{updated}</div>}
          </div>
        </div>
      </header>

      <section className={styles.phaseCard}>
        <div className={styles.phaseTop}>
          <div>
            <div className={styles.phaseLabel}>
              {engagement ? engagement.phaseLabel : 'Engagement'}
            </div>
            {monthClamped && monthsTotal && (
              <div className={styles.phaseMonth}>
                Month {monthClamped} of {monthsTotal}
              </div>
            )}
          </div>
          {client.nextCheckIn && (
            <div className={styles.checkIn}>
              <span className={styles.checkInLabel}>Next check-in</span>
              <span className={styles.checkInDate}>{formatDate(client.nextCheckIn)}</span>
            </div>
          )}
        </div>

        {monthsTotal && (
          <div className={styles.track} role="img"
            aria-label={`Month ${monthClamped} of ${monthsTotal}`}>
            <div className={styles.trackFill} style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        {engagement && engagement.summary && (
          <p className={styles.summary}>{engagement.summary}</p>
        )}

        {client.healthNote && (
          <p className={styles.note}>{client.healthNote}</p>
        )}
      </section>

      {milestones && milestones.length > 0 && (
        <section className={styles.roadmap}>
          <h2 className={styles.roadmapTitle}>Roadmap</h2>
          <ol className={styles.timeline}>
            {milestones.map((ms) => (
              <li key={ms.id} className={`${styles.msItem} ${styles[`ms_${ms.status}`] || ''}`}>
                <span className={styles.msMarker} aria-hidden="true" />
                <div className={styles.msBody}>
                  <div className={styles.msHead}>
                    <span className={styles.msTitle}>{ms.title}</span>
                    {isStaffView && ms.visibility === 'internal' && (
                      <span className={styles.internalBadge}>Internal</span>
                    )}
                    {isStaffView ? (
                      <select
                        className={styles.msSelect}
                        value={ms.status}
                        onChange={(e) => changeMilestoneStatus(ms, e.target.value)}
                        aria-label={`Status for ${ms.title}`}
                      >
                        {Object.entries(MILESTONE_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={styles.msStatus}>
                        {MILESTONE_STATUS_LABELS[ms.status] || ms.status}
                      </span>
                    )}
                  </div>
                  {ms.description && <p className={styles.msDesc}>{ms.description}</p>}
                  {ms.status === 'done' && ms.completedAt && (
                    <span className={styles.msMeta}>Completed {formatDate(ms.completedAt)}</span>
                  )}
                  {ms.status === 'upcoming' && ms.targetDate && (
                    <span className={styles.msMeta}>Planned for {formatDate(ms.targetDate)}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className={styles.grid}>
        {engagement && engagement.goals && engagement.goals.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Goals this engagement</h2>
            <ul className={styles.list}>
              {engagement.goals.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </section>
        )}

        {client.planScope && client.planScope.length > 0 && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>What your plan covers</h2>
            <ul className={styles.list}>
              {client.planScope.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Engagement details</h2>
          <dl className={styles.details}>
            {client.startDate && (
              <>
                <dt>Started</dt>
                <dd>{formatDate(client.startDate)}</dd>
              </>
            )}
            {client.planTier && (
              <>
                <dt>Plan</dt>
                <dd>{client.planTier}</dd>
              </>
            )}
            {engagement && engagement.phase != null && (
              <>
                <dt>Phase</dt>
                <dd>{engagement.phase}</dd>
              </>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}
