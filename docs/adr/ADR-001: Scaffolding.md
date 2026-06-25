# ADR-001: Project Scaffolding

- **Status:** Accepted
- **Date:** 2025
- **Deciders:** Core team

## Context

Metrimap is a visual-first, canvas-heavy single-page application for building and analyzing metric trees. The frontend is highly interactive (graph editing, drawing, rich text), so the priorities are fast iteration (HMR), strong typing, and a rich client runtime. Server-side rendering and SEO were not initial requirements.

## Decision

Scaffold the app as a client-side SPA with:

- **Build tool:** Vite 7
- **Framework:** React 19
- **Language:** TypeScript 5.8
- **Routing:** React Router 7 (library/client-side mode, nested routes under `/canvas/:canvasId`, guarded by a `ProtectedRoute` wrapper)
- **Styling:** Tailwind CSS 4 + PostCSS, with Radix UI primitives wrapped under `src/shared/components/ui/` and variants driven by `class-variance-authority`

Adopt a **feature-based folder structure**:

```
src/
├── features/   # Feature modules: canvas, evidence, projects, auth, dashboard, assets, sources
├── shared/     # Cross-feature code: components, hooks, lib, stores, types, utils
└── lib/        # App-level libraries: prisma, machines, services, stores, workers
```

## Alternatives Considered

- **Next.js** — Rejected for the initial build: SSR/app-router model adds overhead the canvas workload doesn't need. (Some `NEXT_PUBLIC_*` env-var fallbacks remain in the Supabase client for deployment compatibility.)
- **Create React App** — Rejected: effectively deprecated, slow dev server.
- **Remix** — Rejected: SSR-first, same mismatch as Next.js.

## Consequences

- Very fast local development and HMR.
- No built-in SSR/SEO; routing and auth gating happen entirely client-side.
- The feature/shared/lib convention must be maintained as the codebase grows (a "refactor to feature structure" was already performed once — see git history).

## References

- `vite.config.ts`, `tsconfig.json`
- `src/App.tsx`, `src/main.tsx`
- `src/features/`, `src/shared/components/ui/`
- Related: [ADR-002](./ADR-002:%20Using%20Clerk%20for%20User%20Management.md), [ADR-008](./ADR-008:%20Storybook.js%20.md)
