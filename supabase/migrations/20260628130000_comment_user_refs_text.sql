-- Align comment user-reference columns to text so Clerk user ids (text) fit.
--
-- `users.id` is text (Clerk ids like `user_2abc...`), but these columns were uuid,
-- which silently rejected Clerk ids — breaking comment authorship and @mentions.
-- All three tables are empty, so the type change is safe. No RLS policy references
-- these columns directly (every comment/thread/mention policy gates on project_id
-- via has_project_access/can_view_project), so no policy recreation is needed.

ALTER TABLE public.comments
  ALTER COLUMN author_id TYPE text USING author_id::text;

ALTER TABLE public.comment_threads
  ALTER COLUMN created_by TYPE text USING created_by::text;

ALTER TABLE public.comment_mentions
  ALTER COLUMN mentioned_user_id TYPE text USING mentioned_user_id::text;
