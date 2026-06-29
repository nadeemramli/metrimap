-- =====================================================================
-- DASHBOARD WIDGETS — operational dashboard builder (Metrimap)
-- One implicit dashboard per canvas (project); widgets are positioned on a
-- react-grid-layout grid. Canvas-scoped: access gated by has_project_access,
-- mirroring metric_cards. Forward-compatible with a future `dashboards` parent
-- (add nullable dashboard_id later). See docs plan harmonic-stirring-porcupine.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title        text,
  widget_type  text NOT NULL DEFAULT 'line'
                  CHECK (widget_type IN ('kpi', 'line', 'area', 'bar', 'pie', 'table')),
  config       jsonb NOT NULL DEFAULT '{}'::jsonb,
  layout       jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_index   integer NOT NULL DEFAULT 0,
  created_by   text NOT NULL DEFAULT public.requesting_user_id(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dashboard_widgets_select ON public.dashboard_widgets;
CREATE POLICY dashboard_widgets_select ON public.dashboard_widgets
  FOR SELECT TO authenticated
  USING (public.has_project_access(project_id, false));

DROP POLICY IF EXISTS dashboard_widgets_insert ON public.dashboard_widgets;
CREATE POLICY dashboard_widgets_insert ON public.dashboard_widgets
  FOR INSERT TO authenticated
  WITH CHECK (public.has_project_access(project_id, true));

DROP POLICY IF EXISTS dashboard_widgets_update ON public.dashboard_widgets;
CREATE POLICY dashboard_widgets_update ON public.dashboard_widgets
  FOR UPDATE TO authenticated
  USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));

DROP POLICY IF EXISTS dashboard_widgets_delete ON public.dashboard_widgets;
CREATE POLICY dashboard_widgets_delete ON public.dashboard_widgets
  FOR DELETE TO authenticated
  USING (public.has_project_access(project_id, true));

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_project_id
  ON public.dashboard_widgets(project_id);

COMMIT;
