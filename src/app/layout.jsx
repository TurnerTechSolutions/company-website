import '../styles/global.css';
import Script from 'next/script';
import Providers from '../components/Providers';
import GA4Analytics from '../components/GA4Analytics';

export const metadata = {
  title: {
    default: 'Turner Tech Solutions | Web Design, SEO & Google Ads',
    template: '%s | Turner Tech Solutions',
  },
  description:
    'We manage your entire digital business: Google Business Profile, Google Ads, SEO, and your website. One team. One monthly rate.',
  metadataBase: new URL('https://www.turnertechsolutions.com'),
  openGraph: {
    type:     'website',
    locale:   'en_US',
    url:      'https://www.turnertechsolutions.com',
    siteName: 'Turner Tech Solutions',
    description:
      'We manage your entire digital business: Google Business Profile, Google Ads, SEO, and your website. One team. One monthly rate.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Turner Tech Solutions',
    description: 'Digital business management for small businesses.',
  },
};

export const viewport = {
  width:        'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1872824407008959');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1872824407008959&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* JSON-LD — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context':       'https://schema.org',
              '@type':          'LocalBusiness',
              name:             'Turner Tech Solutions',
              url:              'https://www.turnertechsolutions.com',
              telephone:        '+14044823190',
              address: {
                '@type':           'PostalAddress',
                streetAddress:     '1725 Township Cir',
                addressLocality:   'Alpharetta',
                addressRegion:     'GA',
                postalCode:        '30004',
                addressCountry:    'US',
              },
              sameAs: [
                'https://share.google/MXlHLwHtCjzBhGlZk',
                'https://www.linkedin.com/company/turner-tech-solutions',
                'https://www.facebook.com/profile.php?id=61590196720556',
              ],
            }),
          }}
        />
      </head>
      <body>
        {/* Google Analytics (GA4) + Google Ads — loaded after hydration to guarantee ordering */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N5SG73B8YQ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-N5SG73B8YQ', { send_page_view: false });
          gtag('config', 'AW-18156000561');
          function gtag_report_conversion(url) {
            var callback = function() { if (typeof url !== 'undefined') window.location = url; };
            gtag('event', 'conversion', { send_to: 'AW-18156000561/ruDrCOvz4rYcELGqutFD', event_callback: callback });
            return false;
          }
        `}</Script>

        <Providers>{children}</Providers>
        <GA4Analytics />
      </body>
    </html>
  );
}
