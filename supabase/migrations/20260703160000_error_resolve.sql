-- =====================================================================
-- SYSTEM HEALTH INTAKE — auto-resolve loop (Loop A).
-- Adds a 'resolved' sync_status for groups whose crash fingerprint has stopped
-- recurring, and wakes the cron dispatch when such stale-but-open groups exist
-- (not only when there is fresh 'pending' work). The edge function does the
-- Linear-side close/reopen. A recurrence flips the group back to 'pending' via
-- the existing rollup trigger, so resolved issues auto-reopen (regression).
-- APPLIED to prod 2026-07-03.
-- =====================================================================
BEGIN;

-- Allow the new terminal status.
ALTER TABLE public.error_report_groups
  DROP CONSTRAINT IF EXISTS error_report_groups_sync_status_check;
ALTER TABLE public.error_report_groups
  ADD CONSTRAINT error_report_groups_sync_status_check
  CHECK (sync_status IN ('pending','synced','failed','skipped','resolved'));

-- Fire the bridge when there is pending work OR a synced group has gone quiet
-- (candidate for auto-resolve). The 7-day gate should track the edge function's
-- ERROR_RESOLVE_AFTER_DAYS default.
CREATE OR REPLACE FUNCTION public.dispatch_error_report_sync()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fn_url    text;
  fn_secret text;
BEGIN
  SELECT decrypted_secret INTO fn_url
    FROM vault.decrypted_secrets WHERE name = 'error_sync_url';
  SELECT decrypted_secret INTO fn_secret
    FROM vault.decrypted_secrets WHERE name = 'error_sync_secret';

  IF fn_url IS NULL OR fn_secret IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.error_report_groups
    WHERE sync_status = 'pending'
       OR (sync_status = 'synced'
           AND linear_issue_id IS NOT NULL
           AND last_seen_at < now() - interval '7 days')
  ) THEN
    RETURN;
  END IF;

  PERFORM net.http_post(
    url     := fn_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-sync-secret', fn_secret
    ),
    body    := '{}'::jsonb
  );
END;
$$;

COMMIT;
