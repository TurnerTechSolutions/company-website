'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROMO } from '../promoConfig';
import styles from './PromoBar.module.css';

const DISMISS_KEY = (id) => `promo-dismissed-${id}`;

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

export default function PromoBar() {
  const router = useRouter();

  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY(PROMO.id)) === '1'; }
    catch { return false; }
  });

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!PROMO.showCountdown || !PROMO.endsAt) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const inWindow = useMemo(() => {
    const t = now;
    if (PROMO.startsAt && t < new Date(PROMO.startsAt).getTime()) return false;
    if (PROMO.endsAt   && t > new Date(PROMO.endsAt).getTime())   return false;
    return true;
  }, [now]);

  const visible = PROMO.enabled && !dismissed && inWindow;

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

  const isExternal = /^https?:\/\//i.test(PROMO.ctaHref || '');

  const onCta = (e) => {
    if (isExternal) return;
    e.preventDefault();
    router.push(PROMO.ctaHref);
  };

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
