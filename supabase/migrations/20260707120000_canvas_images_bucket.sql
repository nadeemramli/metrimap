-- Storage bucket for canvas pictures (whiteboardNode `image` shapes) pasted or
-- uploaded onto the canvas. First real Supabase Storage usage in the app.
--
-- Objects are keyed `<project_id>/<uuid>.<ext>`. Read is PUBLIC (bucket public)
-- so shared / public canvases render their images without signed URLs; write
-- (insert/update/delete) requires WRITE access to that project, mirroring the
-- canvas_nodes access model via public.has_project_access(pid, write).

insert into storage.buckets (id, name, public)
values ('canvas-images', 'canvas-images', true)
on conflict (id) do nothing;

-- Uploads: authenticated user must have write access to the project whose id is
-- the first path segment. The regex guards the ::uuid cast so a malformed path
-- is denied rather than erroring the statement.
drop policy if exists "canvas_images_insert" on storage.objects;
create policy "canvas_images_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'canvas-images'
    and name ~ '^[0-9a-fA-F-]{36}/'
    and public.has_project_access((split_part(name, '/', 1))::uuid, true)
  );

drop policy if exists "canvas_images_update" on storage.objects;
create policy "canvas_images_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'canvas-images'
    and name ~ '^[0-9a-fA-F-]{36}/'
    and public.has_project_access((split_part(name, '/', 1))::uuid, true)
  );

drop policy if exists "canvas_images_delete" on storage.objects;
create policy "canvas_images_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'canvas-images'
    and name ~ '^[0-9a-fA-F-]{36}/'
    and public.has_project_access((split_part(name, '/', 1))::uuid, true)
  );
