# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Codex, Devin, Copilot, etc.) working in this repo. This file is the cross-tool source of truth; tool-specific files (`CLAUDE.md`, `.cursor/rules/*`) point here.

> **Work is tracked in Linear (team CVS), not in this repo.** Product knowledge lives in the owner's Obsidian product vault; the repo `docs/` holds infrastructure/structural technical docs only (see **Docs policy**). Don't invent work — start from Linear.

## Agent operating protocol (read first)

Work is driven by Linear (team **CVS** / "Canvasm"), organized as **Initiatives → Projects → Issues**, executed in **lanes** (see **Lane operating model**). Do not invent work.

1. **Start from Linear, pick by lane.** Work a single lane at a time (a `lane:<slug>` label or an explicit issue list — **not** a whole broad Project). Within the lane, take the next `Todo` issue by priority and unblocked status (respect `blockedBy`). Read the issue in full incl. comments — many carry a **"## Deep analysis"** (current code, `file:line`) and a **"## Decision (locked)"** comment. Honor locked decisions.
2. **Move the issue to `In Progress`** and **branch per issue** using the Linear `gitBranchName`. During the multi-agent build do **NOT** commit to `main` directly (this supersedes the direct-to-`main` note in Branching).
3. **Implement** to the acceptance criteria + locked decisions. Reuse `src/shared/components/ui` (shadcn) before adding deps. Schema changes → migration + `npm run prisma:types` + update `types.ts`.
4. **Verify:** `npm run type-check`, `npm run lint`, `npm run test` (+ `npm run test:rls` if RLS). Never bypass Husky.
5. **Open a PR** referencing the issue (keep `CVS-XX` in the branch/PR).
6. **Queue the manual test** — for every resolved **runtime** issue, create or update a Manual Test issue (see **Manual-test gate** for the exact fields). Only skip this for explicitly non-runtime issues (docs, config, spikes) that carry an accepted decision.
7. **Move the feature issue to `Waiting for Manual Test`** (never straight to `Done`). Agents do **not** mark runtime feature/bug/improvement issues `Done` themselves — the owner's passing manual test does that.
8. **Capture durable learning** in the product Obsidian vault (see **Docs policy**), not repo docs.

Roles: **Builder** (agents / Nadeem) implement; the **owner** (`m.nadeemramli@gmail.com`) manually tests the queued issues in the **Manual Test** project and accepts or rejects. Full loop: vault note *"3.a Workflow Architecture"*.

### Status workflow (Canvasm team)

`In Review` is **renamed** to `Waiting for Manual Test`, and a new `Needs Fix` status is added. The full set and their meanings:

| Status | Type | Meaning |
| --- | --- | --- |
| `Triage` | triage | Raw intake / shaping. Not ready until clarified — automated intake lands here, never Todo/In Progress. |
| `Backlog` | backlog | Valid but parked for later. |
| `Todo` | unstarted | Ready for an agent to pick up. |
| `In Progress` | started | An agent is actively building or fixing. |
| `Waiting for Manual Test` | started | Agent finished implementation (or a spike); the owner needs to verify/accept. **This is the agent-complete gate, not "done".** |
| `Needs Fix` | started | Manual test failed; the agent should pick it back up. |
| `Done` | completed | Manual test passed, or a non-runtime spike decision was accepted. |

> **Linear settings step (one-time, owner only — cannot be done via API/MCP):** in **Settings → Teams → Canvasm → Workflow**, rename `In Review` → `Waiting for Manual Test` and add a started-type status `Needs Fix`. Renaming preserves history, so issues currently in `In Review` carry over automatically.

### Manual-test gate

Every resolved **runtime** issue must have a Manual Test issue before it moves to `Waiting for Manual Test`:

