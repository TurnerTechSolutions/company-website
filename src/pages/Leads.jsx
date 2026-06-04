import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import {
  subscribeLeads, importLeads, updateLead, fetchApifyDataset,
} from '../leads/leadsService';
import styles from './Leads.module.css';

// Your scheduling link, e.g. https://calendly.com/your-handle/intro-call
const CALENDLY_URL = process.env.REACT_APP_CALENDLY_URL;

const WEBSITE_OPTS   = [['all', 'Website: any'], ['no', 'No website'], ['yes', 'Has website']];
const CONTACT_OPTS   = [['all', 'Status: any'], ['no', 'Not contacted'], ['yes', 'Contacted']];
const SORT_OPTS      = [
  ['reviewsAsc',  'Reviews ↑ (small first)'],
  ['reviewsDesc', 'Reviews ↓'],
  ['ratingDesc',  'Rating ↓'],
  ['name',        'Name A–Z'],
];

export default function Leads() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [toast, setToast]   = useState('');
  const fileRef = useRef(null);

  // ── Filters ──
  const [q, setQ]               = useState('');
  const [website, setWebsite]   = useState('all');
  const [contacted, setContact] = useState('all');
  const [hasPhone, setHasPhone] = useState(false);
  const [category, setCategory] = useState('all');
  const [minReviews, setMin]    = useState('');
  const [maxReviews, setMax]    = useState('');
  const [sort, setSort]         = useState('reviewsAsc');

  // ── Apify panel ──
  const [showApify, setShowApify] = useState(false);
  const [apifyId, setApifyId]     = useState('');
  const [apifyTok, setApifyTok]   = useState('');
  const [busy, setBusy]           = useState(false);

  // ── Notes local buffer (avoids re-render lag while typing) ──
  const [noteDraft, setNoteDraft] = useState({});

  useEffect(() => {
    const unsub = subscribeLeads(
      (rows) => { setLeads(rows); setLoad(false); },
      () => setLoad(false)
    );
    return unsub;
  }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // ── Import handlers ──
  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const { imported } = await importLeads(json);
      flash(`Imported / refreshed ${imported} leads.`);
    } catch (err) {
      flash(`Import failed: ${err.message}`);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleApify = async () => {
    if (!apifyId.trim()) return flash('Enter a dataset ID or URL.');
    setBusy(true);
    try {
      const data = await fetchApifyDataset(apifyId.trim(), apifyTok.trim());
      const { imported } = await importLeads(data);
      flash(`Pulled ${imported} leads from Apify.`);
      setShowApify(false);
    } catch (err) {
      flash(`Apify pull failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  // ── Per-lead updates ──
  const toggleContacted = (lead) =>
    updateLead(lead.id, { contacted: !lead.contacted }).catch((e) => flash(e.message));

  const saveNote = (lead) => {
    const next = noteDraft[lead.id];
    if (next === undefined || next === (lead.notes || '')) return;
    updateLead(lead.id, { notes: next })
      .then(() => flash('Note saved.'))
      .catch((e) => flash(e.message));
  };

  // Open Calendly in a new tab, pre-filling the customer's details.
  const openSchedule = (lead) => {
    console.log(CALENDLY_URL);
    if (!CALENDLY_URL) {
      return flash('Set REACT_APP_CALENDLY_URL in .env to enable scheduling.');
    }
    const params = new URLSearchParams();
    if (lead.name)  params.set('name', lead.name);
    if (lead.email) params.set('email', lead.email);
    const sep = CALENDLY_URL.includes('?') ? '&' : '?';
    const url = params.toString() ? `${CALENDLY_URL}${sep}${params}` : CALENDLY_URL;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ── Derived: category list ──
  const categories = useMemo(() => {
    const set = new Set(leads.map((l) => l.category).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [leads]);

  // ── Derived: filtered + sorted ──
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = leads.filter((l) => {
      if (needle && !(`${l.name} ${l.address} ${l.city}`.toLowerCase().includes(needle))) return false;
      if (website === 'no'  && l.hasWebsite)  return false;
      if (website === 'yes' && !l.hasWebsite) return false;
      if (contacted === 'yes' && !l.contacted) return false;
      if (contacted === 'no'  &&  l.contacted) return false;
      if (hasPhone && !l.hasPhone) return false;
      if (category !== 'all' && l.category !== category) return false;
      if (minReviews !== '' && (l.reviews ?? 0) < Number(minReviews)) return false;
      if (maxReviews !== '' && (l.reviews ?? 0) > Number(maxReviews)) return false;
      return true;
    });
    out.sort((a, b) => {
      switch (sort) {
        case 'reviewsDesc': return (b.reviews ?? 0) - (a.reviews ?? 0);
        case 'ratingDesc':  return (b.rating ?? 0) - (a.rating ?? 0);
        case 'name':        return (a.name || '').localeCompare(b.name || '');
        default:            return (a.reviews ?? 0) - (b.reviews ?? 0); // reviewsAsc
      }
    });
    return out;
  }, [leads, q, website, contacted, hasPhone, category, minReviews, maxReviews, sort]);

  const exportCsv = () => {
    const cols = ['name', 'category', 'phone', 'website', 'email', 'rating', 'reviews', 'city', 'state', 'contacted', 'notes', 'googleUrl'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [cols.join(',')].concat(
      visible.map((l) => cols.map((c) => esc(l[c])).join(','))
    );
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const logout = async () => { await signOut(); navigate('/login', { replace: true }); };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.head}>
        <div>
          <div className={styles.eyebrow}>// lead pipeline</div>
          <h1 className={styles.title}>Leads</h1>
        </div>
        <div className={styles.headActions}>
          <span className={styles.count}>{visible.length} / {leads.length}</span>
          <button className={styles.ghost} onClick={exportCsv} disabled={!visible.length}>Export CSV</button>
          <button className={styles.ghost} onClick={logout}>Sign out</button>
        </div>
      </div>

      {/* Import bar */}
      <div className={styles.importBar}>
        <button className={styles.primary} onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}>
          {busy ? 'Working…' : '↑ Upload JSON'}
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={handleFile} />
        <button className={styles.ghost} onClick={() => setShowApify((s) => !s)}>
          {showApify ? 'Cancel' : 'Import from Apify'}
        </button>
      </div>

      {showApify && (
        <div className={styles.apify}>
          <input className={styles.apifyInput} placeholder="Apify dataset ID or URL"
                 value={apifyId} onChange={(e) => setApifyId(e.target.value)} />
          <input className={styles.apifyInput} placeholder="Apify API token" type="password"
                 value={apifyTok} onChange={(e) => setApifyTok(e.target.value)} />
          <button className={styles.primary} onClick={handleApify} disabled={busy}>Pull</button>
          <p className={styles.apifyNote}>
            Token is used only for this request and not stored. Heads up: it travels through the
            browser — for a hardened setup, proxy this through a serverless function later.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <input className={styles.search} placeholder="Search name / address…"
               value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'Category: any' : c}</option>)}
        </select>
        <select className={styles.select} value={website} onChange={(e) => setWebsite(e.target.value)}>
          {WEBSITE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className={styles.select} value={contacted} onChange={(e) => setContact(e.target.value)}>
          {CONTACT_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={hasPhone} onChange={(e) => setHasPhone(e.target.checked)} />
          Has phone
        </label>
        <input className={styles.num} type="number" placeholder="min ★#"
               value={minReviews} onChange={(e) => setMin(e.target.value)} />
        <input className={styles.num} type="number" placeholder="max ★#"
               value={maxReviews} onChange={(e) => setMax(e.target.value)} />
        <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className={styles.empty}>// loading leads…</div>
      ) : !leads.length ? (
        <div className={styles.empty}>No leads yet. Upload a Compass JSON export to get started.</div>
      ) : !visible.length ? (
        <div className={styles.empty}>No leads match these filters.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Done</th><th>Business</th><th>Category</th><th>Phone</th>
                <th>Site</th><th>★</th><th>#</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} className={l.contacted ? styles.doneRow : ''}>
                  <td>
                    <input type="checkbox" checked={!!l.contacted}
                           onChange={() => toggleContacted(l)} aria-label="Contacted" />
                  </td>
                  <td>
                    <div className={styles.bizName}>
                      {l.googleUrl
                        ? <a href={l.googleUrl} target="_blank" rel="noreferrer">{l.name}</a>
                        : l.name}
                    </div>
                    <div className={styles.bizMeta}>{[l.city, l.state].filter(Boolean).join(', ')}</div>
                    <button className={styles.schedule} onClick={() => openSchedule(l)}>
                      Schedule Discovery Call
                    </button>
                  </td>
                  <td className={styles.cat}>{l.category}</td>
                  <td>{l.phone ? <a href={`tel:${l.phone}`}>{l.phone}</a> : <span className={styles.dim}>—</span>}</td>
                  <td>
                    {l.hasWebsite
                      ? <a className={styles.badgeYes} href={l.website} target="_blank" rel="noreferrer">yes</a>
                      : <span className={styles.badgeNo}>none</span>}
                  </td>
                  <td>{l.rating ?? <span className={styles.dim}>—</span>}</td>
                  <td>{l.reviews ?? 0}</td>
                  <td>
                    <textarea
                      className={styles.notes}
                      placeholder="notes…"
                      value={noteDraft[l.id] !== undefined ? noteDraft[l.id] : (l.notes || '')}
                      onChange={(e) => setNoteDraft((d) => ({ ...d, [l.id]: e.target.value }))}
                      onBlur={() => saveNote(l)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
