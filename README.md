# Metrimap

A visual-first web app for building, managing, and analyzing **metric trees** and
business-architecture maps. Place **cards** (metrics, processes, work) on an infinite
**canvas**, connect them with typed **relationships** (deterministic, probabilistic,
causal, compositional), and layer on evidence, dashboards, sources, and
formula/correlation computation.

## Getting started

```bash
npm install
npm run dev          # Vite dev server on http://localhost:3000
```

Local config lives in `.env` (git-ignored). See **[AGENTS.md](AGENTS.md)** for the
required environment keys.

## Common commands

```bash
npm run build        # type-check (tsc --noEmit) then vite build
npm run type-check   # TypeScript check only
npm run lint         # ESLint
npm run test         # Vitest
npm run test:rls     # RLS policy tests
```

## Where to read more

- **[AGENTS.md](AGENTS.md)** — the source of truth for architecture, stack,
  commands, conventions, the Supabase client, secrets, and the agent operating
  protocol. **Start here.**
- **[docs/](docs/)** — infrastructure/structural technical docs (ADRs, environment,
  auth, database/RLS, state management, and infra features).
- **Work** is tracked in **Linear** (team CVS); **product knowledge** lives in the
  owner's Obsidian product vault (not this repo — see the Docs policy in AGENTS.md).

## Tech stack

React 19 + TypeScript · Vite 7 · React Flow (`@xyflow/react`) · shadcn/ui + Tailwind
v4 · Zustand + XState · TanStack Query · Supabase (RLS) · Clerk auth · deployed on
Vercel.
