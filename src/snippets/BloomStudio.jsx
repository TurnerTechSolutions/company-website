import React from 'react';
import styles from './BloomStudio.module.css';

const products = [
  { name: 'Garden Bouquet', price: 'From $48', colorClass: 'bp1' },
  { name: 'Wild Foliage',   price: 'From $62', colorClass: 'bp2' },
  { name: 'Lavender Dreams',price: 'From $55', colorClass: 'bp3' },
];

export default function BloomStudio() {
  return (
    <div className={styles.wrapper}>
      {/* Nav */}
      <div className={styles.nav}>
        <div className={styles.logo}>Bloom Studio</div>
        <div className={styles.navLinks}>
          {['Shop', 'Weddings', 'Events', 'About'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroImg}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
        </div>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>Handcrafted in Atlanta</div>
          <h3>Fresh flowers,<br />thoughtfully arranged.</h3>
          <p>
            Bespoke bouquets and arrangements for every occasion, delivered
            same-day across Atlanta.
          </p>
          <a className={styles.btn}>Shop Now</a>
        </div>
      </div>

      {/* Products */}
      <div className={styles.products}>
        {products.map((p) => (
          <div key={p.name} className={styles.product}>
            <div className={`${styles.productImg} ${styles[p.colorClass]}`} />
            <div className={styles.productName}>{p.name}</div>
            <div className={styles.productPrice}>{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
