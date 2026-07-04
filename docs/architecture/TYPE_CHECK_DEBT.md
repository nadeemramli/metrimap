# Type-Check Debt

This page tracks the files that were **quarantined** when strict type-checking was turned on, so the debt is explicit and dischargeable rather than silently ignored.

## Background

`npm run type-check` used to run `tsc --noEmit` against the root `tsconfig.json`, which has `"files": []` + project `references`. Plain `tsc` (not `tsc -b`) on that config compiles **nothing**, so type errors anywhere in `src` went unnoticed.

It now runs **`tsc -b --noEmit`**, which actually checks the app. Turning that on surfaced two kinds of pre-existing errors:

1. **Auto-generated Prisma/Zod code (~1,500 errors).** `prisma-zod-generator` emits runtime-valid Zod whose *types* don't pass strict `tsc` against the installed `@prisma/client`. These files are stamped `// @ts-nocheck` automatically by `scripts/stamp-generated-nocheck.mjs`, which runs as part of `npm run prisma:generate` — so the stamp survives every regeneration. **Do not hand-edit generated files.**

2. **Hand-written app code (~250 errors).** The mechanically-safe ones (unused symbols, implicit-any params) were **fixed**. The remaining ones — **219 errors across 37 files** — are real type mismatches that need per-site judgment and carry regression risk, so each such file was stamped `// @ts-nocheck` with a `TODO(type-debt)` pointer to this page.

> ⚠️ A quarantined (`@ts-nocheck`) file is **entirely unchecked**, including any *new* code added to it. Treat the list below as "fix and un-quarantine", and avoid piling new logic into these files.

## How to discharge debt for a file

1. Remove the `// @ts-nocheck` + `TODO(type-debt)` header from the top of the file.
2. Run `npm run type-check` and fix the errors it reports for that file.
3. Verify behavior (the app/build, relevant tests) before committing — many of these are `TS2339`/`TS2769`/`TS2345` mismatches where a wrong "fix" can change runtime behavior.
4. Delete the file's row from the table below.

## Prioritize: likely-real broken imports (`TS2307`)

`TS2307: Cannot find module` usually means an actually-broken import path (not just loose typing) — these are worth fixing first:

- `lib/workers/compute.worker.ts` (2)
- `features/canvas/components/CanvasDebugPanels.tsx`, `features/canvas/components/CanvasModals.tsx`, `features/canvas/components/panels/chart-panel/chart-builder.tsx`, `shared/lib/supabase/services/relationships.ts`, `shared/lib/supabase/services/version-history.ts` (1 each)

## Quarantined files

> Being discharged incrementally (CVS-72). ✅ Done: the 3 canvas stores
> (`useEdgeStore`/`useNodeStore`/`useGroupStore`), plus `nodeTypes.ts` +
> `edgeConnectionHandler.ts`. The table below lists what remains; counts drift
> as files change — re-measure by stripping the directives.

Paths are relative to `src/`. The "Codes" column shows `TSxxxx(count)`.

| File | Errors | Codes |
|------|--------|-------|
| `features/canvas/components/CanvasDebugPanels.tsx` | 1 | TS2307(1) |
| `features/canvas/components/CanvasModals.tsx` | 12 | TS2339(8) TS2352(1) TS2345(1) TS2307(1) TS2304(1) |
| `features/canvas/components/collaboration/collaboration-dialog.tsx` | 17 | TS6133(12) TS2554(4) TS7006(1) |
| `features/canvas/components/edges/DynamicEdge.tsx` | 3 | TS6133(2) TS2322(1) |
| `features/canvas/components/mini-control/LayoutDropdownButton.tsx` | 4 | TS2345(2) TS7006(1) TS2339(1) |
| `features/canvas/components/node-function/inline-editable-field.tsx` | 1 | TS2578(1) |
| `features/canvas/components/nodes/ActionNode.tsx` | 6 | TS2339(3) TS7006(2) TS2344(1) |
| `features/canvas/components/nodes/EvidenceNode.tsx` | 2 | TS2322(2) |
| `features/canvas/components/nodes/HypothesisNode.tsx` | 11 | TS7006(6) TS2339(3) TS2344(1) TS2304(1) |
| `features/canvas/components/nodes/MetricNode.tsx` | 11 | TS7006(6) TS2339(3) TS2344(1) TS2304(1) |
| `features/canvas/components/nodes/ValueNode.tsx` | 6 | TS2339(3) TS7006(2) TS2344(1) |
| `features/canvas/components/nodes/comment-node.tsx` | 7 | TS2339(7) |
| `features/canvas/components/nodes/metric-node/MetricCard.tsx` | 2 | TS2554(1) TS2322(1) |
| `features/canvas/components/nodes/shared/EnhancedNodeToolbar.tsx` | 2 | TS6133(1) TS2339(1) |
| `features/canvas/components/panels/NodeSettingsRouter.tsx` | 7 | TS2678(6) TS6196(1) |
| `features/canvas/components/panels/chart-panel/chart-builder.tsx` | 1 | TS2307(1) |
| `features/canvas/components/panels/relationship-panel/CorrelationAnalysisPanel.tsx` | 1 | TS2339(1) |
| `features/canvas/components/panels/relationship-panel/RelationshipSheet.tsx` | 2 | TS2552(1) TS2339(1) |
| `features/canvas/components/settings/cards/ImportExportCard.tsx` | 1 | TS2339(1) |
| `features/canvas/pages/CanvasPage.tsx` | 5 | TS6133(4) TS2322(1) |
| `features/canvas/stores/useCanvasStore.ts` | 3 | TS2349(3) |
| `features/canvas/stores/useNewNodeTypesStore.ts` | 7 | TS2353(4) TS6133(1) TS2352(1) TS2345(1) |
| `lib/services/typed-canvas.ts` | 3 | TS2322(3) |
| `lib/services/typed-operations.ts` | 23 | TS2345(20) TS2740(1) TS2352(1) TS2322(1) |
| `lib/services/typed-projects.ts` | 3 | TS2345(1) TS2304(1) TS1484(1) |
| `lib/stores/version-history/useVersionHistoryStore.ts` | 5 | TS2339(4) TS6133(1) |
| `lib/workers/compute.worker.ts` | 8 | TS7006(6) TS2307(2) |
| `shared/components/ui/chart.tsx` | 1 | TS2344(1) |
| `shared/lib/supabase/services/collaboration.ts` | 25 | TS2769(14) TS2344(7) TS2322(3) TS2345(1) |
| `shared/lib/supabase/services/newNodeTypes.ts` | 9 | TS2339(5) TS2353(4) |
| `shared/lib/supabase/services/relationships.ts` | 1 | TS2307(1) |
| `shared/lib/supabase/services/version-history.ts` | 19 | TS2769(13) TS2339(5) TS2307(1) |

## Notes

- The Prisma/Zod **type-debt is concentrated in the validation/service layer** (`typed-operations.ts`, `collaboration.ts`, `version-history.ts`). Much of it stems from the generated Zod types being loose (now `// @ts-nocheck`-stamped), so these may partly resolve once the validation types are tightened by hand.
- `src/tests/xstate-react-integration.test.tsx` was **fixed, not quarantined** (its errors were two wrong import paths + unused vars).
- Error-code cheat sheet: `TS6133` unused · `TS7006` implicit any · `TS2307` module not found · `TS2339` property missing · `TS2345`/`TS2322` not assignable · `TS2769` no overload matches · `TS2344` type-arg constraint · `TS2678` switch-case type mismatch.
