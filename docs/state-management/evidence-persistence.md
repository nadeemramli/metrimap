# Evidence persistence model (CVS-337/CVS-338)

How evidence data flows between the canvas, the store, Supabase, and project
settings. This replaced the legacy `projects.settings.evidence` JSON blob.

## Sources of truth

| Data | Where it lives | Written by |
| --- | --- | --- |
| Content fields (title, type, date, summary, hypothesis, link, impact, `content` EditorJS jsonb, `is_public`, scope) | `evidence_items` table | `src/features/evidence/services/evidenceSync.ts` (debounced per-id), `evidence.ts` / `relationships.ts` services |
| Scope (card / relationship / general) | `evidence_items.card_id` / `relationship_id` columns | mapped ⇄ domain `context` in `rowToEvidence` / `transformEvidenceItem` |
| Canvas presentation: `position`, `isExpanded`, `isVisible`, `zIndex`, `links`, `comments`, `tags`, `category`, context target name | `projects.settings.evidenceLayout` — a map keyed by evidence id | CanvasPage debounced layout save (600ms), built by `buildEvidenceLayoutMap` |
| UI working copy | `useEvidenceStore` (Zustand, **not** localStorage-persisted) | hydrated per canvas; all mutations go through `evidenceSync` |

## Write path (`evidenceSync.ts`)

`createEvidenceSynced` / `updateEvidenceSynced` / `deleteEvidenceSynced`:
optimistic store write first, then DB. Content-field updates debounce 800ms
per id onto a per-id promise chain (a create can never race its own updates);
failed creates are retried on the next edit. `flushEvidenceSync(id)` forces
the pending update out immediately — called on panel close and manual saves
(EvidencePage, repository editor) so the row never trails the store.

Layout-field updates deliberately skip the DB — CanvasPage's debounced
`evidenceLayout` settings save owns them.

## Hydration (`hydrateProjectEvidence.ts`)

Canvas load: `evidence_items` rows for the project + `evidenceLayout` overlay
(`applyEvidenceLayout`). The evidence store is cleared on canvas switch —
nothing bleeds across projects. The canvas-scoped repository route hydrates
itself the same way on direct load.

## One-time legacy migration

Pre-CVS-337 canvases hold evidence in `settings.evidence` (blob). On first
load by an **editor** (RLS rejects viewer inserts), `migrateLegacyEvidence`:

1. Partitions blob items vs existing rows — by id, then by
   `(title, date, created_by)` fingerprint (the repository page used to
   dual-write), so re-runs never duplicate.
2. Inserts missing items — UUID ids preserved; legacy `evidence_…` ids get
   fresh ids, remapped across layout keys, `links`, and
   `settings.dataFlowEdges` reference edges (`ref-<old>-<card>` ids too).
3. Finalizes in a single `mergeProjectSettings` write: `evidenceLayout`,
   `evidenceMigratedAt` stamp, `evidenceLegacyBackup` (kept one release —
   remove with the blob-read fallback after CVS-337 has been in production),
   and empties `settings.evidence`.

Viewers on an unmigrated canvas still see blob items read-only.

## Gotchas

- **Prisma/Zod**: `prisma db pull` re-creates a `projects.tags` relation that
  collides with the scalar `tags` column — re-apply the `tag_records` rename
  in `schema.prisma` after every pull. Validation re-exports in
  `src/shared/lib/validation/zod.ts` must stay on the **Unchecked** variants
  (services build flat column payloads). `date` (date-only string) and
  `causal_metadata`/raw-null json stay on the post-parse pattern.
- **Offline**: dropping the store's localStorage persist removed the
  accidental offline cache; a hard-offline session doesn't survive reload.
