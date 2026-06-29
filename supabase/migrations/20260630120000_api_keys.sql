-- =====================================================================
-- Workspace API keys for the read/write metrics API (edge fn `metrics-api`).
-- Full key shown to the user once; only its SHA-256 hash is stored. Owner-
-- managed (RLS); stamped with the active workspace. APPLIED to prod 2026-06-30.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.api_keys (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text DEFAULT public.requesting_org_id(),
  created_by   text NOT NULL DEFAULT public.requesting_user_id(),
  name         text NOT NULL,
  key_prefix   text NOT NULL,
  key_hash     text NOT NULL UNIQUE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS api_keys_select ON public.api_keys;
CREATE POLICY api_keys_select ON public.api_keys
  FOR SELECT USING (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS api_keys_insert ON public.api_keys;
CREATE POLICY api_keys_insert ON public.api_keys
  FOR INSERT WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS api_keys_delete ON public.api_keys;
CREATE POLICY api_keys_delete ON public.api_keys
  FOR DELETE USING (created_by = public.requesting_user_id());

COMMIT;
