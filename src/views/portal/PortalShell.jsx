'use client';
// Portal chrome: guard + client scope + header/nav shared by every
// /portal page. Staff and clients render the exact same shell; the
// only differences are the client switcher link and visible tabs.
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PortalGuard from '../../components/PortalGuard';
import { ClientScopeProvider, useClientScope } from '../../portal/ClientScope';
import { useAuth } from '../../context/AuthProvider';
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
  const { clientId, client, isStaffView } = useClientScope();
  const { signOut } = useAuth();
  const pathname = usePathname();

  // Staff tab links carry ?client= so the active client survives navigation.
  const withClient = (href) =>
    isStaffView && clientId ? `${href}?client=${clientId}` : href;

  // Reports / Roadmap / Account tabs appear here as their increments land.
  const tabs = [
    { label: 'Overview', href: '/portal', active: pathname === '/portal', scoped: true },
    { label: 'Work', href: '/portal/work', active: pathname === '/portal/work', scoped: true },
  ];
  if (isStaffView) {
    tabs.push({ label: 'Clients', href: '/portal/admin', active: pathname === '/portal/admin' });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>TTS</span>
            <span className={styles.brandLabel}>Client Portal</span>
          </div>

          <nav className={styles.tabs} aria-label="Portal">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.scoped ? withClient(t.href) : t.href}
                className={t.active ? styles.tabActive : styles.tab}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className={styles.headerRight}>
            {client && <span className={styles.clientChip}>{client.name}</span>}
            <button className={styles.signOut} type="button" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
