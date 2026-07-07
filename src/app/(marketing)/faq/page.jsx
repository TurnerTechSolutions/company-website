import FAQ from '../../../views/FAQ';

export const metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about SEO, Google Ads, website design, and what it means to work with Turner Tech Solutions.',
  alternates: { canonical: 'https://www.turnertechsolutions.com/faq' },
  openGraph: {
    title:       'FAQ | Turner Tech Solutions',
    description: 'Answers to common questions about SEO, Google Ads, website design, and what it means to work with Turner Tech Solutions.',
    url:         'https://www.turnertechsolutions.com/faq',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type':    'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What does Turner Tech Solutions do?',                             acceptedAnswer: { '@type': 'Answer', text: "We manage your entire digital business: Google Business Profile, Google Ads, local SEO, and your website. Instead of hiring separate agencies for each piece, you get one team that handles everything for a single monthly rate." } },
    { '@type': 'Question', name: 'Do I need to sign a long-term contract?',                         acceptedAnswer: { '@type': 'Answer', text: "No. All plans are month-to-month. We believe you should stay because the results are working, not because a contract locks you in." } },
    { '@type': 'Question', name: 'What is SEO and why does my business need it?',                   acceptedAnswer: { '@type': 'Answer', text: "SEO (Search Engine Optimization) is the process of making your business show up on Google when nearby customers search for your service. Without it, your competitors capture those searches and those calls, every single day." } },
    { '@type': 'Question', name: 'How long does it take to see results from SEO?',                  acceptedAnswer: { '@type': 'Answer', text: "Most businesses see measurable improvement in 3 to 6 months. SEO compounds over time: the longer it runs, the stronger your rankings get. Unlike ads, those rankings don't disappear the moment you stop paying." } },
    { '@type': 'Question', name: 'What is Local SEO?',                                              acceptedAnswer: { '@type': 'Answer', text: "Local SEO is specifically focused on ranking your business in Google's map pack and local search results. It involves optimizing your Google Business Profile, building local citations, managing reviews, and targeting location-based keywords so customers in your area find you first." } },
    { '@type': 'Question', name: "What's the difference between SEO and Google Ads?",               acceptedAnswer: { '@type': 'Answer', text: "Google Ads gets you to the top of results immediately but requires ongoing spend. SEO builds organic rankings over months that stay in place without paying per click. Together they cover the full funnel: ads capture immediate demand while SEO builds long-term authority." } },
    { '@type': 'Question', name: 'How do I know if my SEO and ads are working?',                    acceptedAnswer: { '@type': 'Answer', text: "We set up GA4 and Google Search Console so you have real data on traffic, rankings, and conversions. Pro plan clients receive a monthly performance report in plain English, no vanity metrics, just what's moving and what we're doing about it." } },
    { '@type': 'Question', name: "What's included in a business website?",                          acceptedAnswer: { '@type': 'Answer', text: "Every website we build includes up to 5 pages, mobile-responsive design, on-page SEO baked in from the start, contact and lead capture forms, Google Analytics setup, and domain and hosting configuration. You own it completely." } },
    { '@type': 'Question', name: 'Do you use data from ads to improve SEO, and vice versa?',        acceptedAnswer: { '@type': 'Answer', text: "Yes, and this is one of the biggest advantages of having one team manage everything. The keywords that convert in your ads tell us what terms to target with SEO. The pages that get organic traffic tell us what ad copy resonates. One data loop that makes every channel sharper over time." } },
    { '@type': 'Question', name: 'What is Google Business Profile and why does it matter?',         acceptedAnswer: { '@type': 'Answer', text: "Google Business Profile is the listing that appears when someone searches for your business or finds you on Google Maps. A fully optimized profile dramatically increases how often you appear in local search results, and directly drives calls and direction requests." } },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQ />
    </>
  );
}
