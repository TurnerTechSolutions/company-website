const BASE = 'https://www.turnertechsolutions.com';

export default function sitemap() {
  return [
    { url: `${BASE}/`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/health-check`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/seo-audit`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/faq`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
