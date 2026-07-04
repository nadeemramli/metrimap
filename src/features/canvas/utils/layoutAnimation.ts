// Node position animation (CVS-39). Auto-layout updates node positions in one
// step; to make that a smooth transition instead of an instant jump we briefly
// toggle a class on the React Flow root that enables `transition: transform` on
// nodes (see `.rf-animate-layout` in styles/index.css). The store still commits
// each new position once (one autosave entry per node) — CSS does the tween, so
// there's no per-frame setNodes fighting the controlled node state or the
// autosave writer.

const ANIMATE_CLASS = 'rf-animate-layout';
const DEFAULT_DURATION = 320;

/** Whether to animate given a reduced-motion media query (null = animate). */
export function shouldAnimateLayout(
  mql?: { matches: boolean } | null
): boolean {
  return !mql?.matches;
}

let clearTimer: ReturnType<typeof setTimeout> | null = null;

function root(): Element | null {
  return typeof document === 'undefined'
    ? null
    : document.querySelector('.react-flow');
}

/**
 * Enable the layout transition for `duration` ms, then remove it. Call right
 * before applying auto-layout positions. No-op when the user prefers reduced
 * motion or there's no canvas mounted.
 */
export function animateLayout(duration = DEFAULT_DURATION): void {
  const mql =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  if (!shouldAnimateLayout(mql)) return;
  const el = root();
  if (!el) return;
  el.classList.add(ANIMATE_CLASS);
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = setTimeout(() => {
    el.classList.remove(ANIMATE_CLASS);
    clearTimer = null;
  }, duration);
}

/** Immediately stop animating (e.g. when a drag starts) so it never lags input. */
export function cancelLayoutAnimation(): void {
  if (clearTimer) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
  root()?.classList.remove(ANIMATE_CLASS);
}
