import { beforeEach, describe, expect, it } from 'vitest';
import { useCanvasNodesStore } from '@/features/canvas/stores/useCanvasNodesStore';
import { applyRemoteCanvasChange } from './applyRemoteChange';
import { broadcastCanvasChange } from './canvasSyncChannel';

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
