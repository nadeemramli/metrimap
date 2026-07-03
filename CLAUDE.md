# CLAUDE.md

This file gives Claude Code guidance for working in this repository.

The cross-tool project guide (architecture, stack, commands, conventions, Supabase client, secrets) lives in **@AGENTS.md** — read it first; it is the source of truth and is shared with all AI tools.

## Development Operating System

The team runs a lightweight product-learning workflow (details in the owner's vault):

- **Linear** is the source of truth for work; **Obsidian** stores durable learning; the **repo** is implementation truth. Don't duplicate the same truth across tools.
- A raw signal is not a task — it passes through **intake → normalize → classify → prioritize**. Automated intake issues start in **Intake/Triage**, never Ready/In Progress.
- **Runtime crashes = System Health intake.** They flow **browser → Supabase `error_reports` → server-side Linear sync**, deduped by fingerprint. Never expose Linear credentials in the browser. See `docs/features/system-health-intake.md`.
- Keep Supabase `error_reports` as the raw evidence store; Linear is the work item, not the event log.

## Claude-specific notes

- **Product methodology:** the metric-tree principle the app draws from lives in `docs/reference/metric-tree-methodology.md`. It's the *principle*, not our spec — Metrimap has its own approach. Don't auto-generate features from it; discuss with the owner first and prioritize end-to-end **value pipelines**.
- Root `README.md` is **not** the project readme (it's the upstream Supabase CLI readme by mistake). For project context use `docs/index.md`, the PRD in `docs/prd/`, and `@AGENTS.md`.
- Quick commands: `npm run dev` (port 3000), `npm run build` (type-check + build), `npm run lint`, `npm run test`, `npm run test:rls`. Use `npx supabase` for the CLI.
- After non-trivial changes, run `npm run type-check` and `npm run lint`; run `npm run test` for logic changes.
- Feature-based layout: code lives under `src/features/*` and `src/shared/*`; the Supabase access layer is `src/shared/lib/supabase/`. Path alias `@` → `src`.
- Never print or commit secrets; `.env` and `docs/environment/ENVIRONMENT_SECRETS.md` are git-ignored.
