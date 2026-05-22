<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Turner Technologies React website. PostHog was initialized in `src/index.js` with `PostHogProvider` and `PostHogErrorBoundary` wrapping the entire app. Event tracking calls were added to three page components, covering the key conversion and engagement actions across the site.

## Changes made

| File | Change |
|------|--------|
| `src/index.js` | Added `posthog.init(...)`, `PostHogProvider`, and `PostHogErrorBoundary` |
| `src/pages/Home.jsx` | Added `usePostHog` hook; tracking for hero CTA clicks, "Get a Quote" click, and services list expand/collapse |
| `src/pages/Gallery.jsx` | Added `usePostHog` hook; tracking for portfolio project preview modal opens |
| `src/pages/Contact.jsx` | Added `usePostHog` hook; tracking for contact form submission, referral form submission, free audit link click, and book call click |
| `.env` | Created with `REACT_APP_PUBLIC_POSTHOG_KEY` and `REACT_APP_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event name | Description | File |
|------------|-------------|------|
| `cta_clicked` | User clicks a primary CTA button (`cta_name` property: `start_a_project`, `view_work`, `get_quote`) | `src/pages/Home.jsx` |
| `services_list_expanded` | User expands the full services list | `src/pages/Home.jsx` |
| `services_list_collapsed` | User collapses the services list back | `src/pages/Home.jsx` |
| `portfolio_project_previewed` | User opens a portfolio project preview modal (`project_title`, `project_tag` properties) | `src/pages/Gallery.jsx` |
| `contact_form_submitted` | User submits the main contact/inquiry form (`project_type` property) | `src/pages/Contact.jsx` |
| `referral_form_submitted` | User submits the referral program form | `src/pages/Contact.jsx` |
| `free_audit_link_clicked` | User clicks the "Free audit" Calendly link | `src/pages/Contact.jsx` |
| `book_call_clicked` | User clicks "Book a Free Call" after a successful contact form submission | `src/pages/Contact.jsx` |

## Next steps

We've built an **[Analytics basics dashboard](/dashboard/1605846)** with 5 insights to monitor user behavior:

1. **[Contact form submissions over time](/insights/bkK4VrSy)** — Weekly trend of contact form submissions.
2. **[Hero CTA to inquiry conversion funnel](/insights/8Z5neegh)** — Funnel from "Start a Project" hero click to form submission.
3. **[Portfolio project previews by project](/insights/dJfse1H0)** — Bar chart of which portfolio projects are previewed most.
4. **[All key conversion events (last 90 days)](/insights/NJWH0nbf)** — Multi-series line chart of all major conversion actions.
5. **[Referral form submissions over time](/insights/JEzK8r43)** — Weekly trend of referral program submissions.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-declarative/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
