-- Enable realtime and public sharing for canvases
-- Adds is_public flag to projects and RLS/policies to allow anonymous read when public

alter table public.projects
  add column if not exists is_public boolean not null default false;

-- Ensure realtime is enabled for these tables via publication (handled in Supabase dashboard by default)
-- For self-managed Postgres: create publication if missing
-- create publication supabase_realtime for table public.projects, public.metric_cards, public.relationships, public.groups;

-- RLS: allow anon read when is_public = true
-- Assumes existing RLS restricts access to owners/collaborators for private projects

-- Projects read when public
create policy if not exists "Public read on public projects" on public.projects
  for select
  using (is_public = true);

-- Metric cards of public projects
create policy if not exists "Public read metric_cards of public projects" on public.metric_cards
  for select
  using (
    exists (
      select 1 from public.projects p where p.id = metric_cards.project_id and p.is_public = true
    )
  );

-- Relationships of public projects
create policy if not exists "Public read relationships of public projects" on public.relationships
  for select
  using (
    exists (
      select 1 from public.projects p where p.id = relationships.project_id and p.is_public = true
    )
  );

-- Groups of public projects
create policy if not exists "Public read groups of public projects" on public.groups
  for select
  using (
    exists (
      select 1 from public.projects p where p.id = groups.project_id and p.is_public = true
    )
  );


