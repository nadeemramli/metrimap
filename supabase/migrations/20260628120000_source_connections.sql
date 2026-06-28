-- =====================================================================
-- DATA SOURCE — Phase 3: warehouse connections (Metrimap : iqrclwolhookzzmiedun)
-- Clerk-via-Supabase-native auth. Identity = public.requesting_user_id() (text).
-- Idempotent: safe to apply/re-apply. RLS ENABLED on both tables.
--
-- Security model (see docs/backlog/data-source-architecture.md, Principle 3):
--   * source_connections      — NON-secret connection metadata. Owner CRUD via RLS.
--   * source_connection_secrets — the password/credential. RLS is ENABLED with
--     NO POLICIES, so neither anon nor authenticated roles can read/write it.
--     ONLY the service-role key (used exclusively by the warehouse-proxy edge
--     function) can touch it, because service-role bypasses RLS. The credential
--     therefore never reaches the browser bundle.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. CONNECTION METADATA (owner-visible)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_connections (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by     text NOT NULL DEFAULT public.requesting_user_id(),
  name           text NOT NULL,
  warehouse_type text NOT NULL DEFAULT 'postgres'
                   CHECK (warehouse_type IN ('postgres')),  -- extend as drivers are added
  host           text NOT NULL,
  port           integer NOT NULL DEFAULT 5432,
  database       text NOT NULL,
  username       text NOT NULL,
  ssl            boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.source_connections ENABLE ROW LEVEL SECURITY;

-- Owner-only CRUD. (Per-workspace sharing is deferred with the permissions work;
-- today the de-facto workspace is the owner — see doc decision #2.)
DROP POLICY IF EXISTS source_connections_select ON public.source_connections;
CREATE POLICY source_connections_select ON public.source_connections
  FOR SELECT USING (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS source_connections_insert ON public.source_connections;
CREATE POLICY source_connections_insert ON public.source_connections
  FOR INSERT WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS source_connections_update ON public.source_connections;
CREATE POLICY source_connections_update ON public.source_connections
  FOR UPDATE USING (created_by = public.requesting_user_id())
  WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS source_connections_delete ON public.source_connections;
CREATE POLICY source_connections_delete ON public.source_connections
  FOR DELETE USING (created_by = public.requesting_user_id());

-- ---------------------------------------------------------------------
-- 2. CREDENTIAL STORE (service-role only)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_connection_secrets (
  connection_id uuid PRIMARY KEY
                  REFERENCES public.source_connections(id) ON DELETE CASCADE,
  password      text NOT NULL,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- RLS enabled, intentionally NO policies => anon/authenticated cannot touch this
-- table at all. The warehouse-proxy edge function uses the service-role key,
-- which bypasses RLS, to read it when running a query.
ALTER TABLE public.source_connection_secrets ENABLE ROW LEVEL SECURITY;

-- Defense in depth: revoke privileges from client roles at the grant level too,
-- so the credential table is locked down beyond RLS (also clears the GraphQL
-- discoverability lint). service_role keeps access.
REVOKE ALL ON public.source_connection_secrets FROM anon, authenticated;

COMMIT;
