import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { applyRemoteCanvasChange } from './applyRemoteChange';
import {
  broadcastCanvasChange,
  registerExtraEdgesApply,
  type ExtraEdge,
} from './canvasSyncChannel';

const canvasNode = (id: string, position = { x: 0, y: 0 }) =>
  ({
    id,
    projectId: 'p',
    nodeType: 'sourceNode',
    title: 't',
    position,
    data: {},
    createdAt: '',
    updatedAt: '',
    createdBy: 'u',
  }) as any;

describe('canvas realtime sync', () => {
  beforeEach(() => useCanvasNodesStore.getState().clearNodes());
  afterEach(() => registerExtraEdgesApply(null));

  it('broadcastCanvasChange is a no-op when no channel is registered', () => {
    expect(() =>
      broadcastCanvasChange({ t: 'node:delete', family: 'canvasNode', id: 'x' })
    ).not.toThrow();
  });

  it('applies remote canvasNode create/move/delete to local state only', () => {
    const store = () => useCanvasNodesStore.getState();

    applyRemoteCanvasChange({
      t: 'node:create',
      family: 'canvasNode',
      node: canvasNode('n1'),
    });
    expect(store().getNodeById('n1')).toBeTruthy();

    applyRemoteCanvasChange({
      t: 'node:move',
      family: 'canvasNode',
      id: 'n1',
      position: { x: 5, y: 9 },
    });
    expect(store().getNodeById('n1')?.position).toEqual({ x: 5, y: 9 });

    applyRemoteCanvasChange({ t: 'node:delete', family: 'canvasNode', id: 'n1' });
    expect(store().getNodeById('n1')).toBeUndefined();
  });

  it('applies a remote canvasNode data/title update locally', () => {
    applyRemoteCanvasChange({
      t: 'node:create',
      family: 'canvasNode',
      node: canvasNode('n2'),
    });
    applyRemoteCanvasChange({
      t: 'node:update',
      family: 'canvasNode',
      id: 'n2',
      updates: { title: 'Renamed', data: { k: 1 } } as any,
    });
    const n = useCanvasNodesStore.getState().getNodeById('n2');
    expect(n?.title).toBe('Renamed');
    expect((n?.data as any)?.k).toBe(1);
  });

  it('applies remote extra-edge create/delete through the registered setter', () => {
    let edges: ExtraEdge[] = [];
    registerExtraEdgesApply({
      get: () => edges,
      set: (next) => {
        edges = next;
      },
    });

    const edge: ExtraEdge = { id: 'e1', source: 'a', target: 'b', type: 'operativeEdge' };
    applyRemoteCanvasChange({ t: 'extraEdge:create', edge });
    expect(edges.map((e) => e.id)).toEqual(['e1']);

    // Idempotent: a duplicate create doesn't double-add.
    applyRemoteCanvasChange({ t: 'extraEdge:create', edge });
    expect(edges).toHaveLength(1);

    applyRemoteCanvasChange({ t: 'extraEdge:delete', id: 'e1' });
    expect(edges).toHaveLength(0);
  });

  it('ignores card-family changes when no canvas is loaded (no throw)', () => {
    expect(() =>
      applyRemoteCanvasChange({
        t: 'node:create',
        family: 'card',
        node: { id: 'c1' } as any,
      })
    ).not.toThrow();
  });
});
