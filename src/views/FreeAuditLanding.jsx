'use client';
import React, { useRef, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { usePostHog } from 'posthog-js/react';
import logo from '../images/logos/logo.png';
import styles from './FreeAuditLanding.module.css';

const PHONE_DISPLAY = '(404) 482-3190';
const PHONE_HREF    = 'tel:+14044823190';

const auditItems = [
  {
    title: 'A clear revenue picture',
    points: [
      'How much qualified traffic and how many leads you are missing each month',
      'The conversion gaps in your current digital presence that are costing you revenue',
      'What your online footprint is worth today versus what it should be generating',
    ],
  },
  {
    title: 'A competitive gap analysis',
    points: [
      'Where your top local competitors are ahead and the specific reasons why',
      'The gaps in your Google presence that are routing calls to competitors right now',
      'A realistic assessment of the distance between your current position and market leadership',
    ],
  },
  {
    title: 'A prioritized growth roadmap',
    points: [
      'A ranked list of actions ordered by revenue impact, not effort',
      'Realistic investment levels and timelines for each stage of growth',
      'A clear answer on where to focus first for the fastest return on investment',
    ],
  },
];

const tiers = [
  {
    name: 'Foundation',
    price: '$250',
    features: [
      'Google Business Profile setup and management',
      'On-Page SEO and Core Web Vitals fixes',
      'Custom 5-page website, mobile-friendly and SEO-optimised',
      'Unlimited support and updates',
    ],
  },
  {
    name: 'Momentum',
    price: '$750',
    featured: true,
    badge: 'Most Popular',
    inherits: 'Everything in Foundation, plus:',
    features: [
      'Google Ads setup and management',
      'GA4 and Search Console setup',
      'Local SEO setup and optimization',
    ],
  },
  {
    name: 'Authority',
    price: '$1,000',
    inherits: 'Everything in Momentum, plus:',
    features: [
      'Full admin dashboard',
      'Advanced advertising (Facebook, LinkedIn)',
      'Monthly performance report',
    ],
  },
];

const trust = [
  { n: '3x', l: 'Average increase in inbound calls from Google' },
  { n: '48h', l: 'Strategy session turnaround time' },
  { n: 'Month-to-month', l: 'No long-term contracts required' },
  { n: 'Boutique', l: 'A focused team, not a faceless agency' },
];

export default function FreeAuditLanding() {
  const posthog    = usePostHog();
  const formRef    = useRef(null);
  const [state, handleFormspree] = useForm('xdarqdkz');

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name:     'Free Audit Landing',
        content_category: 'Lead Generation',
      });
    }
  }, []);

  useEffect(() => {
    if (!state.succeeded) return;
    posthog?.capture('landing_form_submitted', { source: 'free-audit-lp' });
    if (typeof window !== 'undefined') {
      if (typeof window.gtag_report_conversion === 'function') window.gtag_report_conversion();
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    }
  }, [state.succeeded, posthog]);

  const handleSubmit = (e) => {
    const data = {
      firstname: e.target.firstname?.value,
      business:  e.target.business?.value,
      phone:     e.target.phone?.value,
      email:     e.target.email?.value,
      challenge: e.target.challenge?.value,
    };
    posthog?.capture('landing_form_submitted', { source: 'free-audit-lp', ...data });
    handleFormspree(e);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    formRef.current?.querySelector('input')?.focus();
  };

  return (
    <div className={styles.page}>

      {/* ── STICKY HEADER ── */}
      <header className={styles.header}>
        <a href="/" className={styles.headerLogo} aria-label="Turner Tech Solutions home">
          <img src={logo.src ?? logo} alt="" aria-hidden="true" className={styles.logoImg} />
          <span className={styles.headerBrand}>
            Turner Tech
            <small className={styles.headerSub}>Solutions</small>
          </span>
        </a>
        <a href={PHONE_HREF} className={styles.headerPhone}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          {PHONE_DISPLAY}
        </a>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>

          {/* LEFT: copy */}
          <div className={styles.heroCopy}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              B2B Digital Strategy
            </div>

            <h1 className={styles.heroTitle}>
              Your competitors are investing in digital. Here is what it is costing you to wait.
            </h1>

            <p className={styles.heroSub}>
              We work with local businesses serious about growth. Our digital strategy assessment
              covers your website, Google presence, and competitive landscape, then delivers a
              clear, prioritized roadmap for where to invest first.
            </p>

            <ul className={styles.trustPills} aria-label="Trust signals">
              <li className={styles.pill}>Transparent pricing</li>
              <li className={styles.pill}>Month-to-month</li>
              <li className={styles.pill}>Results-focused</li>
            </ul>

            <a href={PHONE_HREF} className={styles.heroPhoneCta}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Or speak with us directly: {PHONE_DISPLAY}
            </a>
          </div>

          {/* RIGHT: form */}
          <div className={styles.formWrap} ref={formRef}>
            {state.succeeded ? (
              <div className={styles.success}>
                <div className={styles.successIcon} aria-hidden="true">✦</div>
                <h2 className={styles.successTitle}>Request received.</h2>
                <p className={styles.successSub}>
                  We will review your business and reach out within 48 hours to schedule
                  your strategy session. Want to talk sooner?
                </p>
                <a href={PHONE_HREF} className={styles.successPhone}>{PHONE_DISPLAY}</a>
              </div>
            ) : (
              <>
                <div className={styles.formHeader}>
                  <div className={styles.formTitle}>Request a Strategy Session</div>
                  <div className={styles.formSub}>We assess your full digital presence and deliver a prioritized growth plan. We work with a select number of businesses at a time.</div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <input type="text" name="_gotcha" value="" onChange={() => {}} style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <input type="hidden" name="_source" value="ads-landing-free-audit" />

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lp-firstname">First name *</label>
                      <input
                        className={styles.input}
                        id="lp-firstname"
                        type="text"
                        name="firstname"
                        required
                        autoComplete="given-name"
                        placeholder="Alex"
                      />
                      <ValidationError prefix="First name" field="firstname" errors={state.errors} className={styles.fieldError} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lp-business">Business name *</label>
                      <input
                        className={styles.input}
                        id="lp-business"
                        type="text"
                        name="business"
                        required
                        autoComplete="organization"
                        placeholder="Acme Roofing"
                      />
                      <ValidationError prefix="Business name" field="business" errors={state.errors} className={styles.fieldError} />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lp-phone">Phone *</label>
                      <input
                        className={styles.input}
                        id="lp-phone"
                        type="tel"
                        name="phone"
                        required
                        autoComplete="tel"
                        placeholder="(770) 555-0100"
                      />
                      <ValidationError prefix="Phone" field="phone" errors={state.errors} className={styles.fieldError} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lp-email">Email *</label>
                      <input
                        className={styles.input}
                        id="lp-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="alex@acmeroofing.com"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} className={styles.fieldError} />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="lp-website">Website URL</label>
                    <input
                      className={styles.input}
                      id="lp-website"
                      type="url"
                      name="website"
                      autoComplete="url"
                      placeholder="https://yourbusiness.com"
                    />
                    <ValidationError prefix="Website" field="website" errors={state.errors} className={styles.fieldError} />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="lp-challenge">Biggest challenge right now</label>
                    <select className={styles.select} id="lp-challenge" name="challenge" defaultValue="">
                      <option value="" disabled>Choose one...</option>
                      <option value="no-website">No website or outdated website</option>
                      <option value="not-ranking">Not showing up on Google</option>
                      <option value="ads-not-converting">Running ads that are not converting</option>
                      <option value="all-of-above">All of the above</option>
                      <option value="not-sure">Not sure, that is why I am here</option>
                    </select>
                  </div>

                  <ValidationError errors={state.errors} className={styles.formError} />

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={state.submitting}
                  >
                    {state.submitting ? 'Sending...' : 'Request My Strategy Session →'}
                  </button>

                  <div className={styles.formFootnote}>
                    Prefer to call? <a href={PHONE_HREF} className={styles.formPhoneLink}>{PHONE_DISPLAY}</a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className={styles.trustBar} aria-label="Key facts">
        <div className={styles.trustInner}>
          {trust.map((t, i) => (
            <React.Fragment key={t.n}>
              {i > 0 && <div className={styles.trustDiv} aria-hidden="true" />}
              <div className={styles.trustStat}>
                <span className={styles.trustN}>{t.n}</span>
                <span className={styles.trustL}>{t.l}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── WHAT THE AUDIT COVERS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.eyebrow}>What you get</div>
          <h2 className={styles.sectionTitle}>A strategy session, not a sales pitch.</h2>
          <div className={styles.auditGrid}>
            {auditItems.map((item, i) => (
              <div key={item.title} className={styles.auditCard}>
                <div className={styles.auditNum} aria-hidden="true">0{i + 1}</div>
                <h3 className={styles.auditCardTitle}>{item.title}</h3>
                <ul className={styles.auditList}>
                  {item.points.map((p) => (
                    <li key={p} className={styles.auditItem}>
                      <span className={styles.auditItemDot} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className={styles.pricingSection}>
        <div className={styles.sectionInner}>
          <div className={styles.eyebrow}>Simple, transparent pricing</div>
          <h2 className={styles.sectionTitle}>One team. One monthly rate.</h2>
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
                      <span className={styles.tierCheck} aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`${styles.tierCta} ${tier.featured ? styles.tierCtaFeatured : ''}`}
                  onClick={scrollToForm}
                >
                  Get started with {tier.name}
                </button>
              </div>
            ))}
          </div>
          <p className={styles.pricingNote}>All plans include onboarding, setup, and a free audit · Cancel anytime</p>
        </div>
      </section>

      {/* ── SECOND CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.eyebrowCentered}>Your next step</div>
          <h2 className={styles.ctaTitle}>Ready to find out what growth looks like for your business?</h2>
          <p className={styles.ctaSub}>
            We put together a clear, prioritized plan. No jargon, no pressure. Just an honest look at what it will take to grow your digital presence and what it is costing you to wait.
          </p>
          <div className={styles.ctaActions}>
            <a href={PHONE_HREF} className={styles.ctaPhoneBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call {PHONE_DISPLAY}
            </a>
            <button className={styles.ctaFormBtn} onClick={scrollToForm}>
              Fill out the form above
            </button>
          </div>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ── */}
      <footer className={styles.footer}>
        <address className={styles.footerNap}>
          <strong>Turner Tech Solutions</strong>
          <span>1725 Township Cir, Alpharetta, GA 30004</span>
          <a href={PHONE_HREF} className={styles.footerPhone}>{PHONE_DISPLAY}</a>
        </address>
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} Turner Technologies · All rights reserved
        </span>
      </footer>

    </div>
  );
}
