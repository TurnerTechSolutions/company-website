import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import posthog from 'posthog-js';
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react';

posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
  options={
    api_host: 'https://us.i.posthog.com',
    capture_pageview: true,
    session_recording: {
      maskAllInputs: false,        // ← unmasks all inputs
      maskInputOptions: {
        password: true,            // ← still masks passwords specifically
      },
    },
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>
        <App />
      </PostHogErrorBoundary>
    </PostHogProvider>
  </React.StrictMode>
);
