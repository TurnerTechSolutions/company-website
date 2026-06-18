import React, { useState, useEffect, useRef } from 'react';
import styles from './SeoAudit.module.css';
import { usePostHog } from '@posthog/react';
import { track } from '@vercel/analytics';

/* ── Helpers ─────────────────────────────────────────────────── */

const GRADE_COLORS = { A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', F: '#ef4444' };

function gradeBase(g) { return (g || '').charAt(0).toUpperCase(); }
function gradeColor(g) { return GRADE_COLORS[gradeBase(g)] || '#8c9aa1'; }

function normalizeUrl(raw) {
  const s = raw.trim();
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

const CHECK_LABELS = {
  title: 'Title Tag', description: 'Meta Description', headers: 'Header Tags',
  keywords: 'Keyword Usage', contentLength: 'Content Length', imageAlt: 'Image Alt Text',
  backlinks: 'Backlinks', onPageLinks: 'On-Page Links', brokenLinks: 'Broken Links',
  friendlyUrls: 'Friendly URLs', robotsTxt: 'Robots.txt', sitemap: 'XML Sitemap',
  analytics: 'Analytics Tool', serverResponseTime: 'Server Response Time',
  pageSize: 'Page Size', numberOfResources: 'Resource Count',
  javascriptErrors: 'JavaScript Errors', gzip: 'GZIP Compression',
  optimizedImages: 'Image Optimization', minified: 'Minified CSS & JS',
  deprecated: 'Deprecated HTML Tags', inlineCss: 'Inline CSS',
  deviceRendering: 'Device Rendering', mobileViewport: 'Mobile Viewport',
  flash: 'Flash Content', iframe: 'iFrame Usage', favicon: 'Favicon',
  legibleFonts: 'Font Legibility', tapTargetSizing: 'Tap Target Sizes',
  sslEnabled: 'SSL Certificate', httpsRedirect: 'HTTPS Redirect',
  malware: 'Malware Check', outdatedApps: 'Outdated Software', email: 'Email Exposure',
};

const CATEGORIES = [
  { key: 'seo',         label: 'SEO',         desc: 'Title tags, meta descriptions, keywords, links, and crawlability.' },
  { key: 'performance', label: 'Performance',  desc: 'Page speed, file sizes, compression, and resource count.' },
  { key: 'ui',          label: 'Usability',    desc: 'Mobile-friendliness, viewport, fonts, and tap target sizes.' },
  { key: 'security',    label: 'Security',     desc: 'HTTPS, redirect, malware, and email exposure checks.' },
];

const LOADING_STEPS = [
  'Fetching your page...', 'Analysing title tags and meta data...',
  'Testing mobile-friendliness...', 'Measuring page speed...',
  'Scanning security headers...', 'Reviewing link structure...',
  'Calculating your score...',
];

function isCheck(val) {
  return val !== null && typeof val === 'object' && 'section' in val && 'passed' in val && 'shortAnswer' in val;
}

function groupChecks(output) {
  const groups = { seo: [], performance: [], ui: [], security: [] };
  for (const [key, val] of Object.entries(output || {})) {
    if (!isCheck(val)) continue;
    const section = val.section === 'performance' ? 'performance'
      : val.section === 'ui'          ? 'ui'
      : val.section === 'security'    ? 'security'
      : val.section === 'seo'         ? 'seo'
      : null;
    if (section) groups[section].push({ key, label: CHECK_LABELS[key] || key, ...val });
  }
  return groups;
}

/* ── Sub-components ──────────────────────────────────────────── */

function AuditForm({ onSubmit, disabled }) {
  const [url, setUrl] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!url.trim()) { setErr('Please enter a website URL.'); return; }
    setErr('');
    onSubmit(normalizeUrl(url.trim()));
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formTag}>
        <span className={styles.formTagDot} aria-hidden="true" />
        Free SEO Audit Tool
      </div>
      <h1 className={styles.formTitle}>How does your website<br />actually score?</h1>
      <p className={styles.formSub}>
        Instant audit across SEO, performance, usability, and security.
        No signup required.
      </p>
      <form onSubmit={submit} className={styles.form} noValidate>
        <div className={styles.inputRow}>
          <div className={styles.inputBox}>
            <span className={styles.inputPrefix} aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </span>
            <input
              type="text"
              className={styles.urlInput}
              placeholder="yourbusiness.com"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setErr(''); }}
              aria-label="Website URL to audit"
              disabled={disabled}
              autoFocus
              autoComplete="url"
            />
          </div>
          <button type="submit" className={styles.auditBtn} disabled={disabled}>
            {disabled ? 'Scanning...' : 'Audit My Site'}
          </button>
        </div>
        {err && <p className={styles.inputErr} role="alert">{err}</p>}
      </form>
      <div className={styles.coverageRow}>
        {CATEGORIES.map((c) => <span key={c.key} className={styles.coveragePill}>{c.label}</span>)}
      </div>
    </div>
  );
}

