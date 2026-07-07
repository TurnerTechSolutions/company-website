'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import logo from '../images/logos/logo.png';

const pages  = ['home', 'whatisseo', 'healthcheck', 'seoaudit', 'gallery', 'contact'];
const labels = { home: 'Home', whatisseo: 'What is SEO?', healthcheck: 'Health Check', seoaudit: 'SEO Audit', gallery: 'Work', contact: 'Contact' };
const hrefs  = { home: '/', whatisseo: '/what-is-seo', healthcheck: '/health-check', seoaudit: '/seo-audit', gallery: '/work', contact: '/contact' };

const pathToPage = {
  '/':             'home',
  '/what-is-seo':  'whatisseo',
  '/health-check': 'healthcheck',
  '/seo-audit':    'seoaudit',
  '/work':         'gallery',
  '/contact':      'contact',
};

export default function Navbar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const activePage = pathToPage[pathname] || 'home';

  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const drawerRef    = useRef(null);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 700) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const first = drawerRef.current?.querySelector('a, button');
      first?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); return; }
      if (e.key !== 'Tab') return;
      const focusable = drawerRef.current?.querySelectorAll('a, button');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const handleNavigate = (page) => {
    router.push(hrefs[page]);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navInner}>
          <button
            className={styles.logo}
            onClick={() => handleNavigate('home')}
            aria-label="Turner Technologies — go to home"
          >
            <img src={logo.src ?? logo} alt="" aria-hidden="true" className={styles.logoImg} />
            <span className={styles.brandName}>
              Turner Tech
              <small className={styles.brandSub}>Solutions</small>
            </span>
          </button>

          <ul className={styles.navLinks} role="list">
            {pages.map((page) => (
              <li key={page}>
                <a
                  role="button"
                  tabIndex={0}
                  className={activePage === page ? styles.active : ''}
                  onClick={() => handleNavigate(page)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigate(page)}
                  aria-current={activePage === page ? 'page' : undefined}
                >
                  {labels[page]}
                </a>
              </li>
            ))}
          </ul>

          <button className={styles.navCta} onClick={() => handleNavigate('contact')}>
            Get a Quote
          </button>

          <button
            ref={hamburgerRef}
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} aria-hidden="true" />
            <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} aria-hidden="true" />
            <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        <ul className={styles.drawerLinks} role="list">
          {pages.map((page) => (
            <li key={page}>
              <a
                role="button"
                tabIndex={menuOpen ? 0 : -1}
                className={activePage === page ? styles.drawerActive : ''}
                onClick={() => handleNavigate(page)}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigate(page)}
                aria-current={activePage === page ? 'page' : undefined}
              >
                {labels[page]}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={styles.drawerCta}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => handleNavigate('contact')}
        >
          Get a Quote →
        </button>
      </div>

      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
