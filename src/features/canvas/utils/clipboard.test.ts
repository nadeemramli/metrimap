import { describe, expect, it } from 'vitest';
import type { Relationship } from '@/shared/types';
import { internalEdges, remapEdges } from './clipboard';

function edge(id: string, sourceId: string, targetId: string): Relationship {
  return {
    id,
    sourceId,
    targetId,
    type: 'Deterministic',
    confidence: 'High',
    weight: 0.5,
    evidence: [],
    createdAt: '',
    updatedAt: '',
  } as Relationship;
}

const edges = [
  edge('e1', 'a', 'b'), // both selected
  edge('e2', 'b', 'c'), // both selected
  edge('e3', 'c', 'x'), // x not selected → external
];

describe('internalEdges', () => {
  it('keeps only edges with both endpoints in the selection', () => {
    const kept = internalEdges(edges, new Set(['a', 'b', 'c']));
    expect(kept.map((e) => e.id)).toEqual(['e1', 'e2']);
  });

  it('returns nothing when fewer than two selected nodes are connected', () => {
    expect(internalEdges(edges, new Set(['a']))).toEqual([]);
  });
});

describe('remapEdges', () => {
  it('remaps endpoints to the new ids and strips id/timestamps', () => {
    const map = new Map([
      ['a', 'A'],
      ['b', 'B'],
    ]);
    const out = remapEdges([edge('e1', 'a', 'b')], map);
    expect(out).toEqual([
      {
        sourceId: 'A',
        targetId: 'B',
        type: 'Deterministic',
        confidence: 'High',
        weight: 0.5,
        evidence: [],
        notes: undefined,
      },
    ]);
  });

  it('drops edges whose endpoints did not both map', () => {
    const map = new Map([['a', 'A']]); // b missing
    expect(remapEdges([edge('e1', 'a', 'b')], map)).toEqual([]);
  });
});
