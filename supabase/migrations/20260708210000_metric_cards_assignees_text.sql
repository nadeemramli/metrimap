-- metric_cards.assignees was uuid[] but the app stores Clerk user ids
-- (text, e.g. 'user_...') — every assignee update from the Strategy People
-- picker failed with 'invalid input syntax for type uuid'. Same class of fix
-- as the earlier comment-refs uuid→text migration.
alter table public.metric_cards alter column assignees drop default;
alter table public.metric_cards
  alter column assignees type text[] using assignees::text[];
alter table public.metric_cards alter column assignees set default '{}'::text[];
