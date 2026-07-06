-- Paint order for canvas content (Layers panel / bring-forward / send-back).
-- NULL = legacy row; the client resolves NULLs by created_at order and only
-- writes values back on the first explicit reorder (lazy backfill, no bulk
-- update needed). Applies to the two node tables that exist:
--   metric_cards  — metric/value/action/hypothesis cards
--   canvas_nodes  — source/chart/operator/comment/whiteboard(drawing) nodes
ALTER TABLE public.metric_cards ADD COLUMN IF NOT EXISTS z_index integer;
ALTER TABLE public.canvas_nodes ADD COLUMN IF NOT EXISTS z_index integer;
