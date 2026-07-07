import DigitalHealthCheck from '../../../views/DigitalHealthCheck';

export const metadata = {
  title: 'Free Digital Health Check',
  description:
    'See exactly where your business stands online. Score your website, SEO, and Google presence in under 2 minutes — free.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/health-check' },
  openGraph: {
    title:       'Free Digital Health Check | Turner Tech Solutions',
    description: 'See exactly where your business stands online. Score your website, SEO, and Google presence in under 2 minutes — free.',
    url:         'https://www.turnertechsolutions.com/health-check',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const serviceSchema = {
  '@context':    'https://schema.org',
  '@type':       'Service',
  name:          'Digital Health Check',
  description:   'Free online assessment that scores your business digital presence across website, SEO, Google Business Profile, and more.',
  provider: {
    '@type': 'LocalBusiness',
    name:    'Turner Tech Solutions',
    url:     'https://www.turnertechsolutions.com',
  },
  areaServed:  'United States',
  serviceType: 'Digital Marketing Audit',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function HealthCheckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <DigitalHealthCheck />
    </>
  );
}
