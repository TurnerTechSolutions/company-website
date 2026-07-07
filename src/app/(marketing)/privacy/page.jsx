import PrivacyPolicy from '../../../views/PrivacyPolicy';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Turner Tech Solutions.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/privacy' },
  openGraph: {
    title:       'Privacy Policy | Turner Tech Solutions',
    description: 'Privacy policy for Turner Tech Solutions.',
    url:         'https://www.turnertechsolutions.com/privacy',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
