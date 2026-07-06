import SeoAudit from '../../../views/SeoAudit';

export const metadata = {
  title: 'Free SEO Audit',
  description:
    'Run a free SEO audit on your website. Get a scored report with fixes ranked by impact — powered by Turner Tech Solutions.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/seo-audit' },
};

export default function SeoAuditPage() {
  return <SeoAudit />;
}
