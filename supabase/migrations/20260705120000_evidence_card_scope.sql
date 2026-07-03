-- Let evidence attach to a metric card (task/action evidence), not only a
-- relationship. project_id makes RLS scoping direct and uniform.
ALTER TABLE public.evidence_items
  ADD COLUMN IF NOT EXISTS card_id uuid REFERENCES public.metric_cards(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE;

-- Backfill project_id for existing relationship-scoped rows so the unified
-- policies below keep serving them.
UPDATE public.evidence_items e
SET project_id = r.project_id
FROM public.relationships r
WHERE e.relationship_id = r.id
  AND e.project_id IS NULL;

-- Rewrite RLS to scope by the effective project: the row's own project_id when
-- set (card- or relationship-scoped), else resolved via the parent relationship
-- (legacy rows). Covers both without breaking existing relationship evidence.
DROP POLICY IF EXISTS evidence_items_select ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_insert ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_update ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_delete ON public.evidence_items;

CREATE POLICY evidence_items_select ON public.evidence_items
  FOR SELECT TO anon, authenticated
  USING (public.can_view_project(
    COALESCE(project_id,
             (SELECT r.project_id FROM public.relationships r WHERE r.id = evidence_items.relationship_id))));

CREATE POLICY evidence_items_insert ON public.evidence_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_project_access(
    COALESCE(project_id,
             (SELECT r.project_id FROM public.relationships r WHERE r.id = evidence_items.relationship_id)), true));

CREATE POLICY evidence_items_update ON public.evidence_items
  FOR UPDATE TO authenticated
  USING (public.has_project_access(
    COALESCE(project_id,
             (SELECT r.project_id FROM public.relationships r WHERE r.id = evidence_items.relationship_id)), true))
  WITH CHECK (public.has_project_access(
    COALESCE(project_id,
             (SELECT r.project_id FROM public.relationships r WHERE r.id = evidence_items.relationship_id)), true));

CREATE POLICY evidence_items_delete ON public.evidence_items
  FOR DELETE TO authenticated
  USING (public.has_project_access(
    COALESCE(project_id,
             (SELECT r.project_id FROM public.relationships r WHERE r.id = evidence_items.relationship_id)), true));
