# ADR-004: Whiteboarding / Draw Mode (Excalidraw → custom React Flow tools)

- **Status:** Superseded in practice (see "Current State")
- **Date:** 2025
- **Deciders:** Core team

## Context

The canvas has two environments (see [ADR-007](./ADR-007:%20Adding%20XState.md)): a **practical** environment for structured metric-tree editing (React Flow nodes/edges) and a **design** environment for free-form whiteboarding (sketching, shapes, annotations). The original intent was to adopt **Excalidraw** to power the design environment.

## Decision (original)

Adopt Excalidraw for the whiteboard/"design" mode, giving users hand-drawn-style sketching and shapes alongside the structured canvas.

## Current State (what was actually built)

The implementation diverged from the original decision:

- **Excalidraw is not an active component.** Only its CSS is imported (`src/main.tsx`); no Excalidraw React component is mounted.
- Whiteboarding is instead a **custom drawing system layered over React Flow**, in `src/features/canvas/components/whiteboard/`:
  - `WhiteboardContainer.tsx` manages tool state (`select`, `freehand`, `rectangle`, `lasso`, `erase`), brush size, and color.
  - `FreehandDrawComponent`, `RectangleToolComponent`, `LassoSelectionComponent`, `EraseToolComponent` implement the tools via pointer events.
- The active environment (`practical` vs `design`) is driven by the XState canvas machine; design tools render when `currentEnvironment === 'design'`.

## Alternatives Considered

- **Excalidraw (as integrated component)** — Original choice; in practice it was heavy to co-locate with React Flow's coordinate/viewport system and was reduced to a styling dependency.
- **tldraw** — Another full whiteboard engine; same coexistence concerns with React Flow.
- **Custom React Flow drawing layer** — Chosen in practice: keeps a single canvas/viewport model and full control over interaction.

## Consequences

- One canvas/viewport system to reason about (React Flow), at the cost of building/maintaining drawing tools ourselves.
- The Excalidraw CSS import is now effectively vestigial and is a candidate for cleanup.
- This ADR is retained (rather than deleted) to record *why* the title says "Excalidraw" but the code does not use it.

## References

- `src/main.tsx` (Excalidraw CSS import only)
- `src/features/canvas/components/whiteboard/`
- `src/lib/machines/canvasMachine.ts`, `docs/editor/DRAW_MODE_ARCHITECTURE.md`
