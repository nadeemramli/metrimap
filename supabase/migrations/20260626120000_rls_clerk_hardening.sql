-- =====================================================================
-- RLS HARDENING MIGRATION  (Metrimap / metrimap-v2 : iqrclwolhookzzmiedun)
-- DEFINITIVE. Clerk-via-Supabase-native auth. Identity = public.requesting_user_id() (text).
-- Idempotent: DROP POLICY IF EXISTS (legacy + new names) + CREATE OR REPLACE FUNCTION +
--   guarded ALTER. Safe to apply/re-apply verbatim to live prod. RLS stays ENABLED on all 16 tables.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 0. CLEAN UP LEAKED REVIEW ARTIFACTS
--    A reviewer committed exploratory seed rows to the LIVE DB via a DO block with no
--    rollback wrapper. The DB was empty (0 projects/users) before that. These EXACT seed
--    ids are pollution and are removed here (children first). Guarded to the exact ids only.
-- ---------------------------------------------------------------------
DELETE FROM public.metric_cards
  WHERE id IN ('aaaaaaaa-0000-0000-0000-000000000001',
               'cccccccc-0000-0000-0000-000000000001');
DELETE FROM public.canvas_nodes
  WHERE id = 'dddddddd-0000-0000-0000-000000000001';
DELETE FROM public.project_collaborators
  WHERE project_id IN ('11111111-1111-1111-1111-111111111111',
                       '33333333-3333-3333-3333-333333333333');
DELETE FROM public.projects
  WHERE id IN ('11111111-1111-1111-1111-111111111111',
               '33333333-3333-3333-3333-333333333333');
DELETE FROM public.users
  WHERE id IN ('user_AAA','user_BBB','user_CCC');

-- ---------------------------------------------------------------------
-- 1. HELPER FUNCTIONS  (SECURITY DEFINER => bypass RLS inside body => no recursion)
-- ---------------------------------------------------------------------

-- Read: owner OR any collaborator OR is_public. anon-safe.
CREATE OR REPLACE FUNCTION public.can_view_project(pid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid
      AND (
        p.is_public = true
        OR (public.requesting_user_id() IS NOT NULL AND p.created_by = public.requesting_user_id())
        OR (public.requesting_user_id() IS NOT NULL AND EXISTS (
              SELECT 1 FROM public.project_collaborators pc
              WHERE pc.project_id = p.id AND pc.user_id = public.requesting_user_id()))
      )
  );
$$;

-- Access. write=false: owner OR any collaborator (NOT is_public; public read only via can_view_project).
--   write=true : owner OR a collaborator with write authority. Write authority is recognized via
--   EITHER a permissions[] token (edit/write/admin) OR a write-capable role on the role column
--   (owner/admin; 'editor' included defensively though the live CHECK currently allows only
--   owner|admin|member|viewer). A 'member'/'viewer' with permissions=['read'] stays read-only.
CREATE OR REPLACE FUNCTION public.has_project_access(pid uuid, write boolean)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT (public.requesting_user_id() IS NOT NULL) AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid
      AND (
        p.created_by = public.requesting_user_id()
        OR EXISTS (
          SELECT 1 FROM public.project_collaborators pc
          WHERE pc.project_id = p.id
            AND pc.user_id = public.requesting_user_id()
            AND (
              write = false
              OR pc.permissions @> ARRAY['edit']::text[]
              OR pc.permissions @> ARRAY['write']::text[]
              OR pc.permissions @> ARRAY['admin']::text[]
              OR pc.role = ANY (ARRAY['owner','admin','editor'])
            )
        )
      )
  );
$$;

-- Strict owner check (project_collaborators write policies).
CREATE OR REPLACE FUNCTION public.is_project_owner(pid uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT (public.requesting_user_id() IS NOT NULL) AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = pid AND p.created_by = public.requesting_user_id()
  );
$$;

-- Defense-in-depth: lock down then re-grant EXECUTE to exactly the client roles.
REVOKE ALL ON FUNCTION public.can_view_project(uuid)            FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_project_access(uuid, boolean) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_project_owner(uuid)            FROM public, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.can_view_project(uuid)            TO anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.has_project_access(uuid, boolean) TO anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.is_project_owner(uuid)            TO authenticated;

