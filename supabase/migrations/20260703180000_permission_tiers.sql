-- =====================================================================
-- PERMISSION TIERS — Viewer / Commenter / Editor / Admin (Metrimap)
-- Model: "org = collaborative" — every active-workspace (Clerk org) member keeps
-- full write (unchanged). Per-project roles constrain EXTERNAL/guest
-- collaborators (project_collaborators rows) and public links.
--
--   viewer    = read only
--   commenter = read + comment (NOT edit)   <- new tier
--   editor    = read + comment + edit        <- role now live in the CHECK
--   admin     = editor + (member mgmt is owner-only elsewhere)
--
-- has_project_access(pid, true) is unchanged (editor/admin/owner or edit/write/
-- admin token => write). Adds a separate can_comment_project so commenting no
-- longer requires full write, and my_project_permission for authoritative UI
-- gating that mirrors these helpers.
-- =====================================================================
BEGIN;

-- 1. Allow the new roles. Keep legacy 'member' for existing rows.
ALTER TABLE public.project_collaborators
  DROP CONSTRAINT IF EXISTS project_collaborators_role_check;
ALTER TABLE public.project_collaborators
  ADD CONSTRAINT project_collaborators_role_check
  CHECK (role = ANY (ARRAY['owner','admin','editor','commenter','member','viewer']));

-- 2. Comment access: view + (org member / null-workspace creator / collaborator
--    with a comment-or-higher role or token). Commenters get this but NOT write.
CREATE OR REPLACE FUNCTION public.can_comment_project(pid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT (public.requesting_user_id() IS NOT NULL) AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid AND (
      (public.requesting_org_id() IS NOT NULL AND p.workspace_id = public.requesting_org_id())
      OR (p.workspace_id IS NULL AND p.created_by = public.requesting_user_id())
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc
        WHERE pc.project_id = p.id AND pc.user_id = public.requesting_user_id()
          AND (pc.role = ANY (ARRAY['owner','admin','editor','commenter'])
            OR pc.permissions @> ARRAY['comment']::text[]
            OR pc.permissions @> ARRAY['edit']::text[]
            OR pc.permissions @> ARRAY['write']::text[]
            OR pc.permissions @> ARRAY['admin']::text[])
      )
    )
  );
$$;

-- 3. Repoint comment INSERT policies from write-gate to comment-gate. (UPDATE/
--    DELETE stay write-gated — resolving/removing threads is an editor action.)
DROP POLICY IF EXISTS comment_threads_insert ON public.comment_threads;
CREATE POLICY comment_threads_insert ON public.comment_threads
  FOR INSERT WITH CHECK (public.can_comment_project(project_id));

DROP POLICY IF EXISTS comments_insert ON public.comments;
CREATE POLICY comments_insert ON public.comments
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.comment_threads t
    WHERE t.id = comments.thread_id AND public.can_comment_project(t.project_id)
  ));

DROP POLICY IF EXISTS comment_mentions_insert ON public.comment_mentions;
CREATE POLICY comment_mentions_insert ON public.comment_mentions
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.comments c
    JOIN public.comment_threads t ON t.id = c.thread_id
    WHERE c.id = comment_mentions.comment_id
      AND public.can_comment_project(t.project_id)
  ));

-- 4. Authoritative effective-permission for the current user on a project, so
--    UI gating exactly mirrors RLS. 'none' | 'view' | 'comment' | 'edit'.
CREATE OR REPLACE FUNCTION public.my_project_permission(pid uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT CASE
    WHEN NOT public.can_view_project(pid) THEN 'none'
    WHEN public.has_project_access(pid, true) THEN 'edit'
    WHEN public.can_comment_project(pid) THEN 'comment'
    ELSE 'view'
  END;
$$;
GRANT EXECUTE ON FUNCTION public.my_project_permission(uuid) TO authenticated, anon;

COMMIT;
