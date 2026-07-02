import React, { useState } from 'react';
import styles from './Home.module.css';
import { usePostHog } from '@posthog/react';

const tiers = [
  {
    name: 'Starter',
    price: '$250',
    features: [
      'Google Business Profile setup & management',
      'On-Page SEO & Core Web Vitals fixes',
      'Custom 5-page website, mobile-friendly and SEO-optimised',
      'Unlimited support & updates',
    ],
  },
  {
    name: 'Growth',
    price: '$750',
    featured: true,
    badge: 'Most Popular',
    inherits: 'Everything in Starter, plus:',
    features: [
      'Google Ads setup & management',
      'GA4 & Search Console setup',
      'Local SEO setup & optimization',
    ],
  },
  {
    name: 'Pro',
    price: '$1000',
    inherits: 'Everything in Growth, plus:',
    features: [
      'Full admin dashboard',
      'Advanced advertising (Facebook · LinkedIn)',
      'Monthly performance report',
    ],
  },
];

const serviceIcons = {
  'Business Websites': (
    <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
  ),
  'Business Advertisement': (
    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  'Ongoing Support': (
    <svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
  ),
  'Local SEO Setup': (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  ),
  'SEO Foundations': (
    <svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
  ),
  'Google Analytics & Search Console': (
    <svg viewBox="0 0 24 24"><path d="M21 21H3V3"/><path d="m6 16 4-4 4 4 5-5"/></svg>
  ),
  'Speed & Performance': (
    <svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  'Social Media Integration': (
    <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
  ),
  'Domain & Hosting Setup': (
    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M2 12h20M12 2c-2.76 3.45-4 7-4 10s1.24 6.55 4 10M12 2c2.76 3.45 4 7 4 10s-1.24 6.55-4 10"/></svg>
  ),
};

const checkIcon = (
  <svg viewBox="0 0 16 16"><polyline points="2.5,8 6.5,12 13.5,4"/></svg>
);

const otherServices = [
  {
    title: 'Business Websites',
    description: 'Landing pages, portfolios, and multi-page sites tailored to convert visitors into customers.',
  },
  {
    title: 'Business Advertisement',
    description: 'Google Ads, Facebook, LinkedIn, and more. We\'ll get you in front of the right audience.',
  },
  {
    title: 'Ongoing Support',
    description: 'Monthly retainer plans covering Google account management, ad campaigns, content updates, and ongoing digital growth.',
  },
  {
    title: 'Local SEO Setup',
    description: 'Google Business Profile optimization, local keyword targeting, and schema markup so nearby customers find you first.',
    tag: 'Most requested',
  },
  {
    title: 'SEO Foundations',
    description: 'Technical SEO audit, meta tags, sitemap, robots.txt, and Core Web Vitals fixes baked in at launch, not bolted on later.',
  },
  {
    title: 'Google Analytics & Search Console',
    description: 'Full GA4 setup with conversion tracking, Search Console verification, and a plain-English dashboard you can actually use.',
  },
  {
    title: 'Speed & Performance',
    description: 'Image optimisation, lazy loading, caching, and CDN configuration. Fast sites rank higher and convert better.',
  },
  {
    title: 'Social Media Integration',
    description: 'Open Graph tags, Twitter cards, and social share previews so your links look polished when shared anywhere.',
  },
  {
    title: 'Domain & Hosting Setup',
    description: 'DNS configuration, HTTPS, and custom domain hookup, fully handled.',
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
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroContent}>
          {/* Left — copy */}
          <div className={styles.heroCopy}>
            <div className={styles.heroTag}>
              <span className={styles.heroTagDot} aria-hidden="true" />
              Digital Business Management
            </div>

            <h1 className={styles.heroTitle}>
              Stop letting your competitors grow<br />
              while your <span>business stands still.</span>
            </h1>

            <p className={styles.heroSub}>
              We manage your entire digital business.
              Google Business Profile, Google Ads, SEO, and your website.
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
              <div className={styles.heroStat}>
                <div className={styles.heroStatN}><b>3×</b></div>
                <div className={styles.heroStatL}>more calls from Google</div>
              </div>
              <div className={styles.heroStat}>
                <div className={styles.heroStatN}><b>Free</b></div>
                <div className={styles.heroStatL}>digital audit</div>
              </div>
              <div className={styles.heroStat}>
                <div className={styles.heroStatN}><b>Same-day</b></div>
                <div className={styles.heroStatL}>response</div>
              </div>
            </div>
          </div>

        </div>

        {/* Industry trust bar */}
        <div className={styles.industryBar}>
          <div className={styles.industryLabel}>Industries we serve</div>
          <div className={styles.industryPills}>
            {['Roofing', 'Restaurants', 'Real Estate', 'Auto Detail', 'Healthcare', 'Retail', 'Law Firms', 'Contractors'].map((i) => (
              <span key={i} className={styles.industryPill}>{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className={styles.otherSection}>
        <div className={styles.otherHeader}>
          <div>
            <div className={styles.otherLabel}>Core Services</div>
            <h2 className={styles.otherTitle}>
              Complete digital<br />business management.
            </h2>
          </div>
          <p className={styles.otherSub}>
            Google Business Profile, advertising, SEO, and a website that converts:
            everything it takes to grow your business online.
          </p>
        </div>

        <div className={styles.otherGrid}>
          {visibleServices.map((s, i) => (
            <div key={s.title} className={styles.otherCard}>
              <div className={styles.otherCardTop}>
                <span className={styles.otherCardNum}>0{i + 1}</span>
                {s.tag && <span className={styles.otherTag}>{s.tag}</span>}
              </div>
              <div className={styles.otherIcon} aria-hidden="true">
                {serviceIcons[s.title]}
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

      {/* ── PRICING ── */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={styles.pricingHeader}>
          <div className={styles.pricingLabel}>Pricing</div>
          <h2 className={styles.pricingTitle}>Simple, transparent pricing.</h2>
          <p className={styles.pricingSub}>No hidden fees. Start with a free audit.</p>
        </div>

        <div className={styles.pricingGrid}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`${styles.pricingCard} ${tier.featured ? styles.pricingCardFeatured : ''}`}
            >
              {tier.badge && <div className={styles.tierBadge}>{tier.badge}</div>}
              <div className={styles.tierName}>{tier.name}</div>
              <div className={styles.tierPrice}>{tier.price}<span>/mo</span></div>
              <hr className={styles.tierDivider} />
              {tier.inherits && <div className={styles.tierInherits}>{tier.inherits}</div>}
              <ul className={styles.tierFeatures}>
                {tier.features.map((f) => (
                  <li key={f} className={styles.tierFeature}>
                    <span className={styles.tierFeatureIcon} aria-hidden="true">
                      {checkIcon}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`${styles.tierCta} ${tier.featured ? styles.tierCtaFeatured : ''}`}
                onClick={() => {
                  posthog?.capture('cta_clicked', { cta_name: 'pricing_tier', tier: tier.name });
                  onNavigate('contact');
                }}
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>

        <p className={styles.pricingNote}>
          All plans include onboarding, setup, and a free audit · Cancel anytime
        </p>
      </section>

    </div>
  );
}
