'use client';
// ──────────────────────────────────────────────────────────────
// Resolves which client the portal is showing, and subscribes to
// that client's doc once for the whole portal tree.
//   client role → always their own profile.clientId
//   staff       → ?client=<id> in the URL (linkable), falling back
//                 to the last choice mirrored in localStorage
// ──────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';
import { subscribeClient } from './portalService';

const LS_KEY = 'tts-portal-client';

const ClientScopeContext = createContext({
  clientId: null, client: null, isStaffView: false,
});

export function ClientScopeProvider({ children }) {
  const { role, clientId: ownClientId } = useAuth();
  const searchParams = useSearchParams();
  const urlClient = searchParams.get('client');
  const [stored, setStored] = useState(null);
  const [client, setClient] = useState(null);

  // localStorage is read in an effect so SSR/hydration stay consistent.
  useEffect(() => {
    if (role === 'staff') setStored(window.localStorage.getItem(LS_KEY));
  }, [role]);

  useEffect(() => {
    if (role === 'staff' && urlClient) {
      window.localStorage.setItem(LS_KEY, urlClient);
      setStored(urlClient);
    }
  }, [role, urlClient]);

  const clientId = role === 'client' ? ownClientId : (urlClient || stored);

  useEffect(() => {
    if (!clientId) { setClient(null); return undefined; }
    return subscribeClient(clientId, setClient);
  }, [clientId]);

  const value = { clientId, client, isStaffView: role === 'staff' };
  return (
    <ClientScopeContext.Provider value={value}>
      {children}
    </ClientScopeContext.Provider>
  );
}

export function useClientScope() {
  return useContext(ClientScopeContext);
}
