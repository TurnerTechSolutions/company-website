import FreeAuditLanding from '../../../views/FreeAuditLanding';

export const metadata = {
  title: 'Free Digital Audit | Turner Tech Solutions',
  description:
    'Find out exactly what is holding your business back online. Get a free audit of your website, Google presence, and local SEO. No obligation. Serving Atlanta, GA and surrounding areas.',
  robots: { index: false, follow: false },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type':    'Service',
  name:       'Free Digital Audit',
  provider: {
    '@type':     'LocalBusiness',
    name:        'Turner Tech Solutions',
    url:         'https://www.turnertechsolutions.com',
    telephone:   '+14044823190',
    address: {
      '@type':          'PostalAddress',
      streetAddress:    '1725 Township Cir',
      addressLocality:  'Alpharetta',
      addressRegion:    'GA',
      postalCode:       '30004',
      addressCountry:   'US',
    },
  },
  description:
    'A free review of your website performance, Google Business Profile, local SEO rankings, and competitive landscape. No obligation, same-day response.',
  offers: {
    '@type': 'Offer',
    price:   '0',
    priceCurrency: 'USD',
  },
};

export default function FreeAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FreeAuditLanding />
    </>
  );
}
