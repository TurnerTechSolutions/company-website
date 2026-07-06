'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

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

  if (!user) return null;
  return children;
}
