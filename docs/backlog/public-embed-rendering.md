# Backlog: public embed view doesn't render nodes/relationships properly

**Status:** open · **Priority:** P2 · **Filed:** 2026-07

## Symptom

The public share link now works without login (the People-tab "Copy link"
points at `/embed/:canvasId` when the canvas is public — RLS returns the project
only when `is_public`). But the embed page renders the canvas poorly: nodes
and/or relationships don't show up the way they do in the full canvas.

## Likely cause

`src/features/canvas/pages/EmbedCanvasPage.tsx` is a minimal read-only renderer:

- It loads via `getProjectById(canvasId)` (anon client) and maps `proj.nodes`
  onto a single generic `embed` node type — it does **not** render the real
  node components (metric card, source, operator, chart, whiteboard) or their
  varied data.
- It likely doesn't include the **canvas_nodes** table rows (operator/source/
  chart/comment/whiteboard live in `useCanvasNodesStore` / `canvas_nodes`, not
  in `projects.nodes`) nor the **data-flow/reference edges** stored in
  `projects.settings.dataFlowEdges`. So relationships and non-card nodes are
  missing or mis-rendered.

## Scope to fix later

- Decide how faithful the embed should be: a true read-only mirror of the canvas
  vs. a simplified summary.
- If faithful: load `canvas_nodes` + relationship edges + data-flow edges for
  the public project (requires RLS read access for public canvases), and reuse
  the real node/edge renderers in a non-interactive mode.
- Confirm RLS exposes `canvas_nodes` and edges for `is_public` projects to anon.

## Code pointers

- `src/features/canvas/pages/EmbedCanvasPage.tsx`
- `src/shared/lib/supabase/services/projects.ts` (`getProjectById`,
  `setProjectPublic`)
- Edge/node sources: `useCanvasNodesStore`, `projects.settings.dataFlowEdges`.
