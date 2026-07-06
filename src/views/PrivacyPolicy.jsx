'use client';
import React from 'react';
import styles from './PrivacyPolicy.module.css';

const sections = [
  {
    num: '1.',
    title: 'Who We Are',
    content: (
      <>
        <p>
          TurnerTechSolutions is a website design and development business based in
          Alpharetta, Georgia. We provide our services to clients located in the State
          of Georgia, USA.
        </p>
        <p><strong>Contact:</strong> <a href="mailto:antonio@turnertechsolutions.com">antonio@turnertechsolutions.com</a></p>
      </>
    ),
  },
  {
    num: '2.',
    title: 'Information We Collect',
    content: (
      <>
        <h3>2.1 Information You Provide Directly</h3>
        <p>We collect information you voluntarily submit through forms on our Site:</p>
        <ul>
          <li><strong>Contact Form:</strong> Name, email address, business name, and project information.</li>
          <li><strong>Referral Form:</strong> Name, email address, business name, and project information.</li>
        </ul>
        <p>
          We do not currently operate any account, login, customer portal, or e-commerce
          checkout on the Site, so we do not collect passwords, payment card information,
          or login credentials through the Site.
        </p>

        <h3>2.2 Information Collected Automatically</h3>
        <p>
          When you visit any website, the hosting server typically receives basic technical
          information such as your IP address, browser type, device type, and the pages you
          view. This is standard for all websites and is used for security and reliability
          of the Site.
        </p>
        <p>
          We do <strong>not</strong> currently use Google Analytics, Meta Pixel, or any
          third-party analytics or advertising tracking on the Site. We do{' '}
          <strong>not</strong> set marketing or analytics cookies. If we add these tools in
          the future, this Privacy Policy will be updated and the effective date revised.
        </p>

        <h3>2.3 Information We Do Not Collect</h3>
        <p>
          We do not collect: Social Security numbers, driver's license numbers, financial
          account information, health information, biometric data, or precise geolocation
          data through the Site.
        </p>
      </>
    ),
  },
  {
    num: '3.',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information you submit through our forms to:</p>
        <ul>
          <li>Respond to your inquiry and follow up about a potential project.</li>
          <li>Provide quotes, proposals, and information about our services.</li>
          <li>Communicate with you about a project in progress or referral you have submitted.</li>
          <li>Maintain records of business communications.</li>
          <li>Comply with legal obligations and protect our legal rights.</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your information for any
          purpose other than those described in this Privacy Policy without first asking
          your permission.
        </p>
      </>
    ),
  },
  {
    num: '4.',
    title: 'How We Share Your Information',
    content: (
      <>
        <p>We share information only in the limited circumstances described below.</p>

        <h3>4.1 Service Providers</h3>
        <p>
          We use trusted third-party service providers to operate the Site. These providers
          process information only to perform services for us and are obligated to protect
          your information.
        </p>
        <ul>
          <li>
            <strong>Formspree:</strong> Processes submissions from our contact and referral
            forms and forwards them to our email. Their privacy practices are described at{' '}
            <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noreferrer">
              formspree.io/legal/privacy-policy
            </a>.
          </li>
          <li>
            <strong>Email and hosting providers:</strong> We use standard email and web
            hosting services to receive your messages and deliver our Site.
          </li>
        </ul>

        <h3>4.2 Legal Reasons</h3>
        <p>
          We may disclose information if required to do so by law, subpoena, or court order,
          or if we believe in good faith that disclosure is necessary to protect our rights,
          your safety or the safety of others, or to investigate fraud or respond to a
          government request.
        </p>

        <h3>4.3 Business Transfers</h3>
        <p>
          If TurnerTechSolutions is involved in a merger, acquisition, or sale of all or a
          portion of its assets, your information may be transferred as part of that
          transaction. We will notify you of any such change and any choices you may have.
        </p>
      </>
    ),
  },
  {
    num: '5.',
    title: 'Cookies and Similar Technologies',
    content: (
      <p>
        The Site does not currently set advertising, analytics, or tracking cookies. Some
        essential cookies may be set automatically by our hosting platform to keep the Site
        functioning properly. Your browser settings allow you to refuse or delete cookies if
        you wish; doing so should not prevent you from using the Site. If we begin using
        analytics or advertising cookies in the future, this section will be updated to
        disclose them and to provide opt-out options where required.
      </p>
    ),
  },
  {
    num: '6.',
    title: 'How Long We Keep Your Information',
    content: (
      <p>
        We keep form submissions and project-related communications for as long as we have
        an active or potential relationship with you, plus a reasonable period afterward to
        handle follow-up questions, comply with our legal and tax obligations, and resolve
        any disputes. We typically retain business correspondence and project records for up
        to <strong>seven (7) years</strong>. If you would like us to delete information you
        have submitted, contact us at the email address in Section 11 and we will honor
        reasonable requests, subject to any legal obligation we have to retain certain
        records.
      </p>
    ),
  },
  {
    num: '7.',
    title: 'How We Protect Your Information',
    content: (
      <p>
        We use reasonable administrative, technical, and physical safeguards to protect the
        information we collect, including using reputable service providers and limiting
        access to information to those who need it. However, no method of transmission over
        the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
        security.
      </p>
    ),
  },
  {
    num: '8.',
    title: 'Your Choices',
    content: (
      <>
        <p>You can:</p>
        <ul>
          <li>
            <strong>Decline to provide information.</strong> You are not required to submit
            a form to view our Site, although we cannot respond to an inquiry without your
            contact information.
          </li>
          <li>
            <strong>Request access, correction, or deletion.</strong> Contact us using the
            information in Section 11 and we will respond to reasonable requests in a timely
            manner.
          </li>
          <li>
            <strong>Opt out of communications.</strong> If you have submitted a form, you
            may ask us to stop contacting you at any time by replying to any email from us
            or contacting us directly.
          </li>
        </ul>
      </>
    ),
  },
  {
    num: '9.',
    title: "Children's Privacy",
    content: (
      <p>
        The Site and our services are intended for businesses and adults. We do not knowingly
        collect information from children under 13 years of age. If you believe a child under
        13 has submitted information to us, please contact us and we will delete it.
      </p>
    ),
  },
  {
    num: '10.',
    title: 'Third-Party Websites',
    content: (
      <p>
        Our Site may contain links to third-party websites (for example, social media
        profiles or partner sites). We are not responsible for the privacy practices of those
        sites. We encourage you to read their privacy policies before submitting any
        information to them.
      </p>
    ),
  },
  {
    num: '11.',
    title: 'How to Contact Us',
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or how we handle your information,
          please contact us:
        </p>
        <p>
          <strong>Turner Technologies LLC</strong> (DBA TurnerTechSolutions)<br />
          Alpharetta, Georgia, USA<br />
          Email:{' '}
          <a href="mailto:antuonette@turnertechsolutions.com">
            antuonette@turnertechsolutions.com
          </a>
        </p>
      </>
    ),
  },
  {
    num: '12.',
    title: 'Changes to This Privacy Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our
        practices, technology, legal requirements, or for other reasons. When we make
        changes, we will revise the "Last Updated" date at the top of this page. If the
        changes are significant, we will provide a more prominent notice on the Site. Your
        continued use of the Site after a change becomes effective means you accept the
        updated Privacy Policy.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className="section-label">// legal</div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <div className={styles.meta}>
            <span>Effective Date: May 8, 2026</span>
            <span className={styles.metaDivider}>·</span>
            <span>Last Updated: May 8, 2026</span>
          </div>
          <p className={styles.intro}>
            Turner Technologies LLC, doing business as TurnerTechSolutions, respects your
            privacy and is committed to being transparent about how we collect and use
            information. This Privacy Policy explains what information we collect through{' '}
            <a href="https://www.turnertechsolutions.com">www.turnertechsolutions.com</a>,
            how we use it, and the choices you have.
          </p>
          <p className={styles.introSub}>
            By using the Site, you agree to the practices described in this Privacy Policy.
            If you do not agree, please do not use the Site.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        {/* TOC */}
        <nav className={styles.toc}>
          <div className={styles.tocLabel}>// contents</div>
          <ol className={styles.tocList}>
            {sections.map((s) => (
              <li key={s.num}>
                <a href={`#section-${s.num.replace('.', '')}`}>
                  <span className={styles.tocNum}>{s.num}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className={styles.sections}>
          {sections.map((s) => (
            <section
              key={s.num}
              id={`section-${s.num.replace('.', '')}`}
              className={styles.section}
            >
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>{s.num}</span>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
              </div>
              <div className={styles.sectionContent}>
                {s.content}
              </div>
            </section>
          ))}

          <div className={styles.lastUpdated}>
            This Privacy Policy was last updated on May 8, 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
