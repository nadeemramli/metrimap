# UI/UX Audit & Backlog — 2026-06-29

Verified against the codebase (6-way parallel audit), mapped to the PRD narrative.
Legend: ✅ Done · 🟡 Partial · ❌ Missing. `(#n)` = original 9; `+` = PRD addition.

## Foundation / Platform Epics (track as Backlog B)

| Item | State | Evidence / gap |
|---|---|---|
| Object model & hierarchy (Workspace→Space→Canvas→Node) `+` | ✅ | spaces table + workspace=Clerk org (B.3/B.4) |
| Semantic layer: metric defined once + reference resolution `+` | ✅ | catalog (B.1) + "Add from Catalog" |
| Value store keyed by tracked metric `+` (#5 ext) | ✅ | metric_values + write-through |
| **Stale / orphaned-binding fallback** (#6.2.1) | ❌ | sourceResolver errors silently; no "stale" badge / last-known-snapshot state — **a locked design principle that was never built** |
| **Metric-value versioning / time-travel** `+` | 🟡 | canvas snapshots exist (version-history store); metric *values* upsert in place — no value history |

## Homepage & IA (Backlog A) — essentially DONE

| Item | State |
|---|---|
| Consolidated list + filter chips (Recent/Starred as filters) (#3) | ✅ |
| Search / sort / grid-list toggle (#3) | ✅ |
| Canvas preview (#4) | ✅ |
| Folders/Spaces + tags `+` | ✅ |
| Archive/restore (soft) vs hard delete `+` | ✅ |
| Duplicate (deep copy) `+` | ✅ |
| **Save-as-template** `+` (feeds #2) | ❌ |

## Data & Connections

| Item | State | Gap |
|---|---|---|
| Data source connect page (#5) | ✅ | SourcePage (browse/auth/bind) |
| Source node (DuckDB / file / warehouse) `+` | ✅ | |
| **Connection mgmt in Workspace Settings** (#6.2) | ❌ | only inline in node config |
| **Stale/orphaned-binding fallback** (#6.2.1) | ❌ | (see Foundation) |

## Collaboration & Permissions (gates #7/#8) — strong

| Item | State | Gap |
|---|---|---|
| Roles (viewer/commenter/editor/admin) `+` | ✅ | per-canvas owner/admin/member/viewer |
| Invite flow `+` | ✅ | by email + Clerk org |
| Scoped link-share + public read-only `+` | ✅ | is_public + copy link |
| Comments + @mentions `+` | ✅ | |
| **Update feed board** (Monday-style) (#7) | 🟡 | ActivityTab exists; no All/mentions/bookmarked filters |
| **Notification inbox** (All/Mentioned/Assigned/date) (#8) | 🟡 | mentions only; no tabs/date-range |
| People- vs system-events (two producers) `+` | 🟡 | changelog (system) + notifications (people) stored separately; not labeled/filterable |

## Account & Workspace shell

| Item | State | Gap |
|---|---|---|
| Profile page + notif prefs (#6.1) | 🟡 | Clerk profile; notif prefs stubbed |
| **Workspace settings page** (#6.2) | ❌ | no route; only canvas settings |
| Member/team management `+` | 🟡 | Clerk "Manage Organization"; in-app stub non-functional |
| Theme light/dark/**night** (#9) | 🟡 | light/dark/system only — **no 3rd "night" mode** |
| Give Feedback (#6.3) | 🟡 | Userback; works in prod only (off in dev) |
| Billing / plan / usage `+` | ❌ | |
| Security: 2FA / sessions / audit log `+` | 🟡 | Clerk sessions; no custom 2FA/audit |

## Power-user / Canvas surface

| Item | State | Gap |
|---|---|---|
| Keyboard shortcuts + cheatsheet `+` | ✅ | infra + `?` help overlay (few wired) |
| **Command palette (Cmd+K)** `+` | 🟡 | stub, intentionally disabled ("being rebuilt") |
| **Global cross-canvas search** `+` | 🟡 | AdvancedSearchModal scoped to current canvas only |

## Distribution & Interop — weakest area

| Item | State | Gap |
|---|---|---|
| Export PNG / PDF / CSV `+` | 🟡 | JSON only; no PNG/PDF/CSV |
| Embed (Notion/Confluence/iframe) `+` | ❌ | all routes ProtectedRoute; no public view |
| Read/write API `+` | ❌ | only warehouse-proxy; no metrics API |

## Analytics Intelligence (the differentiator)

| Item | State | Gap |
|---|---|---|
| Examples exercising full feature set (#1) | ✅ | 3 seed trees (SaaS/Ecom/Retail) — could add more |
| **Starter templates** (#2) | ❌ | no template gallery / new-from-template |
| Metric Catalog UI `+` | 🟡 | browse/promote done; no edit/search/lineage |
| Time-travel / snapshot comparison UI `+` | 🟡 | canvas restore; no diff/compare |
| **Alerting / monitoring** (threshold alerts) `+` | ❌ | only `gate` operator |
| Saved scenarios + comparison `+` | 🟡 | simulation runs; no save/compare UI |

## Original 9 → status
1 ✅ · 2 ❌ · 3 ✅ · 4 ✅ · 5 ✅ · 6.1 🟡 · 6.2 ❌ · 6.2.1 ❌ · 6.3 🟡 · 7 🟡 · 8 🟡 · 9 🟡

## Fundamental gaps (not just polish)
1. **Stale/orphaned-binding state** — locked principle "never silently zero/delete"; unbuilt. Data-integrity.
2. **Workspace Settings shell** — no home for connections/members/prefs outside a canvas.
3. **Metric-value time-travel** — value store is current-only; blocks scenario/time-travel promise.
4. **Distribution (export/embed/API)** — the app can't leave the building yet.
