'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useClientScope } from '../../portal/ClientScope';
import { useAuth } from '../../context/AuthProvider';
import {
  subscribeEngagement, subscribeMilestones, updateMilestone, addMilestone,
  deleteMilestone, swapMilestoneOrder, updateEngagement, updateClient,
  monthOfEngagement, daysSince, formatDate, toDate,
} from '../../portal/portalService';
import {
  HEALTH_LABELS, MILESTONE_STATUS_LABELS, VISIBILITY,
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

        {isStaffView && (
          <EngagementEdit clientId={clientId} client={client} engagement={engagement} />
        )}
      </section>

      {milestones && (milestones.length > 0 || isStaffView) && (
        <Roadmap clientId={clientId} milestones={milestones} isStaffView={isStaffView} />
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

// ── Roadmap (staff can add / edit / reorder / delete) ─────────

function Roadmap({ clientId, milestones, isStaffView }) {
  return (
    <section className={styles.roadmap}>
      <h2 className={styles.roadmapTitle}>Roadmap</h2>
      {milestones.length === 0 && (
        <p className={styles.msDesc}>No milestones yet. Add the first one below.</p>
      )}
      <ol className={styles.timeline}>
        {milestones.map((ms, i) => (
          <MilestoneItem
            key={ms.id}
            ms={ms}
            clientId={clientId}
            isStaffView={isStaffView}
            prev={i > 0 ? milestones[i - 1] : null}
            next={i < milestones.length - 1 ? milestones[i + 1] : null}
          />
        ))}
      </ol>
      {isStaffView && <AddMilestoneForm clientId={clientId} />}
    </section>
  );
}

function MilestoneItem({ ms, clientId, isStaffView, prev, next }) {
  const [editing, setEditing] = useState(false);

  const changeStatus = (status) => updateMilestone(clientId, ms.id, {
    status,
    completedAt: status === 'done' ? new Date() : null,
  });
  const remove = () => {
    if (window.confirm(`Delete milestone "${ms.title}"? This cannot be undone.`)) {
      deleteMilestone(clientId, ms.id);
    }
  };

  return (
    <li className={`${styles.msItem} ${styles[`ms_${ms.status}`] || ''}`}>
      <span className={styles.msMarker} aria-hidden="true" />
      <div className={styles.msBody}>
        <div className={styles.msHead}>
          <span className={styles.msTitle}>{ms.title}</span>
          {isStaffView && ms.visibility === VISIBILITY.INTERNAL && (
            <span className={styles.internalBadge}>Internal</span>
          )}
          {isStaffView ? (
            <select
              className={styles.msSelect}
              value={ms.status}
              onChange={(e) => changeStatus(e.target.value)}
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
          {isStaffView && (
            <span className={styles.msControls}>
              <button
                className={styles.msBtn} type="button" title="Move up"
                disabled={!prev}
                onClick={() => swapMilestoneOrder(clientId, ms, prev)}
              >↑</button>
              <button
                className={styles.msBtn} type="button" title="Move down"
                disabled={!next}
                onClick={() => swapMilestoneOrder(clientId, ms, next)}
              >↓</button>
              <button className={styles.msBtn} type="button" onClick={() => setEditing((e) => !e)}>
                {editing ? 'Close' : 'Edit'}
              </button>
              <button className={styles.msBtnDanger} type="button" onClick={remove}>
                Delete
              </button>
            </span>
          )}
        </div>

        {!editing && ms.description && <p className={styles.msDesc}>{ms.description}</p>}
        {!editing && ms.status === 'done' && ms.completedAt && (
          <span className={styles.msMeta}>Completed {formatDate(ms.completedAt)}</span>
        )}
        {!editing && ms.status === 'upcoming' && ms.targetDate && (
          <span className={styles.msMeta}>Planned for {formatDate(ms.targetDate)}</span>
        )}

        {editing && (
          <MilestoneEditForm ms={ms} clientId={clientId} onDone={() => setEditing(false)} />
        )}
      </div>
    </li>
  );
}

function MilestoneEditForm({ ms, clientId, onDone }) {
  const target = toDate(ms.targetDate);
  const [title, setTitle] = useState(ms.title || '');
  const [description, setDescription] = useState(ms.description || '');
  const [targetDate, setTargetDate] = useState(target ? target.toISOString().slice(0, 10) : '');
  const [visibility, setVisibility] = useState(ms.visibility || VISIBILITY.CLIENT);
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await updateMilestone(clientId, ms.id, {
        title: title.trim(),
        description: description.trim(),
        targetDate: targetDate ? new Date(`${targetDate}T12:00:00`) : null,
        visibility,
      });
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={styles.msForm} onSubmit={save}>
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Milestone title"
        required
      />
      <textarea
        className={styles.textarea}
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description the client will see"
      />
      <div className={styles.msFormRow}>
        <input
          className={styles.input}
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          aria-label="Target date"
        />
        <select
          className={styles.input}
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value={VISIBILITY.CLIENT}>Client sees it</option>
          <option value={VISIBILITY.INTERNAL}>Internal only</option>
        </select>
        <button className={styles.saveBtn} type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function AddMilestoneForm({ clientId }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [visibility, setVisibility] = useState(VISIBILITY.CLIENT);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await addMilestone(clientId, {
        title: title.trim(),
        description: description.trim(),
        targetDate: targetDate ? new Date(`${targetDate}T12:00:00`) : null,
        visibility,
      });
      setTitle(''); setDescription(''); setTargetDate('');
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button className={styles.addToggle} type="button" onClick={() => setOpen(true)}>
        + Add milestone
      </button>
    );
  }

  return (
    <form className={styles.msForm} onSubmit={submit}>
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Milestone title"
        required
      />
      <textarea
        className={styles.textarea}
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description the client will see"
      />
      <div className={styles.msFormRow}>
        <input
          className={styles.input}
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          aria-label="Target date"
        />
        <select
          className={styles.input}
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value={VISIBILITY.CLIENT}>Client sees it</option>
          <option value={VISIBILITY.INTERNAL}>Internal only</option>
        </select>
        <button className={styles.saveBtn} type="submit" disabled={busy}>
          {busy ? 'Adding…' : 'Add'}
        </button>
        <button className={styles.msBtn} type="button" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </form>
  );
}

// ── Engagement header editor (staff only) ─────────────────────

function EngagementEdit({ clientId, client, engagement }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const start = () => {
    const startDate = toDate(client.startDate);
    setForm({
      phase: engagement?.phase ?? 1,
      phaseLabel: engagement?.phaseLabel || 'Phase 1 · Foundation',
      monthsTotal: engagement?.monthsTotal ?? 12,
      summary: engagement?.summary || '',
      goals: (engagement?.goals || []).join('\n'),
      startDate: startDate ? startDate.toISOString().slice(0, 10) : '',
    });
    setOpen(true);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateEngagement(clientId, {
        phase: Number(form.phase) || 1,
        phaseLabel: form.phaseLabel.trim(),
        monthsTotal: Number(form.monthsTotal) || 12,
        summary: form.summary.trim(),
        goals: form.goals.split('\n').map((s) => s.trim()).filter(Boolean),
      });
      if (form.startDate) {
        await updateClient(clientId, { startDate: new Date(`${form.startDate}T12:00:00`) });
      }
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button className={styles.editToggle} type="button" onClick={start}>
        Edit engagement
      </button>
    );
  }

  return (
    <form className={styles.engForm} onSubmit={save}>
      <div className={styles.msFormRow}>
        <label className={styles.field}>
          <span>Phase label (client-visible)</span>
          <input className={styles.input} value={form.phaseLabel} onChange={set('phaseLabel')} required />
        </label>
        <label className={styles.field}>
          <span>Phase #</span>
          <input className={styles.input} type="number" min="1" value={form.phase} onChange={set('phase')} />
        </label>
        <label className={styles.field}>
          <span>Months total</span>
          <input className={styles.input} type="number" min="1" value={form.monthsTotal} onChange={set('monthsTotal')} />
        </label>
        <label className={styles.field}>
          <span>Start date</span>
          <input className={styles.input} type="date" value={form.startDate} onChange={set('startDate')} />
        </label>
      </div>
      <label className={styles.field}>
        <span>Summary (client-visible)</span>
        <textarea className={styles.textarea} rows={3} value={form.summary} onChange={set('summary')} />
      </label>
      <label className={styles.field}>
        <span>Goals (one per line)</span>
        <textarea className={styles.textarea} rows={3} value={form.goals} onChange={set('goals')} />
      </label>
      <div className={styles.msFormRow}>
        <button className={styles.saveBtn} type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save engagement'}
        </button>
        <button className={styles.msBtn} type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
