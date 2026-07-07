import Contact from '../../../views/Contact';

export const metadata = {
  title: 'Get a Quote',
  description:
    'Ready to grow your business online? Contact Turner Tech Solutions for a free audit — no pitch, no pressure.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/contact' },
  openGraph: {
    title:       'Get a Quote | Turner Tech Solutions',
    description: 'Ready to grow your business online? Contact Turner Tech Solutions for a free audit — no pitch, no pressure.',
    url:         'https://www.turnertechsolutions.com/contact',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return <Contact />;
}
