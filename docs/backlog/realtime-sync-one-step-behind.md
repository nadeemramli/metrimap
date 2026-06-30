# Backlog: realtime canvas sync is "one step behind"

**Status:** open · **Priority:** P1 (core multiplayer correctness) · **Filed:** 2026-07

## Symptom

Live multiplayer sync (Supabase Realtime broadcast, see `useCanvasRealtime`)
works for **node creation** — a new node appears on the other session
immediately — but mutations to *existing* entities lag:

- **Move a node** → other session doesn't update (or only on the next change).
- **Edit a card** (rename / value) → doesn't reflect.
- **Create / update a relationship** → doesn't reflect live.
- **Delete a node** → appears "one step behind": the receiver shows the result
  of the *previous* change when the *next* one arrives; after reload it can show
  a stale state.

So: **adds reflect immediately; updates/removes/edges reflect one step late.**

## What is already wired (works)

- Outbound: `broadcastCanvasChange` is emitted from the store persist methods
  (`useCanvasStore` card create/update/delete + edge create/update/delete,
  `useCanvasNodesStore` create/update/delete) and from `handleNodeDragStop`
  (moves) — `src/features/canvas/realtime/canvasSyncChannel.ts`.
- Inbound: `applyRemoteCanvasChange` applies each change via the store's
  **local-only** path (no re-persist / re-broadcast) —
  `src/features/canvas/realtime/applyRemoteChange.ts`.
- Diagnostics: `📡 canvas send/recv/status` console logs are in place.

## Leading hypothesis

The send + store-apply paths look correct, and the receiver's stores are
reactively subscribed in `CanvasPage`, so the prime suspect is **React Flow
controlled-nodes reconciliation**: with `nodes={nodes}` controlled and
`onNodesChange` only handling temporary nodes, React Flow picks up *additions*
from the prop reliably but may not flush *position/data mutations or removals*
to already-rendered nodes until the next prop change — producing exactly the
"one step behind" pattern.

## Next diagnostic step (do this first)

Two windows, console open. In window A, move and delete a node:
- A logs `📡 canvas send: node:move` / `node:delete`?
- B logs `📡 canvas recv: ...`?
- **recv fires but B doesn't visually update** → React Flow reconciliation (fix
  below). **No recv** → Supabase delivery/ordering. **`NOT sent`** → channel
  registration timing.

## Candidate fixes to explore

- Apply remote changes through React Flow's own API (`setNodes` /
  `applyNodeChanges`) in addition to the store, so the controlled flow flushes.
- Or ensure the `nodes`/`edges` memos produce changes RF detects (key/identity)
  and force a microtask flush after `applyRemoteCanvasChange`.
- Verify metric-card *moves* aren't masked by the debounced autosave on the
  sender (`useAutoSave` / `saveAllPendingChanges`) when reloading quickly.

## Code pointers

- `src/shared/hooks/useCanvasRealtime.ts` — channel + receive.
- `src/features/canvas/realtime/{canvasSyncChannel,applyRemoteChange}.ts`
- `src/features/canvas/pages/CanvasPage.tsx` — `nodes`/`edges` memos,
  `<ReactFlow controlled>`, `handleNodeDragStop`.
