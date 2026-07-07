'use client';
import { useRouter } from 'next/navigation';

const ROUTES = {
  home:        '/',
  healthcheck: '/health-check',
  seoaudit:    '/seo-audit',
  gallery:     '/work',
  contact:     '/contact',
  privacy:     '/privacy',
  whatisseo:   '/what-is-seo',
};

export function useNav() {
  const router = useRouter();
  return (page) => {
    const path = ROUTES[page] ?? `/${page}`;
    router.push(path);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
}
