-- Widgets become assignable to a specific group dashboard. NULL = the
-- canvas's Custom dashboard (existing behavior). Group ids reference the
-- canvas `groups` table but ids are client-generated and groups are
-- hard-deleted, so this stays a plain text column without an FK; widgets
-- with an orphaned group_id are surfaced back on Custom in the UI. Enables
-- "move chart to another dashboard" + importing straight into a group view.
ALTER TABLE public.dashboard_widgets ADD COLUMN IF NOT EXISTS group_id text;
CREATE INDEX IF NOT EXISTS dashboard_widgets_group_idx
  ON public.dashboard_widgets (project_id, group_id);
