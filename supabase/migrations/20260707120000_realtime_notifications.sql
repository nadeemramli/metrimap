-- =====================================================================
-- REALTIME publication: notifications (Metrimap, CVS-78)
-- The NotificationInbox bell already subscribes to INSERTs on
-- public.notifications to show a live unread badge, but postgres_changes only
-- fires for tables in the supabase_realtime publication — notifications was
-- missing, so the badge only refreshed on mount. Add it (idempotent). RLS still
-- applies at the realtime layer, so each user only receives their own rows.
-- =====================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
