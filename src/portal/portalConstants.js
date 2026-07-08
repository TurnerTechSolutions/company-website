// ──────────────────────────────────────────────────────────────
// Portal enums + display labels (single source of truth for both
// staff and client views).
// ──────────────────────────────────────────────────────────────

export const VISIBILITY = {
  INTERNAL: 'internal',
  CLIENT:   'client',
};

export const TASK_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW:   'in_review',
  DONE:        'done',
  BLOCKED:     'blocked',
};

export const TASK_STATUS_LABELS = {
  not_started: 'Not started',
  in_progress: 'In progress',
  in_review:   'In review',
  done:        'Done',
  blocked:     'Blocked',
};

export const MILESTONE_STATUS = {
  DONE:        'done',
  IN_PROGRESS: 'in_progress',
  UPCOMING:    'upcoming',
};

export const MILESTONE_STATUS_LABELS = {
  done:        'Done',
  in_progress: 'In progress',
  upcoming:    'Upcoming',
};

export const APPROVAL_STATUS = {
  NOT_REQUIRED:      'not_required',
  PENDING:           'pending',
  APPROVED:          'approved',
  CHANGES_REQUESTED: 'changes_requested',
};

export const HEALTH_LABELS = {
  green:  'On track',
  yellow: 'Needs attention',
  red:    'At risk',
};

export const METRIC_SOURCES = {
  GSC:           'gsc',
  GA4:           'ga4',
  RANK:          'rank',
  GBP:           'gbp',
  AI_VISIBILITY: 'ai_visibility',
};

export const METRIC_SOURCE_LABELS = {
  gsc:           'Google Search',
  ga4:           'Website Analytics',
  rank:          'Keyword Rankings',
  gbp:           'Google Business Profile',
  ai_visibility: 'AI Search Visibility',
};

// Field definitions per source. Drives the trend charts, the
// baseline-vs-current deltas, and the staff manual-entry form.
// lowerIsBetter flips delta coloring (e.g. avg position).
export const METRIC_FIELDS = {
  gsc: [
    { key: 'clicks',      label: 'Clicks' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'avgPosition', label: 'Avg position', lowerIsBetter: true, decimals: 1 },
  ],
  ga4: [
    { key: 'sessions',        label: 'Sessions' },
    { key: 'organicSessions', label: 'Organic sessions' },
    { key: 'conversions',     label: 'Conversions' },
  ],
  rank: [
    { key: 'top3',            label: 'Keywords in top 3' },
    { key: 'top10',           label: 'Keywords in top 10' },
    { key: 'avgPosition',     label: 'Avg position', lowerIsBetter: true, decimals: 1 },
    { key: 'trackedKeywords', label: 'Tracked keywords', neutral: true },
  ],
  gbp: [
    { key: 'calls',             label: 'Phone calls' },
    { key: 'directionRequests', label: 'Direction requests' },
    { key: 'views',             label: 'Profile views' },
    { key: 'reviews',           label: 'Reviews' },
    { key: 'rating',            label: 'Rating', decimals: 1 },
  ],
  ai_visibility: [
    { key: 'mentions',    label: 'Brand mentions in AI answers' },
    { key: 'citations',   label: 'Citations of your site' },
    { key: 'aiReferrals', label: 'Visits from AI tools' },
  ],
};

// Expectation-setting copy so early months read as progress, not failure.
export const REPORT_EXPECTATIONS = {
  gsc: 'Impressions rise before clicks, and clicks rise before conversions. Growing impressions with a falling average position means Google is testing your pages higher, which is exactly the sequence we want.',
  ga4: 'Traffic follows rankings with a delay. Expect sessions to lag the ranking gains you see above by four to eight weeks.',
  rank: 'Rankings move keyword by keyword. Watch the top 10 count first: keywords enter the top 10, stabilize, then push into the top 3.',
  gbp: 'Profile views typically grow first, then direction requests and calls follow as the profile earns trust and reviews.',
  ai_visibility: 'AI assistants cite established, well-structured content. Mentions usually start appearing after core pages have held strong rankings for a while.',
};

export const PLAN_TIERS = ['Foundation', 'Growth', 'Scale'];