-- ---------------------------------------------------------------------
-- 2. PROJECTS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own projects"   ON public.projects;
DROP POLICY IF EXISTS "public_read_projects"          ON public.projects;
DROP POLICY IF EXISTS "Users can create projects"     ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS projects_select ON public.projects;
DROP POLICY IF EXISTS projects_insert ON public.projects;
DROP POLICY IF EXISTS projects_update ON public.projects;
DROP POLICY IF EXISTS projects_delete ON public.projects;

CREATE POLICY projects_select ON public.projects
  FOR SELECT TO anon, authenticated
  USING (
    is_public = true
    OR (public.requesting_user_id() IS NOT NULL AND created_by = public.requesting_user_id())
    OR (public.requesting_user_id() IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.project_collaborators pc
          WHERE pc.project_id = projects.id AND pc.user_id = public.requesting_user_id()))
  );
CREATE POLICY projects_insert ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.requesting_user_id() IS NOT NULL AND created_by = public.requesting_user_id());
CREATE POLICY projects_update ON public.projects
  FOR UPDATE TO authenticated
  USING      (public.requesting_user_id() IS NOT NULL AND created_by = public.requesting_user_id())
  WITH CHECK (created_by = public.requesting_user_id());
CREATE POLICY projects_delete ON public.projects
  FOR DELETE TO authenticated
  USING (public.requesting_user_id() IS NOT NULL AND created_by = public.requesting_user_id());

-- ---------------------------------------------------------------------
-- 3. PROJECT_COLLABORATORS  (recursion-safe)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view collaborators of accessible projects" ON public.project_collaborators;
DROP POLICY IF EXISTS "Project owners can add collaborators"                 ON public.project_collaborators;
DROP POLICY IF EXISTS "Project owners can update collaborators"              ON public.project_collaborators;
DROP POLICY IF EXISTS "Project owners can remove collaborators"              ON public.project_collaborators;
DROP POLICY IF EXISTS pc_select ON public.project_collaborators;
DROP POLICY IF EXISTS pc_insert ON public.project_collaborators;
DROP POLICY IF EXISTS pc_update ON public.project_collaborators;
DROP POLICY IF EXISTS pc_delete ON public.project_collaborators;

-- Self-row clause (user_id = requesting_user_id) lets fetchCollaboratedProjectIds work and
-- avoids any need for the policy body to re-read project_collaborators via RLS.
CREATE POLICY pc_select ON public.project_collaborators
  FOR SELECT TO authenticated
  USING (
    public.requesting_user_id() IS NOT NULL
    AND (user_id = public.requesting_user_id() OR public.has_project_access(project_id, false))
  );
CREATE POLICY pc_insert ON public.project_collaborators
  FOR INSERT TO authenticated
  WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY pc_update ON public.project_collaborators
  FOR UPDATE TO authenticated
  USING (public.is_project_owner(project_id)) WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY pc_delete ON public.project_collaborators
  FOR DELETE TO authenticated
  USING (public.is_project_owner(project_id));

-- ---------------------------------------------------------------------
-- 4. USERS  (own Clerk id row; any authenticated may read directory for collaborator email lookup)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;
DROP POLICY IF EXISTS users_select ON public.users;
DROP POLICY IF EXISTS users_insert ON public.users;
DROP POLICY IF EXISTS users_update ON public.users;

CREATE POLICY users_select ON public.users
  FOR SELECT TO authenticated
  USING (public.requesting_user_id() IS NOT NULL);
CREATE POLICY users_insert ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = public.requesting_user_id());
CREATE POLICY users_update ON public.users
  FOR UPDATE TO authenticated
  USING (id = public.requesting_user_id()) WITH CHECK (id = public.requesting_user_id());

-- ---------------------------------------------------------------------
-- 5. METRIC_CARDS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage metric cards in own projects" ON public.metric_cards;
DROP POLICY IF EXISTS "Users can view metric cards in own projects"   ON public.metric_cards;
DROP POLICY IF EXISTS "Users can create metric cards in own projects" ON public.metric_cards;
DROP POLICY IF EXISTS "Users can update metric cards in own projects" ON public.metric_cards;
DROP POLICY IF EXISTS "Users can delete metric cards in own projects" ON public.metric_cards;
DROP POLICY IF EXISTS "public_read_metric_cards"                      ON public.metric_cards;
DROP POLICY IF EXISTS metric_cards_select ON public.metric_cards;
DROP POLICY IF EXISTS metric_cards_insert ON public.metric_cards;
DROP POLICY IF EXISTS metric_cards_update ON public.metric_cards;
DROP POLICY IF EXISTS metric_cards_delete ON public.metric_cards;

