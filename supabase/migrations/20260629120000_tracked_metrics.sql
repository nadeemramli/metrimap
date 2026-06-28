-- =====================================================================
-- SEMANTIC LAYER — Metric Catalog (Metrimap : iqrclwolhookzzmiedun)
-- A Tracked Metric is the shared definition of a real, sourced metric. Owner-
-- scoped for now (created_by = de-facto workspace, like source_connections);
-- re-scoped to the Clerk-org workspace with the hierarchy epic.
-- See docs/backlog/object-model-and-catalog.md. APPLIED to prod 2026-06-29.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.tracked_metrics (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by        text NOT NULL DEFAULT public.requesting_user_id(),
  name              text NOT NULL,
  unit              text,
  formula           text,
  owner_label       text,
  state             text NOT NULL DEFAULT 'tracked'
                       CHECK (state IN ('candidate', 'tracked')),
  origin_card_id    uuid,
  origin_project_id uuid,
  source_kind       text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tracked_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tracked_metrics_select ON public.tracked_metrics;
CREATE POLICY tracked_metrics_select ON public.tracked_metrics
  FOR SELECT USING (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS tracked_metrics_insert ON public.tracked_metrics;
CREATE POLICY tracked_metrics_insert ON public.tracked_metrics
  FOR INSERT WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS tracked_metrics_update ON public.tracked_metrics;
CREATE POLICY tracked_metrics_update ON public.tracked_metrics
  FOR UPDATE USING (created_by = public.requesting_user_id())
  WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS tracked_metrics_delete ON public.tracked_metrics;
CREATE POLICY tracked_metrics_delete ON public.tracked_metrics
  FOR DELETE USING (created_by = public.requesting_user_id());

ALTER TABLE public.metric_cards
  ADD COLUMN IF NOT EXISTS tracked_metric_id uuid
  REFERENCES public.tracked_metrics(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_metric_cards_tracked_metric_id
  ON public.metric_cards(tracked_metric_id);

COMMIT;
