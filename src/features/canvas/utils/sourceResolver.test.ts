import { describe, expect, it } from 'vitest';
import {
  findOrphanedSourceBindings,
  type SourceBindingNode,
} from './sourceResolver';

const series = [
  { period: '2026-01', value: 10, change_percent: 0, trend: 'neutral' as const },
];

function warehouseNode(
  id: string,
  connectionId: string,
  extra: Record<string, unknown> = {}
): SourceBindingNode {
  return {
    id,
    type: 'sourceNode',
    data: { config: { origin: 'warehouse', connectionId, sql: '' }, series, ...extra },
  };
}

describe('findOrphanedSourceBindings', () => {
  it('flags a warehouse node whose connection was removed', () => {
    const nodes = [warehouseNode('n1', 'gone')];
    const updates = findOrphanedSourceBindings(nodes, new Set(['live']));
    expect(updates).toHaveLength(1);
    expect(updates[0].id).toBe('n1');
    expect(updates[0].data.stale).toBe(true);
    expect(updates[0].data.series).toEqual(series); // last value preserved
  });

  it('leaves a node whose connection still exists', () => {
    const nodes = [warehouseNode('n1', 'live')];
    expect(findOrphanedSourceBindings(nodes, new Set(['live']))).toHaveLength(0);
  });

  it('skips nodes already flagged stale', () => {
    const nodes = [warehouseNode('n1', 'gone', { stale: true })];
    expect(findOrphanedSourceBindings(nodes, new Set())).toHaveLength(0);
  });

  it('skips nodes with no series to preserve', () => {
    const nodes = [warehouseNode('n1', 'gone', { series: [] })];
    expect(findOrphanedSourceBindings(nodes, new Set())).toHaveLength(0);
  });

  it('ignores non-source and non-warehouse nodes', () => {
    const nodes: SourceBindingNode[] = [
      { id: 'm1', type: 'metricCard', data: { series } },
      { id: 's1', type: 'sourceNode', data: { config: { origin: 'manual', rows: [] }, series } },
    ];
    expect(findOrphanedSourceBindings(nodes, new Set())).toHaveLength(0);
  });
});
