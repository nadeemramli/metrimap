# Collaboration consolidation — handoff to the collaboration pipeline

> **Read this before touching any collaboration code (comments, mentions, share, members, notifications).**
> The **UI is already built and merged** — do **not** rebuild it. What remains is **runtime activation + backend wiring**, and that work is **owned by the collaboration pipeline**, not the canvas/UI pipeline that authored this.

_Authored 2026-06-28. Status: UI **DONE** (type-check / lint / 50 tests / build all green). Runtime **BLOCKED** on one un-applied migration — see §2._

---

## 1. What was built (DONE — leave it alone)

The canvas had **two** collaboration entry points that did the same job: a top-left **Collaborate** button (a 98vw placeholder dialog) and a top-right **Share** button (one-off `setProjectPublic` + copy-link). They are now **one** top-right **Collaborate** button opening a **right-side slide-over panel** (`Sheet`, `modal={false}` so the canvas stays interactive). Three tabs:

- **People** — members list (role `Select` + remove), invite-by-email, **Public link** toggle + **Copy link** (the old Share, folded in).
- **Comments** — real DB threads (the old list was a literal placeholder) → open thread → reply, via a shared `CommentComposer` with an **@mention picker**. Posting a mention writes `comment_mentions` **and** a `notifications` row.
- **Activity** — notifications (mark-read) + changelog feed + `VersionHistoryButton`.

The card "Discussion" tab was also rerouted off its fake card-JSON storage onto the same real tables.

### Files (authored / changed)
| File | Role |
|---|---|
| `src/features/canvas/components/collaboration/CollaborationPanel.tsx` | the panel (People / Comments / Activity) |
| `src/features/canvas/components/collaboration/CommentComposer.tsx` | textarea + `@` mention picker (Command in Popover) |
| `src/features/canvas/hooks/useProjectMembers.ts` | resolves project members (collaborators + self) for picker & author names |
| `src/features/canvas/utils/comments.ts` | `postComment()` — **single source of truth** for persisting a comment + mentions + notifications |
| `src/features/canvas/components/CanvasLayout.tsx` | single Collaborate button + mounts the panel |
| `src/features/canvas/components/panels/relationship-panel/tabs/comments-tab.tsx` | card discussion, now DB-backed |
| `src/shared/lib/supabase/types.ts` | **hand-added** the 4 missing tables — see §4 |
| `supabase/migrations/20260628130000_comment_user_refs_text.sql` | the blocking migration — see §2 |
| _deleted_ | `collaboration-dialog.tsx`, `CommentSummaryDashboard.tsx`, dead dup `shared/components/layout/CanvasLayout.tsx` |

---

## 2. ⚠️ BLOCKER — the collaboration pipeline must apply this migration

The comment tables store user references as **`uuid`**, but app user ids are **Clerk text ids** (`user_2abc…`, `users.id` is `text`). A Clerk id cannot be inserted into a uuid column, so **every comment post + mention + authorship fails at runtime** (this also affects the pre-existing canvas comment-node). All three tables are empty, so the change is non-destructive.

**Migration:** `supabase/migrations/20260628130000_comment_user_refs_text.sql`
```sql
ALTER TABLE comments        ALTER COLUMN author_id         TYPE text;
ALTER TABLE comment_threads ALTER COLUMN created_by        TYPE text;
ALTER TABLE comment_mentions ALTER COLUMN mentioned_user_id TYPE text;
```
No RLS policy references these columns (all gate on `project_id` via `has_project_access` / `can_view_project`), so no policy recreation is needed — verified against `pg_policy` on 2026-06-28.

**Apply it** (pipeline owns the prod DB `iqrclwolhookzzmiedun`): `npx supabase db push`, or apply the SQL via the Supabase MCP `apply_migration`. This aligns with the backlog's already-tracked **"RLS hardening: Clerk `auth.uid()` → JWT `sub`"** note. Until applied, the panel renders but posting errors.

---

## 3. What still needs implementing (collaboration pipeline owns)

In rough priority:

1. **Apply the §2 migration.** Everything below is dead without it.
2. **Seed an owner `project_collaborators` row on project create/duplicate (backlog P1-12).** Until then `getProjectCollaborators` returns `[]`, so the mention picker shows **self only** on solo projects (`useProjectMembers` already merges self as a fallback so it's never empty).
3. **Server-side user provisioning (backlog P0-7).** Mentions/notifications only deliver to users who have a `users` row; `addMention`/`createNotification` are wrapped in try/catch in `postComment` so a non-provisioned target is skipped, not fatal.
4. **Surface unread on the Collaborate button** — a badge from `listNotifications(userId, { unreadOnly: true })`; the Activity tab already lists + marks-read.
5. **Realtime** (backlog P2) — `useCanvasRealtime` is still a stub; the panel polls on open. Wire Supabase realtime on `comments`/`notifications` if desired.

These resolve / supersede backlog items **P1-9** (thread list placeholder), **P1-18** (route through `createCommentThread`/`createComment` + real author id), **P1-4** (wire `addMention`/`createNotification`), **P1-10** (TeamMembers controls), **P3-14** (`shareProject`). Mark them against this doc rather than re-implementing from the old descriptions.

---

## 4. Contracts & gotchas (don't relearn these the hard way)

- **`postComment()` is the only sanctioned write path.** Reuse it; do not re-implement comment inserts. Signature in `utils/comments.ts`.
- **Thread `source` + `context` conventions** (used to label/route threads):
  - general project comment → `source:'canvas'`, `context:{ general:true }`
  - card discussion → `source:'node'`, `context:{ cardId }`
  - canvas pin (comment-node) → `source:'canvas'`, `context:{ nodeId }`
- **Notification shape for mentions:** `type:'mention'`, `metadata:{ threadId, projectId, commentId }`.
- **`types.ts` was hand-edited** to add `comments`, `comment_threads`, `comment_mentions`, `notifications` — they were **absent** from the generated file (that's why `services/collaboration.ts` and `comment-node.tsx` carry `@ts-nocheck`). **If you run `npm run prisma:types` / regenerate Supabase types, re-add these 4 tables** (with the §2 `text` user-ref types) or strict files will break.
- **Roles must be `owner | admin | member | viewer`** (DB check constraint). The old `addCollaborator` default listed `'editor'` — invalid; it was corrected to `'member'`.
- **`projects.is_public`** exists in the DB but is missing from generated `types.ts`; `setProjectPublic` casts `as any`. The People tab's public toggle initialises to `false` (it does not yet read the live value) — wire the real initial state when convenient.

---

## 5. Verify end-to-end (after applying §2)

Open a canvas → **Collaborate** (top-right) opens the right panel without blocking the canvas → **People** shows you + toggle/copy public link → **Comments**: post a comment, type `@` → picker lists members → posting a mention inserts rows in `comments`, `comment_mentions`, `notifications` (check via Supabase MCP `execute_sql` on `iqrclwolhookzzmiedun`) → **Activity** shows the notification → a card's Discussion tab writes to the same `comments` table (thread `context:{cardId}`).

DB sanity after migration: `comments.author_id`, `comment_threads.created_by`, `comment_mentions.mentioned_user_id` are `text`.
