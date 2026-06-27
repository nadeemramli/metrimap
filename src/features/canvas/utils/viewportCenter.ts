// Computes the flow-coordinate position at the center of the visible canvas, so
// newly created nodes appear where the user is currently looking instead of at a
// fixed/random spot. A small random jitter prevents repeated adds from perfectly
// stacking on top of each other.

type Point = { x: number; y: number };
type ScreenToFlow = (p: Point) => Point;

function resolveContainer(container?: HTMLElement | null): HTMLElement | null {
  if (
    container &&
    typeof (container as HTMLElement).getBoundingClientRect === 'function'
  ) {
    return container;
  }
  // Fall back to the first rendered React Flow pane (the main canvas).
  return document.querySelector('.react-flow') as HTMLElement | null;
}

export function getViewportCenterPosition(
  screenToFlowPosition: ScreenToFlow | undefined,
  container?: HTMLElement | null,
  jitter = 24
): Point {
  const el = resolveContainer(container);
  const rect = el?.getBoundingClientRect();
  const j = () => (Math.random() - 0.5) * 2 * jitter;

  if (rect && rect.width > 0 && screenToFlowPosition) {
    const center = screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    return { x: center.x + j(), y: center.y + j() };
  }

  // Instance not ready yet — fall back to a sensible default.
  return { x: 200 + j(), y: 200 + j() };
}
