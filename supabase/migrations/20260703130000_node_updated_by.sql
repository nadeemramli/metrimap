-- =====================================================================
-- LAST-EDITED-BY attribution for canvas nodes (Metrimap)
-- Adds updated_by to metric_cards + canvas_nodes and stamps it server-side on
-- every UPDATE with the authenticated Clerk user (public.requesting_user_id()),
-- so the UI can show "last edited by X". Null until first edit / for service-role
-- writes. Additive + reversible (drop column).
-- =====================================================================
BEGIN;

ALTER TABLE public.metric_cards ADD COLUMN IF NOT EXISTS updated_by text;
ALTER TABLE public.canvas_nodes ADD COLUMN IF NOT EXISTS updated_by text;

-- Stamp updated_at + updated_by. Dedicated (NOT the shared update_updated_at_column,
-- which several tables without an updated_by column still use).
CREATE OR REPLACE FUNCTION public.stamp_updated_by_and_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = public.requesting_user_id();
  RETURN NEW;
END;
$$;

-- metric_cards: replace the updated_at-only trigger with the stamping one.
DROP TRIGGER IF EXISTS update_metric_cards_updated_at ON public.metric_cards;
CREATE TRIGGER update_metric_cards_updated_at
  BEFORE UPDATE ON public.metric_cards
  FOR EACH ROW EXECUTE FUNCTION public.stamp_updated_by_and_at();

-- canvas_nodes: same (was trigger_update_canvas_nodes_updated_at).
DROP TRIGGER IF EXISTS trigger_update_canvas_nodes_updated_at ON public.canvas_nodes;
CREATE TRIGGER trigger_update_canvas_nodes_updated_at
  BEFORE UPDATE ON public.canvas_nodes
  FOR EACH ROW EXECUTE FUNCTION public.stamp_updated_by_and_at();

COMMIT;
