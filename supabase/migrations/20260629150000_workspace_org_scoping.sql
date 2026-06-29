-- =====================================================================
-- B.4 — WORKSPACE (Clerk org) SCOPING. APPLIED to prod 2026-06-29.
-- ADDITIVE: every existing owner clause is kept; we only ADD
-- `OR workspace_id = requesting_org_id()`, so the creator is never locked out.
-- Org members gain access to the shared workspace. The 8 "indirect" tables
-- route through can_view_project/has_project_access — updating those 2 fns
-- covers them all. users/notifications/changelog stay per-user (untouched).
-- Org claim (Clerk native integration): request.jwt.claims -> 'o' -> 'id'.
-- See docs/backlog/b4-workspace-scoping.md.
--
-- One-time backfill (run via execute_sql, NOT re-runnable here):
--   update <table> set workspace_id='<ORG_ID>'
--     where created_by='<USER_ID>' and workspace_id is null;
-- =====================================================================
BEGIN;

CREATE OR REPLACE FUNCTION public.requesting_org_id()
  RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->'o'->>'id', '')::text;
$$;

ALTER TABLE public.projects           ADD COLUMN IF NOT EXISTS workspace_id text;
ALTER TABLE public.spaces             ADD COLUMN IF NOT EXISTS workspace_id text;
ALTER TABLE public.tracked_metrics    ADD COLUMN IF NOT EXISTS workspace_id text;
ALTER TABLE public.metric_values      ADD COLUMN IF NOT EXISTS workspace_id text;
ALTER TABLE public.source_connections ADD COLUMN IF NOT EXISTS workspace_id text;

-- New rows auto-inherit the active org from the JWT (no app changes).
ALTER TABLE public.projects           ALTER COLUMN workspace_id SET DEFAULT public.requesting_org_id();
ALTER TABLE public.spaces             ALTER COLUMN workspace_id SET DEFAULT public.requesting_org_id();
ALTER TABLE public.tracked_metrics    ALTER COLUMN workspace_id SET DEFAULT public.requesting_org_id();
ALTER TABLE public.metric_values      ALTER COLUMN workspace_id SET DEFAULT public.requesting_org_id();
ALTER TABLE public.source_connections ALTER COLUMN workspace_id SET DEFAULT public.requesting_org_id();

CREATE INDEX IF NOT EXISTS idx_projects_workspace_id           ON public.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_spaces_workspace_id             ON public.spaces(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tracked_metrics_workspace_id    ON public.tracked_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_metric_values_workspace_id      ON public.metric_values(workspace_id);
CREATE INDEX IF NOT EXISTS idx_source_connections_workspace_id ON public.source_connections(workspace_id);

-- Helper functions cover the 8 indirect tables (metric_cards, relationships,
-- canvas_nodes, groups, evidence_items, comments, comment_threads, tags).
CREATE OR REPLACE FUNCTION public.can_view_project(pid uuid)
  RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid AND (
      p.is_public = true
      OR (public.requesting_user_id() IS NOT NULL AND p.created_by = public.requesting_user_id())
      OR (public.requesting_org_id() IS NOT NULL AND p.workspace_id = public.requesting_org_id())
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
      p.created_by = public.requesting_user_id()
      OR (public.requesting_org_id() IS NOT NULL AND p.workspace_id = public.requesting_org_id())
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

-- Direct workspace-content tables: ADD the org-member clause (keep owner clause).
-- projects (preserve is_public + collaborators)
DROP POLICY IF EXISTS projects_select ON public.projects;
CREATE POLICY projects_select ON public.projects FOR SELECT USING (
  is_public = true
  OR (requesting_user_id() IS NOT NULL AND created_by = requesting_user_id())
  OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id())
  OR (requesting_user_id() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.project_collaborators pc
        WHERE pc.project_id = projects.id AND pc.user_id = requesting_user_id())));
DROP POLICY IF EXISTS projects_insert ON public.projects;
CREATE POLICY projects_insert ON public.projects FOR INSERT WITH CHECK (
  requesting_user_id() IS NOT NULL AND created_by = requesting_user_id()
  AND (workspace_id IS NULL OR workspace_id = requesting_org_id()));
DROP POLICY IF EXISTS projects_update ON public.projects;
CREATE POLICY projects_update ON public.projects FOR UPDATE USING (
  (requesting_user_id() IS NOT NULL AND created_by = requesting_user_id())
  OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()))
WITH CHECK (
  created_by = requesting_user_id()
  OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()));
DROP POLICY IF EXISTS projects_delete ON public.projects;
CREATE POLICY projects_delete ON public.projects FOR DELETE USING (
  (requesting_user_id() IS NOT NULL AND created_by = requesting_user_id())
  OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()));

-- spaces / tracked_metrics / metric_values / source_connections: same shape.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['spaces','tracked_metrics','metric_values','source_connections'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %1$s_select ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_select ON public.%1$s FOR SELECT USING (created_by = requesting_user_id() OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()));', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_insert ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_insert ON public.%1$s FOR INSERT WITH CHECK (created_by = requesting_user_id() AND (workspace_id IS NULL OR workspace_id = requesting_org_id()));', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_update ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_update ON public.%1$s FOR UPDATE USING (created_by = requesting_user_id() OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id())) WITH CHECK (created_by = requesting_user_id() OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()));', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_delete ON public.%1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_delete ON public.%1$s FOR DELETE USING (created_by = requesting_user_id() OR (requesting_org_id() IS NOT NULL AND workspace_id = requesting_org_id()));', t);
  END LOOP;
END $$;

COMMIT;
