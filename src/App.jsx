import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './styles/global.css';
import { Analytics } from "@vercel/analytics/react"
import { track } from '@vercel/analytics';

/* Inner app — has access to router context */
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (page) => {
    const routes = {
      home:    '/',
      about:   '/about',
      gallery: '/work',
      contact: '/contact',
      privacy: '/privacy',
    };
    navigate(routes[page] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Derive active page key from current URL for navbar highlighting
  const pathToPage = {
    '/':        'home',
    '/about':   'about',
    '/work':    'gallery',
    '/contact': 'contact',
    '/privacy': 'privacy',
  };
  const activePage = pathToPage[location.pathname] || 'home';

  return (
    <>
      <Navbar activePage={activePage} onNavigate={onNavigate} />
      <Analytics />
      <main key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" onClick={() => {track('Home')}}      element={<Home    onNavigate={onNavigate} />} />
          <Route path="/about" onClick={() => {track('about')}}  element={<About   onNavigate={onNavigate} />} />
          <Route path="/work"  onClick={() => {track('work')}}  element={<Gallery onNavigate={onNavigate} />} />
          <Route path="/contact" onClick={() => {track('contact')}} element={<Contact onNavigate={onNavigate} />} />
          <Route path="/privacy" onClick={() => {track('p;rivacy')}} element={<PrivacyPolicy onNavigate={onNavigate} />} />
          {/* Catch-all — redirect unknown URLs to home */}
          <Route path="*"        element={<Home    onNavigate={onNavigate} />} />
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
