import React, { useState } from 'react';
import styles from './Home.module.css';

const stats = [
  { value: '$300', label: '/month to start' },
  { value: '<3s',  label: 'Load time target' },
  { value: '100%', label: 'Custom built' },
];

const otherServices = [
  {
    icon: '{ }',
    title: 'Custom Development',
    description:
      'Hand-coded sites built with modern frameworks — React, Next.js, or clean HTML/CSS. No bloated page builders.',
  },
  {
    icon: '//',
    title: 'Business Websites',
    description:
      'Landing pages, portfolios, and multi-page sites tailored to convert visitors into customers.',
  },
  {
    icon: '≈',
    title: 'Ongoing Support',
    description:
      'Monthly retainer plans for updates, API integrations, and keeping your site sharp.',
  },
  {
    icon: '◎',
    title: 'Local SEO Setup',
    description:
      'Google Business Profile optimization, local keyword targeting, and schema markup so nearby customers find you first.',
    tag: 'Most requested',
  },
  {
    icon: '↗',
    title: 'SEO Foundations',
    description:
      'Technical SEO audit, meta tags, sitemap, robots.txt, and Core Web Vitals fixes baked in at launch, not bolted on later.',
    tag: null,
  },
  {
    icon: '⬡',
    title: 'Google Analytics & Search Console',
    description:
      'Full GA4 setup with conversion tracking, Search Console verification, and a plain-English dashboard you can actually use.',
    tag: null,
  },
  {
    icon: '◈',
    title: 'Speed & Performance',
    description:
      'Image optimisation, lazy loading, caching, and CDN configuration. Fast sites rank higher and convert better.',
    tag: null,
  },
  {
    icon: '⊞',
    title: 'Social Media Integration',
    description:
      'Open Graph tags, Twitter cards, and social share previews so your links look polished when shared anywhere.',
    tag: null,
  },
  {
    icon: '◻',
    title: 'Domain & Hosting Setup',
    description:
      'DNS configuration, HTTPS, and custom domain hookup, fully handled.',
    tag: null,
  },
];

export default function Home({ onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const visibleServices = expanded ? otherServices : otherServices.slice(0, 3);

  return (
    <div className={styles.wrapper}>

      {/* ── HERO — Option 2: Pain-first ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />

        <div className={styles.heroContent}>
          <div className={styles.heroTag}>Available for new projects</div>

          <h1 className={styles.heroTitle}>
            Losing Customers to<br />
            a <span>Bad Website?</span>
          </h1>

          <p className={styles.heroSub}>
            If your site is slow, hard to navigate, or doesn't show up on Google —
            visitors leave in under 3 seconds. We fix that. Custom-built sites,
            SEO baked in, zero page builders.
          </p>

          {/* Stat callout */}
          <div className={styles.heroStat}>
            <span className={styles.heroStatIcon} aria-hidden="true">↗</span>
            <p className={styles.heroStatText}>
              <strong>Small businesses lose 30% of potential customers</strong> to a
              poor website experience.
            </p>
          </div>

          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => onNavigate('contact')}>
              Get a Free Site Audit
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('healthcheck')}>
              Digital Health Check
            </button>
          </div>

          <div className={styles.heroStats}>
            {stats.map((s) => (
              <div key={s.label}>
                <div className={styles.statNum}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className={styles.otherSection}>
        <div className={styles.otherHeader}>
          <div>
            <div className={styles.otherLabel}>// Core Services</div>
            <h2 className={styles.otherTitle}>
              Everything your online<br />presence needs.
            </h2>
          </div>
          <p className={styles.otherSub}>
            Beyond the build — the digital foundations that make small businesses
            discoverable, credible, and competitive.
          </p>
        </div>

        <div className={styles.otherGrid}>
          {visibleServices.map((s) => (
            <div key={s.title} className={styles.otherCard}>
              <div className={styles.otherCardTop}>
                <div className={styles.otherIcon} aria-hidden="true">{s.icon}</div>
                {s.tag && <span className={styles.otherTag}>{s.tag}</span>}
              </div>
              <h3 className={styles.otherCardTitle}>{s.title}</h3>
              <p className={styles.otherCardDesc}>{s.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.otherFooter}>
          <button
            className={styles.expandBtn}
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
          >
            {expanded ? '↑ Show less' : '↓ See all services'}
          </button>
          <button
            className={styles.ctaBtn}
            onClick={() => onNavigate('contact')}
          >
            Get a Quote →
          </button>
        </div>
      </section>

    </div>
  );
}
