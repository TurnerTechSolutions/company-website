import React, { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

const pages  = ['home', 'healthcheck', 'gallery', 'contact'];
const labels = { home: 'Home', healthcheck: 'Health Check', gallery: 'Work', contact: 'Contact' };

export default function Navbar({ activePage, onNavigate }) {
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

  // Move focus into drawer on open; return to hamburger on close
  useEffect(() => {
    if (menuOpen) {
      const first = drawerRef.current?.querySelector('a, button');
      first?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [menuOpen]);

  // Trap focus inside drawer
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
    onNavigate(page);
    setMenuOpen(false);
    console.log(process.env.REACT_APP_PUBLIC_POSTHOG_KEY, process.env.REACT_APP_PUBLIC_POSTHOG_HOST);
  };

  return (
    <>
      <nav className={styles.nav} aria-label="Main navigation">
        {/* Logo */}
        <button
          className={styles.logo}
          onClick={() => handleNavigate('home')}
          aria-label="Turner Technologies — go to home"
        >
          <span className={styles.logoMark} aria-hidden="true" />
          TURNER<span className={styles.dot} aria-hidden="true">.</span>TECH
        </button>

        {/* Desktop links */}
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

        {/* Desktop CTA */}
        <button className={styles.navCta} onClick={() => handleNavigate('contact')}>
          Get a Quote
        </button>

        {/* Hamburger */}
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
      </nav>

      {/* Mobile drawer */}
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
