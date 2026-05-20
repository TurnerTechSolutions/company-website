import React from 'react';
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
import { track } from '@vercel/analytics';
import { useEffect } from 'react';

function AppInner() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const onNavigate = (page) => {
    const routes = {
      home:    '/',
      healthcheck:   '/health-check',
      gallery: '/work',
      contact: '/contact',
      privacy: '/privacy',
    };
    navigate(routes[page] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pathToPage = {
    '/':        'home',
    '/health-check': 'healthcheck',
    '/work':    'gallery',
    '/contact': 'contact',
    '/privacy': 'privacy',
  };
  const activePage = pathToPage[location.pathname] || 'home';


  useEffect(() => {
    if (typeof window.posthog === 'undefined') return;

    
    window.posthog.onFeatureFlags(() => {
      const variant = window.posthog.getFeatureFlag('theme-variant');
      if (variant === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceTheme = params.get('theme');

    if (forceTheme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else if (forceTheme === 'dark') {
      document.documentElement.classList.remove('theme-light');
    } else if (typeof window.posthog !== 'undefined') {
      // Fall back to PostHog flag when no URL param
      window.posthog.onFeatureFlags(() => {
        const variant = window.posthog.getFeatureFlag('theme-variant');
        if (variant === 'light') {
          document.documentElement.classList.add('theme-light');
        }
      });
    }
  }, []);

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
          <Route path="/"        onClick={() => track('Home')}    element={<Home         onNavigate={onNavigate} />} />
          <Route path="/health-check"   onClick={() => track('healthcheck')}   element={<DigitalHealthCheck onNavigate={onNavigate} />} />
          <Route path="/work"    onClick={() => track('work')}    element={<Gallery      onNavigate={onNavigate} />} />
          <Route path="/contact" onClick={() => track('contact')} element={<Contact      onNavigate={onNavigate} />} />
          <Route path="/privacy" onClick={() => track('privacy')} element={<PrivacyPolicy onNavigate={onNavigate} />} />
          <Route path="*"                                          element={<Home         onNavigate={onNavigate} />} />
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
