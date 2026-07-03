# ADR-003: EditorJS for the Text Editor

- **Status:** Accepted
- **Date:** 2025
- **Deciders:** Core team

## Context

The evidence/notebook feature needs a rich text editor that produces **structured, serializable output** (so content can be stored, validated, migrated, and rendered on canvas nodes) rather than raw HTML or markdown blobs.

## Decision

Use **EditorJS** (`@editorjs/editorjs` 2.30.8), a block-based editor that outputs clean JSON.

- Tooling is configured centrally in `src/lib/editorjs-config.ts` via `createEditorJSTools()` / `createEditorJSInstance()`, covering headers, lists, tables, code, checklists, quotes, embeds, LaTeX, alerts, inline formatting, and more.
- Output is passed through `validateAndMigrateEditorData()` before saving — invalid/removed block types are filtered and a default paragraph is guaranteed.
- Editing surfaces: `EvidenceEditor.tsx` (modal), `EvidenceNode.tsx` (inline on canvas), and the full-page evidence editor, with debounced autosave.

## Alternatives Considered

- **TipTap / ProseMirror** — More powerful, but HTML/PM-document model; heavier to constrain to structured blocks.
- **Lexical / Slate** — Flexible but more custom plumbing to reach a block model with a plugin ecosystem.
- **Plain Markdown** — Rejected: weak for mixed media (tables, embeds, attachments) and structured rendering.

## Consequences

- Clean block JSON that is easy to validate, migrate, and render — but the block schema must be version-managed (`validateAndMigrateEditorData`) whenever the tool set changes.
- EditorJS plugin configuration is **fragile**: misconfigured tools/tunes/inline toolbars can silently skip blocks. The hard-won stable configuration and the failure modes are documented in the EditorJS troubleshooting note (Obsidian product vault; migrated out of the repo).

> Note: an earlier doc described a minimal "12 stable tools" baseline. The live config in `src/lib/editorjs-config.ts` has since expanded well beyond that; treat the troubleshooting guide as the record of *why* certain configurations were constrained, not as the current tool count.

## References

- `src/lib/editorjs-config.ts`
- `src/features/evidence/components/EvidenceEditor.tsx`, `src/features/canvas/components/nodes/EvidenceNode.tsx`
- EditorJS troubleshooting + Notebook implementation notes (Obsidian product vault)