- **project:** `Manual Test`
- **assignee:** Nadeem (`m.nadeemramli@gmail.com`)
- **label:** `manual-test`
- **status:** `Todo` (so it lands in the owner's Todo)
- **linked/parented** to the feature issue (child sub-issue titled `Manual test: <feature>`)
- **body:** link to parent + PR, setup/preconditions, numbered steps → expected result → pass/fail, plus **reload/persistence** checks and **regression** checks.

The gate loop:

1. Agent finishes work → parent issue → `Waiting for Manual Test`, manual-test issue in owner's `Todo`.
2. Owner **passes** → parent issue → `Done`, manual-test issue → `Done`.
3. Owner **fails** → parent issue → `Needs Fix`; owner comments the repro on the manual-test issue or the parent.
4. Agent fixes the failure → parent issue back to `Waiting for Manual Test` (repeat).

## Lane operating model

Projects are too broad to act as execution units. One agent works one **lane** at a time.

- **Projects** = durable product areas (e.g. Canvas engine, Access & visibility, MCP/API, Strategy Impact). They outlive any single agent.
- **Lanes** = short-lived execution slices for one agent, usually **3–8 tightly related issues**. A lane may span or subset a Project.
- **Label lanes** with `lane:<slug>` whenever a Project is too broad to pick from directly. Agents pick issues by **lane label or an explicit issue-ID list**, never by treating a whole broad Project as one lane.
- Every lane declares: an **owner/agent**, a **clear scope**, a **list of Linear issue IDs**, known **blockers**, and required **manual-test coverage**.

Example lanes:

- `lane:manual-test-closeout` — clean up issues already waiting for the owner; verify their manual tests exist.
- `lane:infra-workers` — shared infra / VPS / queues / workers.
- `lane:canonical-schema-foundation` — schema package, manifest registry, runtime foundations.
- `lane:canvas-stability` — React #185 / canvas state migration only.
- `lane:ui-modernization` — card / sheet / comment / filter UI modernization.
- `lane:access-visibility` — groups / access tags / RLS / dashboard visibility.
- `lane:mcp-api` — API / MCP / data ingest.
- `lane:strategy-impact` — impact contracts, trace, dashboard badges, measurement, review.

### Example lane-agent prompt

```
You are the agent for lane `lane:access-visibility` on Linear team Canvasm.
Scope: groups, access tags, RLS, and dashboard visibility. Issues: CVS-118, CVS-119,
CVS-120, CVS-121, CVS-122, CVS-123 (respect blockedBy; skip anything not in Todo).

For each issue, in order:
1. Move it to In Progress and branch with its Linear gitBranchName (keep CVS-XX in the name).
2. Implement to the acceptance criteria and any locked decisions in the comments.
3. Verify: npm run type-check, npm run lint, npm run test (+ test:rls for RLS changes).
4. Open a PR referencing the issue.
5. Create a Manual Test issue in the Manual Test project — assignee Nadeem, label manual-test,
   status Todo, parented to the feature issue — with setup, numbered steps → expected,
   pass/fail, reload/persistence, and regression checks.
6. Move the feature issue to Waiting for Manual Test (never Done).
If the owner marks any issue Needs Fix, fix it and return it to Waiting for Manual Test.
Do not commit to main; one PR per issue, merged one at a time.
```

## Docs policy

- **Product knowledge → Obsidian product vault:** PRD, feature explanations, product decisions, methodology, durable learning. Not the repo.
- **Repo `docs/` → infrastructure/structural technical docs ONLY:** ADRs, environment, auth, database/RLS, migrations, architecture, state-management, and infra feature docs (e.g. `system-health-intake`, `linear-setup`, `metrics-api`).
- **Not in the repo:** feature narratives, changelogs, point-in-time write-ups, or a compiled manual-test plan — manual tests are Linear sub-issues in the **Manual Test** project.

## What this project is

**Metrimap** (`metric-mapping`) is a visual-first web app for building, managing, and analyzing metric trees and business-architecture maps. Users place **cards** (metrics, business processes, work/actions) on an infinite **canvas** and connect them with typed **relationships** (deterministic, probabilistic, causal, compositional). It includes an evidence repository, dashboards, source management, formula/correlation computation, and rich text/whiteboard editing.

> **Product north star & methodology (read before proposing product features).** The app exists to help users **build metric trees and govern their business value chain**. The methodology we draw inspiration from (Levers Labs / Abe Gong "metric trees") is captured in the **Obsidian product vault** (migrated out of the repo). Important: that doc is the *principle*, **not our spec** — Metrimap has its own deliberate approach and diverges where noted in the doc's "Our approach" section. Do **not** auto-generate tasks/features from the methodology; align with the product owner first. Prioritize end-to-end **value pipelines** (build the tree → diagnose drivers → govern/act) over isolated infrastructure items.

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
- **Testing:** Vitest (jsdom, unit/component tests via Testing Library); RLS tests run via `tsx`
- **Docs:** plain Markdown in `docs/` (infra/structural only; VitePress retired). Product docs live in Obsidian.
- **Deploy:** Vercel

## Commands

```bash
npm run dev          # Vite dev server on http://localhost:3000
npm run build        # type-check (tsc --noEmit) then vite build
npm run type-check   # TypeScript check only
npm run lint         # ESLint (flat config: eslint.config.js)
npm run test         # Vitest (jsdom unit/component tests)
npm run test:rls     # RLS policy tests (tsx src/tests/run-rls-tests.ts)
npm run screenshots  # Playwright e2e / visual-verification (signed-in, real canvas)
npm run prisma:types # prisma db pull + generate (regenerate types/Zod from DB)
npx supabase <cmd>   # Always use npx for the Supabase CLI
```

**E2E / visual verification (Playwright + Clerk).** `npm run screenshots` drives the
real app signed in as a test user (over HTTPS at `dev.canvasm.app:3000`, prod Clerk)
and captures screenshots into `e2e/screenshots/`. Specs live in `e2e/*.spec.ts` with
shared helpers in `e2e/helpers.ts` (`signIn`/`openFirstCanvas`/…). Needs local setup
(`.env` `E2E_*`/Clerk keys, hosts entry, a temporary Clerk `allowed_origins` entry).
For UI/canvas lanes, run it before handoff and add specs for new surfaces. Full guide:
`docs/testing/e2e-visual-verification.md` (repo) + the owner's vault note
*"E2E Visual Verification"* (authoritative runbook). Automated-test issues in the
`Manual Test` project carry the `automated-test` label — they turn owner-run visual
checks into Playwright coverage; move them to `Waiting for Manual Test`, don't
add manual-test children unless you change runtime behavior.

### Git hooks (Husky)

A single Husky **`pre-commit`** hook gates quality on every commit (there is no CI yet — this is the safety net). Don't bypass it without reason. It runs, in order:

1. `npm run lint` — full-repo ESLint, **0 errors enforced** (CVS-64 cleared the pre-existing error debt, so any new error anywhere blocks the commit; warnings don't block).
2. `npm run type-check` — whole-repo `tsc`.
3. `vitest run` — the full Vitest suite (jsdom, no browser — Storybook/Chromium was removed, so tests are fast).

## Branching

**During the multi-agent build: branch per issue + PR, merge one at a time.** Use
the Linear `gitBranchName`, keep `CVS-XX` in the branch/PR name, and never commit
to `main` directly (see **Agent operating protocol**). Review + merge PRs one at a
time; other lanes rebase on `main` after each merge.

We revert to direct-to-`main` only once the core value pipeline is complete end to
end (and later still may adopt a `preview` branch with deploy-preview gating). Until
then, PR-based is the expected flow.

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
    prisma/             # schema.prisma + generated Zod schemas
    editorjs-config.ts
  tests/                # RLS + XState integration tests
docs/                   # infra/structural Markdown: adr, database, auth, environment, state-management, architecture, features (infra)
supabase/migrations/    # SQL migrations (source of truth for DB schema)
scripts/                # RLS tests, policy analysis, service-role key helper
```

Path alias: `@` → `src` (configured in `vite.config.ts` and `tsconfig`).

## Conventions

- **Reuse `src/shared/components/ui/*` (shadcn)** before adding any new UI dependency.
- **Zustand stores are the single source of UI state**; persist through Supabase services in `src/shared/lib/supabase/services/`, not directly from components.
- **Minimal inline comments.** Prefer descriptive, feature-scoped `console` messages for debugging; keep logs high-signal.
- **Docs split by type (see Docs policy):** infra/structural technical docs in repo `docs/`; product knowledge + durable learning in the Obsidian product vault. Don't add feature narratives or changelogs to the repo.
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
