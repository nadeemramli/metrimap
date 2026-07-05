-- =====================================================================
-- RELATIONSHIP HISTORY — strength/confidence/type snapshots over time, for the
-- relationship audit trail + strength-trend sparkline (relationship intelligence
-- lane, priority 5). One row per relationship edit; weight snapshots power the
-- trend. Project-scoped RLS (mirrors relationships via has_project_access), with
-- a creator fallback so history on legacy null-project relationships still works.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.relationship_history (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid NOT NULL REFERENCES public.relationships(id) ON DELETE CASCADE,
  project_id      uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  type            text,
  confidence      text,
  weight          double precision,
  changed_by      text NOT NULL DEFAULT public.requesting_user_id(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.relationship_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS relationship_history_select ON public.relationship_history;
CREATE POLICY relationship_history_select ON public.relationship_history
  FOR SELECT USING (
    public.has_project_access(project_id, false)
    OR changed_by = public.requesting_user_id()
  );

-- Append-only: you may only record your own edits; reads are gated above.
DROP POLICY IF EXISTS relationship_history_insert ON public.relationship_history;
CREATE POLICY relationship_history_insert ON public.relationship_history
  FOR INSERT WITH CHECK (changed_by = public.requesting_user_id());

CREATE INDEX IF NOT EXISTS idx_relationship_history_rel
  ON public.relationship_history(relationship_id, created_at);

COMMIT;
