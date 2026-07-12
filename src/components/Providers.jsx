'use client';
import posthog from 'posthog-js';
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react';
import { AuthProvider } from '../context/AuthProvider';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30',
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
      minimumDurationMilliseconds: 5000,
      recordCrossOriginIframes: false,
    },
  });
}

export default function Providers({ children }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <AuthProvider>
          {children}
        </AuthProvider>
      </PostHogErrorBoundary>
    </PostHogProvider>
  );
}