CREATE POLICY metric_cards_select ON public.metric_cards
  FOR SELECT TO anon, authenticated USING (public.can_view_project(project_id));
CREATE POLICY metric_cards_insert ON public.metric_cards
  FOR INSERT TO authenticated WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY metric_cards_update ON public.metric_cards
  FOR UPDATE TO authenticated USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY metric_cards_delete ON public.metric_cards
  FOR DELETE TO authenticated USING (public.has_project_access(project_id, true));

-- ---------------------------------------------------------------------
-- 6. RELATIONSHIPS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage relationships in own projects"        ON public.relationships;
DROP POLICY IF EXISTS "Users can view relationships in accessible projects"   ON public.relationships;
DROP POLICY IF EXISTS "Users can create relationships in accessible projects" ON public.relationships;
DROP POLICY IF EXISTS "Users can update relationships in accessible projects" ON public.relationships;
DROP POLICY IF EXISTS "Users can delete relationships in accessible projects" ON public.relationships;
DROP POLICY IF EXISTS "public_read_relationships"                             ON public.relationships;
DROP POLICY IF EXISTS relationships_select ON public.relationships;
DROP POLICY IF EXISTS relationships_insert ON public.relationships;
DROP POLICY IF EXISTS relationships_update ON public.relationships;
DROP POLICY IF EXISTS relationships_delete ON public.relationships;

CREATE POLICY relationships_select ON public.relationships
  FOR SELECT TO anon, authenticated USING (public.can_view_project(project_id));
CREATE POLICY relationships_insert ON public.relationships
  FOR INSERT TO authenticated WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY relationships_update ON public.relationships
  FOR UPDATE TO authenticated USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY relationships_delete ON public.relationships
  FOR DELETE TO authenticated USING (public.has_project_access(project_id, true));

-- ---------------------------------------------------------------------
-- 7. GROUPS
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage groups in own projects"        ON public.groups;
DROP POLICY IF EXISTS "Users can view groups in accessible projects"   ON public.groups;
DROP POLICY IF EXISTS "Users can create groups in accessible projects" ON public.groups;
DROP POLICY IF EXISTS "Users can update groups in accessible projects" ON public.groups;
DROP POLICY IF EXISTS "Users can delete groups in accessible projects" ON public.groups;
DROP POLICY IF EXISTS "public_read_groups"                             ON public.groups;
DROP POLICY IF EXISTS groups_select ON public.groups;
DROP POLICY IF EXISTS groups_insert ON public.groups;
DROP POLICY IF EXISTS groups_update ON public.groups;
DROP POLICY IF EXISTS groups_delete ON public.groups;

CREATE POLICY groups_select ON public.groups
  FOR SELECT TO anon, authenticated USING (public.can_view_project(project_id));
CREATE POLICY groups_insert ON public.groups
  FOR INSERT TO authenticated WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY groups_update ON public.groups
  FOR UPDATE TO authenticated USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY groups_delete ON public.groups
  FOR DELETE TO authenticated USING (public.has_project_access(project_id, true));

-- ---------------------------------------------------------------------
-- 8. TAGS  (tags.project_id exists)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view tags in accessible projects"   ON public.tags;
DROP POLICY IF EXISTS "Users can create tags in accessible projects" ON public.tags;
DROP POLICY IF EXISTS "Users can update tags they created"           ON public.tags;
DROP POLICY IF EXISTS "Users can delete tags they created"           ON public.tags;
DROP POLICY IF EXISTS tags_select ON public.tags;
DROP POLICY IF EXISTS tags_insert ON public.tags;
DROP POLICY IF EXISTS tags_update ON public.tags;
DROP POLICY IF EXISTS tags_delete ON public.tags;

