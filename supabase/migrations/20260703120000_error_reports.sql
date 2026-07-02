-- =====================================================================
-- ERROR REPORTS — client-side crash sink (Metrimap).
-- Insert-only telemetry written by the app's ErrorBoundary fallback when a
-- user hits "Report this error". May be submitted by logged-out or broken-
-- session users, so anon + authenticated can INSERT. No SELECT/UPDATE/DELETE
-- for normal roles — read via the Supabase dashboard (service_role) only, so
-- reporters can't read the sink. clerk_user_id is captured server-side from the
-- JWT when a valid session exists; reporter_* are best-effort client hints.
-- APPLIED to prod 2026-07-03.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.error_reports (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- server-trusted identity (null for anon / broken session)
  clerk_user_id    text DEFAULT public.requesting_user_id(),
  -- best-effort client-supplied identity hints (NOT trusted)
  reporter_user_id text,
  reporter_email   text,
  -- error payload
  message          text,
  error_stack      text,
  component_stack  text,
  note             text,
  url              text,
  user_agent       text,
  -- client-reported time; created_at is the authoritative server time
  client_time      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;

-- Insert-only: allow both anon and authenticated to write a report.
DROP POLICY IF EXISTS error_reports_insert ON public.error_reports;
CREATE POLICY error_reports_insert ON public.error_reports
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- No SELECT / UPDATE / DELETE policies => denied for anon & authenticated even
-- with RLS enabled. service_role bypasses RLS.

-- Explicit grant (self-documenting; deliberately NO SELECT for anon/authenticated).
GRANT INSERT ON public.error_reports TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_error_reports_created_at
  ON public.error_reports (created_at DESC);

COMMIT;
