import Home from '../../views/Home';

export const metadata = {
  title: 'Turner Tech Solutions | Web Design, SEO & Google Ads — Alpharetta, GA',
  description:
    'We manage your entire digital business: Google Business Profile, Google Ads, SEO, and your website. One team. One monthly rate.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/' },
  openGraph: {
    title:       'Turner Tech Solutions | Web Design, SEO & Google Ads',
    description: 'We manage your entire digital business: Google Business Profile, Google Ads, SEO, and your website. One team. One monthly rate.',
    url:         'https://www.turnertechsolutions.com/',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return <Home />;
}
