import React, { useState } from 'react';
import styles from './Home.module.css';
import { usePostHog } from '@posthog/react';

const stats = [
  // { value: '$300', label: '/month to start' },
  // { value: '<3s',  label: 'Load time target' },
  // { value: '100%', label: 'Custom built' },
  // { value: '3+',   label: 'Yrs engineering' },
];

const otherServices = [
  {
    icon: '//',
    title: 'Business Websites',
    description:
      'Landing pages, portfolios, and multi-page sites tailored to convert visitors into customers.',
  },
  {
    icon: '{ }',
    title: 'Business Advertisement',
    description:
      'Business advertisement setup and management. Google Ads, Facebook, LinkedIn, and more — we\’ll get you in front of the right audience.',
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

      
      {/* ── HERO — Option B: Dual CTA + Industry Trust Bar ── */}
<section className={styles.hero}>
  <div className={styles.heroGrid} aria-hidden="true" />
  <div className={styles.heroGlow} aria-hidden="true" />

  <div className={styles.heroContent}>
    <div className={styles.heroTag}>
      Digital Business Management
    </div>

    <h1 className={styles.heroTitle}>
      Stop losing customers<br />
      to a <span>better online presence.</span>
    </h1>

    <p className={styles.heroSub}>
      We build, manage, and grow your entire digital presence —
      websites, SEO, Google Ads, and Google Business Profile.
      One team. One monthly rate.
    </p>

    <div className={styles.heroCtas}>
      <button
        className={styles.ctaPrimary}
        onClick={() => {
          posthog?.capture('cta_clicked', { cta_name: 'free_consultation', location: 'hero' });
          onNavigate('contact');
        }}
      >
        Schedule a Free Consultation →
      </button>
      <button
        className={styles.ctaSecondary}
        onClick={() => {
          posthog?.capture('cta_clicked', { cta_name: 'see_work', location: 'hero' });
          onNavigate('gallery');
        }}
      >
        See our work
      </button>
    </div>

    <div className={styles.heroTrust}>
      {/* <span>No contracts</span> */}
      {/* <span className={styles.trustDot} aria-hidden="true" /> */}
      <span>Free audit</span>
      <span className={styles.trustDot} aria-hidden="true" />
      <span>Responds same day</span>
    </div>
  </div>

  <div className={styles.industryBar}>
    <div className={styles.industryLabel}>
      Trusted by Atlanta small businesses in
    </div>
    <div className={styles.industryPills}>
      {['Roofing', 'Restaurants', 'Real Estate', 'Auto Detail', 'Healthcare', 'Retail', 'Law Firms', 'Contractors'].map((i) => (
        <span key={i} className={styles.industryPill}>{i}</span>
      ))}
    </div>
  </div>

  <div className={styles.heroStrip}>
    <p className={styles.heroStripText}>
      <strong>80% of your competitors</strong> don't have a proper website.
      Be the one that does — free audit, no commitment, responds same day.
    </p>
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
            onClick={handleToggleServices}
            aria-expanded={expanded}
          >
            {expanded ? '↑ Show less' : '↓ See all services'}
          </button>
          <button
            className={styles.ctaBtn}
            onClick={() => {
              posthog?.capture('cta_clicked', { cta_name: 'get_quote' });
              onNavigate('contact');
            }}
          >
            Get a Quote →
          </button>
        </div>
      </section>

    </div>
  );
}
