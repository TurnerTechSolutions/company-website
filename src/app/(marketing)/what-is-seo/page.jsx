import WhatIsSeo from '../../../views/WhatIsSeo';

export const metadata = {
  title: 'What is SEO? A Plain-English Guide | Turner Tech Solutions',
  description:
    'Understand what SEO and GEO are, why they matter for your business, and how organic search rankings drive free, compounding traffic. Serving Alpharetta, GA and surrounding areas.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/what-is-seo' },
  openGraph: {
    title:       'What is SEO? | Turner Tech Solutions',
    description: 'A plain-English breakdown of SEO, GEO, and why ranking on Google is the highest-ROI investment most small businesses overlook.',
    url:         'https://www.turnertechsolutions.com/what-is-seo',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type':    'Article',
  headline:   'What is SEO? A Plain-English Guide for Small Business Owners',
  description: 'Understand what SEO and GEO are, why they matter for your business, and how organic search rankings drive free, compounding traffic.',
  author: {
    '@type': 'Organization',
    name:    'Turner Tech Solutions',
    url:     'https://www.turnertechsolutions.com',
  },
  publisher: {
    '@type': 'Organization',
    name:    'Turner Tech Solutions',
    url:     'https://www.turnertechsolutions.com',
  },
  url: 'https://www.turnertechsolutions.com/what-is-seo',
};

export default function WhatIsSeoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <WhatIsSeo />
    </>
  );
}
