-- =====================================================================
-- WORKSPACE GROUPS / DEPARTMENTS (CVS-119) — foundation for node-level
-- visibility (Access & Visibility, spike CVS-118).
--
-- Introduces WITHIN-workspace tiering that doesn't exist today: the Clerk
-- org stays the tenant boundary (org = collaborative, every member writes),
-- but members can now be grouped (Finance, Marketing, Exec…) so later
-- access-tags (CVS-120) + RLS (CVS-121) can gate which nodes/values a
-- group may see. This migration only adds the membership model + the
-- my_groups() helper the visibility policy will key off.
--
-- Scope note: group management is gated to workspace (org) membership, not
-- org-admin-only, consistent with the current "org = collaborative" model.
-- Admin-only tightening is a documented follow-up tied to workspace-settings
-- roles (CVS-93). The real data boundary lands in CVS-121.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.workspace_groups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id text NOT NULL DEFAULT public.requesting_org_id(),
  name         text NOT NULL,
  description  text,
  color        text,
  created_by   text NOT NULL DEFAULT public.requesting_user_id(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, name)
);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid NOT NULL REFERENCES public.workspace_groups(id) ON DELETE CASCADE,
  user_id  text NOT NULL,
  added_by text NOT NULL DEFAULT public.requesting_user_id(),
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_groups_ws ON public.workspace_groups(workspace_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user   ON public.group_members(user_id);

-- ---------------------------------------------------------------------
-- my_groups(): the requesting user's group ids in the current workspace.
-- SECURITY DEFINER so the visibility helpers/policies can call it without
-- needing direct select on the membership tables. Fail-closed: no org / no
-- user => empty set.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.my_groups()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT gm.group_id
  FROM public.group_members gm
  JOIN public.workspace_groups g ON g.id = gm.group_id
  WHERE public.requesting_user_id() IS NOT NULL
    AND gm.user_id = public.requesting_user_id()
    AND g.workspace_id = public.requesting_org_id();
$$;
GRANT EXECUTE ON FUNCTION public.my_groups() TO authenticated, anon;

-- ---------------------------------------------------------------------
-- RLS — everything scoped to the requester's workspace (Clerk org).
-- ---------------------------------------------------------------------
ALTER TABLE public.workspace_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members    ENABLE ROW LEVEL SECURITY;

-- workspace_groups: any workspace member reads/manages groups in their org.
DROP POLICY IF EXISTS workspace_groups_select ON public.workspace_groups;
CREATE POLICY workspace_groups_select ON public.workspace_groups
  FOR SELECT USING (workspace_id = public.requesting_org_id());

DROP POLICY IF EXISTS workspace_groups_insert ON public.workspace_groups;
CREATE POLICY workspace_groups_insert ON public.workspace_groups
  FOR INSERT WITH CHECK (
    workspace_id = public.requesting_org_id()
    AND public.requesting_user_id() IS NOT NULL
  );

DROP POLICY IF EXISTS workspace_groups_update ON public.workspace_groups;
CREATE POLICY workspace_groups_update ON public.workspace_groups
  FOR UPDATE USING (workspace_id = public.requesting_org_id())
  WITH CHECK (workspace_id = public.requesting_org_id());

DROP POLICY IF EXISTS workspace_groups_delete ON public.workspace_groups;
CREATE POLICY workspace_groups_delete ON public.workspace_groups
  FOR DELETE USING (workspace_id = public.requesting_org_id());

-- group_members: readable/manageable when the parent group is in the org.
DROP POLICY IF EXISTS group_members_select ON public.group_members;
CREATE POLICY group_members_select ON public.group_members
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = group_members.group_id
      AND g.workspace_id = public.requesting_org_id()
  ));

DROP POLICY IF EXISTS group_members_insert ON public.group_members;
CREATE POLICY group_members_insert ON public.group_members
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = group_members.group_id
      AND g.workspace_id = public.requesting_org_id()
  ) AND public.requesting_user_id() IS NOT NULL);

DROP POLICY IF EXISTS group_members_delete ON public.group_members;
CREATE POLICY group_members_delete ON public.group_members
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = group_members.group_id
      AND g.workspace_id = public.requesting_org_id()
  ));

COMMIT;