function AuditLoading({ url }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 4000);
    return () => clearInterval(id);
  }, []);
  const pct = Math.round(((step + 1) / LOADING_STEPS.length) * 90);
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner} aria-hidden="true" />
      <p className={styles.loadingUrl}>Auditing <strong>{url.replace(/^https?:\/\//, '')}</strong></p>
      <p className={styles.loadingStep}>{LOADING_STEPS[step]}</p>
      <div className={styles.loadingBar} role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        <div className={styles.loadingFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.loadingNote}>Reports typically take 30-60 seconds.</p>
    </div>
  );
}

function CheckRow({ check }) {
  const passed = check.passed;
  const icon   = passed === true ? '✓' : passed === false ? '✗' : '–';
  const color  = passed === true ? '#22c55e' : passed === false ? '#ef4444' : '#8c9aa1';
  return (
    <div className={`${styles.checkRow} ${passed === false ? styles.checkRowFail : ''}`}>
      <span className={styles.checkIcon} style={{ color }} aria-hidden="true">{icon}</span>
      <div className={styles.checkBody}>
        <div className={styles.checkTitle}>{check.label}</div>
        {check.shortAnswer && <div className={styles.checkAnswer}>{check.shortAnswer}</div>}
        {check.recommendation && (
          <div className={styles.checkRec}>Fix: {check.recommendation}</div>
        )}
      </div>
    </div>
  );
}

