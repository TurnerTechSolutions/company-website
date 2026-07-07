'use client';
import React, { useState } from 'react';
import styles from './FAQ.module.css';
import { useNav } from '../hooks/useNav';

const categories = [
  {
    label: 'General',
    items: [
      {
        q: 'What does Turner Tech Solutions do?',
        a: "We manage your entire digital business: Google Business Profile, Google Ads, local SEO, and your website. Instead of hiring separate agencies for each piece, you get one team that handles everything for a single monthly rate.",
      },
      {
        q: 'What areas do you serve?',
        a: "We work with small businesses across the United States. Our team is based in Alpharetta, Georgia and we operate fully remotely, so location is never a barrier.",
      },
      {
        q: 'Do I need to sign a long-term contract?',
        a: "No. All plans are month-to-month. We believe you should stay because the results are working, not because a contract locks you in.",
      },
      {
        q: 'How do I get started?',
        a: "Start with a free audit. We take an honest look at your current digital presence, identify what's costing you customers, and walk you through what we'd do to fix it. No pitch, no pressure.",
      },
    ],
  },
  {
    label: 'SEO',
    items: [
      {
        q: 'What is SEO and why does my business need it?',
        a: "SEO (Search Engine Optimization) is the process of making your business show up on Google when nearby customers search for your service. Without it, your competitors capture those searches and those calls, every single day.",
      },
      {
        q: 'How long does it take to see results from SEO?',
        a: "Most businesses see measurable improvement in 3 to 6 months. SEO compounds over time: the longer it runs, the stronger your rankings get. Unlike ads, those rankings don't disappear the moment you stop paying.",
      },
      {
        q: 'What is Local SEO?',
        a: "Local SEO is specifically focused on ranking your business in Google's map pack and local search results. It involves optimizing your Google Business Profile, building local citations, managing reviews, and targeting location-based keywords so customers in your area find you first.",
      },
      {
        q: 'What is Google Business Profile and why does it matter?',
        a: "Google Business Profile (formerly Google My Business) is the listing that appears when someone searches for your business or finds you on Google Maps. A fully optimized profile dramatically increases how often you appear in local search results, and directly drives calls and direction requests.",
      },
      {
        q: 'Can you fix my Google rankings if a competitor is outranking me?',
        a: "Yes. We analyze exactly why competitors are outranking you, whether it's their content, backlinks, site speed, or GBP signals, and build a plan to close the gap and then pass them.",
      },
    ],
  },
  {
    label: 'Advertising',
    items: [
      {
        q: 'What is Google Ads and how does it work?',
        a: "Google Ads puts your business at the top of search results instantly, before organic results, for searches you choose to target. You pay per click. We handle campaign setup, keyword targeting, ad copy, bid strategy, and ongoing optimization to make sure every dollar is working.",
      },
      {
        q: "What's the difference between SEO and Google Ads?",
        a: "Google Ads gets you to the top of results immediately but requires ongoing spend. SEO builds organic rankings over months that stay in place without paying per click. Together they cover the full funnel: ads capture immediate demand while SEO builds long-term authority.",
      },
      {
        q: 'How much do Google Ads cost?',
        a: "Ad spend is separate from our management fee and varies by industry and location. We help you set a budget that makes sense for your market, and we're transparent about what you're spending and what it's returning.",
      },
      {
        q: 'Do you manage Facebook and Instagram ads too?',
        a: "Yes. Our Pro plan includes advanced advertising across Facebook and LinkedIn. Social ads work differently from search ads and are best used for brand awareness and retargeting customers who've already shown interest.",
      },
    ],
  },
  {
    label: 'Website',
    items: [
      {
        q: "What's included in a business website?",
        a: "Every website we build includes up to 5 pages, mobile-responsive design, on-page SEO baked in from the start, contact and lead capture forms, Google Analytics setup, and domain and hosting configuration. You own it completely.",
      },
      {
        q: 'Can I update my own website after it launches?',
        a: "Yes. We build sites so you can manage basic content updates yourself if you want to. And if you'd rather we handle it, updates are included in your monthly plan.",
      },
      {
        q: 'How is your website different from a template builder like Wix or Squarespace?',
        a: "Template builders are fine for getting something online, but they're built for ease of use, not performance or SEO. Our sites are built to convert, load fast, and rank on Google. We also integrate your website with your ads and SEO strategy so everything works together.",
      },
    ],
  },
  {
    label: 'Analytics and Reporting',
    items: [
      {
        q: 'How do I know if my SEO and ads are working?',
        a: "We set up GA4 and Google Search Console so you have real data on traffic, rankings, and conversions. Pro plan clients receive a monthly performance report in plain English, no vanity metrics, just what's moving and what we're doing about it.",
      },
      {
        q: 'Do you use data from ads to improve SEO, and vice versa?',
        a: "Yes, and this is one of the biggest advantages of having one team manage everything. The keywords that convert in your ads tell us what terms to target with SEO. The pages that get organic traffic tell us what ad copy resonates. One data loop that makes every channel sharper over time.",
      },
    ],
  },
];

export default function FAQ() {
  const navigate = useNav();
  const [open, setOpen] = useState({});

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.label}>FAQ</div>
        <h1 className={styles.title}>Frequently asked questions</h1>
        <p className={styles.sub}>
          Everything you need to know before getting started. Don't see your question?{' '}
          <button className={styles.subLink} onClick={() => navigate('contact')}>Ask us directly.</button>
        </p>
      </div>

      <div className={styles.body}>
        {categories.map((cat) => (
          <div key={cat.label} className={styles.category}>
            <div className={styles.catLabel}>{cat.label}</div>
            <div className={styles.items}>
              {cat.items.map((item, i) => {
                const key = `${cat.label}-${i}`;
                const isOpen = !!open[key];
                return (
                  <div key={key} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                    <button
                      className={styles.question}
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <span className={styles.icon} aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && <p className={styles.answer}>{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cta}>
        <div className={styles.ctaLabel}>Still have questions?</div>
        <p className={styles.ctaText}>Book a free 30-minute call. We'll look at your current digital presence and tell you exactly what we'd do.</p>
        <button className={styles.ctaBtn} onClick={() => navigate('contact')}>
          Get a Free Audit →
        </button>
      </div>
    </div>
  );
}
