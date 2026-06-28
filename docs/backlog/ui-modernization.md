# UI/UX Modernization — status & deferred work

_Started 2026-06-28. Foundation-first modernization to a Linear/Notion aesthetic on the existing Tailwind v4 + shadcn stack. This doc tracks what shipped and — importantly — **what was deferred because it overlaps an active pipeline or is unsafe to do yet**._

## Shipped

- **Phase 0 — Foundation.** Wired the design tokens into Tailwind v4 (`@theme inline` in `src/styles/index.css`) — they previously generated **no CSS** (no `@config`/`@theme`), so `bg-muted`/`text-foreground`/etc. were inert and dark mode didn't work. Added status tokens (`--success/--warning/--info` + `--destructive-foreground`), mounted `ThemeProvider` + a Light/Dark/System switcher in the user menu, mounted `<Toaster>` (was never mounted — every `toast.*` was a silent no-op), mounted `ConfirmDialogProvider`. New shared primitives: `ConfirmDialog`+`useConfirm`, `EmptyState`, `StatusBadge`, `Sparkline`, `formatDate`/`formatRelative`, `statusHelpers`, semantic Badge variants.
- **Phase 1 — Settings + Evidence.** Native `confirm`/`alert`→`useConfirm`/toast; hand-rolled modal→shadcn `Dialog`; raw inputs→shadcn; dates→`formatDate`; tokenized colors; added a missing delete-confirmation on Settings.
- **Phase 2 — Assets + Evidence.** AssetsPage fully modernized in place (3 hand-rolled dialogs→`Dialog`, all confirm/alert→useConfirm/toast, raw checkboxes→shadcn `Checkbox`, dates→`formatDate`, **all** hardcoded colors→tokens). Evidence dual-context breadcrumb (the global `/evidence` route had no nav chrome).
- **Phase 3 — Dashboard + Sources (visual).** Dashboard fake `<div>`-bar charts→Recharts `Sparkline`; fake health bars→shadcn `Progress`; status colors→tokens. SourcePage `window.confirm`→`useConfirm`, status-helpers refactored onto shared `statusHelpers`, dates→`formatDate`/`formatRelative`, colors tokenized.

## Deferred — overlaps an ACTIVE pipeline (coordinate before doing)

These are intentionally untouched to avoid colliding with in-flight work owned elsewhere.

1. **Data-source model consolidation** (the original "biggest UX win" of Phase 3). Connecting **canvas source-nodes ↔ Sources page ↔ Dashboard** via a shared `sourceId`, plus filling the **5 stub CRUD dialogs** (`src/features/sources/components/dialogs/`) with real DB-writing forms. → Overlaps the **data-source pipeline** (`sourceConnections.ts`, `source-config-sheet.tsx`, `duckdbEngine.ts`, the new migration; see `docs/backlog/data-source-architecture.md` + `data-source-caveats.md`). SourcePage currently uses the *old* `useSourcesStore`, independent of that work. Do this only once the data-source pipeline settles, designed against its model.
2. **Real AI dashboard insights** (`DashboardPage` `calculateDashboardInsights` is a `TODO` returning mock). → Needs a backend/inference path; out of scope for a UI pass.
3. **Collaboration UI** — already consolidated by the collaboration pipeline; do NOT rebuild. See `docs/backlog/collaboration-consolidation.md`.

## Deferred — unsafe / needs prerequisite work

4. **Canvas right-side Inspector consolidation** (Phase 4's largest item): merge `ControlPanel` (operators) + `GroupsPanel` + the 3 right-slide sheets (`CardSettingsSheet`, `RelationshipSheet`, `NodeSettingsRouter`) into one dockable tabbed Inspector. → **Blocked on removing `@ts-nocheck` from `CanvasPage.tsx`** — without type-checking, a refactor of this size on a 1839-line file is too risky. Recommend: clear the `@ts-nocheck` type debt first, then consolidate.
5. **Floating pill toolbar + on-canvas mode toggle** (move Edit/Draw toggle out of the header `CanvasModeToggle` onto the canvas surface). → Medium risk; touches `CanvasHeaderContext` + `CanvasPage` (`@ts-nocheck`). Sequence after #4.
6. **Selection → right-click context menu** (replace bottom-center `SelectionPanel`). → Sequence with #4.
7. **AssetsPage structural extraction** (1791→~600 lines). Modernization is done; the pure line-count extraction is deferred — the orphaned `MetricsTable.tsx`/`RelationshipsTable.tsx` (+ `AssetsHeader`, `AssetsFilters`, `table/DataTable`, all 0 imports) are **stale** (missing column drag-drop + real connection counts), so wiring them in would regress features. Needs a faithful re-extraction.
8. **Raw HTML tables → shadcn `Table` / TanStack** (Sources, Assets). Tables are already tokenized (dark-mode safe), so this is polish, not correctness.

## Done in Phase 4 (this pass)

- **Native-dialog elimination across canvas internals** — the deferred Phase-1 sweep: `confirm`/`alert` in `DynamicEdge`, `EvidenceNode`, `MetricCard`, `AddNodeButton`, `ImportExportCard`, `CardSettingsSheet`, `RelationshipSheet`, `data-events-tab`, `correlations-tab`, `CanvasPage` → `useConfirm`/`toast`. After this the **whole app** has zero native `confirm`/`alert` (verified by grep). 0 tsc/lint errors, build OK.
- **`EnhancedCanvasPage`** (`/canvas/:id/enhanced`) confirmed dead (unreachable from any UI link; only referenced by App routing + one test). Left in place pending owner decision to delete (a test imports it).

## Phase 4 — NOT yet done (next, in priority order)

- **Command palette (Cmd/Ctrl+K)** on the canvas — replace the `QuickSearchCommand` stub (built on `cmdk`/`ui/command`): jump-to-node (search by title → select + center) and navigate canvas sub-pages. Mostly additive; the safest next feature. **Recommended next.**
- Then the architectural consolidation (deferred items #4–#6 above): right-side Inspector, floating toolbar + on-canvas mode toggle, selection context menu — **blocked on removing `@ts-nocheck` from `CanvasPage.tsx`** first (no type safety = unsafe for a refactor this size).
