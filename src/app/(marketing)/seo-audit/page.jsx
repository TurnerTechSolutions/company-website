import SeoAudit from '../../../views/SeoAudit';

export const metadata = {
  title: 'Free SEO Audit',
  description:
    'Run a free SEO audit on your website. Get a scored report with fixes ranked by impact — powered by Turner Tech Solutions.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/seo-audit' },
  openGraph: {
    title:       'Free SEO Audit | Turner Tech Solutions',
    description: 'Run a free SEO audit on your website. Get a scored report with fixes ranked by impact — powered by Turner Tech Solutions.',
    url:         'https://www.turnertechsolutions.com/seo-audit',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const serviceSchema = {
  '@context':    'https://schema.org',
  '@type':       'Service',
  name:          'Free SEO Audit',
  description:   'Automated SEO audit that scores your website across 20+ technical and on-page factors, then delivers ranked recommendations.',
  provider: {
    '@type': 'LocalBusiness',
    name:    'Turner Tech Solutions',
    url:     'https://www.turnertechsolutions.com',
  },
  areaServed:  'United States',
  serviceType: 'SEO Audit',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function SeoAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <SeoAudit />
    </>
  );
}
