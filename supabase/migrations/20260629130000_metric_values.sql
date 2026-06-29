-- =====================================================================
-- DATA LIFECYCLE (B.2) — shared value store for Tracked Metrics.
-- One row per (tracked_metric_id, period) = the current series, so every card
-- referencing the metric reads ONE shared history. Owner-scoped (created_by).
-- Versioning / time-travel comes later via a separate append-only history table.
-- See docs/backlog/object-model-and-catalog.md. APPLIED to prod 2026-06-29.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.metric_values (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_metric_id uuid NOT NULL REFERENCES public.tracked_metrics(id) ON DELETE CASCADE,
  period            text NOT NULL,
  value             double precision NOT NULL,
  change_percent    double precision,
  trend             text,
  source            text,
  created_by        text NOT NULL DEFAULT public.requesting_user_id(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tracked_metric_id, period)
);

ALTER TABLE public.metric_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS metric_values_select ON public.metric_values;
CREATE POLICY metric_values_select ON public.metric_values
  FOR SELECT USING (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS metric_values_insert ON public.metric_values;
CREATE POLICY metric_values_insert ON public.metric_values
  FOR INSERT WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS metric_values_update ON public.metric_values;
CREATE POLICY metric_values_update ON public.metric_values
  FOR UPDATE USING (created_by = public.requesting_user_id())
  WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS metric_values_delete ON public.metric_values;
CREATE POLICY metric_values_delete ON public.metric_values
  FOR DELETE USING (created_by = public.requesting_user_id());

CREATE INDEX IF NOT EXISTS idx_metric_values_tracked_metric_id
  ON public.metric_values(tracked_metric_id);

COMMIT;
