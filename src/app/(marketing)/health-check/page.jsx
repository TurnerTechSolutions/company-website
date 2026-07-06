import DigitalHealthCheck from '../../../views/DigitalHealthCheck';

export const metadata = {
  title: 'Free Digital Health Check',
  description:
    'See exactly where your business stands online. Score your website, SEO, and Google presence in under 2 minutes — free.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/health-check' },
};

export default function HealthCheckPage() {
  return <DigitalHealthCheck />;
}
