-- =====================================================================
-- B.4 — STRICT WORKSPACE SEPARATION (orgs-only). APPLIED to prod 2026-06-29.
-- Replaces the additive owner clause (which leaked a creator's canvases into
-- every context) with active-workspace scoping. A null-workspace creator
-- fallback prevents orphaning. Safe: the Clerk o.id claim is confirmed flowing
-- and all existing rows are stamped with a workspace_id.
-- Reads/writes now follow the ACTIVE org; INSERT policies unchanged (new rows
-- default workspace_id = requesting_org_id()). See docs/backlog/b4-workspace-scoping.md.
-- =====================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.can_view_project(pid uuid)
  RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid AND (
      p.is_public = true
      OR (public.requesting_org_id() IS NOT NULL AND p.workspace_id = public.requesting_org_id())
      OR (p.workspace_id IS NULL AND public.requesting_user_id() IS NOT NULL AND p.created_by = public.requesting_user_id())
      OR (public.requesting_user_id() IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.project_collaborators pc
            WHERE pc.project_id = p.id AND pc.user_id = public.requesting_user_id()))
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.has_project_access(pid uuid, write boolean)
  RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT (public.requesting_user_id() IS NOT NULL) AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid AND (
      (public.requesting_org_id() IS NOT NULL AND p.workspace_id = public.requesting_org_id())
      OR (p.workspace_id IS NULL AND p.created_by = public.requesting_user_id())
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc
        WHERE pc.project_id = p.id AND pc.user_id = public.requesting_user_id()
          AND (write = false
            OR pc.permissions @> ARRAY['edit']::text[]
            OR pc.permissions @> ARRAY['write']::text[]
            OR pc.permissions @> ARRAY['admin']::text[]
            OR pc.role = ANY (ARRAY['owner','admin','editor']))
      )
    )
  );
$$;

DROP POLICY IF EXISTS projects_select ON public.projects;
CREATE POLICY projects_select ON public.projects FOR SELECT USING (
  is_public = true
  OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id())
  OR (workspace_id IS NULL AND requesting_user_id() IS NOT NULL AND created_by = requesting_user_id())
  OR (requesting_user_id() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.project_collaborators pc
        WHERE pc.project_id = projects.id AND pc.user_id = requesting_user_id())));
DROP POLICY IF EXISTS projects_update ON public.projects;
CREATE POLICY projects_update ON public.projects FOR UPDATE USING (
  (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id())
  OR (workspace_id IS NULL AND created_by = requesting_user_id()))
WITH CHECK (
  (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id())
  OR (workspace_id IS NULL AND created_by = requesting_user_id()));
DROP POLICY IF EXISTS projects_delete ON public.projects;
CREATE POLICY projects_delete ON public.projects FOR DELETE USING (
  (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id())
  OR (workspace_id IS NULL AND created_by = requesting_user_id()));

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['spaces','tracked_metrics','metric_values','source_connections'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %1$s_select ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_select ON public.%1$s FOR SELECT USING ((requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()) OR (workspace_id IS NULL AND created_by = requesting_user_id()));', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_update ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_update ON public.%1$s FOR UPDATE USING ((requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()) OR (workspace_id IS NULL AND created_by = requesting_user_id())) WITH CHECK ((requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()) OR (workspace_id IS NULL AND created_by = requesting_user_id()));', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_delete ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_delete ON public.%1$s FOR DELETE USING ((requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()) OR (workspace_id IS NULL AND created_by = requesting_user_id()));', t);
  END LOOP;
END $$;

COMMIT;
