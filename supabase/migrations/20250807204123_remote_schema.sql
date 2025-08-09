drop policy "Users can manage evidence in own projects" on "public"."evidence_items";

drop policy "Users can manage groups in own projects" on "public"."groups";

drop policy "Users can manage metric cards in own projects" on "public"."metric_cards";

drop policy "Users can create projects" on "public"."projects";

drop policy "Users can delete own projects" on "public"."projects";

drop policy "Users can update own projects" on "public"."projects";

drop policy "Users can view own projects" on "public"."projects";

drop policy "Users can manage relationships in own projects" on "public"."relationships";

drop policy "Users can manage own profile" on "public"."users";

create policy "Users can manage evidence in own projects"
on "public"."evidence_items"
as permissive
for all
to public
using (((created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)))
with check (((created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));


create policy "Users can manage groups in own projects"
on "public"."groups"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = groups.project_id) AND (projects.created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)))))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)))
with check (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = groups.project_id) AND (projects.created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)))))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));


create policy "Users can manage metric cards in own projects"
on "public"."metric_cards"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)))))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)))
with check (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = metric_cards.project_id) AND (projects.created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)))))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));


create policy "Users can create projects"
on "public"."projects"
as permissive
for insert
to public
with check (((requesting_user_id() IS NOT NULL) OR (auth.uid() IS NOT NULL) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) IS NOT NULL) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));


create policy "Users can delete own projects"
on "public"."projects"
as permissive
for delete
to public
using ((created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))));


create policy "Users can update own projects"
on "public"."projects"
as permissive
for update
to public
using (((created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL) OR (created_by = ANY (ARRAY['user_30ui9qrJF30u0StAHlwM6w2vkHx'::text, 'user_30uQARGezqSApAChPSGSwFyUy85'::text]))));


create policy "Users can view own projects"
on "public"."projects"
as permissive
for select
to public
using (((created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));


create policy "Users can manage relationships in own projects"
on "public"."relationships"
as permissive
for all
to public
using (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = relationships.project_id) AND (projects.created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)))))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)))
with check (((EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id = relationships.project_id) AND (projects.created_by = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)))))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));


create policy "Users can manage own profile"
on "public"."users"
as permissive
for all
to public
using (((id = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)))
with check (((id = COALESCE(requesting_user_id(), (auth.uid())::text, ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text))) OR (current_setting('request.jwt.claims'::text, true) IS NOT NULL)));



