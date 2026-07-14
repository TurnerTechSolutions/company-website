'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function gtag(event, params) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

export default function GA4Analytics() {
  const pathname = usePathname();

  // ── Global click tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target.closest('a, button, [role="button"]');
      if (!el) return;

      const text = (
        el.textContent?.trim() ||
        el.getAttribute('aria-label') ||
        ''
      ).slice(0, 100);
      const href = el.getAttribute('href');

      // Phone call clicks
      if (href?.startsWith('tel:')) {
        gtag('phone_call_click', {
          phone_number: href.replace('tel:', ''),
          page_path: pathname,
        });
        return;
      }

      // Outbound link clicks (enhanced measurement also fires these, but we add text context)
      if (href && (href.startsWith('http') || href.startsWith('//'))) {
        gtag('outbound_click', {
          link_url:  href,
          link_text: text,
          page_path: pathname,
        });
        return;
      }

      // Internal buttons and links
      gtag('click', {
        element_type: el.tagName.toLowerCase(),
        element_text: text,
        page_path:    pathname,
      });
    };

    // Capture phase so we catch clicks on elements with stopPropagation
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  // ── Form interaction tracking ─────────────────────────────────────────────
  useEffect(() => {
    // Fire form_start once when a user first touches any field in a form
    const handleFocusin = (e) => {
      const form = e.target.closest('form');
      if (!form || e.target.tagName === 'BUTTON') return;
      if (form.dataset.gaStarted) return;
      form.dataset.gaStarted = '1';
      gtag('form_start', {
        form_id:   form.id || form.getAttribute('name') || 'unnamed',
        page_path: pathname,
      });
    };

    // Fire form_submit on every submission attempt (before Formspree validation)
    const handleSubmit = (e) => {
      const form = e.target;
      if (form.tagName !== 'FORM') return;
      gtag('form_submit', {
        form_id:   form.id || form.getAttribute('name') || 'unnamed',
        page_path: pathname,
      });
    };

    document.addEventListener('focusin', handleFocusin);
    document.addEventListener('submit', handleSubmit);
    return () => {
      document.removeEventListener('focusin', handleFocusin);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [pathname]);

  // ── Scroll depth milestones ───────────────────────────────────────────────
  useEffect(() => {
    const fired = new Set();

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total    = document.documentElement.scrollHeight;
      if (total <= window.innerHeight) return; // page doesn't scroll

      const pct = Math.round((scrolled / total) * 100);

      [25, 50, 75, 90].forEach((threshold) => {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          gtag('scroll_depth', {
            percent_scrolled: threshold,
            page_path:        pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}
