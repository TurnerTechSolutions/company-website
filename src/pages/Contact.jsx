import React, { useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styles from './Contact.module.css';
import { track } from '@vercel/analytics';
import { usePostHog } from '@posthog/react';

const projectTypes = [
  'New business website',
  'Redesign existing site',
  'Landing page',
  'E-commerce',
  'Ongoing maintenance',
  'SEO optimization',
  'Application development',
  'Other',
];

const howItWorks = [
  {
    num: '01',
    title: 'Refer a business',
    desc: 'Share your referral link or submit the form below with your contact\'s details.',
  },
  {
    num: '02',
    title: 'They sign a contract',
    desc: 'Once your referral moves to a signed contract and pays their deposit, you\'re eligible.',
  },
  {
    num: '03',
    title: 'You get rewarded',
    desc: 'Receive one free month of your retainer — credited automatically on your next invoice.',
  },
];

/* ── Contact form ── */
function ContactForm() {
  const [state, handleForm] = useForm('maqvrgjb');
  const posthog = usePostHog();

  useEffect(() => {
  if (state.succeeded) {
    // Track conversion for PostHog A/B test
    if (window.posthog) {
      window.posthog.capture('contact_form_submitted', {
        source: 'contact_page',
      });
    }
  }
}, [state.succeeded]);

  const handleSubmit = (e) => {
    track('Contact Form');
    posthog?.capture('contact_form_submitted', {
      project_type: e.target.project_type?.value || '',
    });
    handleForm(e);
    gtag_report_conversion();
  };

  // Fire Meta Pixel ViewContent when contact page loads
    useEffect(() => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: 'Contact',
          content_category: 'Lead Generation',
        });
      }
    }, []);

    // Fire Meta Pixel Lead event when form submits successfully
    useEffect(() => {
      if (state.succeeded && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'Contact Form Submission',
          content_category: 'Web Design Inquiry',
        });
      }
    }, [state.succeeded]);

  return (
    <div className="section">
      <div className="section-label">// contact</div>
      <h2>Let's build<br />something.</h2>

      <div className={styles.grid}>
        {/* LEFT */}
        <div className={styles.info}>
          <h3>Schedule a free consultation</h3>
          <p>
            Tell us about your project and We'll get back to you within 24 hours
            with thoughts, questions, and a rough scope.
          </p>

          <p>
            Already have a website? Schedule a free site audit and understand where you can improve. <a
                  href="https://calendly.com/antonio-turnertechsolutions/30min"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.auditBtn}
                  onClick={() => posthog?.capture('free_audit_link_clicked')}

            >
              Free audit
              </a>
          </p>

          <div className={styles.detail}>
            <div className={styles.detailIcon}>@</div>
            <span>antonio@turnertechsolutions.com</span>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailIcon}>#</div>
            <span>Atlanta, Georgia</span>
          </div>
          <div className={styles.detail}>
            <div className={styles.detailIcon}>↻</div>
            <span>Typically responds in &lt; 24hr</span>
          </div>

          <div className={styles.pricing}>
            <div className={styles.pricingLabel}>// starting from</div>
            <div className={styles.price}>$300<span style={{ fontSize: '0.9rem' }}>/month</span></div>
            <div className={styles.priceSub}>4-page business website</div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {state.succeeded ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✦</div>
              <h3>Message received.</h3>
              <p>Thanks for reaching out — I'll be in touch within 24 hours.</p>

              <div className={styles.successDivider} />

              <div className={styles.bookingPrompt}>
                <div className={styles.bookingLabel}>// want to talk sooner?</div>
                <p className={styles.bookingDesc}>
                  Skip the back-and-forth — book a free 30-minute discovery
                  call directly on our calendar.
                </p>
                <a
                  href="https://calendly.com/antonio-turnertechsolutions/30min"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.bookingBtn}
                  onClick={() => posthog?.capture('book_call_clicked')}
                >
                  Book a Free Call →
                </a>
                <p className={styles.bookingNote}>
                  Zoom link sent automatically on booking.
                </p>
              </div>
            </div>
          ) : (
           <form onSubmit={handleSubmit} className={styles.form}>

              {/* ── HubSpot hidden fields ──
                  These map to HubSpot contact/deal properties.
                  The Formspree → HubSpot integration reads these
                  field names to populate your CRM automatically. */}
              <input type="hidden" name="_hubspot_pipeline"      value="default" />
              <input type="hidden" name="_hubspot_pipeline_stage" value="appointmentscheduled" />
              <input type="hidden" name="hs_lead_status"          value="NEW" />
              <input type="hidden" name="lead_source"             value="Website Contact Form" />

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First name</label>
                  <input id="firstName" type="text" name="firstname" placeholder="Jane" required />
                  <ValidationError field="firstname" prefix="First name" errors={state.errors} className={styles.fieldError} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last name</label>
                  <input id="lastName" type="text" name="lastname" placeholder="Smith" required />
                  <ValidationError field="lastname" prefix="Last name" errors={state.errors} className={styles.fieldError} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" placeholder="jane@yourbusiness.com" required />
                  <ValidationError field="email" prefix="Email" errors={state.errors} className={styles.fieldError} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone number</label>
                  <input id="phone" type="tel" name="phone" placeholder="(404) 555-0100" />
                  <ValidationError field="phone" prefix="Phone" errors={state.errors} className={styles.fieldError} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="business">Business name</label>
                <input id="business" type="text" name="company" placeholder="Smith Consulting" />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="projectType">Project type</label>
                <select id="projectType" name="project_type">
                  <option value="">Select one...</option>
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Tell me about your project</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="What does your business do? What problem are you trying to solve? Any timeline or budget in mind?"
                />
                <ValidationError field="message" prefix="Message" errors={state.errors} className={styles.fieldError} />
              </div>

              <div aria-live="polite" aria-atomic="true"><ValidationError errors={state.errors} className={styles.formError} /></div>

              <button type="submit" className={styles.submitBtn} disabled={state.submitting}>
                {state.submitting ? 'Sending...' : 'Send Inquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Referral form ── */
function ReferralForm() {
  const [state, handleForm] = useForm('xaqvpqdg');
  const posthog = usePostHog();

  const handleSubmit = (e) => {
    posthog?.capture('referral_form_submitted');
    handleForm(e);
  };

  return (
    <div className={styles.referralFormWrap}>
      {state.succeeded ? (
        <div className={styles.referralSuccess}>
          <div className={styles.successIcon}>✦</div>
          <h3>Referral submitted.</h3>
          <p>Thanks — I'll reach out to your contact and let you know when they're signed. Your free month will be credited once the contract is confirmed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Hidden field so Formspree can distinguish referral submissions */}
          <input type="hidden" name="_subject" value="New referral submission" />
          <input type="hidden" name="formType" value="referral" />

          <div className={styles.referralFormGrid}>
            {/* Your details */}
            <div className={styles.referralCol}>
              <div className={styles.referralColLabel}>// your details</div>

              <div className={styles.formGroup}>
                <label htmlFor="refYourName">Your name</label>
                <input id="refYourName" type="text" name="yourName" placeholder="Your name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="refYourEmail">Your email</label>
                <input id="refYourEmail" type="email" name="yourEmail" placeholder="you@yourbusiness.com" required />
              </div>
            </div>

            {/* Their details */}
            <div className={styles.referralCol}>
              <div className={styles.referralColLabel}>// their details</div>

              <div className={styles.formGroup}>
                <label htmlFor="refTheirName">Their name</label>
                <input id="refTheirName" type="text" name="referralName" placeholder="Contact's name" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="refTheirEmail">Their email</label>
                <input id="refTheirEmail" type="email" name="referralEmail" placeholder="them@theirbusiness.com" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="refTheirBiz">Their business</label>
                <input id="refTheirBiz" type="text" name="referralBusiness" placeholder="Business name" />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="refNote">Anything I should know? (optional)</label>
            <textarea
              id="refNote"
              name="referralNote"
              placeholder="What kind of site do they need? How do you know them?"
              style={{ minHeight: '80px' }}
            />
          </div>

          <div aria-live="polite" aria-atomic="true"><ValidationError errors={state.errors} className={styles.formError} /></div>

          <button type="submit" className={styles.submitBtn} disabled={state.submitting}>
            {state.submitting ? 'Submitting...' : 'Submit Referral →'}
          </button>
        </form>
      )}
    </div>
  );
}

/* ── Page ── */
export default function Contact() {
  return (
    <div className={styles.wrapper}>
      <ContactForm />

      {/* ── REFERRAL PROGRAM ── */}
      <section className={styles.referralSection}>
        <div className={styles.referralInner}>

          {/* Header */}
          <div className={styles.referralHeader}>
            <div>
              <div className="section-label">// referral program</div>
              <h2 className={styles.referralTitle}>
                Know someone who<br />
                needs a website?
              </h2>
            </div>
            <div className={styles.referralReward}>
              <div className={styles.rewardLabel}>// your reward</div>
              <div className={styles.rewardValue}>1 Free Month</div>
              <div className={styles.rewardSub}>of your retainer plan, credited on your next invoice when your referral signs a contract.</div>
            </div>
          </div>

          {/* How it works */}
          <div className={styles.howItWorks}>
            {howItWorks.map((s) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Fine print */}
          <div className={styles.finePrint}>
            <span className={styles.finePrintIcon}>ⓘ</span>
            Referral reward applies to active retainer clients only. One reward per successful referral.
            No limit on how many referrals you can submit — rewards stack.
          </div>

          {/* Referral form */}
          <div className={styles.referralFormSection}>
            <div className={styles.referralFormHeader}>
              <h3>Submit a referral</h3>
              <p>Already have someone in mind? Fill this out and I'll take it from there.</p>
            </div>
            <ReferralForm />
          </div>

        </div>
      </section>
    </div>
  );
}