CREATE POLICY tags_select ON public.tags
  FOR SELECT TO anon, authenticated USING (public.can_view_project(project_id));
CREATE POLICY tags_insert ON public.tags
  FOR INSERT TO authenticated WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY tags_update ON public.tags
  FOR UPDATE TO authenticated USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY tags_delete ON public.tags
  FOR DELETE TO authenticated USING (public.has_project_access(project_id, true));

-- ---------------------------------------------------------------------
-- 9. EVIDENCE_ITEMS  (child of relationships -> project)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage evidence in own projects"               ON public.evidence_items;
DROP POLICY IF EXISTS "Users can view evidence items in accessible projects"    ON public.evidence_items;
DROP POLICY IF EXISTS "Users can create evidence items in accessible projects"  ON public.evidence_items;
DROP POLICY IF EXISTS "Users can update evidence items in accessible projects"  ON public.evidence_items;
DROP POLICY IF EXISTS "Users can delete evidence items in accessible projects"  ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_select ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_insert ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_update ON public.evidence_items;
DROP POLICY IF EXISTS evidence_items_delete ON public.evidence_items;

CREATE POLICY evidence_items_select ON public.evidence_items
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.relationships r
                 WHERE r.id = evidence_items.relationship_id AND public.can_view_project(r.project_id)));
CREATE POLICY evidence_items_insert ON public.evidence_items
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.relationships r
                      WHERE r.id = evidence_items.relationship_id AND public.has_project_access(r.project_id, true)));
CREATE POLICY evidence_items_update ON public.evidence_items
  FOR UPDATE TO authenticated
  USING      (EXISTS (SELECT 1 FROM public.relationships r
                      WHERE r.id = evidence_items.relationship_id AND public.has_project_access(r.project_id, true)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.relationships r
                      WHERE r.id = evidence_items.relationship_id AND public.has_project_access(r.project_id, true)));
CREATE POLICY evidence_items_delete ON public.evidence_items
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.relationships r
                 WHERE r.id = evidence_items.relationship_id AND public.has_project_access(r.project_id, true)));

-- ---------------------------------------------------------------------
-- 10. CANVAS_NODES  (was DEAD under auth.uid() -> now works for Clerk)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view canvas nodes in accessible projects"   ON public.canvas_nodes;
DROP POLICY IF EXISTS "Users can insert canvas nodes in accessible projects" ON public.canvas_nodes;
DROP POLICY IF EXISTS "Users can update canvas nodes in accessible projects" ON public.canvas_nodes;
DROP POLICY IF EXISTS "Users can delete canvas nodes in accessible projects" ON public.canvas_nodes;
DROP POLICY IF EXISTS canvas_nodes_select ON public.canvas_nodes;
DROP POLICY IF EXISTS canvas_nodes_insert ON public.canvas_nodes;
DROP POLICY IF EXISTS canvas_nodes_update ON public.canvas_nodes;
DROP POLICY IF EXISTS canvas_nodes_delete ON public.canvas_nodes;

CREATE POLICY canvas_nodes_select ON public.canvas_nodes
  FOR SELECT TO anon, authenticated USING (public.can_view_project(project_id));
CREATE POLICY canvas_nodes_insert ON public.canvas_nodes
  FOR INSERT TO authenticated WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY canvas_nodes_update ON public.canvas_nodes
  FOR UPDATE TO authenticated USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY canvas_nodes_delete ON public.canvas_nodes
  FOR DELETE TO authenticated USING (public.has_project_access(project_id, true));

-- ---------------------------------------------------------------------
-- 11. METRIC_CARD_TAGS  (junction -> metric_card -> project)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view metric card tags in accessible projects"   ON public.metric_card_tags;
DROP POLICY IF EXISTS "Users can create metric card tags in accessible projects" ON public.metric_card_tags;
DROP POLICY IF EXISTS "Users can delete metric card tags in accessible projects" ON public.metric_card_tags;
DROP POLICY IF EXISTS metric_card_tags_select ON public.metric_card_tags;
DROP POLICY IF EXISTS metric_card_tags_insert ON public.metric_card_tags;
DROP POLICY IF EXISTS metric_card_tags_delete ON public.metric_card_tags;

