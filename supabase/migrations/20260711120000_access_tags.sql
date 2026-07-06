-- =====================================================================
-- ACCESS TAGS + AUDIENCE POLICY (CVS-120) — extends the existing tag system
-- so a tag can be an "access tag" carrying an audience (which workspace groups
-- may see nodes with it). Builds on workspace_groups/my_groups() (CVS-119).
--
-- Model (locked in CVS-118):
--   * tags.is_access        — mark a tag as an access tag
--   * tags.redaction_mode   — hide_value (default) | hide_node
--   * tag_audiences         — access tag -> allowed groups
--   * node_access_grants    — per-node allowlist escape hatch
--   * node_visible_to_me()  — deterministic visibility resolver (fail closed)
--
-- This migration adds the MODEL + resolver only. RLS enforcement that USES the
-- resolver on metric_cards / edges / metric_values lands in CVS-121. Existing
-- untagged nodes stay visible to everyone (is_access defaults false).
-- =====================================================================
BEGIN;

ALTER TABLE public.tags
  ADD COLUMN IF NOT EXISTS is_access boolean NOT NULL DEFAULT false;
ALTER TABLE public.tags
  ADD COLUMN IF NOT EXISTS redaction_mode text NOT NULL DEFAULT 'hide_value';

DO $$ BEGIN
  ALTER TABLE public.tags
    ADD CONSTRAINT tags_redaction_mode_check
    CHECK (redaction_mode IN ('hide_value', 'hide_node'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.tag_audiences (
  tag_id   uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES public.workspace_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (tag_id, group_id)
);

CREATE TABLE IF NOT EXISTS public.node_access_grants (
  metric_card_id uuid NOT NULL REFERENCES public.metric_cards(id) ON DELETE CASCADE,
  group_id       uuid NOT NULL REFERENCES public.workspace_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (metric_card_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_tag_audiences_group      ON public.tag_audiences(group_id);
CREATE INDEX IF NOT EXISTS idx_node_access_grants_group ON public.node_access_grants(group_id);

-- ---------------------------------------------------------------------
-- node_visible_to_me(card_id): the deterministic resolver the RLS layer
-- (CVS-121) and the client (redaction UX, CVS-122) both call.
--
-- SECURITY DEFINER (runs as owner, bypassing RLS) so it can read the tag /
-- audience tables AND so calling it from the metric_cards RLS policy in
-- CVS-121 does not recurse. Fail-closed: unknown card / no match => false.
--
-- Visible when ANY of:
--   * requester owns/admins/edits the project (has_project_access), OR
--   * the node carries NO access tag, OR
--   * the requester is in some access tag's audience, OR
--   * the requester's group has a per-node allowlist grant.
-- Multiple access tags union (any granting tag lets the viewer in).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.node_visible_to_me(card_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.metric_cards mc WHERE mc.id = card_id)
    AND (
      public.has_project_access(
        (SELECT mc.project_id FROM public.metric_cards mc WHERE mc.id = card_id), true
      )
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

-- ---------------------------------------------------------------------
-- RLS — audience/allowlist rows scoped to the requester's workspace via the
-- group they reference (workspace_groups.workspace_id = requesting_org_id()).
-- ---------------------------------------------------------------------
ALTER TABLE public.tag_audiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_access_grants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tag_audiences_select ON public.tag_audiences;
CREATE POLICY tag_audiences_select ON public.tag_audiences
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = tag_audiences.group_id
      AND g.workspace_id = public.requesting_org_id()
  ));

DROP POLICY IF EXISTS tag_audiences_insert ON public.tag_audiences;
CREATE POLICY tag_audiences_insert ON public.tag_audiences
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = tag_audiences.group_id
      AND g.workspace_id = public.requesting_org_id()
  ) AND public.requesting_user_id() IS NOT NULL);

DROP POLICY IF EXISTS tag_audiences_delete ON public.tag_audiences;
CREATE POLICY tag_audiences_delete ON public.tag_audiences
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = tag_audiences.group_id
      AND g.workspace_id = public.requesting_org_id()
  ));

DROP POLICY IF EXISTS node_access_grants_select ON public.node_access_grants;
CREATE POLICY node_access_grants_select ON public.node_access_grants
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = node_access_grants.group_id
      AND g.workspace_id = public.requesting_org_id()
  ));

DROP POLICY IF EXISTS node_access_grants_insert ON public.node_access_grants;
CREATE POLICY node_access_grants_insert ON public.node_access_grants
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = node_access_grants.group_id
      AND g.workspace_id = public.requesting_org_id()
  ) AND public.requesting_user_id() IS NOT NULL);

DROP POLICY IF EXISTS node_access_grants_delete ON public.node_access_grants;
CREATE POLICY node_access_grants_delete ON public.node_access_grants
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = node_access_grants.group_id
      AND g.workspace_id = public.requesting_org_id()
  ));

COMMIT;
