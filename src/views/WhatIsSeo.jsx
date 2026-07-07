'use client';
import React from 'react';
import styles from './WhatIsSeo.module.css';
import { useNav } from '../hooks/useNav';

const seoTypes = [
  {
    title: 'On-Page SEO',
    desc: 'Optimizing the content and structure of each page: titles, headings, meta descriptions, keyword placement, internal links, and image alt text. This is what tells Google what each page is about.',
    icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    title: 'Technical SEO',
    desc: 'The behind-the-scenes work: site speed, mobile-friendliness, crawlability, structured data (schema), HTTPS, XML sitemaps, and Core Web Vitals. If Google can\'t crawl your site efficiently, rankings suffer regardless of your content.',
    icon: <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    title: 'Local SEO',
    desc: 'Getting your business to appear in Google\'s local map pack when someone nearby searches for your service. This involves Google Business Profile optimization, local citations, reviews, and location-based keyword targeting.',
    icon: <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  },
  {
    title: 'Off-Page SEO',
    desc: 'Building your site\'s authority through backlinks from other reputable websites, brand mentions, and signals that tell Google your business is trusted and relevant in your industry.',
    icon: <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  },
];

const geoStrategies = [
  { label: 'Structured Data', desc: 'Schema markup helps AI systems understand who you are, what you do, and where you operate.' },
  { label: 'Authoritative Content', desc: 'Clear, factual answers to common questions signal to AI that your site is a reliable source.' },
  { label: 'E-E-A-T Signals', desc: 'Experience, Expertise, Authoritativeness, and Trustworthiness are the signals AI engines use to rank sources.' },
  { label: 'FAQ Format', desc: 'Pages that directly answer questions in a Q&A format are frequently pulled into AI-generated responses.' },
];

const stats = [
  { n: '93%', l: 'of online experiences begin with a search engine' },
  { n: '75%', l: 'of users never scroll past the first page of results' },
  { n: '46%', l: 'of all Google searches have local intent' },
  { n: '28%', l: 'of local searches lead to a purchase within 24 hours' },
];

