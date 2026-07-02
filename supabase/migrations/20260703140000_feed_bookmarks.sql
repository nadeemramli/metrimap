-- =====================================================================
-- FEED BOOKMARKS — persistent "saved" primitive for the update feed (Metrimap)
-- Replaces the localStorage-only bookmarks in FeedPage so saved items follow
-- the user across devices. Keyed on the feed item's composite id (e.g. 'c:<id>'
-- for a changelog entry, 'n:<id>' for a notification), so it works for the
-- heterogeneous feed. Owner-scoped via RLS.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.feed_bookmarks (
  user_id    text NOT NULL DEFAULT public.requesting_user_id(),
  item_key   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_key)
);

ALTER TABLE public.feed_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS feed_bookmarks_select ON public.feed_bookmarks;
CREATE POLICY feed_bookmarks_select ON public.feed_bookmarks
  FOR SELECT USING (user_id = public.requesting_user_id());

DROP POLICY IF EXISTS feed_bookmarks_insert ON public.feed_bookmarks;
CREATE POLICY feed_bookmarks_insert ON public.feed_bookmarks
  FOR INSERT WITH CHECK (user_id = public.requesting_user_id());

DROP POLICY IF EXISTS feed_bookmarks_delete ON public.feed_bookmarks;
CREATE POLICY feed_bookmarks_delete ON public.feed_bookmarks
  FOR DELETE USING (user_id = public.requesting_user_id());

COMMIT;
