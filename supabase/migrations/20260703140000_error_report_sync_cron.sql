-- =====================================================================
-- SYSTEM HEALTH INTAKE — scheduled dispatch to the Linear sync bridge.
-- Every 5 min, if there is pending work, invoke the `sync-error-reports` edge
-- function (which holds the Linear credential server-side). Secret-free: the
-- function URL + shared secret live in Supabase Vault, so this migration is safe
-- to commit and no-ops until those secrets are set. APPLIED to prod 2026-07-03.
--
-- One-time setup by the deployer (NOT committed):
--   select vault.create_secret('https://<ref>.functions.supabase.co/sync-error-reports', 'error_sync_url');
--   select vault.create_secret('<random-shared-secret>', 'error_sync_secret');
-- The same '<random-shared-secret>' must be set as the edge function's
-- ERROR_SYNC_SECRET env var. See docs/features/system-health-intake.md.
-- =====================================================================
BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Fire the bridge only when there is pending work and the Vault secrets exist.
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
    RETURN; -- not configured yet; no-op
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.error_report_groups WHERE sync_status = 'pending'
  ) THEN
    RETURN; -- nothing to sync
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

-- (Re)schedule idempotently.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'error-report-sync') THEN
    PERFORM cron.unschedule('error-report-sync');
  END IF;
END;
$$;

SELECT cron.schedule(
  'error-report-sync',
  '*/5 * * * *',
  $$SELECT public.dispatch_error_report_sync();$$
);

COMMIT;
