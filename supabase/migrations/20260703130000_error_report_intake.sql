-- =====================================================================
-- SYSTEM HEALTH INTAKE — fingerprinting + grouping for error_reports.
-- Groups repeated runtime crashes by a client-computed `fingerprint` so the
-- server-side Linear bridge creates ONE issue per distinct crash and comments
-- on repeats instead of spamming duplicates. error_reports stays the raw event
-- log; error_report_groups is the per-fingerprint rollup and the Linear unit.
-- See docs/features/system-health-intake.md. APPLIED to prod 2026-07-03.
-- =====================================================================
BEGIN;

-- 1. Raw reports get a stable group key (computed client-side; may be null for
--    older reports or if hashing was unavailable).
ALTER TABLE public.error_reports
  ADD COLUMN IF NOT EXISTS fingerprint text;

CREATE INDEX IF NOT EXISTS idx_error_reports_fingerprint
  ON public.error_reports (fingerprint);

-- 2. Per-fingerprint rollup = the Linear issue unit.
CREATE TABLE IF NOT EXISTS public.error_report_groups (
  fingerprint             text PRIMARY KEY,
  title                   text,
  first_seen_at           timestamptz NOT NULL DEFAULT now(),
  last_seen_at            timestamptz NOT NULL DEFAULT now(),
  occurrence_count        integer NOT NULL DEFAULT 0,
  -- occurrences already reflected in Linear at the last successful sync
  last_synced_count       integer NOT NULL DEFAULT 0,
  severity                text NOT NULL DEFAULT 'medium',
  -- most recent raw report, used by the bridge for evidence (message/stack/note)
  sample_report_id        uuid,
  -- Linear sync metadata (server-side bridge only)
  linear_issue_id         text,
  linear_issue_identifier text,
  linear_issue_url        text,
  sync_status             text NOT NULL DEFAULT 'pending'
                            CHECK (sync_status IN ('pending','synced','failed','skipped')),
  sync_error              text,
  linear_synced_at        timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_error_report_groups_sync_status
  ON public.error_report_groups (sync_status);

-- Client can never touch the rollup: RLS on, no policies. The trigger writes via
-- SECURITY DEFINER; the bridge writes via service_role (both bypass RLS).
ALTER TABLE public.error_report_groups ENABLE ROW LEVEL SECURITY;

-- 3. Roll each inserted report up into its group. New fingerprint => new group in
--    'pending'. Repeat => bump count/last_seen and re-flag 'pending' so the bridge
--    posts an occurrence update (the bridge itself rate-limits comments).
CREATE OR REPLACE FUNCTION public.rollup_error_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.fingerprint IS NULL THEN
    RETURN NEW; -- ungrouped; stays in the raw log only
  END IF;

  INSERT INTO public.error_report_groups AS g (
    fingerprint, first_seen_at, last_seen_at, occurrence_count,
    sample_report_id, sync_status, updated_at
  )
  VALUES (
    NEW.fingerprint, NEW.created_at, NEW.created_at, 1,
    NEW.id, 'pending', now()
  )
  ON CONFLICT (fingerprint) DO UPDATE SET
    occurrence_count = g.occurrence_count + 1,
    last_seen_at     = NEW.created_at,
    sample_report_id = NEW.id,
    -- don't re-open a group the team has intentionally skipped
    sync_status      = CASE WHEN g.sync_status = 'skipped' THEN 'skipped' ELSE 'pending' END,
    updated_at       = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_rollup_error_report ON public.error_reports;
CREATE TRIGGER trg_rollup_error_report
  AFTER INSERT ON public.error_reports
  FOR EACH ROW EXECUTE FUNCTION public.rollup_error_report();

COMMIT;
