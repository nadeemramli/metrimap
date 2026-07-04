-- =====================================================================
-- DATA INGEST STAGING (CVS-102). Temporary, RLS-scoped, TTL'd staging for
-- agent-pushed data (structured series or raw CSV) before it is mapped and
-- materialized onto metric cards. `import_batches` is one push; `import_rows`
-- holds its raw rows. Reads filter on `expires_at > now()`, and a daily cron
-- garbage-collects expired batches, so staging is transient by construction.
-- Scoped per user via requesting_user_id() (Clerk), same as the rest of the app.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.import_batches (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             text NOT NULL DEFAULT requesting_user_id(),
  project_id          uuid,
  kind                text NOT NULL DEFAULT 'series'
                        CHECK (kind IN ('series', 'csv')),
  status              text NOT NULL DEFAULT 'staged'
                        CHECK (status IN ('staged', 'materialized', 'failed')),
  filename            text,
  columns             jsonb,
  mapping             jsonb,
  row_count           integer NOT NULL DEFAULT 0,
  materialized_count  integer NOT NULL DEFAULT 0,
  error               text,
  expires_at          timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.import_rows (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id   uuid NOT NULL REFERENCES public.import_batches (id) ON DELETE CASCADE,
  row_index  integer NOT NULL,
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_import_batches_user ON public.import_batches (user_id);
CREATE INDEX IF NOT EXISTS idx_import_batches_expires ON public.import_batches (expires_at);
CREATE INDEX IF NOT EXISTS idx_import_rows_batch ON public.import_rows (batch_id);

ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_rows ENABLE ROW LEVEL SECURITY;

-- A user only ever sees/writes their own (non-expired) batches.
CREATE POLICY import_batches_select ON public.import_batches FOR SELECT
  USING (user_id = requesting_user_id() AND expires_at > now());
CREATE POLICY import_batches_insert ON public.import_batches FOR INSERT
  WITH CHECK (user_id = requesting_user_id());
CREATE POLICY import_batches_update ON public.import_batches FOR UPDATE
  USING (user_id = requesting_user_id()) WITH CHECK (user_id = requesting_user_id());
CREATE POLICY import_batches_delete ON public.import_batches FOR DELETE
  USING (user_id = requesting_user_id());

-- Rows inherit their batch's ownership.
CREATE POLICY import_rows_select ON public.import_rows FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.import_batches b
                 WHERE b.id = import_rows.batch_id
                   AND b.user_id = requesting_user_id()
                   AND b.expires_at > now()));
CREATE POLICY import_rows_insert ON public.import_rows FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.import_batches b
                      WHERE b.id = import_rows.batch_id
                        AND b.user_id = requesting_user_id()));
CREATE POLICY import_rows_delete ON public.import_rows FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.import_batches b
                 WHERE b.id = import_rows.batch_id
                   AND b.user_id = requesting_user_id()));

-- TTL garbage collection (service_role only). Reads already ignore expired rows;
-- this just reclaims storage.
CREATE OR REPLACE FUNCTION public.cleanup_expired_imports()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.import_batches WHERE expires_at < now();
$$;

REVOKE ALL ON FUNCTION public.cleanup_expired_imports() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_imports() TO service_role;

-- Daily GC via pg_cron (guarded: no-op if pg_cron isn't installed or already set).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup-expired-imports', '17 3 * * *',
      'select public.cleanup_expired_imports()'
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- schedule already exists / insufficient priv — safe to ignore.
  NULL;
END $$;

COMMIT;
