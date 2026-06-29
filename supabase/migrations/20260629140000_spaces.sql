-- =====================================================================
-- HIERARCHY (B.3) — Spaces/Folders. Owner-scoped (created_by); re-scopes to a
-- Clerk-org workspace_id once Clerk Organizations are enabled. A canvas
-- (project) belongs to 0..1 space; null space_id = "Uncategorized".
-- See docs/backlog/object-model-and-catalog.md. APPLIED to prod 2026-06-29.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.spaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  text NOT NULL DEFAULT public.requesting_user_id(),
  name        text NOT NULL,
  color       text,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS spaces_select ON public.spaces;
CREATE POLICY spaces_select ON public.spaces
  FOR SELECT USING (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS spaces_insert ON public.spaces;
CREATE POLICY spaces_insert ON public.spaces
  FOR INSERT WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS spaces_update ON public.spaces;
CREATE POLICY spaces_update ON public.spaces
  FOR UPDATE USING (created_by = public.requesting_user_id())
  WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS spaces_delete ON public.spaces;
CREATE POLICY spaces_delete ON public.spaces
  FOR DELETE USING (created_by = public.requesting_user_id());

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS space_id uuid
  REFERENCES public.spaces(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_space_id ON public.projects(space_id);

COMMIT;
