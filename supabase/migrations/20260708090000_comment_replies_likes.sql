-- Threaded replies + likes for comments (Monday-style comment UI).
-- Additive only: nullable parent_id on comments, and a comment_likes table
-- whose RLS mirrors the comments policies through the thread → project chain.

alter table public.comments
  add column if not exists parent_id uuid references public.comments(id) on delete cascade;
create index if not exists idx_comments_parent_id on public.comments(parent_id);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);
alter table public.comment_likes enable row level security;

drop policy if exists comment_likes_select on public.comment_likes;
create policy comment_likes_select on public.comment_likes
  for select using (
    exists (
      select 1 from public.comments c
      join public.comment_threads t on t.id = c.thread_id
      where c.id = comment_likes.comment_id
        and public.can_view_project(t.project_id)
    )
  );

drop policy if exists comment_likes_insert on public.comment_likes;
create policy comment_likes_insert on public.comment_likes
  for insert with check (
    user_id = public.requesting_user_id()
    and exists (
      select 1 from public.comments c
      join public.comment_threads t on t.id = c.thread_id
      where c.id = comment_likes.comment_id
        and public.can_comment_project(t.project_id)
    )
  );

-- Users can only unlike for themselves.
drop policy if exists comment_likes_delete on public.comment_likes;
create policy comment_likes_delete on public.comment_likes
  for delete using (user_id = public.requesting_user_id());
