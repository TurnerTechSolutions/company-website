'use client';
import { useEffect } from 'react';
import { usePostHog } from '@posthog/react';

export default function ThemeSync() {
  const posthog = usePostHog();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceTheme = params.get('theme');

    if (forceTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      return;
    } else if (forceTheme === 'dark') {
      document.documentElement.classList.remove('theme-light');
      return;
    }

    if (!posthog) return;

    const unsubscribe = posthog.onFeatureFlags(() => {
      const variant = posthog.getFeatureFlag('theme-variant');
      if (variant === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    });

    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, [posthog]);

  return null;
}
