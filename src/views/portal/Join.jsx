'use client';
// Invite acceptance: a teammate self-registers here. Their account
// only gets portal access if invites/{their email} exists; the
// Firestore rules enforce the match, this page just drives the flow.
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { acceptInvite } from '../../portal/portalService';
import styles from '../Login.module.css';

export default function Join() {
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use a password of at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      try {
        await acceptInvite(cred.user, name.trim());
        router.replace('/portal');
        return;
      } catch (err) {
        // No matching invite (or rules rejected the profile): clean up
        // the just-created Auth account so nothing is left orphaned.
        await cred.user.delete().catch(() => {});
        setError(
          err.code === 'portal/no-invite'
            ? 'We could not find an invitation for that email. Ask your team to invite you, and use the exact address they invited.'
            : 'Something went wrong setting up your access. Contact Turner Tech Solutions and we will sort it out.'
        );
      }
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'An account with that email already exists. Sign in instead.'
          : err.code === 'auth/invalid-email'
            ? 'That email address does not look right.'
            : 'Could not create the account. Check your connection and try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden="true" />
      <form className={styles.card} onSubmit={submit}>
        <div className={styles.eyebrow}>// turner tech solutions</div>
        <h1 className={styles.title}>Join Your Portal</h1>
        <p className={styles.sub}>
          Invited by your team? Create your account with the email address the invite was sent to.
        </p>

        <label className={styles.label} htmlFor="join-name">Your name</label>
        <input
          id="join-name" type="text" autoComplete="name"
          className={styles.input} value={name}
          onChange={(e) => setName(e.target.value)} required
        />

        <label className={styles.label} htmlFor="join-email">Email</label>
        <input
          id="join-email" type="email" autoComplete="username"
          className={styles.input} value={email}
          onChange={(e) => setEmail(e.target.value)} required
        />

        <label className={styles.label} htmlFor="join-password">Choose a password</label>
        <input
          id="join-password" type="password" autoComplete="new-password"
          className={styles.input} value={password}
          onChange={(e) => setPassword(e.target.value)} required
        />

        {error && <div className={styles.error} role="alert">{error}</div>}

        <button className={styles.btn} type="submit" disabled={busy}>
          {busy ? 'Setting up…' : 'Create Account →'}
        </button>

        <Link className={styles.linkBtn} href="/login">
          Already have an account? Sign in
        </Link>
      </form>
    </div>
  );
}
