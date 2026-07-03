-- Workflow fields for Work/Action and Ideas/Hypothesis cards (Strategy board).
-- `status` is the queryable kanban column; everything else (priority, due date,
-- effort, confidence, testable, assumptions, successCriteria, businessImpact,
-- stakeholders) lives in `workflow` jsonb. NULL status renders as backlog.
-- Existing metric_cards RLS row policies (has_project_access via Clerk
-- requesting_user_id()) cover the new columns — no policy changes needed.

ALTER TABLE public.metric_cards
  ADD COLUMN IF NOT EXISTS status text
    CHECK (status IS NULL OR status IN ('backlog','planning','in_progress','done','on_hold')),
  ADD COLUMN IF NOT EXISTS workflow jsonb NOT NULL DEFAULT '{}'::jsonb;
