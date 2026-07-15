import FreeAuditLanding from '../../../views/FreeAuditLanding';

export const metadata = {
  title: 'Digital Strategy Assessment | Turner Tech Solutions',
  description:
    'Turner Tech Solutions works with local businesses serious about growth. Our digital strategy assessment covers your website, Google presence, and competitive landscape — delivered as a clear, prioritized growth roadmap.',
  robots: { index: false, follow: false },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type':    'Service',
  name:       'Digital Strategy Assessment',
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
    'A comprehensive review of your website performance, Google Business Profile, local SEO rankings, and competitive landscape — delivered as a prioritized growth roadmap with clear investment recommendations.',
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
