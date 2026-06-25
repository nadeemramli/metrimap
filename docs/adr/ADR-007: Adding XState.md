# ADR-007: Adding XState for Canvas State

- **Status:** Accepted
- **Date:** 2025
- **Deciders:** Core team

## Context

The canvas has genuinely complex, mode-driven UI state: two environments (`practical` = React Flow editing vs `design` = whiteboard drawing — see [ADR-004](./ADR-004:%20Excalidraw%20for%20Whiteboarding.md)), per-environment tool selection, navigation tools, a passthrough mode, and viewport synchronization. Modeling this with ad-hoc booleans across Zustand stores led to implicit, hard-to-reason-about state combinations.

## Decision

Introduce **XState 5** (`xstate` 5.x, `@xstate/react` 6.x) for canvas interaction state:

- The machine lives in `src/lib/machines/canvasMachine.ts`, with `CanvasContext` (environment, navigation/practical/design tools, viewport sync, collaboration, error) and a `CanvasEvent` union (`SWITCH_TO_PRACTICAL`, `SWITCH_TO_DESIGN`, `SET_*_TOOL`, `ENABLE/DISABLE_PASSTHROUGH`, `UPDATE_VIEWPORT`, …).
- React consumes it via `src/features/canvas/hooks/useCanvasStateMachine.ts`; `CanvasPage` reads the current environment to decide edit vs draw mode.
- **Zustand is retained for data** (project/canvas entities); XState governs *interaction/mode* state, not persisted data.

## Alternatives Considered

- **Pure Zustand / `useReducer`** — Rejected: the boolean-soup of modes/tools is exactly the implicit-state problem statecharts solve.
- **Redux + middleware** — Rejected: more boilerplate, still no first-class state-transition guarantees.

## Consequences

- Explicit, inspectable, testable transitions; illegal mode combinations become unrepresentable.
- A learning curve for contributors unfamiliar with statecharts.
- The machine and the UI must be kept in sync; the machine is the authority for "what mode are we in".

## References

- `src/lib/machines/canvasMachine.ts`
- `src/features/canvas/hooks/useCanvasStateMachine.ts`, `src/features/canvas/pages/CanvasPage.tsx`
- `docs/state-management/XSTATE_COMPLETE_GUIDE.md`
