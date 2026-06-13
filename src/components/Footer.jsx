import React from 'react';
import styles from './Footer.module.css';

const services = ['Business Websites', 'Google Ads', 'Local SEO', 'Google Business Profile', 'Analytics Setup', 'Ongoing Support'];
const company  = ['Home', 'Work', 'Contact', 'Health Check'];
const companyPages = { 'Home': 'home', 'About': 'about', 'Work': 'gallery', 'Contact': 'contact', 'Health Check': 'healthcheck' };

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.inner}>

        {/* ── Brand column ── */}
        <div className={styles.brand}>
          <button className={styles.brandLogo} onClick={() => onNavigate('home')} aria-label="Go to home">
            {/* <span className={styles.brandMark} aria-hidden="true">T</span> */}
            <span className={styles.brandName}>
              Turner Tech
              <small className={styles.brandSub}>Solutions</small>
            </span>
          </button>
          <p className={styles.brandDesc}>
            Digital business management for small businesses: Google, ads, SEO, and web. One team. One monthly rate.
          </p>
          <div className={styles.socials}>
            <a
              href="https://www.linkedin.com/company/turner-tech-solutions"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label="Turner Tech Solutions on LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61590196720556"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label="Turner Tech Solutions on Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Services links ── */}
        <div className={styles.col}>
          <div className={styles.colLabel}>Services</div>
          <ul className={styles.colLinks} role="list">
            {services.map((s) => (
              <li key={s}><button className={styles.link} onClick={() => onNavigate('contact')}>{s}</button></li>
            ))}
          </ul>
        </div>

        {/* ── Company links ── */}
        <div className={styles.col}>
          <div className={styles.colLabel}>Company</div>
          <ul className={styles.colLinks} role="list">
            {company.map((c) => (
              <li key={c}><button className={styles.link} onClick={() => onNavigate(companyPages[c])}>{c}</button></li>
            ))}
          </ul>
        </div>

        {/* ── Get started ── */}
        <div className={styles.col}>
          <div className={styles.colLabel}>Get Started</div>
          <p className={styles.ctaText}>Start with a free digital audit. No pitch, no pressure.</p>
          <button className={styles.ctaBtn} onClick={() => onNavigate('contact')}>
            Free Audit →
          </button>
          <button className={styles.link} style={{ marginTop: '10px', display: 'block' }} onClick={() => onNavigate('healthcheck')}>
            Digital Health Check
          </button>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bar}>
        <span className={styles.copy}>© {year} Turner Technologies · All rights reserved</span>
        <div className={styles.legal}>
          <button className={styles.legalLink} onClick={() => onNavigate('privacy')}>Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
}