CREATE POLICY metric_card_tags_select ON public.metric_card_tags
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.metric_cards mc
                 WHERE mc.id = metric_card_tags.metric_card_id AND public.can_view_project(mc.project_id)));
CREATE POLICY metric_card_tags_insert ON public.metric_card_tags
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.metric_cards mc
                      WHERE mc.id = metric_card_tags.metric_card_id AND public.has_project_access(mc.project_id, true)));
CREATE POLICY metric_card_tags_delete ON public.metric_card_tags
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.metric_cards mc
                 WHERE mc.id = metric_card_tags.metric_card_id AND public.has_project_access(mc.project_id, true)));

-- ---------------------------------------------------------------------
-- 12. RELATIONSHIP_TAGS  (junction -> relationship -> project)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view relationship tags in accessible projects"   ON public.relationship_tags;
DROP POLICY IF EXISTS "Users can create relationship tags in accessible projects" ON public.relationship_tags;
DROP POLICY IF EXISTS "Users can delete relationship tags in accessible projects" ON public.relationship_tags;
DROP POLICY IF EXISTS relationship_tags_select ON public.relationship_tags;
DROP POLICY IF EXISTS relationship_tags_insert ON public.relationship_tags;
DROP POLICY IF EXISTS relationship_tags_delete ON public.relationship_tags;

CREATE POLICY relationship_tags_select ON public.relationship_tags
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.relationships r
                 WHERE r.id = relationship_tags.relationship_id AND public.can_view_project(r.project_id)));
CREATE POLICY relationship_tags_insert ON public.relationship_tags
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.relationships r
                      WHERE r.id = relationship_tags.relationship_id AND public.has_project_access(r.project_id, true)));
CREATE POLICY relationship_tags_delete ON public.relationship_tags
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.relationships r
                 WHERE r.id = relationship_tags.relationship_id AND public.has_project_access(r.project_id, true)));

-- ---------------------------------------------------------------------
-- 13. CHANGELOG  (project-scoped; ALSO allow target-only entries owned by the caller.
--     changelog.user_id is TEXT = the Clerk id, changelog.project_id is nullable.
--     Dropping the legacy 'true' wide-open SELECT/UPDATE/DELETE policies is REQUIRED:
--     a leftover USING=true policy OR-rescues cross-tenant reads.)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view changelog in accessible projects"           ON public.changelog;
DROP POLICY IF EXISTS "Users can create changelog entries in accessible projects" ON public.changelog;
DROP POLICY IF EXISTS "Project owners can update changelog entries"               ON public.changelog;
DROP POLICY IF EXISTS "Project owners can delete changelog entries"               ON public.changelog;
DROP POLICY IF EXISTS changelog_select ON public.changelog;
DROP POLICY IF EXISTS changelog_insert ON public.changelog;
DROP POLICY IF EXISTS changelog_update ON public.changelog;
DROP POLICY IF EXISTS changelog_delete ON public.changelog;

CREATE POLICY changelog_select ON public.changelog
  FOR SELECT TO anon, authenticated
  USING (
    (project_id IS NOT NULL AND public.can_view_project(project_id))
    OR (project_id IS NULL AND public.requesting_user_id() IS NOT NULL
        AND user_id = public.requesting_user_id())
  );
CREATE POLICY changelog_insert ON public.changelog
  FOR INSERT TO authenticated
  WITH CHECK (
    (project_id IS NOT NULL AND public.has_project_access(project_id, true))
    OR (project_id IS NULL AND public.requesting_user_id() IS NOT NULL
        AND user_id = public.requesting_user_id())
  );
-- append-only: no UPDATE / DELETE policies (the legacy 'true' ones above are dropped).

-- ---------------------------------------------------------------------
-- 14. COMMENT_THREADS  (project-scoped; was DEAD under auth.uid())
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "comment_threads_select" ON public.comment_threads;
DROP POLICY IF EXISTS "comment_threads_insert" ON public.comment_threads;
DROP POLICY IF EXISTS "comment_threads_update" ON public.comment_threads;
DROP POLICY IF EXISTS comment_threads_delete ON public.comment_threads;

CREATE POLICY comment_threads_select ON public.comment_threads
  FOR SELECT TO anon, authenticated USING (public.can_view_project(project_id));
