import React from 'react';
import styles from './SynkAnalytics.module.css';

const metrics = [
  { label: 'MRR',         value: '$48.2k', delta: '↑ 12% this mo.', positive: true },
  { label: 'Active users',value: '3,841',  delta: '↑ 8%',           positive: true },
  { label: 'Churn rate',  value: '1.4%',   delta: '↑ 0.2%',         positive: false },
  { label: 'NPS score',   value: '62',     delta: '↑ 5 pts',         positive: true },
];

// Bar heights as percentages
const bars = [30, 45, 38, 60, 52, 70, 65, 80, 75, 88, 82, 95];

export default function SynkAnalytics() {
  return (
    <div className={styles.wrapper}>
      {/* Nav */}
      <div className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoMark} />
          <div className={styles.logoText}>Synk</div>
        </div>
        <div className={styles.navCenter}>
          {['Product', 'Pricing', 'Docs', 'Blog'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className={styles.navRight}>
          <div className={styles.login}>Log in</div>
          <div className={styles.trial}>Start free trial</div>
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.badge}>Now in public beta</div>
        <h3>
          Analytics that <span>actually make sense</span>
          <br />for your team.
        </h3>
        <p>
          Synk connects your data sources and surfaces insights your team can
          act on. No SQL required.
        </p>
        <div className={styles.heroBtns}>
          <button className={styles.btnPrimary}>Start for free</button>
          <button className={styles.btnGhost}>See a demo</button>
        </div>
      </div>

      {/* Dashboard preview */}
      <div className={styles.dashboard}>
        <div className={styles.metricsRow}>
          {metrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue}>{m.value}</div>
              <div
                className={styles.metricDelta}
                style={{ color: m.positive ? '#34d399' : '#f87171' }}
              >
                {m.delta}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.chartArea}>
          {bars.map((h, i) => (
            <div
              key={i}
              className={styles.bar}
              style={{
                height: `${h}%`,
                opacity: i === bars.length - 1 ? 1 : 0.7,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
