'use client';
// Portal chrome: guard + client scope + header/nav shared by every
// /portal page. Staff and clients render the exact same shell; the
// only differences are the client switcher link and visible tabs.
// Desktop shows inline tabs; mobile collapses them behind a hamburger.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PortalGuard from '../../components/PortalGuard';
import { ClientScopeProvider, useClientScope } from '../../portal/ClientScope';
import { useAuth } from '../../context/AuthProvider';
import logo from '../../images/logos/logo.png';
import styles from './PortalShell.module.css';

export default function PortalShell({ children }) {
  return (
    <PortalGuard allow={['staff', 'client']}>
      <ClientScopeProvider>
        <Chrome>{children}</Chrome>
      </ClientScopeProvider>
    </PortalGuard>
  );
}

function Chrome({ children }) {
  const { clientId, client, isStaffView, memberships } = useClientScope();
  const { signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const multiBusiness = !isStaffView && memberships.length > 1;

  const switchBusiness = (id) => {
    setMenuOpen(false);
    router.push(`${pathname}?client=${id}`);
  };

  // Close the mobile menu on navigation and when leaving mobile widths.
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 760) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Staff tab links carry ?client= so the active client survives navigation.
  const withClient = (href) =>
    isStaffView && clientId ? `${href}?client=${clientId}` : href;

  // The Roadmap tab appears when its increment lands.
  const tabs = [
    { label: 'Overview', href: '/portal', active: pathname === '/portal', scoped: true },
    { label: 'Work', href: '/portal/work', active: pathname === '/portal/work', scoped: true },
    { label: 'Reports', href: '/portal/reports', active: pathname === '/portal/reports', scoped: true },
    { label: 'Account', href: '/portal/account', active: pathname === '/portal/account', scoped: true },
  ];
  if (isStaffView) {
    tabs.push({ label: 'Clients', href: '/portal/admin', active: pathname === '/portal/admin' });
  }

  const tabHref = (t) => (t.scoped ? withClient(t.href) : t.href);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Turner Tech Solutions home">
              <img src={logo.src ?? logo} alt="" className={styles.logoImg} />
            </Link>
            <span className={styles.brandLabel}>Client Portal</span>
          </div>

          <nav className={styles.tabs} aria-label="Portal">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={tabHref(t)}
                className={t.active ? styles.tabActive : styles.tab}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className={styles.headerRight}>
            {multiBusiness ? (
              <select
                className={styles.bizSwitch}
                value={clientId || ''}
                onChange={(e) => switchBusiness(e.target.value)}
                aria-label="Switch business"
              >
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            ) : (
              client && <span className={styles.clientChip}>{client.name}</span>
            )}
            <button className={styles.signOut} type="button" onClick={() => signOut()}>
              Sign out
            </button>
          </div>

          <button
            className={styles.hamburger}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close portal menu' : 'Open portal menu'}
            aria-expanded={menuOpen}
            aria-controls="portal-mobile-menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} aria-hidden="true" />
            <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} aria-hidden="true" />
            <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} aria-hidden="true" />
          </button>
        </div>

        {menuOpen && (
          <nav id="portal-mobile-menu" className={styles.mobileMenu} aria-label="Portal menu">
            {multiBusiness ? (
              <select
                className={styles.bizSwitchMobile}
                value={clientId || ''}
                onChange={(e) => switchBusiness(e.target.value)}
                aria-label="Switch business"
              >
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            ) : (
              client && <div className={styles.menuClient}>{client.name}</div>
            )}
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={tabHref(t)}
                className={t.active ? styles.menuLinkActive : styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                {t.label}
              </Link>
            ))}
            <button className={styles.menuSignOut} type="button" onClick={() => signOut()}>
              Sign out
            </button>
          </nav>
        )}
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
