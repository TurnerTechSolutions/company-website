'use client';
// Account tab: org details, service links, team access, and (for
// staff) the client edit panel + delete. Same view for both roles;
// staff just see more controls.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClientScope } from '../../portal/ClientScope';
import { useAuth } from '../../context/AuthProvider';
import {
  subscribeTeam, subscribeInvites, createInvite, deleteInvite,
  createClientLogin, deleteClientOrg, updateClient, formatDate, toDate,
} from '../../portal/portalService';
import { HEALTH_LABELS, PLAN_TIERS } from '../../portal/portalConstants';
import styles from './PortalAccount.module.css';

export default function PortalAccount() {
  const { clientId, client, isStaffView } = useClientScope();

  if (!clientId) {
    return (
      <div className={styles.empty}>
        <div className="eyebrow">account</div>
        <h1 className={styles.title}>No client selected</h1>
        <p className={styles.muted}>
          <Link className={styles.link} href="/portal/admin">Choose a client</Link> first.
        </p>
      </div>
    );
  }

  if (!client) return <div className={styles.loading}>// loading…</div>;

  return (
    <div className={styles.account}>
      <header>
        <div className="eyebrow">account</div>
        <h1 className={styles.title}>{client.name}</h1>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Engagement</h2>
          <dl className={styles.details}>
            <dt>Plan</dt><dd>{client.planTier || 'Not set'}</dd>
            <dt>Status</dt><dd>{client.status || 'active'}</dd>
            <dt>Health</dt><dd>{HEALTH_LABELS[client.health] || client.health || 'Not set'}</dd>
            {client.startDate && (<><dt>Started</dt><dd>{formatDate(client.startDate)}</dd></>)}
            {client.nextCheckIn && (<><dt>Next check-in</dt><dd>{formatDate(client.nextCheckIn)}</dd></>)}
            {client.primaryDomain && (<><dt>Domain</dt><dd>{client.primaryDomain}</dd></>)}
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Your sites &amp; services</h2>
          {(client.serviceLinks || []).length === 0 && (
            <p className={styles.muted}>
              {isStaffView
                ? 'No service links yet. Add production and dev URLs in the edit panel below.'
                : 'No links yet. Your production and dev site links will appear here.'}
            </p>
          )}
          <ul className={styles.linkList}>
            {(client.serviceLinks || []).map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className={styles.serviceLink}>
                  {l.label || l.url} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <TeamSection clientId={clientId} isStaffView={isStaffView} />

      {isStaffView && <StaffEditPanel clientId={clientId} client={client} />}
      {isStaffView && <DangerZone clientId={clientId} client={client} />}
    </div>
  );
}

function DangerZone({ clientId, client }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const match = typed.trim() === client.name;

  const destroy = async (e) => {
    e.preventDefault();
    if (!match) return;
    setError('');
    setBusy(true);
    try {
      await deleteClientOrg(clientId, typed.trim());
      window.localStorage.removeItem('tts-portal-client');
      router.push('/portal/admin');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <section className={styles.danger}>
      <h2 className={styles.dangerTitle}>Danger zone (staff only)</h2>
      {!open ? (
        <button className={styles.dangerToggle} type="button" onClick={() => setOpen(true)}>
          Delete this client…
        </button>
      ) : (
        <form className={styles.dangerPanel} onSubmit={destroy}>
          <p className={styles.dangerText}>
            This permanently deletes <strong>{client.name}</strong>: every task, milestone,
            metric, message, and invoice record, plus its pending invites. Logins that only
            belong to this business are deleted too; logins shared with another business
            just lose access to this one. There is no undo.
          </p>
          <label className={styles.field}>
            <span>Type the client name to confirm: {client.name}</span>
            <input
              className={styles.input}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={client.name}
              autoComplete="off"
            />
          </label>
          <div className={styles.editActions}>
            <button className={styles.dangerBtn} type="submit" disabled={!match || busy}>
              {busy ? 'Deleting…' : `Yes, permanently delete ${client.name}`}
            </button>
            <button
              className={styles.smallBtn}
              type="button"
              onClick={() => { setOpen(false); setTyped(''); setError(''); }}
            >
              Cancel
            </button>
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </form>
      )}
    </section>
  );
}

function TeamSection({ clientId, isStaffView }) {
  const { user, profile } = useAuth();
  const [team, setTeam] = useState(null);
  const [invites, setInvites] = useState([]);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => subscribeTeam(clientId, setTeam), [clientId]);
  useEffect(() => subscribeInvites(clientId, setInvites), [clientId]);

  const invite = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    const addr = email.trim().toLowerCase();
    if (!addr) return;
    if ((team || []).some((m) => (m.email || '').toLowerCase() === addr)) {
      setError('That person already has access.');
      return;
    }
    setBusy(true);
    try {
      if (isStaffView) {
        // Staff create the login directly; Firebase emails a
        // password-setup link, no join step needed. An existing
        // client login just gets this business added.
        const result = await createClientLogin({ email: addr, displayName: '', clientId });
        setNotice(result.linked
          ? `${addr} already had a login; this business was added to it.`
          : `Login created. ${addr} received an email to set their password.`);
      } else {
        await createInvite(addr, {
          clientId,
          invitedByUid: user.uid,
          invitedByName: (profile && profile.displayName) || user.email,
        });
        setNotice(
          `Invite created. Send them this link to set up their account: ${window.location.origin}/join`
        );
      }
      setEmail('');
    } catch (err) {
      setError(err.message || 'Could not add the teammate.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Team access</h2>
      <p className={styles.muted}>
        {isStaffView
          ? 'Everyone below can sign in and see this portal. Add a login by email; they get an email to set their own password.'
          : 'Everyone below can sign in and see this portal. Invite a teammate by email; they will create their own password.'}
      </p>

      <ul className={styles.team}>
        {(team || []).map((m) => (
          <li key={m.uid} className={styles.member}>
            <span className={styles.memberName}>{m.displayName || m.email}</span>
            <span className={styles.memberEmail}>{m.email}</span>
          </li>
        ))}
        {invites.map((inv) => (
          <li key={inv.email} className={styles.member}>
            <span className={styles.memberName}>{inv.email}</span>
            <span className={styles.pendingBadge}>Invite pending</span>
            <button
              className={styles.smallBtn}
              type="button"
              onClick={() => deleteInvite(inv.email).catch(() => setError(
                isStaffView ? 'Could not cancel the invite.'
                  : 'Contact Turner Tech Solutions to cancel this invite.'
              ))}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>

      <form className={styles.inviteForm} onSubmit={invite}>
        <input
          className={styles.input}
          type="email"
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className={styles.addBtn} type="submit" disabled={busy}>
          {busy ? 'Inviting…' : 'Invite teammate'}
        </button>
      </form>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  );
}

// Textarea list format: one entry per line. Service links use
// "Label | https://url" per line.
const linesToScope = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean);
const linesToLinks = (text) => text.split('\n').map((line) => {
  const [label, url] = line.split('|').map((s) => s.trim());
  if (url) return { label, url };
  if (label && label.startsWith('http')) return { label: label, url: label };
  return null;
}).filter(Boolean);

function StaffEditPanel({ clientId, client }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const start = () => {
    const checkIn = toDate(client.nextCheckIn);
    setForm({
      name: client.name || '',
      planTier: client.planTier || 'Growth',
      status: client.status || 'active',
      dealValue: client.dealValue ?? '',
      primaryDomain: client.primaryDomain || '',
      health: client.health || 'green',
      healthNote: client.healthNote || '',
      nextCheckIn: checkIn ? checkIn.toISOString().slice(0, 10) : '',
      conversionMetric: client.conversionMetric || 'gbp.calls',
      planScope: (client.planScope || []).join('\n'),
      serviceLinks: (client.serviceLinks || []).map((l) => `${l.label} | ${l.url}`).join('\n'),
    });
    setNotice('');
    setOpen(true);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateClient(clientId, {
        name: form.name.trim(),
        planTier: form.planTier,
        status: form.status,
        dealValue: Number(form.dealValue) || 0,
        primaryDomain: form.primaryDomain.trim(),
        health: form.health,
        healthNote: form.healthNote.trim(),
        nextCheckIn: form.nextCheckIn ? new Date(`${form.nextCheckIn}T12:00:00`) : null,
        conversionMetric: form.conversionMetric,
        planScope: linesToScope(form.planScope),
        serviceLinks: linesToLinks(form.serviceLinks),
      });
      setNotice('Saved.');
    } catch (err) {
      setNotice(`Save failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button className={styles.addToggle} type="button" onClick={start}>
        Edit client details
      </button>
    );
  }

  return (
    <form className={styles.editPanel} onSubmit={save}>
      <h2 className={styles.cardTitle}>Edit client (staff only)</h2>
      <div className={styles.editGrid}>
        <label className={styles.field}>
          <span>Name</span>
          <input className={styles.input} value={form.name} onChange={set('name')} required />
        </label>
        <label className={styles.field}>
          <span>Plan tier</span>
          <select className={styles.input} value={form.planTier} onChange={set('planTier')}>
            {PLAN_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>Status</span>
          <select className={styles.input} value={form.status} onChange={set('status')}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="churned">Churned</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Deal value per lead ($)</span>
          <input className={styles.input} type="number" min="0" value={form.dealValue} onChange={set('dealValue')} />
        </label>
        <label className={styles.field}>
          <span>Primary domain</span>
          <input className={styles.input} value={form.primaryDomain} onChange={set('primaryDomain')} />
        </label>
        <label className={styles.field}>
          <span>Health</span>
          <select className={styles.input} value={form.health} onChange={set('health')}>
            <option value="green">On track</option>
            <option value="yellow">Needs attention</option>
            <option value="red">At risk</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Next check-in</span>
          <input className={styles.input} type="date" value={form.nextCheckIn} onChange={set('nextCheckIn')} />
        </label>
        <label className={styles.field}>
          <span>Conversion metric (revenue calc)</span>
          <select className={styles.input} value={form.conversionMetric} onChange={set('conversionMetric')}>
            <option value="gbp.calls">GBP phone calls</option>
            <option value="ga4.conversions">GA4 conversions</option>
          </select>
        </label>
      </div>
      <label className={styles.field}>
        <span>Health note (client-visible)</span>
        <input className={styles.input} value={form.healthNote} onChange={set('healthNote')} />
      </label>
      <label className={styles.field}>
        <span>Plan scope (one item per line)</span>
        <textarea className={styles.textarea} rows={4} value={form.planScope} onChange={set('planScope')} />
      </label>
      <label className={styles.field}>
        <span>Service links (one per line: Label | https://url)</span>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder={'Production site | https://example.com\nDev site | https://dev.example.com'}
          value={form.serviceLinks}
          onChange={set('serviceLinks')}
        />
      </label>
      <div className={styles.editActions}>
        <button className={styles.addBtn} type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        <button className={styles.smallBtn} type="button" onClick={() => setOpen(false)}>
          Close
        </button>
        {notice && <span className={styles.notice}>{notice}</span>}
      </div>
    </form>
  );
}
