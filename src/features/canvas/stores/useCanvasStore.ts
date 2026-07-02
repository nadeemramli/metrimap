// Canvas store — consolidation shim.
//
// Historically two separate `useCanvasStore` implementations existed: this file
// and `canvasStore.ts`. The app (CanvasPage, MetricCard, @/lib/stores) renders
// from and mutates `canvasStore.ts`, so this file's separate instance held an
// empty canvas / empty selection. That split silently broke copy/duplicate/
// delete (read the wrong instance) and made realtime + catalog write-through
// underfire (they were wired here, not in the rendered store).
//
// Resolution: there is now ONE store. `canvasStore.ts` is the single source of
// truth (it carries the realtime broadcast + catalog write-through wiring), and
// this module simply re-exports it so every existing importer converges on the
// same instance. Import from either path or from `@/lib/stores` — all identical.
export { useCanvasStore } from './canvasStore';
