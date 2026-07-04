-- =====================================================================
-- NODE-LEVEL VISIBILITY — RLS ENFORCEMENT (CVS-121). The hard boundary:
-- restricted nodes/edges become unreachable server-side regardless of client
-- (app or API/MCP). Builds on groups (CVS-119) + access tags (CVS-120).
--
-- IMPORTANT correctness fix over CVS-120: the exemption for "always sees"
-- CANNOT be has_project_access(), because this app is org-collaborative —
-- has_project_access() is TRUE for EVERY workspace member, which would make
-- hiding a no-op inside a workspace. The exemption is OWNER/ADMIN only
-- (is_visibility_admin): project creator, an owner/admin project collaborator,
-- or a Clerk org admin. Regular members (incl. editors) are subject to
-- visibility — that's the whole point (Marketing must not see Finance).
--
-- Enforcement model (locked CVS-118):
--   * hide_node  — the card ROW and its edges are filtered out for viewers not
--                  in the access tag's audience (owner/admin/allowlist exempt).
--   * hide_value — structure stays (row visible); the number is redacted. The
--                  shared value store (metric_values) is already owner-scoped
--                  so non-owners can't read values via the API. In-card values
--                  (metric_cards.data, a column) are masked at render (CVS-122)
--                  since row-level RLS can't blank a column.
--
-- All resolver helpers are SECURITY DEFINER (run as owner, bypass RLS) so
-- calling them from the metric_cards/relationships SELECT policies does NOT
-- recurse.
-- =====================================================================
BEGIN;

-- Clerk org role from the session JWT (o.rol), e.g. 'admin' / 'org:admin'.
CREATE OR REPLACE FUNCTION public.requesting_org_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->'o'->>'rol', '');
$$;
GRANT EXECUTE ON FUNCTION public.requesting_org_role() TO authenticated, anon;

-- Owner/admin of a project — the only roles exempt from node visibility.
-- NOT plain org members / editors (org is collaborative but visibility tiers
-- below owner/admin).
CREATE OR REPLACE FUNCTION public.is_visibility_admin(pid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT (public.requesting_user_id() IS NOT NULL) AND (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = pid AND p.created_by = public.requesting_user_id()
    )
    OR EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = pid
        AND pc.user_id = public.requesting_user_id()
        AND pc.role = ANY (ARRAY['owner','admin'])
    )
    OR public.requesting_org_role() = ANY (ARRAY['admin','org:admin'])
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_visibility_admin(uuid) TO authenticated, anon;

-- Supersede CVS-120's node_visible_to_me: owner/admin exemption (was the
-- over-broad has_project_access). Fail-closed. Used by the client resolver
-- (redaction UX) and the value-for-card boundary.
CREATE OR REPLACE FUNCTION public.node_visible_to_me(card_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.metric_cards mc WHERE mc.id = card_id)
    AND (
      public.is_visibility_admin(
        (SELECT mc.project_id FROM public.metric_cards mc WHERE mc.id = card_id))
      OR NOT EXISTS (
        SELECT 1 FROM public.metric_card_tags mct
        JOIN public.tags t ON t.id = mct.tag_id
        WHERE mct.metric_card_id = card_id AND t.is_access
      )
      OR EXISTS (
        SELECT 1 FROM public.metric_card_tags mct
        JOIN public.tags t ON t.id = mct.tag_id AND t.is_access
        JOIN public.tag_audiences ta ON ta.tag_id = t.id
        WHERE mct.metric_card_id = card_id
          AND ta.group_id IN (SELECT public.my_groups())
      )
      OR EXISTS (
        SELECT 1 FROM public.node_access_grants g
        WHERE g.metric_card_id = card_id
          AND g.group_id IN (SELECT public.my_groups())
      )
    );
$$;
GRANT EXECUTE ON FUNCTION public.node_visible_to_me(uuid) TO authenticated, anon;

-- node_hidden_from_me(card_id): true => filter the card ROW out for the viewer.
-- Only hide_node access tags hide the row; hide_value keeps it.
CREATE OR REPLACE FUNCTION public.node_hidden_from_me(card_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    NOT public.is_visibility_admin(
      (SELECT mc.project_id FROM public.metric_cards mc WHERE mc.id = card_id))
    AND EXISTS (
      SELECT 1 FROM public.metric_card_tags mct
      JOIN public.tags t ON t.id = mct.tag_id
      WHERE mct.metric_card_id = card_id
        AND t.is_access AND t.redaction_mode = 'hide_node'
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.metric_card_tags mct
      JOIN public.tags t ON t.id = mct.tag_id
      JOIN public.tag_audiences ta ON ta.tag_id = t.id
      WHERE mct.metric_card_id = card_id
        AND t.is_access AND t.redaction_mode = 'hide_node'
        AND ta.group_id IN (SELECT public.my_groups())
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.node_access_grants g
      WHERE g.metric_card_id = card_id
        AND g.group_id IN (SELECT public.my_groups())
    );
$$;
GRANT EXECUTE ON FUNCTION public.node_hidden_from_me(uuid) TO authenticated, anon;

-- metric_cards: keep the project-scope gate, additionally drop hide_node rows.
DROP POLICY IF EXISTS metric_cards_select ON public.metric_cards;
CREATE POLICY metric_cards_select ON public.metric_cards
  FOR SELECT TO anon, authenticated
  USING (
    public.can_view_project(project_id)
    AND NOT public.node_hidden_from_me(id)
  );

-- relationships: hide any edge touching a hidden node (info-leak guard). NULL
-- source/target resolves to "not hidden" so ordinary edges are unaffected.
DROP POLICY IF EXISTS relationships_select ON public.relationships;
CREATE POLICY relationships_select ON public.relationships
  FOR SELECT TO anon, authenticated
  USING (
    public.can_view_project(project_id)
    AND NOT public.node_hidden_from_me(source_id)
    AND NOT public.node_hidden_from_me(target_id)
  );

COMMIT;
