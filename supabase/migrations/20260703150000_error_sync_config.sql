-- =====================================================================
-- SYSTEM HEALTH INTAKE — read sync secrets from Vault (no function-secret env).
-- The sync-error-reports edge function reads LINEAR_API_KEY / LINEAR_TEAM_ID /
-- ERROR_SYNC_SECRET from Supabase Vault via this SECURITY DEFINER RPC (Deno.env
-- still wins if set). Execute is restricted to service_role, so only the edge
-- function (service role) can read the secrets — never anon/authenticated.
-- Set the values with:
--   select vault.create_secret('<linear-api-key>',  'linear_api_key');
--   select vault.create_secret('<team-uuid>',       'linear_team_id');
--   select vault.create_secret('<shared-secret>',   'error_sync_secret');
-- APPLIED to prod 2026-07-03.
-- =====================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.error_sync_config()
RETURNS TABLE (
  linear_api_key    text,
  linear_team_id    text,
  error_sync_secret text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'linear_api_key'),
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'linear_team_id'),
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'error_sync_secret');
$$;

REVOKE ALL ON FUNCTION public.error_sync_config() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.error_sync_config() TO service_role;

COMMIT;
