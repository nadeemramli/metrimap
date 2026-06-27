# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Codex, Devin, Copilot, etc.) working in this repo. Humans: see `docs/` (VitePress) for full documentation. This file is the cross-tool source of truth; tool-specific files (`CLAUDE.md`, `.cursor/rules/*`) point here.

> Note: the root `README.md` currently contains the upstream Supabase CLI readme by mistake — it does **not** describe this project. The real project overview is `docs/index.md` and the PRD under `docs/prd/`.

> Known issues & roadmap live in **`BACKLOG.md`** (prioritized P0–P3). Check it before starting work — several core flows (autosave, duplicate, version history, evidence persistence) have open P0s.

## What this project is

**Metrimap** (`metric-mapping`) is a visual-first web app for building, managing, and analyzing metric trees and business-architecture maps. Users place **cards** (metrics, business processes, work/actions) on an infinite **canvas** and connect them with typed **relationships** (deterministic, probabilistic, causal, compositional). It includes an evidence repository, dashboards, source management, formula/correlation computation, and rich text/whiteboard editing.

> **Product north star & methodology (read before proposing product features).** The app exists to help users **build metric trees and govern their business value chain**. The methodology we draw inspiration from (Levers Labs / Abe Gong "metric trees") is captured in **[`docs/reference/metric-tree-methodology.md`](docs/reference/metric-tree-methodology.md)**. Important: that doc is the *principle*, **not our spec** — Metrimap has its own deliberate approach and diverges where noted in the doc's "Our approach" section. Do **not** auto-generate tasks/features from the methodology; align with the product owner first. Prioritize end-to-end **value pipelines** (build the tree → diagnose drivers → govern/act) over isolated infrastructure items.

## Tech stack

- **Framework:** React 19 + TypeScript (~5.8), built with Vite 7 (`@vitejs/plugin-react-swc`)
- **Canvas:** React Flow via `@xyflow/react` (v12) + Dagre auto-layout; Excalidraw for whiteboarding
- **UI:** shadcn/ui (Radix primitives) + Tailwind CSS v4 + Recharts; `lucide-react` icons
- **State:** Zustand stores (UI state) + XState (`canvasMachine`) for canvas state machine
- **Data fetching:** TanStack React Query
- **Backend:** Supabase (`@supabase/supabase-js`) with Row Level Security (RLS)
- **Auth:** Clerk — native integration that mints tokens for Supabase via `accessToken()`
- **Types/ORM:** Prisma schema *mirrors* Supabase for type-safety only (no relations/ORM use) + Zod generated via `prisma-zod-generator`
- **Rich text:** EditorJS (many plugins)
- **Compute:** Web Workers + Comlink; `mathjs` + `simple-statistics` (formulas, correlations)
- **Testing:** Vitest (jsdom) + Storybook + Playwright (browser/story tests); RLS tests run via `tsx`
- **Docs:** VitePress in `docs/`
- **Deploy:** Vercel

## Commands

```bash
npm run dev          # Vite dev server on http://localhost:3000
npm run build        # type-check (tsc --noEmit) then vite build
npm run type-check   # TypeScript check only
npm run lint         # ESLint (flat config: eslint.config.js)
npm run test         # Vitest
npm run test:rls     # RLS policy tests (tsx src/tests/run-rls-tests.ts)
npm run storybook    # Storybook on :6006
npm run docs:dev     # VitePress docs
npm run prisma:types # prisma db pull + generate (regenerate types/Zod from DB)
npx supabase <cmd>   # Always use npx for the Supabase CLI
```

A Husky `pre-commit` hook runs on commit (`.husky/pre-commit`). Don't bypass it without reason.

## Project layout

Feature-based architecture (recently refactored — some older paths in `.cursor/rules/*` may be stale; trust this file):

```
src/
  features/            # Feature modules: auth, canvas, dashboard, evidence, projects, sources, assets
  shared/              # Cross-feature code
    components/         # incl. shadcn ui/* — REUSE these before adding UI deps
    contexts/ hooks/ stores/ types/ utils/ constants/
    lib/supabase/       # client.ts, types.ts, services/*  ← Supabase access layer
  lib/
    machines/           # canvasMachine.ts (XState)
    workers/            # compute.worker.ts + Comlink worker manager
    services/           # typed-canvas, typed-operations, typed-projects
    prisma/             # schema.prisma + generated Zod schemas
    editorjs-config.ts
  tests/                # RLS + XState integration tests
docs/                   # VitePress: prd, adr, features, database, auth, state-management, editor, environment, refactoring, tests
supabase/migrations/    # SQL migrations (source of truth for DB schema)
scripts/                # RLS tests, policy analysis, service-role key helper
```

Path alias: `@` → `src` (configured in `vite.config.ts` and `tsconfig`).

## Conventions

- **Reuse `src/shared/components/ui/*` (shadcn)** before adding any new UI dependency.
- **Zustand stores are the single source of UI state**; persist through Supabase services in `src/shared/lib/supabase/services/`, not directly from components.
- **Minimal inline comments.** Prefer descriptive, feature-scoped `console` messages for debugging; keep logs high-signal.
- **Documentation lives in `docs/`.** Link to PRD sections rather than duplicating content. Update relevant docs when changing behavior.
- **Prisma is for types only** — the schema mirrors Supabase with no relations. After DB schema changes, run `npm run prisma:types` to regenerate.
- Match the style, naming, and structure of surrounding code.

## Supabase client (important)

`src/shared/lib/supabase/client.ts` exposes singleton factory functions — call them, don't construct clients ad hoc:

- `supabase()` — default anon client (singleton).
- `createClerkSupabaseClient(getToken)` — production/staging; uses Clerk's native `accessToken()` integration. **This is the authenticated path that respects RLS.**
- `getClerkSupabaseClient()` — singleton Clerk client variant.
- `createDevSupabaseClient()` — **local development only**; uses the **service-role key to bypass RLS** for faster iteration.

Environment is detected from the Supabase URL: `localhost` / `127.0.0.1` / `0.0.0.0` ⇒ development. Env vars are read as `VITE_SUPABASE_*` first, then `NEXT_PUBLIC_SUPABASE_*`.

## Environment & secrets

- Local config is in `.env` (git-ignored). Required keys: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_URL`, `DATABASE_URL` (Prisma), `VITE_SUPABASE_SERVICE_ROLE_KEY` (local dev only), and CLI vars `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`.
- **Never commit secrets or print secret values.** `.env`, `.cursor/mcp.json`, and `docs/environment/ENVIRONMENT_SECRETS.md` are git-ignored — keep it that way.
- The service-role key bypasses RLS — use it only in local dev, never ship it to the client bundle in production.

## Agent etiquette

- Prefer the project's own scripts/tools over ad-hoc shell when one fits.
- Run `npm run type-check` and `npm run lint` after non-trivial changes; run `npm run test` for logic changes.
- Don't bypass RLS in production code paths. Don't disable the Husky hook silently.
- When schema changes: add a SQL migration under `supabase/migrations/`, regenerate Prisma types, and update `src/shared/lib/supabase/types.ts` if needed.
