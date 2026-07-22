/**
 * Per-panel-kind dock width persistence. Deliberately plain localStorage —
 * useCanvasPanelStore stays transient; only the user's preferred width for a
 * given panel kind (e.g. 'evidenceEdit') survives reloads.
 */
const STORAGE_PREFIX = 'metrimap.dock.width.';

export const DOCK_MIN_WIDTH = 360;

/** Max dock width in px — mirrors DockHost's 45vw cap. */
export function dockMaxWidth(): number {
  return Math.round(window.innerWidth * 0.45);
}

export function clampDockWidth(px: number): number {
  return Math.min(Math.max(Math.round(px), DOCK_MIN_WIDTH), dockMaxWidth());
}

export function loadDockWidth(key: string): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    const px = raw ? Number(raw) : NaN;
    return Number.isFinite(px) ? clampDockWidth(px) : null;
  } catch {
    return null;
  }
}

export function saveDockWidth(key: string, px: number): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, String(Math.round(px)));
  } catch {
    /* storage unavailable (private mode) — width just won't persist */
  }
}
