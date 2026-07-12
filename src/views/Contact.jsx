'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, ValidationError } from '@formspree/react';
import styles from './Contact.module.css';
import { track } from '@vercel/analytics';
import { usePostHog } from '@posthog/react';

const situationTypes = [
  'No website at all',
  "Website that doesn't convert",
  'Not showing up on Google',
  'Running ads with no results',
  'All of the above',
  'Something else',
];

const howItWorks = [
  { num: '01', title: 'Refer a business',    desc: "Share your referral link or submit the form below with your contact's details." },
  { num: '02', title: 'They sign a contract', desc: "Once your referral moves to a signed contract and pays their deposit, you're eligible." },
  { num: '03', title: 'You get rewarded',     desc: 'Receive one free month of your retainer, credited automatically on your next invoice.' },
];

/* ── Contact form ── */
function ContactForm() {
  const [state, handleForm] = useForm('maqvrgjb');
  const posthog = usePostHog();
  const router = useRouter();

   const handleSubmit = (e) => {
    e.preventDefault();
    // ── Capture ALL field values FIRST before anything else runs ──
    const firstname    = e.target.firstname?.value    || '';
    const lastname     = e.target.lastname?.value     || '';
    const email        = e.target.email?.value        || '';
    const phone        = e.target.phone?.value        || '';
    const company      = e.target.company?.value      || '';
    const project_type = e.target.project_type?.value || '';
    const message      = e.target.message?.value      || '';
 
    // ── Track in Vercel Analytics ──
    track('Contact Form');
 
    // ── Capture full event in PostHog ──
    posthog?.capture('contact_form_submitted', {
      firstname,
      lastname,
      email,
      phone,
      company,
      project_type,
      message,
    });
 
    // ── Identify the person so all future sessions link to them ──
    if (email) {
      posthog?.identify(email, {
        email,
        name:    `${firstname} ${lastname}`.trim(),
        company,
        phone,
      });
    }
 
    // ── Submit to Formspree AFTER capturing everything ──
    handleForm(e);
 
    // ── Google Ads conversion ──
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion();
    }
  };

  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', { content_name: 'Contact', content_category: 'Lead Generation' });
    }
  }, []);

  useEffect(() => {
    if (state.succeeded && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact');
    }
  }, [state.succeeded]);

  return (
    <div className={styles.contactWrap}>
      {/* <div className="section-label">// contact</div> */}
      {/* <h2 className={styles.pageTitle}>Let's build<br />something.</h2> */}
      <div className={styles.split}>

        {/* LEFT */}
        <div className={styles.splitLeft}>
          <div className={styles.leftGlow} aria-hidden="true" />

          <div className={styles.leftTop}>
            <div className={styles.eyebrow}>// the uncomfortable truth</div>
            <h1 className={styles.headline}>
              Your business deserves <span>more than just a website.</span>
            </h1>
            <p className={styles.leadCopy}>
              If your business isn't showing up on Google, in search results, the map pack, or ads,
              you don't exist to most customers. They'll find your competitor, click their ad, and call them instead.{' '}
              <strong>They just invested in being found first.</strong>
            </p>

            <div className={styles.urgencyBlock}>
              <div className={styles.urgencyLabel}>// you're losing customers right now</div>
              <p className={styles.urgencyCopy}>
                <strong>Right now,</strong> while you're reading this, someone is searching for what you do
                and finding your competitor. Every month without a managed Google presence is a month of compounding loss.
              </p>
            </div>

            <div className={styles.painList}>
              {[
                'Invisible on Google when locals search for you',
                'Paying for ads that go nowhere',
                "Not knowing what's broken, or what it's costing you",
              ].map((p) => (
                <div key={p} className={styles.painItem}>
                  <span className={styles.painArrow} aria-hidden="true">▼</span>
                  {p}
                </div>
              ))}
            </div>

            <p className={styles.turnCopy}>
              We've helped businesses in roofing, restaurants, real estate, and healthcare go from
              invisible to fully booked. Free audit, no pitch, no pressure.
            </p>
          </div>

          <div className={styles.leftBottom}>
            <div className={styles.priceBox}>
              <div className={styles.priceLabel}>// starting at</div>
              <div className={styles.priceValue}>$250<span className={styles.pricePer}>/mo</span></div>
              <div className={styles.priceSub}>Google Business Profile · SEO · Website</div>
              <div className={styles.priceTerms}>Cancel anytime · Free audit to start</div>
            </div>
            <button
              className={styles.viewPackagesBtn}
              onClick={() => {
                router.push('/');
                setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 150);
              }}
            >
              View Growth &amp; Pro packages →
            </button>
            <div className={styles.detailsRow}>
              <div className={styles.detail}><span className={styles.detailIcon}>@</span><span>antonio@turnertechsolutions.com</span></div>
              <div className={styles.detail}><span className={styles.detailIcon}>✆</span><a href="tel:+14044823190" className={styles.detailLink}>(404) 482-3190</a></div>
              <div className={styles.detail}><span className={styles.detailIcon}>↻</span><span>Responds same day</span></div>
              <div className={styles.detail}><span className={styles.detailIcon}>#</span><span>1725 Township Cir, Alpharetta, GA 30004</span></div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.splitRight}>
          {state.succeeded ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✦</div>
              <h3>Message received.</h3>
              <p>Thanks for reaching out. We'll be in touch within 24 hours with an honest look at what's holding your business back online.</p>
              <div className={styles.successDivider} />
              <div className={styles.bookingPrompt}>
                <div className={styles.bookingLabel}>// want to talk sooner?</div>
                <p className={styles.bookingDesc}>Skip the back-and-forth. Book a free 30-minute discovery call directly on our calendar.</p>
                <a href="https://calendly.com/antonio-turnertechsolutions/website-discovery-call" target="_blank" rel="noreferrer" className={styles.bookingBtn} onClick={() => posthog?.capture('book_call_clicked')}>
                  Book a Free Call →
                </a>
                <p className={styles.bookingNote}>Zoom link sent automatically on booking.</p>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formHeadline}>
                  Tell us about your business.<br />We'll show you what you're missing.
                </h2>
                <p className={styles.formSubhead}>Free audit · No pitch · No commitment</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Contact inquiry form">
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
                    <input type="text" name="_gotcha" value="" onChange={() => {}} style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} tabIndex="-1" autoComplete="off" aria-hidden="true" />
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
                  <label htmlFor="projectType">What describes you best?</label>
                  <select id="projectType" name="project_type">
                    <option value="">Select your situation...</option>
                    {situationTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Tell us about your business.</label>
                  <textarea id="message" name="message" placeholder="Give as much detail as possible about your business and the challenges you're facing. This will help us understand your needs and provide the best solution for you." />
                  <ValidationError field="message" prefix="Message" errors={state.errors} className={styles.fieldError} />
                </div>

                <div aria-live="polite" aria-atomic="true">
                  <ValidationError errors={state.errors} className={styles.formError} />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={state.submitting}>
                  {state.submitting ? 'Sending...' : 'I Want to Stop Losing Customers →'}
                </button>

                <div className={styles.formNote}>
                  Free audit · No pitch · Responds same day ·{' '}
                  <a href="https://calendly.com/antonio-turnertechsolutions/website-discovery-call" target="_blank" rel="noreferrer" onClick={() => posthog?.capture('book_call_clicked', { source: 'contact_form_note' })} className={styles.formNoteLink}>
                    Book a call instead →
                  </a>
                </div>
              </form>
            </>
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
  const handleSubmit = (e) => { posthog?.capture('referral_form_submitted'); handleForm(e); };

  return (
    <div className={styles.referralFormWrap}>
      {state.succeeded ? (
        <div className={styles.referralSuccess}>
          <div className={styles.successIcon}>✦</div>
          <h3>Referral submitted.</h3>
          <p>Thanks. I'll reach out to your contact and let you know when they're signed. Your free month will be credited once the contract is confirmed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="_subject" value="New referral submission" />
          <input type="hidden" name="formType" value="referral" />
          <div className={styles.referralFormGrid}>
            <div className={styles.referralCol}>
              <div className={styles.referralColLabel}>// your details</div>
              <div className={styles.formGroup}><label htmlFor="refYourName">Your name</label><input id="refYourName" type="text" name="yourName" placeholder="Your name" required /></div>
              <div className={styles.formGroup}><label htmlFor="refYourEmail">Your email</label><input id="refYourEmail" type="email" name="yourEmail" placeholder="you@yourbusiness.com" required /></div>
            </div>
            <div className={styles.referralCol}>
              <div className={styles.referralColLabel}>// their details</div>
              <div className={styles.formGroup}><label htmlFor="refTheirName">Their name</label><input id="refTheirName" type="text" name="referralName" placeholder="Contact's name" required /></div>
              <div className={styles.formGroup}><label htmlFor="refTheirEmail">Their email</label><input id="refTheirEmail" type="email" name="referralEmail" placeholder="them@theirbusiness.com" required /></div>
              <div className={styles.formGroup}><label htmlFor="refTheirBiz">Their business</label><input id="refTheirBiz" type="text" name="referralBusiness" placeholder="Business name" /></div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="refNote">Anything I should know? (optional)</label>
            <textarea id="refNote" name="referralNote" placeholder="What does their current digital presence look like? How do you know them?" style={{ minHeight: '80px' }} />
          </div>
          <div aria-live="polite" aria-atomic="true"><ValidationError errors={state.errors} className={styles.formError} /></div>
          <button type="submit" className={styles.submitBtn} disabled={state.submitting}>{state.submitting ? 'Submitting...' : 'Submit Referral →'}</button>
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
      {/* <section className={styles.referralSection}>
        <div className={styles.referralInner}>
          <div className={styles.referralHeader}>
            <div>
              <div className="section-label">// referral program</div>
              <h2 className={styles.referralTitle}>Know a business that<br />wants to grow online?</h2>
            </div>
            <div className={styles.referralReward}>
              <div className={styles.rewardLabel}>// your reward</div>
              <div className={styles.rewardValue}>1 Free Month</div>
              <div className={styles.rewardSub}>of your retainer plan, credited on your next invoice when your referral signs a contract.</div>
            </div>
          </div>
          <div className={styles.howItWorks}>
            {howItWorks.map((s) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.finePrint}>
            <span className={styles.finePrintIcon}>ⓘ</span>
            Referral reward applies to active retainer clients only. One reward per successful referral. No limit on how many referrals you can submit. Rewards stack.
          </div>
          <div className={styles.referralFormSection}>
            <div className={styles.referralFormHeader}>
              <h3>Submit a referral</h3>
              <p>Already have someone in mind? Fill this out and I'll take it from there.</p>
            </div>
            <ReferralForm />
          </div>
        </div>
      </section> */}
    </div>
  );
}
