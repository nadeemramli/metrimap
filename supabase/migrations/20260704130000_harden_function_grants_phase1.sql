-- =====================================================================
-- DB SECURITY HARDENING — Phase 1 (CVS-127).
-- Addresses Supabase security advisors:
--   * function_search_path_mutable (stamp_updated_by_and_at)
--   * {anon,authenticated}_security_definer_function_executable, restricted to
--     the PURE trigger/cron functions that no client `.rpc()` and no RLS policy
--     calls by name.
--
-- WHY THIS IS SAFE:
--   - Trigger functions run in the trigger/owner context on the table event; the
--     invoking role does NOT need EXECUTE on them. Revoking anon/authenticated
--     therefore cannot break INSERT/UPDATE paths.
--   - run_alert_sweep / dispatch_error_report_sync are invoked by pg_cron /
--     service_role, and upsert_user by the Clerk webhook (service_role). We do
--     NOT touch service_role, so cron + webhook keep working.
--   - Identity/permission helpers used by RLS policies + client `.rpc`
--     (get_clerk_user_id, requesting_*, has_project_access, can_*,
--     my_project_permission, emit_card_alert, notify_card_assigned) are LEFT
--     ALONE here — the anon revoke on those is Phase 2 (needs anon-policy check).
--
-- Verify after apply (all should be false / true respectively):
--   select p.proname,
--     has_function_privilege('anon', p.oid, 'EXECUTE')          as anon,
--     has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth,
--     has_function_privilege('service_role', p.oid, 'EXECUTE')  as svc
--   from pg_proc p join pg_namespace n on n.oid=p.pronamespace
--   where n.nspname='public' and p.proname in ('rollup_error_report','run_alert_sweep', ...);
-- =====================================================================
BEGIN;

-- 1. Fixed search_path for the one flagged mutable-search_path function.
ALTER FUNCTION public.stamp_updated_by_and_at() SET search_path = public;

-- 2. Revoke EXECUTE from anon + authenticated on pure trigger/cron functions.
--    (service_role is intentionally NOT revoked.)
REVOKE EXECUTE ON FUNCTION public.rollup_error_report()                    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()               FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_projects_updated_at()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_user_update()                     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.stamp_updated_by_and_at()                FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.run_alert_sweep()                        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.dispatch_error_report_sync()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upsert_user(text, text, text, text)      FROM anon, authenticated;

COMMIT;
