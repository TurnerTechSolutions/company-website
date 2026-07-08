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

export const PLAN_TIERS = ['Foundation', 'Growth', 'Scale'];
