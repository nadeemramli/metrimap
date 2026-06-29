# Canvas-system follow-ups (resume context)

Deferred items discovered while building the workspace/collaboration stack
(2026-06-29). Each has enough context to pick up cold. Broader gap map:
`docs/backlog/ui-ux-audit-2026-06-29.md`.

---

## 1. "Assigned to me" notification producer  ⬅ the explicit follow-up

**State:** the notification **inbox** and **feed** already support an `assigned`
type — the "Assigned to me" filter (`NotificationInbox.tsx`, type tab `assigned`)
queries `listNotifications(userId, { types: ['assigned'] })`. But **nothing
creates `assigned` notifications yet**, so the filter is always empty.

**What exists to build on:**
- Cards carry assignees: `MetricCard.assignees: string[]` (`src/shared/types/index.ts`),
  persisted on `metric_cards.assignees`.
- The notification primitive is ready: `createNotification({ userId, type,
  title, description, metadata })` in
  `src/shared/lib/supabase/services/collaboration.ts`. Mentions already use it
  with `type: 'mention'` + `metadata: { projectId, threadId, commentId }`
  (see `src/features/canvas/utils/comments.ts`).

**To wire it (when canvas assignment UX is built):**
1. Find where assignees are edited (CardSettingsSheet → assignees field, or
   wherever `assignees` is updated on a card).
2. On adding an assignee `U` to card `C` in project `P`, call
   `createNotification({ userId: U, type: 'assigned', title: \`You were assigned
   to ${C.title}\`, description: ..., metadata: { projectId: P, cardId: C.id } })`.
3. The inbox "Assigned to me" tab + the feed people-event lane then light up
   automatically. Click-through already navigates via `metadata.projectId`.

**Watch:** don't notify on self-assignment; debounce bulk assignee edits.

---

## 2. Canvas-level real-time collaboration (presence, cursors, live nodes)

**State:** `src/shared/hooks/useCanvasRealtime.ts` is a **stub** (returns
`isConnected: true`, does nothing). Project-list realtime IS done and is the
template: `src/features/projects/hooks/useProjectsRealtime.ts` (postgres_changes,
debounced refetch, channel cleanup).

**What's ready:** `canvas_nodes`, `metric_cards`, `relationships`, `groups`,
`projects` are all in the `supabase_realtime` publication. RLS already scopes
them to the workspace (`can_view_project` / `has_project_access`).

**To build:** subscribe per-canvas to changes on those tables filtered by
`project_id=eq.<canvasId>` and reconcile into the canvas store; add Supabase
Realtime **presence** for member avatars + live cursors. Mind the token/refetch
race we hit on the homepage (refetch on a fresh token after org switch).

---

## 3. Notification bell — live badge

**State:** `NotificationInbox` fetches the unread count on mount only. For a live
badge, subscribe to `notifications` inserts for the current user.

**Blocker:** `notifications` is **not** in the `supabase_realtime` publication
yet — add it (`ALTER PUBLICATION supabase_realtime ADD TABLE notifications`)
before subscribing. Then reuse the `useProjectsRealtime` pattern, filtered by
`user_id=eq.<me>`, bumping the count on INSERT.

---

## 4. Other canvas-surface gaps (from the audit, parked)

- **Stale / orphaned-binding state** — being built now (cluster #2). When done,
  cross-link from here.
- **Metric-value time-travel** — canvas snapshots exist
  (`useVersionHistoryStore`), but `metric_values` upserts in place (no value
  history). Needs an append-only value-history table to enable "what did this
  metric look like last quarter" + scenario compare.
- **Cmd+K command palette** — `QuickSearchCommand.tsx` is a stub ("being
  rebuilt"); `cmdk` + `useKeyboardShortcuts` infra already present.
- **Cross-canvas global search** — `AdvancedSearchModal` is scoped to the
  current canvas only; needs a workspace-wide index ("every node using GA4
  sessions").
- **Export PNG/PDF** — only JSON today; no `html2canvas`/`jsPDF` deps.
