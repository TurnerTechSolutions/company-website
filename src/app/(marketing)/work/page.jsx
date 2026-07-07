import Gallery from '../../../views/Gallery';

export const metadata = {
  title: 'Our Work',
  description:
    'Browse live client sites and example projects — local service businesses, restaurants, and more, built and managed by Turner Tech Solutions.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/work' },
  openGraph: {
    title:       'Our Work | Turner Tech Solutions',
    description: 'Browse live client sites and example projects — local service businesses, restaurants, and more, built and managed by Turner Tech Solutions.',
    url:         'https://www.turnertechsolutions.com/work',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function WorkPage() {
  return <Gallery />;
}
