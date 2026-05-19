import React, { useState } from 'react';
import styles from './Home.module.css';
import { usePostHog } from '@posthog/react';
// Empty currently but will be used to highlight 3-4 core services on the homepage, with the option to expand and show the full list of otherServices below.
const services = [

];

const stats = [
  { value: '100%', label: 'Custom built' },
  { value: '<3s', label: 'Load time target' },
  { value: '3+', label: 'Years engineering' },
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
  const posthog = usePostHog();

  const visibleServices = expanded ? otherServices : otherServices.slice(0, 3);

  const handleToggleServices = () => {
    const next = !expanded;
    setExpanded(next);
    posthog?.capture(next ? 'services_list_expanded' : 'services_list_collapsed');
  };

  return (
    <div className={styles.wrapper}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />

        <div className={styles.heroContent}>
          <div className={styles.heroTag}>Available for new projects</div>

          <h1 className={styles.heroTitle}>
            Engineering<br />
            websites that<br />
            <span>actually work.</span>
          </h1>

          <p className={styles.heroSub}>
            Turner Technologies builds fast, modern websites for small businesses,
            crafted by a team who understands both the code and the craft.
          </p>

          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => { posthog?.capture('cta_clicked', { cta_name: 'start_a_project' }); onNavigate('contact'); }}>
              Start a Project
            </button>
            <button className="btn-ghost" onClick={() => { posthog?.capture('cta_clicked', { cta_name: 'view_work' }); onNavigate('gallery'); }}>
              View Work
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

      {/* ── CORE SERVICES STRIP ── *** CURENTLY EMPTY */}
      <div className={styles.servicesStrip}>
        {services.map((s) => (
          <div key={s.title} className={styles.serviceCard}>
            <div className={styles.serviceIcon}>{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>

      {/* ── OTHER SERVICES ── */}
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
                <div className={styles.otherIcon}>{s.icon}</div>
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
            onClick={handleToggleServices}
          >
            {expanded ? '↑ Show less' : '↓ See all services'}
          </button>
          <button
            className={styles.ctaBtn}
            onClick={() => { posthog?.capture('cta_clicked', { cta_name: 'get_quote' }); onNavigate('contact'); }}
          >
            Get a Quote →
          </button>
        </div>
      </section>

    </div>
  );
}
