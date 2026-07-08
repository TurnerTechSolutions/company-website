'use client';
// ──────────────────────────────────────────────────────────────
// Resolves which client the portal is showing, and subscribes to
// that client's doc once for the whole portal tree.
//   client role → one of their memberships (users/{uid}.clientIds):
//                 ?client= in the URL if it's theirs, else the last
//                 choice from localStorage, else their first org.
//                 Multi-business clients get a switcher (PortalShell).
//   staff       → ?client=<id> (linkable), falling back to localStorage
// ──────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';
import { subscribeClient } from './portalService';

const LS_KEY = 'tts-portal-client';

const ClientScopeContext = createContext({
  clientId: null, client: null, isStaffView: false, memberships: [],
});

export function ClientScopeProvider({ children }) {
  const { role, clientIds } = useAuth();
  const searchParams = useSearchParams();
  const urlClient = searchParams.get('client');
  const [stored, setStored] = useState(null);
  const [client, setClient] = useState(null);
  const [names, setNames] = useState({});

  // localStorage is read in an effect so SSR/hydration stay consistent.
  useEffect(() => {
    if (role) setStored(window.localStorage.getItem(LS_KEY));
  }, [role]);

  let clientId = null;
  if (role === 'client') {
    if (urlClient && clientIds.includes(urlClient)) clientId = urlClient;
    else if (stored && clientIds.includes(stored)) clientId = stored;
    else clientId = clientIds[0] || null;
  } else if (role === 'staff') {
    clientId = urlClient || stored;
  }

  // Remember the last valid selection.
  useEffect(() => {
    if (clientId) {
      window.localStorage.setItem(LS_KEY, clientId);
      setStored(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    if (!clientId) { setClient(null); return undefined; }
    return subscribeClient(clientId, setClient);
  }, [clientId]);

  // Names for the multi-business switcher (n is tiny; one listener each).
  const membershipKey = clientIds.join(',');
  useEffect(() => {
    if (role !== 'client' || clientIds.length < 2) { setNames({}); return undefined; }
    const unsubs = clientIds.map((id) =>
      subscribeClient(id, (c) => {
        setNames((n) => ({ ...n, [id]: c ? c.name : id }));
      })
    );
    return () => unsubs.forEach((u) => u());
  }, [role, membershipKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const memberships = role === 'client'
    ? clientIds.map((id) => ({ id, name: names[id] || id }))
    : [];

  const value = { clientId, client, isStaffView: role === 'staff', memberships };
  return (
    <ClientScopeContext.Provider value={value}>
      {children}
    </ClientScopeContext.Provider>
  );
}

export function useClientScope() {
  return useContext(ClientScopeContext);
}
