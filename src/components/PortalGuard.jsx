'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';

// Role-aware route guard.
//   <PortalGuard allow={['staff']}>…</PortalGuard>
// No user  → /login?next=<current path>
// Wrong or missing role → clients go to /portal, everyone else to /login
// (Login shows a "not provisioned" notice for signed-in users with no
// profile doc, so there is no redirect loop.)
export default function PortalGuard({ allow = ['staff', 'client'], children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = !!user && allow.includes(role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!allowed) {
      router.replace(role === 'client' ? '/portal' : '/login');
    }
  }, [loading, user, allowed, role, router, pathname]);

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh', display: 'grid', placeItems: 'center',
        fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.1em',
      }}>
        // authenticating…
      </div>
    );
  }

  if (!allowed) return null;
  return children;
}
