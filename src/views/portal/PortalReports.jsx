'use client';
// Reporting module: revenue influenced up top, then small-multiple
// trend charts per source with baseline-vs-current deltas. Staff
// get manual and CSV metric entry; the docs written here share IDs
// with the future API sync, so nothing changes when that lands.
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Papa from 'papaparse';
import { useClientScope } from '../../portal/ClientScope';
import {
  subscribeMetrics, saveMetricSnapshot, importMetricsCsv, monthLabel, monthKeyOf,
} from '../../portal/portalService';
import {
  METRIC_FIELDS, METRIC_SOURCE_LABELS, REPORT_EXPECTATIONS,
} from '../../portal/portalConstants';
import TrendChart, { Sparkline, fmtValue } from './charts/TrendChart';
import styles from './PortalReports.module.css';

const SOURCE_ORDER = ['gsc', 'gbp', 'rank', 'ga4', 'ai_visibility'];
const fmtMoney = (v) => `$${Math.round(v).toLocaleString('en-US')}`;

function groupBySource(metrics) {
  const map = {};
  (metrics || []).forEach((m) => {
    if (!map[m.source]) map[m.source] = [];
    map[m.source].push(m);
  });
  return map;
}

const baselineOf = (rows) => rows.find((r) => r.isBaseline) || rows[0];

export default function PortalReports() {
  const { clientId, client, isStaffView } = useClientScope();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!clientId) return undefined;
    return subscribeMetrics(clientId, setMetrics);
  }, [clientId]);

  if (!clientId) {
    return (
      <div className={styles.empty}>
        <div className="eyebrow">reports</div>
        <h1 className={styles.title}>No client selected</h1>
        <p className={styles.muted}>
          <Link className={styles.link} href="/portal/admin">Choose a client</Link> first.
        </p>
      </div>
    );
  }

  const bySource = groupBySource(metrics);
  const sources = SOURCE_ORDER.filter((s) => (bySource[s] || []).length > 0);

  return (
    <div className={styles.reports}>
      <header>
        <div className="eyebrow">reports</div>
        <h1 className={styles.title}>Is it working?</h1>
        <p className={styles.muted}>
          Every chart compares where you started with where you are now. SEO compounds:
          impressions rise before clicks, and clicks rise before calls and customers.
        </p>
      </header>

      {client && <RevenueHero client={client} bySource={bySource} />}

      {isStaffView && <StaffMetricsEntry clientId={clientId} />}

      {metrics === null && <div className={styles.loading}>// loading…</div>}
      {metrics !== null && sources.length === 0 && (
        <p className={styles.muted}>
          No reporting data yet. Numbers appear here after the first monthly snapshot.
        </p>
      )}

      {sources.map((source) => (
        <SourceSection key={source} source={source} rows={bySource[source]} />
      ))}
    </div>
  );
}

function DeltaChip({ latest, baseline, lowerIsBetter, neutral, decimals }) {
  if (neutral || latest == null || baseline == null) return null;
  const diff = latest - baseline;
  if (diff === 0) return <span className={styles.deltaFlat}>No change vs baseline</span>;
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  const arrow = diff > 0 ? '▲' : '▼';
  const text = baseline !== 0
    ? `${Math.abs(Math.round((diff / baseline) * 100))}%`
    : fmtValue(Math.abs(diff), decimals);
  return (
    <span className={good ? styles.deltaGood : styles.deltaBad}>
      {arrow} {text} vs baseline
    </span>
  );
}

function RevenueHero({ client, bySource }) {
  const metricPath = client.conversionMetric || 'gbp.calls';
  const [srcKey, fieldKey] = metricPath.split('.');
  const rows = (bySource[srcKey] || []).filter((r) => r.values && r.values[fieldKey] != null);
  const dealValue = Number(client.dealValue) || 0;
  if (rows.length === 0 || dealValue === 0) return null;

  const conv = rows.map((r) => r.values[fieldKey]);
  const revenues = conv.map((c) => c * dealValue);
  const latest = revenues[revenues.length - 1];
  const baseline = revenues[0];
  const total = revenues.reduce((a, b) => a + b, 0);
  const latestPeriod = rows[rows.length - 1].period;
  const fieldLabel = (METRIC_FIELDS[srcKey].find((f) => f.key === fieldKey) || {}).label || fieldKey;

  return (
    <section className={styles.heroRow}>
      <div className={styles.heroTile}>
        <span className={styles.tileLabel}>Estimated revenue influenced in {monthLabel(latestPeriod)}</span>
        <span className={styles.heroValue}>{fmtMoney(latest)}</span>
        <DeltaChip latest={latest} baseline={baseline} />
        <span className={styles.tileHint}>
          {fmtValue(conv[conv.length - 1])} {fieldLabel.toLowerCase()} × {fmtMoney(dealValue)} average value
        </span>
      </div>
      <div className={styles.tile}>
        <span className={styles.tileLabel}>{fieldLabel} in {monthLabel(latestPeriod)}</span>
        <span className={styles.tileValue}>{fmtValue(conv[conv.length - 1])}</span>
        <DeltaChip latest={conv[conv.length - 1]} baseline={conv[0]} />
        <Sparkline values={conv} />
      </div>
      <div className={styles.tile}>
        <span className={styles.tileLabel}>Total revenue influenced, all {rows.length} months</span>
        <span className={styles.tileValue}>{fmtMoney(total)}</span>
        <span className={styles.tileHint}>Since your baseline month, {monthLabel(rows[0].period)}</span>
        <Sparkline values={revenues} />
      </div>
    </section>
  );
}

