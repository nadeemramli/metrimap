-- =====================================================================
-- EVIDENCE PUBLIC SHARE — let a single evidence item be shared publicly (read-
-- only) independent of its parent project's visibility, for /embed/evidence/:id
-- (Notion/Confluence/iframe). Mirrors projects.is_public. Relationship+evidence
-- lane, priority 6. Adds an `is_public = true` disjunct to the SELECT policy so
-- the anon role can read a shared item; writes remain project-access gated.
-- =====================================================================
BEGIN;

ALTER TABLE public.evidence_items
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS evidence_items_select ON public.evidence_items;
CREATE POLICY evidence_items_select ON public.evidence_items
  FOR SELECT TO anon, authenticated
  USING (
    is_public = true
    OR public.can_view_project(
      COALESCE(
        project_id,
        (SELECT r.project_id FROM public.relationships r
          WHERE r.id = evidence_items.relationship_id)
      )
    )
  );

COMMIT;
