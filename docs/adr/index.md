# Architecture Decision Records

Architecture Decision Records (ADRs) capture significant technical decisions for Metrimap — the context, the choice made, the alternatives weighed, and the consequences. They are the durable record of *why* the system looks the way it does.

When a decision changes, we add or amend an ADR rather than silently editing history.

## Index

| # | Decision | Status |
|---|----------|--------|
| [ADR-001](./ADR-001:%20Scaffolding.md) | Project scaffolding (Vite + React 19 + TS + React Router) | Accepted |
| [ADR-002](./ADR-002:%20Using%20Clerk%20for%20User%20Management.md) | Clerk for user management (native Supabase integration) | Accepted |
| [ADR-003](./ADR-003:%20EditorJS%20for%20Text%20Editor.md) | EditorJS for the block-based text editor | Accepted |
| [ADR-004](./ADR-004:%20Excalidraw%20for%20Whiteboarding.md) | Whiteboarding / draw mode (Excalidraw → custom React Flow tools) | Superseded in practice |
| [ADR-005](./ADR-005:%20Realtime-js,%20WASM,%20and%20Websocket.md) | Realtime collaboration (Automerge, WASM, WebSocket) | Proposed / Scaffolded |
| [ADR-006](./ADR-006:%20Use%20Prisma%20+%20Zod.md) | Prisma (schema-only) + Zod for type safety & validation | Accepted |
| [ADR-007](./ADR-007:%20Adding%20XState.md) | XState for canvas interaction state | Accepted |
| [ADR-008](./ADR-008:%20Canvas%20State%20Ownership.md) | Canvas state ownership (React Flow owns view state; one-way persistence; retire XState slice) — fixes recurring React #185 | Proposed |

## Status legend

- **Accepted** — in effect and reflected in the codebase.
- **Proposed / Scaffolded** — direction agreed and partially wired, but not fully implemented.
- **Superseded in practice** — the original decision was recorded but the implementation evolved; the ADR explains the divergence.
