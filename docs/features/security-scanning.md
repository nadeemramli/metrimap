# Security scanning (free, GitHub-native)

Dependency (SCA) + static-analysis (SAST) scanning for the repo, using free
GitHub-native tools instead of a paid Snyk plan (CVS-28, Path B). Findings land in
the repo **Security** tab; the plan is to route only High/Critical into Linear
later (see below).

## What's wired

| Tool | Config | Covers |
|---|---|---|
| **Dependabot** | `.github/dependabot.yml` | npm dependency CVEs (SCA) + GitHub-Actions version bumps. Weekly PRs; non-major bumps grouped to cut noise. |
| **CodeQL** | `.github/workflows/codeql.yml` | JS/TS static analysis (SAST), `security-extended` query set. Runs on push/PR to `main` + weekly. `build-mode: none` (no build needed for JS/TS). |

Also enable in **repo Settings → Code security**: *Dependabot alerts* and
*Dependabot security updates* (the config file drives version PRs; the alerts
toggle drives the vulnerability feed).

## Not this layer

- **Database security** (RLS, GraphQL exposure, SECURITY DEFINER grants) is covered
  by **Supabase advisors**, not CodeQL/Dependabot — disjoint layer, tracked in
  CVS-127. Don't cross-route.
- **Snyk** (paid) was evaluated in CVS-28: reserve it for when we need auto-fix PRs,
  license compliance, or container/IaC scanning.

## Routing to Linear (follow-up)

Keep the Security tab as the working surface. When we want tickets, add a small
GitHub Action that files **only High/Critical** CodeQL/Dependabot alerts into
Linear (label `source:security`), deduped by the alert's stable id — same
server-side pattern as the System Health / Userback bridges. Don't auto-file
low/medium (noise).
