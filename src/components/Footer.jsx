import React from 'react';
import styles from './Footer.module.css';

const pages  = ['home', 'about', 'gallery', 'contact'];
const labels = { home: 'Home', about: 'About', gallery: 'Work', contact: 'Contact' };

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.copy}>
        © {year} Turner Technologies · Alpharetta, GA
      </div>

      <nav aria-label="Footer navigation">
        <ul className={styles.links} role="list">
          {pages.map((page) => (
            <li key={page}>
              <button
                className={styles.footerBtn}
                onClick={() => onNavigate(page)}
              >
                {labels[page]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.legal}>
        <button
          className={styles.footerBtn}
          onClick={() => onNavigate('privacy')}
        >
          Privacy Policy
        </button>
      </div>
    </footer>
  );
}
