import React, { useState, useEffect, useRef } from 'react';
import styles from './Gallery.module.css';
import { usePostHog } from '@posthog/react';

import ApexPlumbing   from '../snippets/ApexPlumbing';
import BloomStudio    from '../snippets/BloomStudio';
import EmberAndOak    from '../snippets/EmberAndOak';
import KestrelRealty  from '../snippets/KestrelRealty';
import DrElainePark   from '../snippets/DrElainePark';
import ApexAutoDetail from '../snippets/ApexAutoDetail';
import petalandpour   from '../images/sites/petalandpourco.com_.png';
import elevationlandscaping from '../images/sites/elevationlandscaping.png';
import ejmobilemechanics from '../images/sites/ejmobilemechanic.png';

/* ─────────────────────────────────────────────────────────
   EXAMPLE PROJECTS — snippet previews
───────────────────────────────────────────────────────── */
const projects = [
  { id: 'apex',       title: 'Apex Plumbing Co.',  description: '5-page service site with booking form and Google Maps integration.', tag: 'Local Service', accent: '#00e5ff', component: ApexPlumbing   },
  { id: 'bloom',      title: 'Bloom Studio',        description: 'Floral shop with online ordering, delivery zones, and product gallery.', tag: 'E-Commerce',   accent: '#7b61ff', component: BloomStudio    },
  { id: 'ember',      title: 'Ember & Oak',         description: 'Upscale dining site with menu, reservation system, and private events page.', tag: 'Restaurant',  accent: '#f59e0b', component: EmberAndOak    },
  { id: 'park',       title: 'Dr. Elaine Park',     description: 'Consultant portfolio with speaking archive, publications, and contact form.', tag: 'Portfolio',   accent: '#10b981', component: DrElainePark   },
  { id: 'kestrel',    title: 'Kestrel Realty',      description: 'Real estate landing page with property search and lead capture.', tag: 'Real Estate', accent: '#e53935', component: KestrelRealty   },
  { id: 'autodetail', title: 'Apex Auto Detail',    description: 'Mobile detailing site with packages, add-ons, and booking.', tag: 'Automotive',  accent: '#3b82f6', component: ApexAutoDetail  },
];

/* ─────────────────────────────────────────────────────────
   LIVE SITES — add new clients here as an object in the array.
   Fields:
     id         — unique string key
     title      — site / business name
     description— one-line description
     tag        — industry label
     url        — full live URL (https://...)
     screenshot — path to image in /public/screenshots/ OR null for placeholder
     accent     — brand color for the accent bar
     tech       — array of tech tags (optional)

   Carousel activates automatically when liveSites.length > 3.
───────────────────────────────────────────────────────── */
const liveSites = [
  {
    id: 'petalandpour',
    title: 'Petal & Pour',
    description: 'Boutique Pop-up Coffee Shop in Zephyrhills, FL.',
    tag: 'Food & Beverage',
    url: 'https://petalandpourco.com',
    screenshot: petalandpour, // replace with '/screenshots/churros.png' once you have it
    accent: 'rgb(201, 122, 140)',
    // tech: ['React','Vite', 'Vercel', 'Formspree'],
  },
  {
    id: 'elevationlandscaping',
    title: 'Elevation Landscaping',
    description: 'Luxury landscaping company serving Sacramento, CA.',
    tag: 'Landscaping',
    url: 'https://www.elevationlandscapingca.com',
    screenshot: elevationlandscaping,
    accent: '#2d6a4f',
  },
  {
    id: 'ejmobilemechanics',
    title: 'E&J Mobile Mechanics',
    description: 'ASE certified mobile mechanic serving Sacramento and Yuba City, CA.',
    tag: 'Automotive',
    url: 'https://www.ejmobilemechanicca.com',
    screenshot: ejmobilemechanics,
    accent: '#56ae5a',
  },
];

/* ─────────────────────────────────────────────────────────
   MODAL — for example project previews
───────────────────────────────────────────────────────── */
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
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <span className={styles.modalTag}>{project.tag}</span>
            <div className={styles.modalTitle} id="modal-title">{project.title}</div>
          </div>
          <button ref={closeRef} className={styles.modalClose} onClick={onClose} aria-label={`Close ${project.title} preview`}>✕</button>
        </div>
        <div className={styles.modalBody}><Preview /></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LIVE SITE CARD
