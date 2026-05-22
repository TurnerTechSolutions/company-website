import React, { useState, useEffect, useRef } from 'react';
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

function Modal({ project, onClose, triggerRef }) {
  const Preview  = project.component;
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      triggerRef?.current?.focus();
    };
  }, [onClose, triggerRef]);

  useEffect(() => {
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <span className={styles.modalTag}>{project.tag}</span>
            <div className={styles.modalTitle} id="modal-title">{project.title}</div>
          </div>
          <button
            ref={closeRef}
            className={styles.modalClose}
            onClick={onClose}
            aria-label={`Close ${project.title} preview`}
          >
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
  const triggerRef          = useRef(null);   // ← tracks which card was clicked
  const posthog             = usePostHog();

  const handleProjectClick = (p, e) => {
    triggerRef.current = e.currentTarget;     // ← store the clicked card element
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
          <div
            key={p.id}
            className={styles.card}
            onClick={(e) => handleProjectClick(p, e)}  // ← pass event
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleProjectClick(p, e)}
            aria-label={`Preview ${p.title}`}
          >
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

      {active && (
        <Modal
          project={active}
          onClose={() => setActive(null)}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
}