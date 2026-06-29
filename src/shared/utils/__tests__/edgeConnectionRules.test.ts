import { describe, expect, it } from 'vitest';
import { wouldCreateCycle } from '../edgeConnectionRules';

type E = { source: string; target: string; type?: string };

describe('wouldCreateCycle', () => {
  it('allows an edge in an empty graph', () => {
    expect(wouldCreateCycle('A', 'B', [])).toBe(false);
  });

  it('detects a self-loop', () => {
    expect(wouldCreateCycle('A', 'A', [])).toBe(true);
  });

  it('detects a direct back edge (A->B exists, adding B->A)', () => {
    const edges: E[] = [{ source: 'A', target: 'B' }];
    expect(wouldCreateCycle('B', 'A', edges)).toBe(true);
  });

  it('detects a transitive cycle (A->B->C, adding C->A)', () => {
    const edges: E[] = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ];
    expect(wouldCreateCycle('C', 'A', edges)).toBe(true);
  });

  it('allows a forward shortcut that keeps the graph acyclic (A->B->C, adding A->C)', () => {
    const edges: E[] = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ];
    expect(wouldCreateCycle('A', 'C', edges)).toBe(false);
  });

  it('allows connecting into an unrelated branch', () => {
    const edges: E[] = [
      { source: 'A', target: 'B' },
      { source: 'C', target: 'D' },
    ];
    expect(wouldCreateCycle('B', 'C', edges)).toBe(false);
  });
});
