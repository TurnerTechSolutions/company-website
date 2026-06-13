import React, { useState } from 'react';
import styles from './ApexAutoDetail.module.css';

const services = [
  {
    name: 'Exterior Detail',
    price: 'From $149',
    desc: 'Hand wash, clay bar, polish, and ceramic spray sealant.',
    tag: 'Most Popular',
  },
  {
    name: 'Interior Detail',
    price: 'From $129',
    desc: 'Deep vacuum, steam clean, leather condition, and odor treatment.',
    tag: null,
  },
  {
    name: 'Full Detail',
    price: 'From $249',
    desc: 'Complete interior and exterior treatment. The works.',
    tag: 'Best Value',
  },
  {
    name: 'Ceramic Coating',
    price: 'From $599',
    desc: '2-year hydrophobic nano-ceramic protection layer.',
    tag: null,
  },
];

const stats = [
  { value: '500+', label: 'Cars Detailed' },
  { value: '4.9★', label: 'Google Rating' },
  { value: '2yr', label: 'Coating Warranty' },
];

export default function ApexAutoDetail() {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className={styles.wrapper}>

      {/* ── Nav ── */}
      <div className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            {/* Simple shield/diamond mark */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L16 4.5V9C16 12.5 13 15.5 9 17C5 15.5 2 12.5 2 9V4.5L9 1Z"
                fill="#3b82f6" opacity="0.9"/>
              <path d="M6 9l2 2 4-4" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>APEX<span className={styles.logoDot}> DETAIL</span></span>
        </div>
        <div className={styles.navLinks}>
          {['Services', 'Gallery', 'Pricing', 'Book Now'].map((l) => (
            <span key={l} className={l === 'Book Now' ? styles.navBook : ''}>{l}</span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        {/* Animated background lines */}
        <div className={styles.heroBg}>
          <div className={styles.heroBgLine1} />
          <div className={styles.heroBgLine2} />
          <div className={styles.heroBgGlow} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Atlanta's Premier Auto Detailing
          </div>
          <h2 className={styles.heroTitle}>
            Your car deserves<br />
            <span>showroom quality.</span>
          </h2>
          <p className={styles.heroSub}>
            Mobile detailing that comes to you. Professional-grade products,
            meticulous technique, flawless results, guaranteed.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary}>Book Your Detail</button>
            <button className={styles.btnGhost}>View Packages</button>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.heroStats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>// services</div>
          <div className={styles.tabs}>
            {['services', 'add-ons'].map((t) => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t === 'services' ? 'Packages' : 'Add-ons'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'services' ? (
          <div className={styles.serviceGrid}>
            {services.map((s) => (
              <div key={s.name} className={styles.serviceCard}>
                {s.tag && <div className={styles.serviceTag}>{s.tag}</div>}
                <div className={styles.serviceName}>{s.name}</div>
                <div className={styles.servicePrice}>{s.price}</div>
                <div className={styles.serviceDesc}>{s.desc}</div>
                <button className={styles.serviceBtn}>Book This →</button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.addOns}>
            {['Engine Bay Clean: $60', 'Headlight Restoration: $80',
              'Ozone Odor Treatment: $50', 'Paint Correction: $199',
              'Tire Shine & Dressing: $30', 'Pet Hair Removal: $45'].map((a) => (
              <div key={a} className={styles.addOnRow}>
                <span className={styles.addOnCheck}>✓</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Trust bar ── */}
      <div className={styles.trustBar}>
        {['Fully Insured', 'Mobile Service', 'Eco-Friendly Products',
          'Satisfaction Guaranteed', 'Same-Day Available'].map((t) => (
          <div key={t} className={styles.trustItem}>
            <span className={styles.trustDot} />
            {t}
          </div>
        ))}
      </div>

    </div>
  );
}
