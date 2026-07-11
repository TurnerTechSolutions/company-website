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
    title: 'Website performance',
    points: [
      'Page speed and Core Web Vitals',
      'Mobile responsiveness',
      'On-page SEO: titles, headings, meta descriptions',
    ],
  },
  {
    title: 'Google presence',
    points: [
      'Google Business Profile completeness and ranking',
      'Local map pack visibility',
      'Review signals and citation consistency',
    ],
  },
  {
    title: 'Competitive snapshot',
    points: [
      'How you stack up against 2 local competitors',
      'Keyword gaps you are missing',
      'Where your biggest opportunities are',
    ],
  },
];

const trust = [
  { n: 'Free', l: 'No cost, no obligation' },
  { n: 'Same day', l: 'Response within 24 hours' },
  { n: 'Local', l: 'Atlanta, GA team' },
  { n: 'No long term commitment', l: 'Month-to-month always' },
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
        <a href="/" className={styles.headerLogo} aria-label="Turner Tech Solutions — home">
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
              Free · No obligation · Alpharetta, GA
            </div>

            <h1 className={styles.heroTitle}>
              Find out exactly what's holding your business back online.
            </h1>

            <p className={styles.heroSub}>
              We audit your website, Google Business Profile, and local SEO rankings,
              then show you the exact gaps your competitors are exploiting.
              Takes 24 hours. Costs nothing.
            </p>

            <ul className={styles.trustPills} aria-label="Trust signals">
              <li className={styles.pill}>Same-day response</li>
              <li className={styles.pill}>No contract required</li>
              <li className={styles.pill}>Local Alpharetta team</li>
            </ul>

            <a href={PHONE_HREF} className={styles.heroPhoneCta}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Or call now: {PHONE_DISPLAY}
            </a>
          </div>

          {/* RIGHT: form */}
          <div className={styles.formWrap} ref={formRef}>
            {state.succeeded ? (
              <div className={styles.success}>
                <div className={styles.successIcon} aria-hidden="true">✦</div>
                <h2 className={styles.successTitle}>Request received.</h2>
                <p className={styles.successSub}>
                  We will review your business and send your audit within 24 hours.
                  Want to talk sooner?
                </p>
                <a href={PHONE_HREF} className={styles.successPhone}>{PHONE_DISPLAY}</a>
              </div>
            ) : (
              <>
                <div className={styles.formHeader}>
                  <div className={styles.formTitle}>Get your free audit</div>
                  <div className={styles.formSub}>We will review your business and respond within 24 hours.</div>
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
                    {state.submitting ? 'Sending...' : 'Get My Free Audit →'}
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
          <div className={styles.eyebrow}>What is included</div>
          <h2 className={styles.sectionTitle}>Three things we look at.</h2>
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

      {/* ── SECOND CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.eyebrowCentered}>Ready? It is free.</div>
          <h2 className={styles.ctaTitle}>Let us take a look at your business.</h2>
          <p className={styles.ctaSub}>
            No pitch, no pressure. Just an honest look at where you stand and what is worth fixing first.
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
