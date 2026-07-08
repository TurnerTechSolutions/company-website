// ──────────────────────────────────────────────────────────────
// Auth context — wraps Firebase Auth (email/password) and the
// users/{uid} profile doc ({role: 'staff'|'client', clientId}).
// `loading` stays true until BOTH auth state and profile resolve,
// so route guards never flash or misroute.
// ──────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({
  user: null, profile: null, role: null, clientId: null, loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser]                 = useState(null);
  const [profile, setProfile]           = useState(null);
  const [authReady, setAuthReady]       = useState(false);
  const [profileReady, setProfileReady] = useState(true);

  useEffect(() => {
    let unsubProfile = null;
    let watchdog = null;
    const stopProfile = () => {
      if (unsubProfile) { unsubProfile(); unsubProfile = null; }
      if (watchdog) { clearTimeout(watchdog); watchdog = null; }
    };
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      stopProfile();
      setUser(u);
      if (u) {
        setProfileReady(false);
        // Never let a wedged Firestore connection block auth forever:
        // after 8s, continue without a profile (guards then route to
        // /login, which shows the "not set up yet" notice).
        watchdog = setTimeout(() => {
          console.warn('[auth] profile load timed out, continuing without profile');
          setProfile(null);
          setProfileReady(true);
        }, 8000);
        unsubProfile = onSnapshot(
          doc(db, 'users', u.uid),
          (snap) => {
            if (watchdog) { clearTimeout(watchdog); watchdog = null; }
            setProfile(snap.exists() ? { uid: u.uid, ...snap.data() } : null);
            setProfileReady(true);
          },
          (err) => {
            if (watchdog) { clearTimeout(watchdog); watchdog = null; }
            console.error('[auth] profile load error', err);
            setProfile(null);
            setProfileReady(true);
          }
        );
      } else {
        setProfile(null);
        setProfileReady(true);
      }
      setAuthReady(true);
    });
    return () => { stopProfile(); unsubAuth(); };
  }, []);

  const value = {
    user,
    profile,
    role:     profile ? profile.role : null,
    clientId: profile ? (profile.clientId || null) : null,
    loading:  !authReady || !profileReady,
    signIn:        (email, password) => signInWithEmailAndPassword(auth, email, password),
    signOut:       () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
