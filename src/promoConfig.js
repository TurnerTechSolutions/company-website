// ──────────────────────────────────────────────────────────────
// PROMO BAR CONFIG  —  edit this file to run / change a promotion
// ──────────────────────────────────────────────────────────────
// Best practice: ONE message, ONE call-to-action. Keep it short.
//
// • Change `id` whenever you launch a NEW offer — it re-shows the bar
//   to people who dismissed the previous one.
// • `endsAt` powers the countdown AND auto-hides the bar when it passes,
//   so an expired offer never lingers.
// • `ctaHref` can be an internal route ("/contact") or a full external
//   URL ("https://calendly.com/..."); external links open in a new tab.

export const PROMO = {
  id:        'summer-build-2026',          // bump this to re-show after edits
  enabled:   true,

  message:   'First month free for new clients. No commitment, cancel anytime.',
  ctaLabel:  'Claim my month',
  ctaHref:   'contact',                   // internal route or https:// URL

  // Scheduling (ISO 8601, local time). null = no bound.
  startsAt:  null,                         // e.g. '2026-06-10T00:00:00'
  endsAt:    '2026-06-30T23:59:59',        // drives countdown + auto-hide

  showCountdown: true,                     // false = hide the timer
};
