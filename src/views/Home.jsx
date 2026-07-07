'use client';
import React, { useState } from 'react';
import styles from './Home.module.css';
import { usePostHog } from '@posthog/react';
import { useNav } from '../hooks/useNav';

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

const funnelSteps = [
  {
    tag: 'Top of Funnel',
    title: 'Advertising',
    desc: 'Google Ads and social campaigns put your business in front of customers who are actively searching and ready to spend.',
    icon: <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    tag: 'Middle of Funnel',
    title: 'Local SEO',
    desc: 'Organic search rankings capture intent-based traffic around the clock, without paying per click.',
    icon: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  },
  {
    tag: 'Bottom of Funnel',
    title: 'Website & Landing Pages',
    desc: 'Conversion-optimized pages that turn every visitor from ads or search into a call, booking, or lead.',
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>,
  },
];

const integratedBenefits = [
  {
    title: 'Faster Execution',
    desc: "When an ad isn't converting, we update the landing page that same day. No waiting on a separate web agency, no approval chains between vendors. One team acts as fast as your business needs.",
    icon: <svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  {
    title: 'A Funnel That Works Together',
    desc: 'Your ad copy, SEO keywords, and website messaging all speak the same language. Every touchpoint reinforces the next so nothing falls through the cracks between disconnected vendors.',
    icon: <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  },
  {
    title: 'Analytics That Sharpen Everything',
    desc: 'Ad click data reveals which search terms to target with SEO. Website behavior data improves how we write ad copy. One unified data loop makes every channel smarter over time.',
    icon: <svg viewBox="0 0 24 24"><path d="M21 21H3V3"/><path d="m6 16 4-4 4 4 5-5"/></svg>,
  },
];

const seoBenefits = [
  {
    title: 'Rank Higher on Google',
    desc: 'Appear at the top of search results when nearby customers look for your service. Higher ranking means more clicks, more calls, more revenue.',
    icon: <svg viewBox="0 0 24 24"><path d="M8 21h8m-4-4v4M17 3H7L5 9c0 3.314 3.134 6 7 6s7-2.686 7-6L17 3z"/><path d="M5 9H2.5a1.5 1.5 0 0 0 0 3 3.5 3.5 0 0 0 3.3-2.3M19 9h2.5a1.5 1.5 0 0 1 0 3 3.5 3.5 0 0 1-3.3-2.3"/></svg>,
  },
  {
    title: 'Attract Ready-to-Buy Customers',
    desc: 'SEO targets people actively searching for your service right now. These are warm leads who already need what you offer.',
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  },
  {
    title: 'Outrank Local Competitors',
    desc: "If your competitor shows up on Google and you don't, they get the call. SEO closes that gap and puts your business in front first.",
    icon: <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  },
  {
    title: 'Results That Compound',
    desc: 'Unlike ads that stop the moment you stop paying, SEO builds authority over time. The longer you invest, the stronger your ranking becomes.',
    icon: <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
];

const seoStats = [
  { n: '75%',  l: 'of users never scroll past the first page of Google results' },
  { n: '46%',  l: 'of all Google searches are looking for a local business' },
  { n: '28%',  l: 'of local searches lead to a purchase within 24 hours' },
];

const otherServices = [
  {
    title: 'Business Websites',
    description: 'Landing pages, portfolios, and multi-page sites tailored to convert visitors into customers.',
    link: 'healthcheck',
    linkLabel: 'Free health check →',
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
    link: 'seoaudit',
    linkLabel: 'Free SEO audit →',
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

export default function Home() {
  const navigate = useNav();
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
                  navigate('contact');
                }}
              >
                Schedule a Free Consultation →
              </button>
              <button
                className={styles.ctaSecondary}
                onClick={() => {
                  posthog?.capture('cta_clicked', { cta_name: 'what_is_seo', location: 'hero' });
                  navigate('whatisseo');
                }}
              >
                What is SEO?
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

      {/* ── SEO EXPLAINER ── */}
      <section className={styles.seoSection}>
        <div className={styles.seoInner}>
          <div className={styles.seoHeader}>
            <div className={styles.seoLabel}>What is SEO</div>
            <h2 className={styles.seoTitle}>
              When customers search,<br />will they find you or your competitor?
            </h2>
            <p className={styles.seoIntro}>
              SEO (Search Engine Optimization) is how your business shows up on Google when someone nearby searches for your service.
              Without it, you're invisible to the 3 out of 4 customers who look online before making a call.
            </p>
          </div>

          <div className={styles.seoBenefits}>
            {seoBenefits.map((b) => (
              <div key={b.title} className={styles.seoBenefit}>
                <div className={styles.seoBenefitIcon} aria-hidden="true">{b.icon}</div>
                <h3 className={styles.seoBenefitTitle}>{b.title}</h3>
                <p className={styles.seoBenefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.seoStats}>
            {seoStats.map((s, i) => (
              <React.Fragment key={s.n}>
                {i > 0 && <div className={styles.seoStatDiv} aria-hidden="true" />}
                <div className={styles.seoStat}>
                  <span className={styles.seoStatN}>{s.n}</span>
                  <span className={styles.seoStatL}>{s.l}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATED APPROACH ── */}
      <section className={styles.intSection}>
        <div className={styles.intInner}>

          <div className={styles.intHeader}>
            <div className={styles.intLabel}>The Integrated Approach</div>
            <h2 className={styles.intTitle}>
              One team managing everything<br />means faster results and fewer gaps.
            </h2>
            <p className={styles.intIntro}>
              Most businesses split their website, SEO, and ads across separate agencies.
              That creates delays, misaligned messaging, and blind spots in your data.
              We manage the entire funnel so every part works as one system.
            </p>
          </div>

          <div className={styles.funnelRow}>
            {funnelSteps.map((step, i) => (
              <React.Fragment key={step.title}>
                <div className={styles.funnelStep}>
                  <div className={styles.funnelStepTag}>{step.tag}</div>
                  <div className={styles.funnelStepIcon} aria-hidden="true">{step.icon}</div>
                  <div className={styles.funnelStepTitle}>{step.title}</div>
                  <p className={styles.funnelStepDesc}>{step.desc}</p>
                </div>
                {i < funnelSteps.length - 1 && (
                  <div className={styles.funnelArrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className={styles.intBenefits}>
            {integratedBenefits.map((b) => (
              <div key={b.title} className={styles.intBenefit}>
                <div className={styles.intBenefitIcon} aria-hidden="true">{b.icon}</div>
                <div>
                  <h3 className={styles.intBenefitTitle}>{b.title}</h3>
                  <p className={styles.intBenefitDesc}>{b.desc}</p>
                </div>
              </div>
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
              {s.link && (
                <button className={styles.cardLink} onClick={() => navigate(s.link)}>
                  {s.linkLabel}
                </button>
              )}
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
              navigate('contact');
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
                  navigate('contact');
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