CREATE POLICY comment_threads_insert ON public.comment_threads
  FOR INSERT TO authenticated WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY comment_threads_update ON public.comment_threads
  FOR UPDATE TO authenticated USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));
CREATE POLICY comment_threads_delete ON public.comment_threads
  FOR DELETE TO authenticated USING (public.has_project_access(project_id, true));

-- ---------------------------------------------------------------------
-- 15. COMMENTS  (child of comment_threads -> project; was DEAD under auth.uid())
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "comments_select" ON public.comments;
DROP POLICY IF EXISTS "comments_insert" ON public.comments;
DROP POLICY IF EXISTS "comments_update" ON public.comments;
DROP POLICY IF EXISTS comments_delete ON public.comments;

CREATE POLICY comments_select ON public.comments
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.comment_threads t
                 WHERE t.id = comments.thread_id AND public.can_view_project(t.project_id)));
CREATE POLICY comments_insert ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.comment_threads t
                      WHERE t.id = comments.thread_id AND public.has_project_access(t.project_id, true)));
CREATE POLICY comments_update ON public.comments
  FOR UPDATE TO authenticated
  USING      (EXISTS (SELECT 1 FROM public.comment_threads t
                      WHERE t.id = comments.thread_id AND public.has_project_access(t.project_id, true)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.comment_threads t
                      WHERE t.id = comments.thread_id AND public.has_project_access(t.project_id, true)));
CREATE POLICY comments_delete ON public.comments
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.comment_threads t
                 WHERE t.id = comments.thread_id AND public.has_project_access(t.project_id, true)));

-- ---------------------------------------------------------------------
-- 16. COMMENT_MENTIONS  (comment -> thread -> project; mentioned_user_id is uuid,
--     scoped by project access which is the durable model)
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "comment_mentions_select" ON public.comment_mentions;
DROP POLICY IF EXISTS comment_mentions_insert ON public.comment_mentions;
DROP POLICY IF EXISTS comment_mentions_delete ON public.comment_mentions;

CREATE POLICY comment_mentions_select ON public.comment_mentions
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.comments c
                   JOIN public.comment_threads t ON t.id = c.thread_id
                 WHERE c.id = comment_mentions.comment_id AND public.can_view_project(t.project_id)));
CREATE POLICY comment_mentions_insert ON public.comment_mentions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.comments c
                        JOIN public.comment_threads t ON t.id = c.thread_id
                      WHERE c.id = comment_mentions.comment_id AND public.has_project_access(t.project_id, true)));

-- ---------------------------------------------------------------------
-- 17. NOTIFICATIONS  (per-user). FIX: migrate user_id UUID -> TEXT so a Clerk text sub
--     can actually match, making the notifications feature functional under the Clerk client
--     (previously DEAD: uuid user_id could never equal a Clerk text id).
--     Dependent policies are dropped FIRST (a policy referencing the column blocks ALTER TYPE).
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
DROP POLICY IF EXISTS notifications_insert ON public.notifications;
DROP POLICY IF EXISTS notifications_delete ON public.notifications;

-- Guarded, idempotent type change (only acts while the column is still uuid).
DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'notifications'
        AND column_name = 'user_id') = 'uuid' THEN
    ALTER TABLE public.notifications
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END $$;

CREATE POLICY notifications_select ON public.notifications
  FOR SELECT TO authenticated
  USING (public.requesting_user_id() IS NOT NULL AND user_id = public.requesting_user_id());
CREATE POLICY notifications_insert ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.requesting_user_id() IS NOT NULL AND user_id = public.requesting_user_id());
CREATE POLICY notifications_update ON public.notifications
  FOR UPDATE TO authenticated
  USING      (public.requesting_user_id() IS NOT NULL AND user_id = public.requesting_user_id())
  WITH CHECK (user_id = public.requesting_user_id());

-- ---------------------------------------------------------------------
-- 18. FIX MUTABLE search_path on trigger fn (advisor WARN)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_canvas_nodes_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- 19. Ensure RLS stays ENABLED on every public table (idempotent)
-- ---------------------------------------------------------------------
ALTER TABLE public.projects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_cards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canvas_nodes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_card_tags      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_tags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_threads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_mentions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;

COMMIT;