function AuditResults({ output, scores, recommendations, url, onReset, onNavigate }) {
  const [openCat, setOpenCat] = useState(null);
  const checkGroups = groupChecks(output);
  const overall     = scores?.overall || {};
  const overallColor = gradeColor(overall.grade);

  const failCount = Object.values(checkGroups).flat().filter((c) => c.passed === false).length;

  return (
    <div className={styles.results}>

      {/* ── Score header ── */}
      <div className={styles.resultsHeader}>
        <div className={styles.scoreRingWrap}>
          <div className={styles.scoreRing} style={{ borderColor: overallColor }}>
            <div className={styles.scoreGrade} style={{ color: overallColor }}>{overall.grade || '?'}</div>
            <div className={styles.scoreLabel}>overall</div>
          </div>
        </div>
        <div className={styles.resultsMeta}>
          <h2 className={styles.resultsUrl}>{url.replace(/^https?:\/\//, '')}</h2>
          {overall.title && <p className={styles.overallTitle}>{overall.title}</p>}
          {failCount > 0 && (
            <p className={styles.issueCount}>
              <strong>{failCount} issue{failCount !== 1 ? 's' : ''}</strong> found that may be hurting your rankings.
            </p>
          )}
          <button className={styles.resetBtn} onClick={onReset}>← Audit another site</button>
        </div>
      </div>

      {/* ── Category score cards ── */}
      <div className={styles.catGrid}>
        {CATEGORIES.map((c) => {
          const catScore = scores?.[c.key] || {};
          const color    = gradeColor(catScore.grade);
          const isOpen   = openCat === c.key;
          const checks   = checkGroups[c.key] || [];
          const fails    = checks.filter((ch) => ch.passed === false).length;
          return (
            <div key={c.key} className={styles.catCard} style={{ '--cat-color': color }}>
              <button
                className={`${styles.catCardBtn} ${isOpen ? styles.catCardBtnOpen : ''}`}
                onClick={() => setOpenCat(isOpen ? null : c.key)}
                aria-expanded={isOpen}
              >
                <div className={styles.catTop}>
                  <div className={styles.catGrade} style={{ color }}>{catScore.grade || '?'}</div>
                  <div className={styles.catInfo}>
                    <div className={styles.catLabel}>{c.label}</div>
                    {fails > 0 && (
                      <div className={styles.catFails}>{fails} issue{fails !== 1 ? 's' : ''}</div>
                    )}
                  </div>
                  <span className={styles.catChevron} aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div className={styles.catDetail}>
                  <p className={styles.catDesc}>{c.desc}</p>
                  {catScore.title && <p className={styles.catVerdict}>{catScore.title}</p>}
                  <div className={styles.checkList}>
                    {checks.map((ch) => <CheckRow key={ch.key} check={ch} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Recommendations ── */}
      {recommendations?.length > 0 && (
        <div className={styles.recsSection}>
          <div className={styles.recsHeader}>
            <div className="section-label">// recommendations</div>
            <h3 className={styles.recsTitle}>What to fix first</h3>
          </div>
          <div className={styles.recsList}>
            {recommendations.map((r, i) => (
              <div key={i} className={`${styles.recRow} ${r.priority === 'high' ? styles.recHigh : styles.recLow}`}>
                <span className={styles.recPriority}>{r.priority}</span>
                <div>
                  <div className={styles.recSection}>{r.section}</div>
                  <div className={styles.recText}>{r.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className={styles.resultsCta}>
        <div className={styles.resultsCtaInner}>
          <div className="section-label">// want these fixed?</div>
          <h3 className={styles.resultsCtaTitle}>We fix what's holding your site back.</h3>
          <p className={styles.resultsCtaText}>
            Turner Tech handles the SEO, speed fixes, Google Business Profile, and ads
            so your site doesn't just score higher, it converts better too.
            Free consultation, no pressure.
          </p>
          <div className={styles.resultsCtaBtns}>
            <button className={styles.resultsCtaBtn} onClick={() => onNavigate('contact')}>
              Get a Free Consultation →
            </button>
            <button className={styles.resetBtnLight} onClick={onReset}>Audit another site</button>
          </div>
        </div>
      </div>

    </div>
  );
}

function AuditError({ message, onReset }) {
  return (
    <div className={styles.errorBox}>
      <div className={styles.errorIcon} aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h3>Audit could not complete</h3>
      <p>{message || 'Something went wrong. Please check the URL and try again.'}</p>
      <button className={styles.resetBtn} onClick={onReset}>← Try again</button>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */

export default function SeoAudit({ onNavigate }) {
  const [phase,     setPhase]     = useState('idle');
  const [auditUrl,  setAuditUrl]  = useState('');
  const [reportId,  setReportId]  = useState(null);
  const [output,    setOutput]    = useState(null);
  const [scores,    setScores]    = useState(null);
  const [recs,      setRecs]      = useState([]);
  const [errMsg,    setErrMsg]    = useState('');
  const posthog = usePostHog();

  const pollRef    = useRef(null);
  const timeoutRef = useRef(null);

  const stopPolling = () => {
    clearInterval(pollRef.current);
    clearTimeout(timeoutRef.current);
  };

  useEffect(() => () => stopPolling(), []);

  const startPolling = (id) => {
    const poll = async () => {
      try {
        const res  = await fetch(`/api/seo-get?id=${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) return;

        const report = json.data;
        if (report?.completed_at && report?.output?.success) {
          stopPolling();
          setOutput(report.output);
          setScores(report.output.scores);
          setRecs(report.output.recommendations || []);
          setPhase('success');
          track('SEO Audit Completed');
          posthog?.capture('seo_audit_completed', { grade: report.output.scores?.overall?.grade });
        }
      } catch (_) {}
    };

    poll();
    pollRef.current    = setInterval(poll, 6000);
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setErrMsg('The audit timed out. Please try again.');
      setPhase('error');
    }, 150000);
  };

  const runAudit = async (url) => {
    stopPolling();
    setAuditUrl(url);
    setPhase('loading');
    setOutput(null);
    setScores(null);
    setRecs([]);
    setErrMsg('');
    track('SEO Audit Started');
    posthog?.capture('seo_audit_started', { url });

    try {
      const res  = await fetch('/api/seo-create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to start the audit. Please try again.');
      }

      const id = json.data?.id;
      if (!id) throw new Error('No report ID returned. Please try again.');

      setReportId(id);
      startPolling(id);
    } catch (err) {
      setErrMsg(err.message);
      setPhase('error');
      posthog?.capture('seo_audit_error', { url, error: err.message });
    }
  };

  const reset = () => {
    stopPolling();
    setPhase('idle');
    setOutput(null);
    setScores(null);
    setRecs([]);
    setAuditUrl('');
    setReportId(null);
    setErrMsg('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>

        {phase === 'idle' && <AuditForm onSubmit={runAudit} disabled={false} />}

        {phase === 'loading' && (
          <>
            <AuditForm onSubmit={runAudit} disabled={true} />
            <AuditLoading url={auditUrl} />
          </>
        )}

        {phase === 'error' && (
          <>
            <AuditForm onSubmit={runAudit} disabled={false} />
            <AuditError message={errMsg} onReset={reset} />
          </>
        )}

        {phase === 'success' && (
          <AuditResults
            output={output}
            scores={scores}
            recommendations={recs}
            url={auditUrl}
            onReset={reset}
            onNavigate={onNavigate}
          />
        )}

      </div>
    </div>
  );
}
