import React, { useEffect, useMemo, useState } from 'react';
import { PROMO } from '../promoConfig';
import styles from './PromoBar.module.css';

const DISMISS_KEY = (id) => `promo-dismissed-${id}`;

// Returns ms left until `end`, or null if no end / already passed handled by caller.
function msUntil(end) {
  if (!end) return null;
  return new Date(end).getTime() - Date.now();
}

function formatCountdown(ms) {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function PromoBar({ onNavigate }) {
  // Dismissal — remembered per campaign id.
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY(PROMO.id)) === '1'; }
    catch { return false; }
  });

  // Tick every second for the countdown.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!PROMO.showCountdown || !PROMO.endsAt) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Scheduling window.
  const inWindow = useMemo(() => {
    const t = now;
    if (PROMO.startsAt && t < new Date(PROMO.startsAt).getTime()) return false;
    if (PROMO.endsAt   && t > new Date(PROMO.endsAt).getTime())   return false;
    return true;
  }, [now]);

  const visible = PROMO.enabled && !dismissed && inWindow;

  // Push the navbar + page content down by the bar's height while visible.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--promo-h', visible ? '46px' : '0px');
    return () => root.style.setProperty('--promo-h', '0px');
  }, [visible]);

  if (!visible) return null;

  const countdown = PROMO.showCountdown ? formatCountdown(msUntil(PROMO.endsAt)) : null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY(PROMO.id), '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  const onCta = (e) => {
    const href = PROMO.ctaHref || '';
    if (/^https?:\/\//i.test(href)) return; // let the anchor open externally
    e.preventDefault();
    if (onNavigate) onNavigate(href);
  };

  const isExternal = /^https?:\/\//i.test(PROMO.ctaHref || '');

  return (
    <div className={styles.bar} role="region" aria-label="Promotion">
      <div className={styles.inner}>
        <span className={styles.message}>{PROMO.message}</span>

        {countdown && (
          <span className={styles.timer} aria-label="Time remaining">
            <span className={styles.timerDot} aria-hidden="true" />
            {countdown}
          </span>
        )}

        <a
          className={styles.cta}
          href={PROMO.ctaHref}
          onClick={onCta}
          {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {PROMO.ctaLabel} →
        </a>
      </div>

      <button className={styles.close} onClick={dismiss} aria-label="Dismiss promotion">×</button>
    </div>
  );
}
