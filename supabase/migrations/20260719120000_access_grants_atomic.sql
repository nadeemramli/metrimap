-- =====================================================================
-- Atomic access-matrix writes. setTagAudience / setNodeAccessGrants replace a
-- tag's audience / a node's allowlist with a client-side DELETE followed by a
-- separate INSERT. If the INSERT fails after the DELETE commits, the access
-- config is left EMPTY — the write path of the admin access matrix that governs
-- who can see restricted nodes. These SECURITY DEFINER RPCs do the DELETE+INSERT
-- in one transaction, re-checking the same authorization the tag_audiences /
-- node_access_grants RLS policies enforce (every group in the caller's
-- workspace; caller has write access to the tag/card's project).
-- =====================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.set_tag_audience(
  p_tag_id    uuid,
  p_group_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project uuid;
  v_exists  boolean;
  gid       uuid;
BEGIN
  IF public.requesting_user_id() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT true, t.project_id INTO v_exists, v_project
  FROM public.tags t WHERE t.id = p_tag_id;
  IF NOT coalesce(v_exists, false) THEN
    RAISE EXCEPTION 'tag not found';
  END IF;

  -- Tag scoped to a project => caller needs write access to it.
  IF v_project IS NOT NULL AND NOT public.has_project_access(v_project, true) THEN
    RAISE EXCEPTION 'not authorized to edit this tag audience';
  END IF;

  -- Every target group must belong to the caller's active workspace.
  FOREACH gid IN ARRAY coalesce(p_group_ids, ARRAY[]::uuid[])
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.workspace_groups g
      WHERE g.id = gid AND g.workspace_id = public.requesting_org_id()
    ) THEN
      RAISE EXCEPTION 'group % is not in the current workspace', gid;
    END IF;
  END LOOP;

  DELETE FROM public.tag_audiences WHERE tag_id = p_tag_id;

  IF p_group_ids IS NOT NULL AND array_length(p_group_ids, 1) IS NOT NULL THEN
    INSERT INTO public.tag_audiences (tag_id, group_id)
    SELECT p_tag_id, g FROM unnest(p_group_ids) AS g
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_node_access_grants(
  p_card_id   uuid,
  p_group_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project uuid;
  gid       uuid;
BEGIN
  IF public.requesting_user_id() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT mc.project_id INTO v_project
  FROM public.metric_cards mc WHERE mc.id = p_card_id;
  IF v_project IS NULL THEN
    RAISE EXCEPTION 'card not found';
  END IF;

  IF NOT public.has_project_access(v_project, true) THEN
    RAISE EXCEPTION 'not authorized to edit this node access';
  END IF;

  FOREACH gid IN ARRAY coalesce(p_group_ids, ARRAY[]::uuid[])
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.workspace_groups g
      WHERE g.id = gid AND g.workspace_id = public.requesting_org_id()
    ) THEN
      RAISE EXCEPTION 'group % is not in the current workspace', gid;
    END IF;
  END LOOP;

  DELETE FROM public.node_access_grants WHERE metric_card_id = p_card_id;

  IF p_group_ids IS NOT NULL AND array_length(p_group_ids, 1) IS NOT NULL THEN
    INSERT INTO public.node_access_grants (metric_card_id, group_id)
    SELECT p_card_id, g FROM unnest(p_group_ids) AS g
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.set_tag_audience(uuid, uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION public.set_tag_audience(uuid, uuid[]) TO authenticated;
REVOKE ALL ON FUNCTION public.set_node_access_grants(uuid, uuid[]) FROM public;
GRANT EXECUTE ON FUNCTION public.set_node_access_grants(uuid, uuid[]) TO authenticated;

COMMIT;
