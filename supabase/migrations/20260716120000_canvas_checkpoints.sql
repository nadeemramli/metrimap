-- =====================================================================
-- CANVAS CHECKPOINTS — game-style manual saves of the whole canvas state.
-- Backs the version-history/checkpoint feature: the client code has written
-- to canvas_snapshots since the beginning, but the table never existed. A
-- checkpoint stores the full nodes/edges/groups payload so it can be listed,
-- compared, and restored. canvas_id == projects.id (a canvas is a project).
-- Project-scoped RLS via has_project_access (view to read, edit to write).
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.canvas_snapshots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version     integer NOT NULL,
  title       text NOT NULL,
  description text,
  nodes       jsonb NOT NULL DEFAULT '[]'::jsonb,
  edges       jsonb NOT NULL DEFAULT '[]'::jsonb,
  groups      jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by  text NOT NULL DEFAULT public.requesting_user_id(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.canvas_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS canvas_snapshots_select ON public.canvas_snapshots;
CREATE POLICY canvas_snapshots_select ON public.canvas_snapshots
  FOR SELECT USING (public.has_project_access(canvas_id, false));

DROP POLICY IF EXISTS canvas_snapshots_insert ON public.canvas_snapshots;
CREATE POLICY canvas_snapshots_insert ON public.canvas_snapshots
  FOR INSERT WITH CHECK (
    public.has_project_access(canvas_id, true)
    AND created_by = public.requesting_user_id()
  );

DROP POLICY IF EXISTS canvas_snapshots_update ON public.canvas_snapshots;
CREATE POLICY canvas_snapshots_update ON public.canvas_snapshots
  FOR UPDATE USING (public.has_project_access(canvas_id, true))
  WITH CHECK (public.has_project_access(canvas_id, true));

DROP POLICY IF EXISTS canvas_snapshots_delete ON public.canvas_snapshots;
CREATE POLICY canvas_snapshots_delete ON public.canvas_snapshots
  FOR DELETE USING (public.has_project_access(canvas_id, true));

CREATE INDEX IF NOT EXISTS idx_canvas_snapshots_canvas
  ON public.canvas_snapshots(canvas_id, version DESC);

COMMIT;
