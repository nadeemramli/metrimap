# B.4 — Workspace (Clerk org) scoping + collaboration

**Status:** prepared, NOT applied. Needs (1) the owner's personal **org id** (live, post sign-in) for the backfill, and (2) a **second user invited to the org** to verify shared access. Folded into B.4 per owner decision 2026-06-29.

## Why this is now SAFE (additive design)

The org clause is **additive** — every existing owner check stays, we only *add* `OR workspace_id = requesting_org_id()`. So the creator can never be locked out (the `created_by = requesting_user_id()` clause always works); the new clause only *grants* access to fellow workspace members. Backfill enables org-member visibility; it can't break owner access.

## Architecture (discovered via audit)

- **Indirect tables** (`metric_cards`, `relationships`, `canvas_nodes`, `groups`, `evidence_items`, `comments`, `comment_threads`, `tags`) don't reference `projects` directly — they all route through **`can_view_project(pid)`** and **`has_project_access(pid, write)`**. Update those **2 functions once** → all 8 follow.
- **Direct workspace-content tables:** `projects`, `spaces`, `tracked_metrics`, `metric_values`, `source_connections` — `created_by = requesting_user_id()`.
- **Stay per-user (do NOT touch):** `users`, `notifications`, `changelog`.
- **Collaboration:** `project_collaborators` already exists (per-project sharing); Clerk org invites/roles come via `<OrganizationSwitcher>` → Manage Organization.

## Claim shape (confirmed)

Clerk native integration exposes the active org as `request.jwt.claims -> 'o' -> 'id'`.

## Prepared SQL

```sql
-- 1. org-id reader + owner resolver (org if active, else the user — the fallback)
create or replace function public.requesting_org_id() returns text
  language sql stable security definer set search_path to 'public' as $$
  select nullif(current_setting('request.jwt.claims', true)::json->'o'->>'id','')::text;
$$;

-- 2. workspace_id columns (additive, nullable) on the 5 direct tables
alter table public.projects           add column if not exists workspace_id text;
alter table public.spaces             add column if not exists workspace_id text;
alter table public.tracked_metrics    add column if not exists workspace_id text;
alter table public.metric_values      add column if not exists workspace_id text;
alter table public.source_connections add column if not exists workspace_id text;
create index if not exists idx_projects_workspace_id on public.projects(workspace_id);
-- (+ indexes on the others)

-- 3. helper functions: ADD an org-member clause (keep everything else)
--    can_view_project: ... OR (requesting_org_id() is not null AND p.workspace_id = requesting_org_id())
--    has_project_access: same additive clause (write path can refine by Clerk org role later)

-- 4. direct-table policies: ADD `OR workspace_id = public.requesting_org_id()` to each
--    (keep the existing created_by clause — additive, no lockout)

-- 5. BACKFILL (needs <ORG_ID>): set workspace_id on the owner's existing rows
update public.projects           set workspace_id = '<ORG_ID>' where created_by = '<USER_ID>' and workspace_id is null;
update public.spaces             set workspace_id = '<ORG_ID>' where created_by = '<USER_ID>' and workspace_id is null;
update public.tracked_metrics    set workspace_id = '<ORG_ID>' where created_by = '<USER_ID>' and workspace_id is null;
update public.metric_values      set workspace_id = '<ORG_ID>' where created_by = '<USER_ID>' and workspace_id is null;
update public.source_connections set workspace_id = '<ORG_ID>' where created_by = '<USER_ID>' and workspace_id is null;

-- 6. new-insert default: app sets workspace_id = active org id on create
--    (set in the services; keep created_by = the actual user for audit)
```

## Execution checklist

1. Owner signs in → personal org auto-created → capture **org id** (Clerk Dashboard → Organizations, `org_…`) and **user id** (`user_…`).
2. Apply steps 1–4 (additive — safe; owner access unchanged).
3. Apply step 5 backfill with the real ids.
4. App: on canvas/space/metric create, stamp `workspace_id = active org id`.
5. **Verify:** owner still sees everything (regression); invite a 2nd user to the org → they see the shared workspace; remove them → access gone.
6. Roles: gate write via Clerk org role (admin/member) in `has_project_access`.

## Rollback

Drop the added policy clauses (revert helpers + direct policies to the `created_by`-only versions). `workspace_id` columns can stay (harmless).
