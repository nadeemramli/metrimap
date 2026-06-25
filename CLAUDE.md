# CLAUDE.md

This file gives Claude Code guidance for working in this repository.

The cross-tool project guide (architecture, stack, commands, conventions, Supabase client, secrets) lives in **@AGENTS.md** — read it first; it is the source of truth and is shared with all AI tools.

## Claude-specific notes

- Root `README.md` is **not** the project readme (it's the upstream Supabase CLI readme by mistake). For project context use `docs/index.md`, the PRD in `docs/prd/`, and `@AGENTS.md`.
- Quick commands: `npm run dev` (port 3000), `npm run build` (type-check + build), `npm run lint`, `npm run test`, `npm run test:rls`. Use `npx supabase` for the CLI.
- After non-trivial changes, run `npm run type-check` and `npm run lint`; run `npm run test` for logic changes.
- Feature-based layout: code lives under `src/features/*` and `src/shared/*`; the Supabase access layer is `src/shared/lib/supabase/`. Path alias `@` → `src`.
- Never print or commit secrets; `.env` and `docs/environment/ENVIRONMENT_SECRETS.md` are git-ignored.
