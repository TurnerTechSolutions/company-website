import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DigitalHealthCheck from './pages/DigitalHealthCheck';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import { usePostHog } from '@posthog/react';

function AppInner() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const posthog   = usePostHog();

  // ── A/B Test: theme-variant feature flag ──────────────────────
  // Single, clean flag evaluation. Runs once when posthog is ready.
  // Also handles ?theme=light/dark URL override for testing.
  useEffect(() => {
    // URL param override — for local/manual testing
    const params = new URLSearchParams(window.location.search);
    const forceTheme = params.get('theme');

    if (forceTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      return; // skip PostHog flag if manually overriding
    } else if (forceTheme === 'dark') {
      document.documentElement.classList.remove('theme-light');
      return;
    }

    // PostHog feature flag — only runs if no URL override
    if (!posthog) return;

    posthog.onFeatureFlags(() => {
      const variant = posthog.getFeatureFlag('theme-variant');

      // Explicitly capture the flag evaluation so PostHog
      // can attribute downstream events to the correct variant
      posthog.capture('$feature_flag_called', {
        '$feature_flag': 'theme-variant',
        '$feature_flag_response': variant,
      });

      if (variant === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    });
  }, [posthog]);

  // ── Navigation ────────────────────────────────────────────────
  const onNavigate = (page) => {
    const routes = {
      home:        '/',
      healthcheck: '/health-check',
      gallery:     '/work',
      contact:     '/contact',
      privacy:     '/privacy',
    };
    navigate(routes[page] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pathToPage = {
    '/':             'home',
    '/health-check': 'healthcheck',
    '/work':         'gallery',
    '/contact':      'contact',
    '/privacy':      'privacy',
  };
  const activePage = pathToPage[location.pathname] || 'home';

  return (
    <>
      {/* ADA WCAG 2.4.1 — Skip navigation */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar activePage={activePage} onNavigate={onNavigate} />
      <Analytics />

      <main id="main-content" key={location.pathname} tabIndex={-1}>
        <Routes>
          <Route path="/"            element={<Home              onNavigate={onNavigate} />} />
          <Route path="/health-check" element={<DigitalHealthCheck onNavigate={onNavigate} />} />
          <Route path="/work"        element={<Gallery           onNavigate={onNavigate} />} />
          <Route path="/contact"     element={<Contact           onNavigate={onNavigate} />} />
          <Route path="/privacy"     element={<PrivacyPolicy     onNavigate={onNavigate} />} />
          <Route path="*"            element={<Home              onNavigate={onNavigate} />} />
        </Routes>
      </main>

      <Footer onNavigate={onNavigate} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
