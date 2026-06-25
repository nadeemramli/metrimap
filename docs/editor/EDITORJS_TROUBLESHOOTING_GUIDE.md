# EditorJS Troubleshooting Guide

Consolidated reference for diagnosing and fixing EditorJS issues in Metrimap's evidence/notebook editor. Covers the two classes of problems we've hit: **initialization/plugin errors** and **editing UX issues** (focus loss, autosave, visual hierarchy).

> Central config: `src/lib/editorjs-config.ts`. Primary editing surface: `src/features/evidence/components/EvidenceEditor.tsx`. See also [ADR-003](../adr/ADR-003:%20EditorJS%20for%20Text%20Editor.md).

---

## Part 1 — Initialization & plugin errors

### Symptoms

```
❌ Block «paragraph» skipped because of plugins error
❌ Block «header» skipped because of plugins error
❌ TypeError: Cannot read properties of undefined (reading 'isInternal')
❌ The block can not be displayed correctly
```

### Root causes

| Error | Cause |
|-------|-------|
| `Block «X» skipped because of plugins error` | A tool config references inline tools that aren't registered (`link`, `marker`, `bold`, `italic`), or a tune (e.g. `textVariant`) isn't properly configured. Complex tools (`NestedChecklist`, `ColorPicker`, `ToggleBlock`) fail to initialize and cascade. |
| `Cannot read properties of undefined (reading 'isInternal')` | Type casting with `as any` masks real interface mismatches; a tool class doesn't match the expected EditorJS tool interface. |
| `The block can not be displayed correctly` | Saved content contains block types whose tools are no longer registered, or the validation list includes types that aren't actually configured. |

### Resolution strategy: configure only what you register

1. **Register tools deliberately** — don't enable 25+ tools at once. Start from a known-good core and add tools one at a time, testing each.
2. **Avoid `as any`** on tool classes — it hides interface incompatibilities that surface later as runtime errors.
3. **Drop fragile extras until proven** — tunes (`textVariant`), complex inline toolbars, and heavy tools (`NestedChecklist`, `ColorPicker`, `ToggleBlock`) are the usual culprits.
4. **Keep validation aligned with the registered tool set** — `validateAndMigrateEditorData()` must only allow block types that are actually configured, so unknown blocks are filtered (and a default paragraph is guaranteed) instead of throwing at render time.

A minimal, reliably-working core looks like:

```typescript
// Known-good baseline — add tools incrementally on top of this
const STABLE_BLOCK_TYPES = [
  "header", "paragraph", "list", "quote", "table",
  "checklist", "code", "warning", "delimiter",
  "marker", "inlineCode", "underline",
] as const;

// Direct class references, simple config, no tunes, no exotic inline toolbars
header: {
  class: Header,
  config: { placeholder: "Enter a header", levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
},
paragraph: {
  class: Paragraph,
  inlineToolbar: true,
  config: { placeholder: "Start writing or press '/' for commands..." },
},
```

### Incremental enhancement path

When adding tools back, do it in waves and verify after each:

1. **Core (stable):** the 12 types above.
2. **Next:** `Image`, `LinkTool`, `Alert`.
3. **Then:** `ToggleBlock`, `ColorPicker`, `LaTeX`.
4. **Last:** complex tools like `NestedChecklist`, `TOC`, custom tunes, drag-and-drop.

> The live config in `src/lib/editorjs-config.ts` has grown well beyond the 12-type baseline. This section documents *why* configurations are constrained and how to add tools safely — not a cap on what's currently enabled.

---

## Part 2 — Editing UX issues

### 2.1 User gets "pushed out" / loses focus when clicking block tools

**Cause:** autosave firing too frequently (every ~2s) and running synchronously, blocking the editor and stealing focus.

**Fix:**

- Debounce the user-level autosave to **3s**.
- Make content retrieval **non-blocking** — defer `editor.save()` behind a small `setTimeout` so it doesn't block the interaction:

```typescript
// Non-blocking save — small delay prevents UI stalls/focus loss
setTimeout(async () => {
  try {
    const content = await editorRef.current!.save();
    autoSave(content, formData);
  } catch (error) {
    console.error("Non-blocking save error:", error);
  }
}, 100);
```

### 2.2 Autosave interrupting typing

**Cause:** synchronous, eager saves on every change.

**Fix — layered debouncing:**

| Layer | Delay | Purpose |
|-------|-------|---------|
| Editor `onChange` | 500ms | Collapse rapid keystrokes |
| Form change processing | 200ms | Avoid reprocessing on every field tick |
| Content retrieval | 100ms | Defer `save()` off the interaction path |
| User-level autosave | 3000ms | Actual persistence cadence |

Autosave must **fail gracefully** — never block typing, always leave manual save (Ctrl+S) available:

```typescript
try {
  onSave(updatedEvidence);
} catch (error) {
  console.error("AUTO-SAVE ERROR:", error);
  toast.error("Auto-save failed", { duration: 2000 });
  // User keeps working; manual save still available
}
```

### 2.3 Headers look the same as paragraphs

**Cause:** missing visual hierarchy in CSS (EditorJS ships minimal styling).

**Fix — explicit header scale:**

| Level | Size | Treatment |
|-------|------|-----------|
| H1 | 2.25rem | bold, blue underline |
| H2 | 1.875rem | bold, blue |
| H3 | 1.5rem | bold, gray |
| H4 | 1.25rem | bold, light gray |
| H5 | 1.125rem | light gray, uppercase, spaced |
| H6 | 1rem | light gray, uppercase, extra spaced |

Paragraphs: 1rem, line-height ~1.75, distinct gray (`rgb(55 65 81)`), consistent ~0.75rem margins.

---

## Resolution checklist

- [ ] Every tool referenced in inline toolbars / tunes is actually registered.
- [ ] No `as any` on tool class assignments.
- [ ] `validateAndMigrateEditorData()` allow-list matches the registered tools.
- [ ] Autosave is debounced (~3s) and non-blocking; manual Ctrl+S works.
- [ ] Editor is properly destroyed on unmount and timeouts are cleared (no leaks).
- [ ] Headers have a visible size/color hierarchy vs paragraphs.

## Lessons learned

1. **Start simple, add incrementally** — core tools first, complexity later, test each addition.
2. **Validation must mirror configuration** — drift between them is the source of "block cannot be displayed".
3. **Type safety matters** — `as any` defers errors to runtime where they're cryptic.
4. **Saves must never block input** — debounce + defer + graceful failure.
5. **Watch the console** — EditorJS errors are terse but point at the offending block/tool.

## References

- `src/lib/editorjs-config.ts` — tool configuration & `validateAndMigrateEditorData()`
- `src/features/evidence/components/EvidenceEditor.tsx` — autosave & lifecycle
- [ADR-003: EditorJS for the Text Editor](../adr/ADR-003:%20EditorJS%20for%20Text%20Editor.md)
- `docs/editor/NOTEBOOK_IMPLEMENTATION.md`, `docs/editor/BLOCK_CONVERSION_AND_FULLSCREEN_FIXES.md`
