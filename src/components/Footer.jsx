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
            Digital business management for small businesses — Google, ads, SEO, and web. One team. One monthly rate.
          </p>
          {/* <p className={styles.brandLocation}>Alpharetta, GA</p> */}
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
          <p className={styles.ctaText}>Start with a free digital audit — no pitch, no pressure.</p>
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
