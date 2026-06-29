// Freehand stroke geometry, built on perfect-freehand. getStroke turns an input
// path into a variable-width OUTLINE polygon (pressure/velocity aware); we then
// render that outline as a single FILLED SVG path — not a constant-width stroke.

import { getStroke } from 'perfect-freehand';

export type InputPoint = [number, number];

const strokeOptions = (size: number) => ({
  size,
  thinning: 0.6,
  smoothing: 0.5,
  streamline: 0.5,
  // No real pressure from a mouse — let perfect-freehand vary width by velocity.
  simulatePressure: true,
  last: true,
});

/** Variable-width outline points for a set of input points. */
export function getStrokeOutline(
  points: InputPoint[],
  size: number
): number[][] {
  if (points.length === 0) return [];
  return getStroke(points, strokeOptions(size));
}

/** Convert an outline polygon into a closed, filled SVG path (quadratic-smoothed). */
export function outlineToPath(outline: number[][]): string {
  if (outline.length < 2) return '';
  const round = (n: number) => Math.round(n * 100) / 100;
  let d = `M ${round(outline[0][0])} ${round(outline[0][1])} Q`;
  for (let i = 0; i < outline.length; i++) {
    const [x0, y0] = outline[i];
    const [x1, y1] = outline[(i + 1) % outline.length];
    d += ` ${round(x0)} ${round(y0)} ${round((x0 + x1) / 2)} ${round((y0 + y1) / 2)}`;
  }
  return `${d} Z`;
}

/** Filled SVG path for a freehand stroke, in the input points' own coordinates. */
export function strokeToPath(points: InputPoint[], size: number): string {
  return outlineToPath(getStrokeOutline(points, size));
}

export interface Bounds {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

/** Axis-aligned bounds of a set of points (width/height clamped to >= 1). */
export function boundsOf(points: number[][]): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return {
    minX,
    minY,
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1),
  };
}
