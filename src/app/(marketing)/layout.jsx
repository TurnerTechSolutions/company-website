import { Analytics } from '@vercel/analytics/react';
import PromoBar from '../../components/PromoBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ThemeSync from '../../components/ThemeSync';

export default function MarketingLayout({ children }) {
  return (
    <>
      <ThemeSync />
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <PromoBar />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
