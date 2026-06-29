import { describe, expect, it } from 'vitest';
import {
  boundsOf,
  getStrokeOutline,
  outlineToPath,
  strokeToPath,
} from './freehand';

describe('freehand stroke geometry', () => {
  it('produces a closed, filled outline path for a stroke', () => {
    const points: [number, number][] = [
      [0, 0],
      [10, 5],
      [20, 0],
    ];
    const path = strokeToPath(points, 4);
    expect(path.startsWith('M ')).toBe(true);
    expect(path.endsWith(' Z')).toBe(true); // closed -> fillable
    expect(path).toContain('Q');
  });

  it('returns an empty path for a degenerate outline', () => {
    expect(outlineToPath([])).toBe('');
    expect(outlineToPath([[1, 1]])).toBe(''); // < 2 points -> nothing to fill
  });

  it('outline of a real stroke is wider than zero (variable width applied)', () => {
    const outline = getStrokeOutline(
      [
        [0, 0],
        [50, 0],
      ],
      8
    );
    expect(outline.length).toBeGreaterThan(2);
    const b = boundsOf(outline);
    expect(b.height).toBeGreaterThan(1); // a flat line gains thickness
  });

  it('boundsOf clamps degenerate dimensions to >= 1', () => {
    const b = boundsOf([
      [5, 5],
      [5, 5],
    ]);
    expect(b.minX).toBe(5);
    expect(b.width).toBe(1);
    expect(b.height).toBe(1);
  });
});
