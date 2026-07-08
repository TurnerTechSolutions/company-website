'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';
import styles from './Login.module.css';

// Shared sign-in for staff and clients.
// Redirect priority: ?next= (same-origin path) → role home
// (client → /portal, staff → /leads).
function destinationFor(role, next) {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return role === 'client' ? '/portal' : '/leads';
}

export default function Login() {
  const { signIn, signOut, resetPassword, user, role, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState('');
  const [busy, setBusy]         = useState(false);

  useEffect(() => {
    if (!loading && user && role) {
      router.replace(destinationFor(role, next));
    }
  }, [loading, user, role, next, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      // Redirect happens in the effect above once the profile loads.
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'Incorrect email or password.'
          : 'Sign-in failed. Check your connection and try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter your email above first, then tap "Forgot password?" again.');
      return;
    }
    try {
      await resetPassword(email.trim());
      setNotice('Password reset email sent. Check your inbox.');
    } catch {
      setError('Could not send the reset email. Double-check the address.');
    }
  };

  // Signed in, but no users/{uid} profile doc: the account has not been
  // provisioned. Show a notice instead of redirect-looping with PortalGuard.
  if (!loading && user && !role) {
    return (
      <div className={styles.wrap}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.card}>
          <div className={styles.eyebrow}>// account</div>
          <h1 className={styles.title}>Almost there</h1>
          <p className={styles.sub}>
            Your login works, but your account has not been set up yet.
            Contact Turner Tech Solutions and we will finish it for you.
          </p>
          <button className={styles.btn} type="button" onClick={() => signOut()}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden="true" />
      <form className={styles.card} onSubmit={submit}>
        <div className={styles.eyebrow}>// turner tech solutions</div>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.sub}>Access your client portal and project workspace.</p>

        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email" type="email" autoComplete="username"
          className={styles.input} value={email}
          onChange={(e) => setEmail(e.target.value)} required
        />

        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password" type="password" autoComplete="current-password"
          className={styles.input} value={password}
          onChange={(e) => setPassword(e.target.value)} required
        />

        {error && <div className={styles.error} role="alert">{error}</div>}
        {notice && <div className={styles.notice} role="status">{notice}</div>}

        <button className={styles.btn} type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In →'}
        </button>

        <button className={styles.linkBtn} type="button" onClick={forgot}>
          Forgot password?
        </button>
      </form>
    </div>
  );
}
