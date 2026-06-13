import React from 'react';
import styles from './About.module.css';

const skills = [
  'React / Next.js', 'TypeScript', 'Node.js', 'Python',
  'PostgreSQL', 'REST APIs', 'AWS / Cloud', 'CI/CD',
   'Performance', 'Git / GitHub'
];

const badges = [
  'Full-Stack', 'React / Next.js', 'Node.js', 'UI/UX', 'SEO', 'Atlanta, GA',
];

export default function About() {
  return (
    <div className={styles.wrapper}>
      <div className="section">
        <div className="section-label">// about</div>
        <h2>
          Digital business partner.<br />
          Built for growth.
        </h2>

        <div className={styles.aboutGrid}>
          {/* Left: bio */}
          <div className={styles.aboutText}>
            <p>
              I started Turner Technologies on a simple premise: small businesses deserve
              a complete digital strategy, not just a website, but a managed Google presence,
              targeted advertising, and the online foundation needed to grow.
            </p>
            <p>
              With a background spanning full-stack development, system architecture, and
              digital marketing, I bring a depth of technical knowledge and marketing acumen
              that most digital agencies don't combine. That means smarter ads, better Google
              rankings, and a website that actually converts.
            </p>
            <p>
              Every project is a direct collaboration. No account managers, no juniors
              handing off work. You work directly with me from discovery to launch.
            </p>
            <div className={styles.badges}>
              {badges.map((b) => (
                <span key={b} className={styles.badge}>{b}</span>
              ))}
            </div>
          </div>

          {/* Right: skills + approach */}
          <div>
            <div className={styles.skillsLabel}>// technical expertise</div>
            <div className={styles.skillsGrid}>
              {skills.map((s) => (
                <div key={s} className={styles.skillTag}>{s}</div>
              ))}
            </div>

            <div className={styles.approachBox}>
              <div className={styles.skillsLabel}>// approach</div>
              <p>
                Growth-first. Google Business Profile, ad campaigns, and your website all
                work together, optimized, monitored, and managed so your business keeps
                growing without you having to manage it all yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