───────────────────────────────────────────────────────── */
function LiveSiteCard({ site }) {
  return (
    <div className={styles.liveCard}>
      {/* Browser chrome */}
      <div className={styles.browserChrome}>
        <div className={styles.chromeDots}>
          <span className={styles.chromeDot} style={{ background: '#ef4444' }} />
          <span className={styles.chromeDot} style={{ background: '#f59e0b' }} />
          <span className={styles.chromeDot} style={{ background: '#22c55e' }} />
        </div>
        <div className={styles.chromeUrl}>{site.url.replace('https://', '')}</div>
        <a href={site.url} target="_blank" rel="noreferrer" className={styles.chromeVisit} aria-label={`Visit ${site.title}`}>↗</a>
      </div>

      {/* Screenshot / placeholder */}
      <div className={styles.screenshot}>
        {site.screenshot ? (
          <img src={site.screenshot} alt={`${site.title} website screenshot`} loading="lazy" />
        ) : (
          <div className={styles.screenshotPlaceholder}>
            <div className={styles.placeholderBar} style={{ background: site.accent }} />
            <div className={styles.placeholderContent}>
              <div className={styles.placeholderTitle} style={{ color: site.accent }}>{site.title}</div>
              <div className={styles.placeholderSub}>Screenshot coming soon</div>
              <div className={styles.placeholderLines}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div className={styles.screenshotOverlay}>
          <a href={site.url} target="_blank" rel="noreferrer" className={styles.overlayBtn}>
            Visit live site ↗
          </a>
        </div>
      </div>

      {/* Card info */}
      <div className={styles.liveCardBody}>
        <div className={styles.liveCardTop}>
          <div className={styles.liveAccentBar} style={{ background: site.accent }} />
          <div className={styles.liveCardHeader}>
            <div className={styles.liveCardTitle}>{site.title}</div>
            <span className={styles.liveBadge}>
              <span className={styles.livePulse} />
              Live
            </span>
          </div>
          <div className={styles.liveCardTag}>{site.tag}</div>
          <p className={styles.liveCardDesc}>{site.description}</p>
        </div>
        {site.tech && (
          <div className={styles.techTags}>
            {site.tech.map((t) => (
              <span key={t} className={styles.techTag}>{t}</span>
            ))}
          </div>
        )}
        <div className={styles.liveCardFooter}>
          <a
            href={site.url}
            target="_blank"
            rel="noreferrer"
            className={styles.visitBtn}
            style={{ '--btn-color': site.accent }}
          >
            Visit site ↗
          </a>
          <span className={styles.liveCardUrl}>{site.url.replace('https://', '')}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LIVE SITES SECTION — grid when ≤3, carousel when >3
───────────────────────────────────────────────────────── */
const CAROUSEL_THRESHOLD = 3;

function LiveSitesSection() {
  const [current, setCurrent]   = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef                = useRef(null);
  const useCarousel             = liveSites.length > CAROUSEL_THRESHOLD;

  // Auto-advance carousel
  useEffect(() => {
    if (!useCarousel || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % liveSites.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [useCarousel, isPaused]);

  const prev = () => setCurrent((c) => (c - 1 + liveSites.length) % liveSites.length);
  const next = () => setCurrent((c) => (c + 1) % liveSites.length);

  return (
    <section className={styles.liveSitesSection}>
      <div className={styles.liveSitesHeader}>
        <div>
          <div className={styles.liveSitesLabel}>// live sites</div>
          <h2 className={styles.liveSitesTitle}>Real sites. Live in the wild.</h2>
          <p className={styles.liveSitesSub}>
            Production sites built and managed by Turner Technologies. Click any to visit the live site.
          </p>
        </div>
        {useCarousel && (
          <div className={styles.carouselControls}>
            <button
              className={styles.carouselBtn}
              onClick={() => { setIsPaused(true); prev(); }}
              aria-label="Previous site"
            >‹</button>
            <div className={styles.carouselDots}>
              {liveSites.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.carouselDot} ${i === current ? styles.carouselDotActive : ''}`}
                  onClick={() => { setIsPaused(true); setCurrent(i); }}
                  aria-label={`Go to site ${i + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.carouselBtn}
              onClick={() => { setIsPaused(true); next(); }}
              aria-label="Next site"
            >›</button>
            <button
              className={styles.carouselPauseBtn}
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
              aria-pressed={isPaused}
            >
              {isPaused ? '▶' : '⏸'}
            </button>
          </div>
        )}
      </div>

      {useCarousel ? (
        /* ── Carousel mode ── */
        <div
          className={styles.carouselWrap}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${current * 100}%)` }}
            aria-live={isPaused ? 'polite' : 'off'}
          >
            {liveSites.map((site) => (
              <div key={site.id} className={styles.carouselSlide}>
                <LiveSiteCard site={site} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Grid mode (≤3 sites) ── */
        <div className={styles.liveGrid}>
          {liveSites.map((site) => (
            <LiveSiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   GALLERY PAGE
───────────────────────────────────────────────────────── */
export default function Gallery({ onNavigate }) {
  const [active, setActive] = useState(null);
  const triggerRef          = useRef(null);
  const posthog             = usePostHog();

  const handleProjectClick = (p, e) => {
    triggerRef.current = e.currentTarget;
    posthog?.capture('portfolio_project_previewed', {
      project_title: p.title,
      project_tag:   p.tag,
    });
    setActive(p);
  };

  return (
    <div className={styles.wrapper}>

      {/* ── Example projects ── */}
      <div className={`section ${styles.headerSection}`}>
        <div className="section-label">// work</div>
        <h2>Projects &amp;<br />case studies.</h2>
        <p className={styles.sub}>
          A selection of websites we've built, from local service businesses to
          professional portfolios. Behind each one: SEO, Google Business Profile, and ad management.
          Tap any card to preview.
        </p>
      </div>

      <div className={styles.grid}>
        {projects.map((p) => (
          <div
            key={p.id}
            className={styles.card}
            onClick={(e) => handleProjectClick(p, e)}
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

      {/* ── Live sites ── */}
      <LiveSitesSection />

      {/* ── CTA ── */}
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
