-- =====================================================================
-- @mention notifications producer. Cross-user notifications are RLS-blocked for
-- clients (notifications_insert requires user_id = requesting_user_id()), so
-- @mention rows for OTHER users can never be inserted from the browser. Mirror
-- the notify_card_assigned / emit_card_alert pattern: a SECURITY DEFINER RPC that
-- verifies the caller has access to the comment's project, then inserts a
-- 'mention' notification for each mentioned user (skipping the caller).
-- =====================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.notify_comment_mention(
  p_comment_id uuid,
  p_user_ids   text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project uuid;
  v_thread  uuid;
  v_content text;
  v_caller  text := public.requesting_user_id();
  uid       text;
BEGIN
  SELECT c.thread_id, t.project_id, c.content
    INTO v_thread, v_project, v_content
  FROM public.comments c
  JOIN public.comment_threads t ON t.id = c.thread_id
  WHERE c.id = p_comment_id;
  IF v_project IS NULL THEN RETURN; END IF;

  -- Caller must have access to the comment's project.
  IF NOT public.has_project_access(v_project, false) THEN
    RAISE EXCEPTION 'not authorized to notify for this comment';
  END IF;

  FOREACH uid IN ARRAY coalesce(p_user_ids, ARRAY[]::text[])
  LOOP
    -- Skip empty ids and self-mentions (don't notify yourself).
    IF uid IS NULL OR uid = '' OR uid = v_caller THEN
      CONTINUE;
    END IF;
    INSERT INTO public.notifications (user_id, type, title, description, metadata)
    VALUES (
      uid,
      'mention',
      'You were mentioned',
      left(coalesce(v_content, ''), 140),
      jsonb_build_object(
        'threadId', v_thread::text,
        'projectId', v_project::text,
        'commentId', p_comment_id::text
      )
    );
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.notify_comment_mention(uuid, text[]) FROM public;
GRANT EXECUTE ON FUNCTION public.notify_comment_mention(uuid, text[]) TO authenticated;

COMMIT;
