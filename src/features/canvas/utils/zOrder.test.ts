import { describe, expect, it } from 'vitest';
import {
  bringForward,
  bringToFront,
  nextZ,
  reorder,
  resolveZ,
  sendBackward,
  sendToBack,
  sortByZ,
  Z_STEP,
  type ZItem,
} from './zOrder';

const legacy = (id: string, createdAt: string): ZItem => ({
  id,
  zIndex: null,
  createdAt,
});
const persisted = (id: string, zIndex: number, createdAt = ''): ZItem => ({
  id,
  zIndex,
  createdAt,
});

describe('resolveZ', () => {
  it('derives creation-order z for legacy items (no persisted zIndex)', () => {
    const z = resolveZ([
      legacy('b', '2026-01-02'),
      legacy('a', '2026-01-01'),
      legacy('c', '2026-01-03'),
    ]);
    expect(z.get('a')).toBe(Z_STEP);
    expect(z.get('b')).toBe(2 * Z_STEP);
    expect(z.get('c')).toBe(3 * Z_STEP);
  });

  it('persisted zIndex wins over creation order', () => {
    const z = resolveZ([
      legacy('old', '2026-01-01'),
      persisted('raised', 99, '2025-01-01'),
    ]);
    expect(z.get('raised')).toBe(99);
  });
});

describe('sortByZ', () => {
  it('orders bottom to top', () => {
    const order = sortByZ([
      persisted('top', 30),
      persisted('bottom', 10),
      persisted('mid', 20),
    ]).map((i) => i.id);
    expect(order).toEqual(['bottom', 'mid', 'top']);
  });
});

describe('nextZ', () => {
  it('puts new items on top', () => {
    expect(nextZ([])).toBe(Z_STEP);
    // legacy 'b' resolves to rank 2 → 20, so the new item lands above at 30
    expect(nextZ([persisted('a', 10), legacy('b', '2026-01-01')])).toBe(
      3 * Z_STEP
    );
  });
});

describe('reorder', () => {
  it('first reorder renormalizes and backfills every unpersisted item', () => {
    const items = [
      legacy('a', '2026-01-01'),
      legacy('b', '2026-01-02'),
      legacy('c', '2026-01-03'),
    ];
    // move c (top) to the bottom
    const patches = reorder(items, 'c', 0);
    const byId = Object.fromEntries(patches.map((p) => [p.id, p.zIndex]));
    expect(byId['c']).toBe(Z_STEP);
    expect(byId['a']).toBe(2 * Z_STEP);
    expect(byId['b']).toBe(3 * Z_STEP);
  });

  it('single midpoint write when fully persisted with a gap', () => {
    const items = [
      persisted('a', 10),
      persisted('b', 20),
      persisted('c', 30),
    ];
    // move c between a and b
    const patches = reorder(items, 'c', 1);
    expect(patches).toEqual([{ id: 'c', zIndex: 15 }]);
  });

  it('renormalizes when the gap is exhausted', () => {
    const items = [
      persisted('a', 10),
      persisted('b', 11),
      persisted('c', 30),
    ];
    // move c between a and b — no integer gap
    const patches = reorder(items, 'c', 1);
    const byId = Object.fromEntries(patches.map((p) => [p.id, p.zIndex]));
    expect(byId['a']).toBeUndefined(); // already at 10 — unchanged rows get no patch
    expect(byId['c']).toBe(20);
    expect(byId['b']).toBe(30);
  });

  it('no-ops for unknown ids and same position', () => {
    const items = [persisted('a', 10), persisted('b', 20)];
    expect(reorder(items, 'zz', 0)).toEqual([]);
    expect(reorder(items, 'a', 0)).toEqual([]);
  });
});

describe('bring/send helpers', () => {
  const items = [
    persisted('a', 10),
    persisted('b', 20),
    persisted('c', 30),
  ];

  it('bringToFront moves above the current top', () => {
    const [patch] = bringToFront(items, 'a');
    expect(patch.id).toBe('a');
    expect(patch.zIndex).toBeGreaterThan(30);
  });

  it('sendToBack moves below the current bottom', () => {
    const [patch] = sendToBack(items, 'c');
    expect(patch.id).toBe('c');
    expect(patch.zIndex).toBeLessThan(10);
  });

  it('bringForward swaps with the neighbor above', () => {
    const patches = bringForward(items, 'a');
    const after = sortByZ(
      items.map((i) => {
        const p = patches.find((x) => x.id === i.id);
        return p ? { ...i, zIndex: p.zIndex } : i;
      })
    ).map((i) => i.id);
    expect(after).toEqual(['b', 'a', 'c']);
  });

  it('sendBackward swaps with the neighbor below', () => {
    const patches = sendBackward(items, 'c');
    const after = sortByZ(
      items.map((i) => {
        const p = patches.find((x) => x.id === i.id);
        return p ? { ...i, zIndex: p.zIndex } : i;
      })
    ).map((i) => i.id);
    expect(after).toEqual(['a', 'c', 'b']);
  });
});
