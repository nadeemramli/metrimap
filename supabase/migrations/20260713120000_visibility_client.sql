-- =====================================================================
-- REDACTION UX SUPPORT (CVS-122) — batch resolvers for the client so it can
-- mask hide_value nodes and preview "view as <group>" in one round-trip.
-- (hide_node nodes are already filtered by RLS in CVS-121; these power the
-- client-side "Restricted" badge + value masking that pairs with it.)
-- =====================================================================
BEGIN;

-- Hardening: is_visibility_admin (CVS-121) returned NULL when the Clerk org role
-- claim was absent (NULL = ANY(...) is NULL), which propagates through
-- NOT is_visibility_admin and can fail OPEN for hide_value masking. COALESCE the
-- org-role test (and the whole result) to false so it is strictly boolean.
CREATE OR REPLACE FUNCTION public.is_visibility_admin(pid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE((public.requesting_user_id() IS NOT NULL) AND (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = pid AND p.created_by = public.requesting_user_id())
    OR EXISTS (SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = pid AND pc.user_id = public.requesting_user_id()
        AND pc.role = ANY (ARRAY['owner','admin']))
    OR COALESCE(public.requesting_org_role() = ANY (ARRAY['admin','org:admin']), false)
  ), false);
$$;
GRANT EXECUTE ON FUNCTION public.is_visibility_admin(uuid) TO authenticated, anon;

-- Card ids in a project that are RESTRICTED for the current viewer: they carry
-- an access tag whose audience the viewer isn't in (and no allowlist grant, and
-- the viewer isn't an owner/admin). Includes both redaction modes; in practice
-- only hide_value ids reach the client (hide_node rows are RLS-filtered).
CREATE OR REPLACE FUNCTION public.my_restricted_cards(pid uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT mc.id FROM public.metric_cards mc
  WHERE mc.project_id = pid
    AND NOT public.is_visibility_admin(pid)
    AND EXISTS (
      SELECT 1 FROM public.metric_card_tags mct
      JOIN public.tags t ON t.id = mct.tag_id
      WHERE mct.metric_card_id = mc.id AND t.is_access
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.metric_card_tags mct
      JOIN public.tags t ON t.id = mct.tag_id
      JOIN public.tag_audiences ta ON ta.tag_id = t.id
      WHERE mct.metric_card_id = mc.id AND t.is_access
        AND ta.group_id IN (SELECT public.my_groups())
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.node_access_grants g
      WHERE g.metric_card_id = mc.id AND g.group_id IN (SELECT public.my_groups())
    );
$$;
GRANT EXECUTE ON FUNCTION public.my_restricted_cards(uuid) TO authenticated, anon;

-- Admin-only "view as <group>" preview: which cards would be restricted for a
-- viewer whose groups are exactly group_ids. Returns empty for non-admins
-- (fail closed) so it can't be used by regular members to probe audiences.
CREATE OR REPLACE FUNCTION public.cards_restricted_for_groups(pid uuid, group_ids uuid[])
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT mc.id FROM public.metric_cards mc
  WHERE mc.project_id = pid
    AND public.is_visibility_admin(pid)
    AND EXISTS (
      SELECT 1 FROM public.metric_card_tags mct
      JOIN public.tags t ON t.id = mct.tag_id
      WHERE mct.metric_card_id = mc.id AND t.is_access
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.metric_card_tags mct
      JOIN public.tags t ON t.id = mct.tag_id
      JOIN public.tag_audiences ta ON ta.tag_id = t.id
      WHERE mct.metric_card_id = mc.id AND t.is_access
        AND ta.group_id = ANY (group_ids)
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.node_access_grants g
      WHERE g.metric_card_id = mc.id AND g.group_id = ANY (group_ids)
    );
$$;
GRANT EXECUTE ON FUNCTION public.cards_restricted_for_groups(uuid, uuid[]) TO authenticated, anon;

COMMIT;
