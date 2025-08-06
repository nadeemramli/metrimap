drop policy "Users can create metric cards in accessible projects" on "public"."metric_cards";

drop policy "Users can delete metric cards in accessible projects" on "public"."metric_cards";

drop policy "Users can update metric cards in accessible projects" on "public"."metric_cards";

drop policy "Users can view metric cards in accessible projects" on "public"."metric_cards";

drop policy "Users can insert own projects" on "public"."projects";

drop policy "Users can insert own profile" on "public"."users";

drop policy "Users can update own profile" on "public"."users";

drop policy "Users can view own profile" on "public"."users";

drop policy "Users can delete own projects" on "public"."projects";

drop policy "Users can update own projects" on "public"."projects";

drop policy "Users can view own projects" on "public"."projects";

drop index if exists "public"."idx_project_collaborators_user_id";

drop index if exists "public"."idx_tags_created_by";

CREATE INDEX idx_changelog_user_id ON public.changelog USING btree (user_id);

CREATE INDEX idx_evidence_items_created_by ON public.evidence_items USING btree (created_by);

CREATE INDEX idx_evidence_items_owner_id ON public.evidence_items USING btree (owner_id);

CREATE INDEX idx_groups_created_by ON public.groups USING btree (created_by);

CREATE INDEX idx_metric_cards_created_by ON public.metric_cards USING btree (created_by);

CREATE INDEX idx_metric_cards_owner_id ON public.metric_cards USING btree (owner_id);

CREATE INDEX idx_projects_last_modified_by ON public.projects USING btree (last_modified_by);

CREATE INDEX idx_relationships_created_by ON public.relationships USING btree (created_by);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_clerk_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Try to get user ID from JWT claims
  -- Clerk JWT tokens have the user ID in the 'sub' claim
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id',
    current_setting('request.jwt.claims', true)::json->>'id'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.get_current_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Try to get user ID from JWT claims first
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id',
    current_setting('request.jwt.claims', true)::json->>'id'
  );
$function$
;

create policy "Users can manage evidence in own projects"
on "public"."evidence_items"
as permissive
for all
to public
using (((created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)))
with check (((created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)));


create policy "Users can manage groups in own projects"
on "public"."groups"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = groups.project_id) AND (projects.created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text))))) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)))
with check (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = groups.project_id) AND (projects.created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text))))) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)));


create policy "Users can create metric cards in own projects"
on "public"."metric_cards"
as permissive
for insert
to public
with check (((requesting_user_id() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = requesting_user_id()))))));


create policy "Users can delete metric cards in own projects"
on "public"."metric_cards"
as permissive
for delete
to public
using (((requesting_user_id() IS NOT NULL) AND (requesting_user_id() = created_by)));


create policy "Users can manage metric cards in own projects"
on "public"."metric_cards"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text))))) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)))
with check (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text))))) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)));


create policy "Users can update metric cards in own projects"
on "public"."metric_cards"
as permissive
for update
to public
using (((requesting_user_id() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = requesting_user_id()))))));


create policy "Users can view metric cards in own projects"
on "public"."metric_cards"
as permissive
for select
to public
using (((requesting_user_id() IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = requesting_user_id()))))));


create policy "Users can create projects"
on "public"."projects"
as permissive
for insert
to public
with check (((((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL) OR (get_clerk_user_id() IS NOT NULL) OR (auth.uid() IS NOT NULL)));


create policy "Users can manage relationships in own projects"
on "public"."relationships"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = relationships.project_id) AND (projects.created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text))))) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)))
with check (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = relationships.project_id) AND (projects.created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text))))) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)));


create policy "Users can manage own profile"
on "public"."users"
as permissive
for all
to public
using (((id = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)))
with check (((id = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)));


create policy "Users can delete own projects"
on "public"."projects"
as permissive
for delete
to public
using ((created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)));


create policy "Users can update own projects"
on "public"."projects"
as permissive
for update
to public
using ((created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)));


create policy "Users can view own projects"
on "public"."projects"
as permissive
for select
to public
using (((created_by = COALESCE(((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text), get_clerk_user_id(), (auth.uid())::text)) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL)));