function SourceSection({ source, rows }) {
  const fields = (METRIC_FIELDS[source] || []).filter(
    (f) => rows.some((r) => r.values && r.values[f.key] != null)
  );
  if (fields.length === 0) return null;
  const baseRow = baselineOf(rows);
  const lastRow = rows[rows.length - 1];

  return (
    <section className={styles.sourceSection}>
      <div className={styles.sourceHead}>
        <h2 className={styles.sourceTitle}>{METRIC_SOURCE_LABELS[source] || source}</h2>
        <span className={styles.sourceMeta}>
          Baseline {monthLabel(baseRow.period)} · Latest {monthLabel(lastRow.period)}
        </span>
      </div>
      {REPORT_EXPECTATIONS[source] && (
        <p className={styles.expectation}>{REPORT_EXPECTATIONS[source]}</p>
      )}

      <div className={styles.chartGrid}>
        {fields.map((f) => {
          const points = rows
            .filter((r) => r.values && r.values[f.key] != null)
            .map((r) => ({ period: r.period, value: r.values[f.key] }));
          const latest = points[points.length - 1].value;
          const base = (baseRow.values && baseRow.values[f.key] != null)
            ? baseRow.values[f.key] : points[0].value;
          return (
            <div key={f.key} className={styles.chartCard}>
              <div className={styles.chartHead}>
                <span className={styles.chartLabel}>{f.label}</span>
                <span className={styles.chartValue}>{fmtValue(latest, f.decimals || 0)}</span>
              </div>
              <DeltaChip
                latest={latest}
                baseline={base}
                lowerIsBetter={f.lowerIsBetter}
                neutral={f.neutral}
                decimals={f.decimals || 0}
              />
              <TrendChart
                points={points}
                decimals={f.decimals || 0}
                ariaLabel={`${f.label}: ${fmtValue(latest, f.decimals || 0)} in ${monthLabel(points[points.length - 1].period)}`}
              />
            </div>
          );
        })}
      </div>

      <details className={styles.tableDetails}>
        <summary>View data table</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                {fields.map((f) => <th key={f.key}>{f.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.period}>
                  <td>{monthLabel(r.period)}{r.isBaseline ? ' (baseline)' : ''}</td>
                  {fields.map((f) => (
                    <td key={f.key}>
                      {r.values && r.values[f.key] != null
                        ? fmtValue(r.values[f.key], f.decimals || 0)
                        : '–'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function StaffMetricsEntry({ clientId }) {
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('gsc');
  const [period, setPeriod] = useState(monthKeyOf());
  const [values, setValues] = useState({});
  const [flash, setFlash] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCsv = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const { imported, skipped } = await importMetricsCsv(clientId, result.data);
          setFlash(`Imported ${imported} monthly snapshots${skipped ? `, skipped ${skipped} bad rows` : ''}.`);
        } catch (err) {
          setFlash(`Import failed: ${err.message}`);
        }
      },
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const entries = Object.entries(values)
      .filter(([, v]) => v !== '' && !Number.isNaN(Number(v)))
      .map(([k, v]) => [k, Number(v)]);
    if (entries.length === 0) {
      setFlash('Enter at least one value.');
      return;
    }
    setBusy(true);
    try {
      await saveMetricSnapshot(clientId, {
        source, period, values: Object.fromEntries(entries),
      });
      setFlash(`Saved ${METRIC_SOURCE_LABELS[source]} for ${monthLabel(period)}.`);
      setValues({});
    } catch (err) {
      setFlash(`Save failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={styles.entry}>
      <div className={styles.entryHead}>
        <span className={styles.entryTitle}>Metric entry (staff only)</span>
        <div className={styles.entryActions}>
          <button className={styles.smallBtn} type="button" onClick={() => fileRef.current.click()}>
            Import CSV
          </button>
          <button className={styles.smallBtn} type="button" onClick={() => setOpen((s) => !s)}>
            {open ? 'Close manual entry' : 'Manual entry'}
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={handleCsv} />
      </div>
      <p className={styles.entryHint}>
        CSV columns: period,source,metric,value. Example row: {monthKeyOf()},gsc,clicks,210
      </p>

      {open && (
        <form className={styles.entryForm} onSubmit={submit}>
          <div className={styles.entryRow}>
            <select
              className={styles.input}
              value={source}
              onChange={(e) => { setSource(e.target.value); setValues({}); }}
            >
              {SOURCE_ORDER.map((s) => (
                <option key={s} value={s}>{METRIC_SOURCE_LABELS[s]}</option>
              ))}
            </select>
            <input
              className={styles.input}
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
            />
          </div>
          <div className={styles.entryRow}>
            {METRIC_FIELDS[source].map((f) => (
              <label key={f.key} className={styles.field}>
                <span>{f.label}</span>
                <input
                  className={styles.input}
                  type="number"
                  step="any"
                  min="0"
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </label>
            ))}
          </div>
          <button className={styles.addBtn} type="submit" disabled={busy}>
            {busy ? 'Saving…' : `Save ${monthLabel(period)}`}
          </button>
        </form>
      )}

      {flash && <p className={styles.flash} role="status">{flash}</p>}
    </section>
  );
}
