# ADR-005: Realtime Collaboration (Automerge, WASM, WebSocket)

- **Status:** Proposed / Scaffolded (not yet implemented)
- **Date:** 2025
- **Deciders:** Core team

## Context

A multi-user canvas eventually needs real-time collaboration: live updates, presence, and collaborative cursors, with conflict-free merging of concurrent edits. We want an architecture chosen up front so dependencies and build config don't have to be retrofitted later.

## Decision

Plan for **CRDT-based collaboration**:

- **`@automerge/automerge`** (2.0.0) as the CRDT for conflict-free document merging.
- **WASM support** in the build via `vite-plugin-wasm` + `vite-plugin-top-level-await` (Automerge ships a WASM core; it is excluded from Vite dep optimization in `vite.config.ts`).
- **Supabase Realtime** (WebSocket channels) as the transport for change broadcast and presence.

## Current State (important)

This is **scaffolded but not wired up**:

- `src/shared/hooks/useCanvasRealtime.ts` is a stub with `TODO` comments and only simulates connection state.
- `@automerge/automerge` is installed and the build is WASM-ready, but there are **no Automerge imports in application code yet**.
- No live WebSocket subscriptions are active; `collaboration.ts` provides query-based comment/thread APIs, not live sync.
- Persistence today is **debounced autosave** (`useAutoSave.ts`), not realtime.

## Alternatives Considered

- **Yjs** — Mature CRDT with strong ecosystem; Automerge chosen for its document model and JSON-like ergonomics.
- **Supabase Realtime broadcasting raw diffs (no CRDT)** — Simpler, but no principled conflict resolution for concurrent edits.
- **Last-write-wins autosave only** — The current de facto behavior; acceptable for single-user, insufficient for true collaboration.

## Consequences

- The build is already prepared for WASM/Automerge, lowering the cost of finishing this later.
- Until implemented, the app is effectively single-writer with autosave; docs and UI should not imply live collaboration works.
- When implemented, RLS + Clerk auth ([ADR-002](./ADR-002:%20Using%20Clerk%20for%20User%20Management.md)) must extend to realtime channels.

## References

- `package.json` (`@automerge/automerge`), `vite.config.ts` (wasm plugins, optimize exclude)
- `src/shared/hooks/useCanvasRealtime.ts` (TODO stub), `src/shared/hooks/useAutoSave.ts`
- `src/shared/lib/supabase/services/collaboration.ts`
