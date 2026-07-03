-- =====================================================================
-- REALTIME publication additions (Metrimap)
-- postgres_changes only fires for tables in the supabase_realtime publication.
-- Add the tables our live features subscribe to:
--   metric_values, tracked_metrics — live cross-canvas catalog propagation
--   comments                       — live comment sync (node + panel)
-- RLS still applies at the realtime layer, so users only receive changes they
-- can see. Idempotent (skips tables already published).
-- =====================================================================
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['metric_values', 'tracked_metrics', 'comments']
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public' AND tablename = tbl
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
    END IF;
  END LOOP;
END $$;
