# Metrimap — repo docs

**Scope:** this folder holds **infrastructure / structural** technical docs only.
Product knowledge (PRD, feature explanations, methodology, decisions, learning) lives
in the owner's Obsidian product vault, and **work** is tracked in **Linear** (team
CVS). See the **Docs policy** in [`../AGENTS.md`](../AGENTS.md).

> VitePress has been retired — these are plain Markdown files; read them here or on
> GitHub. Knowledge/product docs now live in Obsidian.

## What's here

- **[adr/](adr/)** — Architecture Decision Records (technical choices + rationale)
- **[architecture/](architecture/)** — structural technical notes (e.g. type-check debt)
- **[auth/](auth/)** — Clerk + Supabase authentication integration
- **[database/](database/)** — Prisma + Zod, Supabase client singleton, RLS solution + testing
- **[environment/](environment/)** — environment setup + secrets guide
- **[state-management/](state-management/)** — XState patterns
- **features/ (infra only)** — [system-health-intake](features/system-health-intake.md),
  [linear-setup](features/linear-setup.md), [linear-initiatives](features/linear-initiatives.md),
  [userback-customer-requests](features/userback-customer-requests.md),
  [security-scanning](features/security-scanning.md),
  [metrics-api](features/metrics-api.md)

Anything product-facing (feature narratives, changelogs, methodology, PRD) belongs
in the Obsidian vault, not here.
