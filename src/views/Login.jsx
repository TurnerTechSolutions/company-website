'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';
import styles from './Login.module.css';

export default function Login() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  useEffect(() => {
    if (user) router.replace('/leads');
  }, [user, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/leads');
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

  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden="true" />
      <form className={styles.card} onSubmit={submit}>
        <div className={styles.eyebrow}>// internal</div>
        <h1 className={styles.title}>Lead Dashboard</h1>
        <p className={styles.sub}>Sign in to access your prospect pipeline.</p>

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

        <button className={styles.btn} type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>
    </div>
  );
}
