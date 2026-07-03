-- =====================================================================
-- CVS-73 — "assigned to me" notification producer.
-- The inbox/feed already filters type='assigned', but nothing emitted them.
-- Clients can't insert notifications for OTHER users (RLS), so mirror the
-- emit_card_alert pattern: a SECURITY DEFINER RPC that verifies the caller has
-- project access, then inserts an 'assigned' notification for each newly-added
-- assignee (skipping the caller themselves). APPLIED to prod 2026-07-04.
-- =====================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.notify_card_assigned(
  p_card_id  uuid,
  p_user_ids text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project uuid;
  v_title   text;
  v_caller  text := public.requesting_user_id();
  uid       text;
BEGIN
  SELECT project_id, title INTO v_project, v_title
  FROM public.metric_cards WHERE id = p_card_id;
  IF v_project IS NULL THEN RETURN; END IF;

  -- Caller must have access to the card's project.
  IF NOT public.has_project_access(v_project, false) THEN
    RAISE EXCEPTION 'not authorized to notify for this card';
  END IF;

  FOREACH uid IN ARRAY coalesce(p_user_ids, ARRAY[]::text[])
  LOOP
    -- Skip empty ids and self-assignment (don't notify yourself).
    IF uid IS NULL OR uid = '' OR uid = v_caller THEN
      CONTINUE;
    END IF;
    INSERT INTO public.notifications (user_id, type, title, description, metadata)
    VALUES (
      uid,
      'assigned',
      'You were assigned to ' || coalesce(nullif(v_title, ''), 'a card'),
      NULL,
      jsonb_build_object('projectId', v_project::text, 'cardId', p_card_id::text)
    );
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.notify_card_assigned(uuid, text[]) FROM public;
GRANT EXECUTE ON FUNCTION public.notify_card_assigned(uuid, text[]) TO authenticated;

COMMIT;