export default function WhatIsSeo() {
  const navigate = useNav();

  return (
    <div className={styles.wrapper}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLabel}>SEO Guide</div>
          <h1 className={styles.heroTitle}>
            What is SEO?<br />
            <span>And why your business can't afford to ignore it.</span>
          </h1>
          <p className={styles.heroSub}>
            Search Engine Optimization is the single highest-ROI investment most small businesses never make.
            This guide breaks down exactly what it is, how it works, and what the newer concept of GEO means for your future visibility.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('seoaudit')}>
              Get a Free SEO Audit →
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate('contact')}>
              Talk to an expert
            </button>
          </div>
        </div>
      </section>

      {/* ── WHAT IS SEO ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Search Engine Optimization</div>
          <h2 className={styles.sectionTitle}>What is SEO?</h2>
          <div className={styles.explainerGrid}>
            <div className={styles.explainerText}>
              <p>
                SEO is the process of making your website show up when someone types a relevant search into Google.
                When a homeowner in your city searches "roof repair near me" or a parent searches "pediatric dentist Alpharetta,"
                Google scans thousands of websites in milliseconds and decides which ones to show first.
                SEO is the work that puts your business in those top results.
              </p>
              <p>
                Unlike Google Ads, where you pay every time someone clicks, organic SEO rankings are free to maintain once
                you earn them. The trade-off is time: SEO takes months to build but then compounds indefinitely.
                A business that ranks on page one for its core services is earning free, qualified traffic every single day.
              </p>
              <p>
                Google uses over 200 ranking signals to decide where your site appears. The major categories are the quality
                of your content, the technical health of your website, how many other trusted sites link to you, and
                how well your business signals local relevance.
              </p>
            </div>
            <div className={styles.explainerVisual}>
              <div className={styles.serpCard}>
                <div className={styles.serpLabel}>Google Search Result</div>
                <div className={styles.serpAd}>
                  <span className={styles.serpAdBadge}>Sponsored</span>
                  <div className={styles.serpUrl}>competitor.com</div>
                  <div className={styles.serpHeadline}>Roofing Services: Get a Free Quote Today</div>
                </div>
                <div className={`${styles.serpResult} ${styles.serpResultHighlight}`}>
                  <div className={styles.serpRank}>1</div>
                  <div>
                    <div className={styles.serpUrl}>yourbusiness.com</div>
                    <div className={styles.serpHeadline}>Expert Roofing in Alpharetta, GA | 5-Star Rated</div>
                    <div className={styles.serpSnippet}>Local, licensed roofers serving Alpharetta and surrounding areas. Free inspections. Same-week scheduling available.</div>
                  </div>
                </div>
                <div className={styles.serpResult}>
                  <div className={styles.serpRank}>2</div>
                  <div>
                    <div className={styles.serpUrl}>anothercompetitor.com</div>
                    <div className={styles.serpHeadline}>Alpharetta Roofing Company</div>
                    <div className={styles.serpSnippet}>Professional roofing services for residential and commercial properties...</div>
                  </div>
                </div>
                <div className={styles.serpHighlightLabel}>
                  Organic ranking = free clicks, forever
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection}>
        <div className={styles.statsInner}>
          {stats.map((s, i) => (
            <React.Fragment key={s.n}>
              {i > 0 && <div className={styles.statDiv} aria-hidden="true" />}
              <div className={styles.stat}>
                <span className={styles.statN}>{s.n}</span>
                <span className={styles.statL}>{s.l}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── TYPES OF SEO ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>The four pillars</div>
          <h2 className={styles.sectionTitle}>Types of SEO</h2>
          <p className={styles.sectionSub}>
            Effective SEO is not a single tactic. It's a combination of four interconnected disciplines that work together to improve your visibility.
          </p>
          <div className={styles.typesGrid}>
            {seoTypes.map((t) => (
              <div key={t.title} className={styles.typeCard}>
                <div className={styles.typeIcon} aria-hidden="true">{t.icon}</div>
                <h3 className={styles.typeTitle}>{t.title}</h3>
                <p className={styles.typeDesc}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IS GEO ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>The next frontier</div>
          <h2 className={styles.sectionTitle}>What is GEO?</h2>
          <div className={styles.geoGrid}>
            <div className={styles.geoText}>
              <p>
                GEO stands for Generative Engine Optimization. It's the practice of optimizing your content to appear
                in answers generated by AI tools like Google's AI Overviews, ChatGPT, Perplexity, and other
                large language models that now answer questions directly rather than just listing links.
              </p>
              <p>
                When someone asks an AI "who is the best roofer in Alpharetta?" or "what should I look for in a local SEO agency,"
                the AI scans the web for credible, well-structured sources to pull from. Businesses optimized for GEO
                get cited in those answers. Businesses that aren't, become invisible in a channel that is growing rapidly.
              </p>
              <p>
                GEO is not a replacement for SEO. It's an extension of it. The same principles apply: authoritative content,
                technical accuracy, structured data, and trust signals. The difference is the format and the endpoint.
                Where SEO targets a ranked list of links, GEO targets the paragraph an AI writes when someone asks it a question.
              </p>
              <div className={styles.geoBadge}>
                GEO is still emerging. The businesses building for it now will have a significant head start.
              </div>
            </div>
            <div className={styles.geoStrategies}>
              <div className={styles.geoStrategiesLabel}>How to optimize for GEO</div>
              {geoStrategies.map((g) => (
                <div key={g.label} className={styles.geoStrategy}>
                  <div className={styles.geoStrategyDot} aria-hidden="true" />
                  <div>
                    <div className={styles.geoStrategyTitle}>{g.label}</div>
                    <div className={styles.geoStrategyDesc}>{g.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>The business case</div>
          <h2 className={styles.sectionTitle}>Why SEO matters for your business</h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardNum}>01</div>
              <h3 className={styles.whyCardTitle}>Your competitors are already doing it</h3>
              <p className={styles.whyCardDesc}>
                Every day you're not optimizing for search, the businesses that are continue to pull further ahead.
                Google's top spots are not distributed evenly: the first result gets over 30% of all clicks.
                The second gets 15%. By page two, traffic drops to near zero.
              </p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardNum}>02</div>
              <h3 className={styles.whyCardTitle}>It targets people who are already looking to buy</h3>
              <p className={styles.whyCardDesc}>
                Social media ads interrupt people. SEO captures people who are actively searching for what you offer
                right now. These are warm leads with intent. The conversion rate on organic search traffic is
                consistently higher than almost any other digital channel.
              </p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardNum}>03</div>
              <h3 className={styles.whyCardTitle}>The results compound over time</h3>
              <p className={styles.whyCardDesc}>
                Ads stop generating traffic the moment your budget runs out. SEO rankings, once earned,
                keep driving traffic indefinitely. Businesses that have invested in SEO for 2+ years often
                find it becomes their single largest source of leads at the lowest cost per acquisition.
              </p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardNum}>04</div>
              <h3 className={styles.whyCardTitle}>It builds trust and credibility</h3>
              <p className={styles.whyCardDesc}>
                Ranking at the top of Google signals legitimacy. Customers who find you organically already
                trust you more than someone who clicked an ad. High rankings combined with strong reviews
                and an optimized Google Business Profile create a trust signal that no amount of ad spend can replicate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaSectionLabel}>Ready to rank?</div>
          <h2 className={styles.ctaSectionTitle}>See exactly where your SEO stands today.</h2>
          <p className={styles.ctaSectionSub}>
            Run a free audit on your website and get a scored report with the most impactful fixes ranked by priority.
            No email required to see your score.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaPrimary} onClick={() => navigate('seoaudit')}>
              Run a Free SEO Audit →
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate('contact')}>
              Talk to an expert
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
