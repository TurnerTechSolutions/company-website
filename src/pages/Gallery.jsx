import React, { useState, useEffect } from 'react';
import styles from './Gallery.module.css';
import { usePostHog } from '@posthog/react';

import ApexPlumbing   from '../snippets/ApexPlumbing';
import BloomStudio    from '../snippets/BloomStudio';
import EmberAndOak    from '../snippets/EmberAndOak';
import KestrelRealty  from '../snippets/KestrelRealty';
import DrElainePark   from '../snippets/DrElainePark';
import ApexAutoDetail from '../snippets/ApexAutoDetail';

const projects = [
  {
    id: 'apex',
    title: 'Apex Plumbing Co.',
    description: '5-page service site with booking form and Google Maps integration.',
    tag: 'Local Service',
    accent: '#00e5ff',
    component: ApexPlumbing,
  },
  {
    id: 'bloom',
    title: 'Bloom Studio',
    description: 'Floral shop with online ordering, delivery zones, and product gallery.',
    tag: 'E-Commerce',
    accent: '#7b61ff',
    component: BloomStudio,
  },
  {
    id: 'ember',
    title: 'Ember & Oak',
    description: 'Upscale dining site with menu, reservation system, and private events page.',
    tag: 'Restaurant',
    accent: '#f59e0b',
    component: EmberAndOak,
  },
  {
    id: 'park',
    title: 'Dr. Elaine Park',
    description: 'Consultant portfolio with speaking archive, publications, and contact form.',
    tag: 'Portfolio',
    accent: '#10b981',
    component: DrElainePark,
  },
  {
    id: 'kestrel',
    title: 'Kestrel Realty',
    description: 'Real estate landing page with property search and lead capture.',
    tag: 'Real Estate',
    accent: '#e53935',
    component: KestrelRealty,
  },
  {
    id: 'autodetail',
    title: 'Apex Auto Detail',
    description: 'Mobile detailing site with packages, add-ons, and booking.',
    tag: 'Automotive',
    accent: '#3b82f6',
    component: ApexAutoDetail,
  },
];

function Modal({ project, onClose }) {
  const Preview = project.component;

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <span className={styles.modalTag}>{project.tag}</span>
            <div className={styles.modalTitle}>{project.title}</div>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>
          <Preview />
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ onNavigate }) {
  const [active, setActive] = useState(null);
  const posthog = usePostHog();

  const handleProjectClick = (p) => {
    posthog?.capture('portfolio_project_previewed', {
      project_title: p.title,
      project_tag: p.tag,
    });
    setActive(p);
  };

  return (
    <div className={styles.wrapper}>
      <div className={`section ${styles.headerSection}`}>
        <div className="section-label">// work</div>
        <h2>Projects &amp;<br />case studies.</h2>
        <p className={styles.sub}>
          A selection of example sites — from local service businesses to
          professional portfolios. Tap any card to preview.
        </p>
      </div>

      <div className={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.card} onClick={() => handleProjectClick(p)}>
            <div className={styles.accentBar} style={{ background: p.accent }} />
            <div className={styles.cardTag}>{p.tag}</div>
            <div className={styles.cardTitle}>{p.title}</div>
            <div className={styles.cardDesc}>{p.description}</div>
            <div className={styles.cardFooter}>
              <span className={styles.cardArrow}>Preview →</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cta}>
        <p>
          Want to see more?{' '}
          <a onClick={() => onNavigate('contact')}>Get in touch →</a>
        </p>
      </div>

      {active && <Modal project={active} onClose={() => setActive(null)} />}
    </div>
  );
}
