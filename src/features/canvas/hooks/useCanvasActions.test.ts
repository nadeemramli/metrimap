import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCanvasActions } from './useCanvasActions';

// Regression guard for delete→undo losing relationships: deleting cards must
// snapshot their incident edges so undo restores BOTH internal edges (both
// endpoints deleted) and boundary edges (one endpoint survives), and redo
// removes the recreated edges again before re-deleting the nodes.

const h = vi.hoisted(() => {
  let idSeq = 0;
  const newId = (prefix: string) => `${prefix}-${++idSeq}`;

  const canvasState: any = {
    canvas: { id: 'canvas-1', nodes: [], edges: [] },
    selectedNodeIds: [],
    selectedEdgeIds: [],
    persistNodeDelete: async (id: string) => {
      canvasState.canvas.nodes = canvasState.canvas.nodes.filter(
        (n: any) => n.id !== id
      );
      canvasState.canvas.edges = canvasState.canvas.edges.filter(
        (e: any) => e.sourceId !== id && e.targetId !== id
      );
    },
    createNode: async (data: any) => {
      canvasState.canvas.nodes = [
        ...canvasState.canvas.nodes,
        { ...data, id: newId('node') },
      ];
    },
    updateNode: () => {},
    createEdge: async (data: any) => {
      canvasState.canvas.edges = [
        ...canvasState.canvas.edges,
        { ...data, id: newId('edge'), createdAt: '', updatedAt: '' },
      ];
    },
    persistEdgeDelete: async (id: string) => {
      canvasState.canvas.edges = canvasState.canvas.edges.filter(
        (e: any) => e.id !== id
      );
    },
  };
  const useCanvasStore = {
    getState: () => canvasState,
    setState: (p: any) =>
      Object.assign(canvasState, typeof p === 'function' ? p(canvasState) : p),
  };

  const nodesState: any = {
    canvasNodes: [],
    createNode: async (data: any) => {
      const node = { ...data, id: newId('cnode') };
      nodesState.canvasNodes = [...nodesState.canvasNodes, node];
      return node;
    },
    deleteNode: async (id: string) => {
      nodesState.canvasNodes = nodesState.canvasNodes.filter(
        (n: any) => n.id !== id
      );
    },
  };
  const useCanvasNodesStore = { getState: () => nodesState };

  const evidenceState: any = {
    evidence: [],
    addEvidence: (e: any) => {
      evidenceState.evidence = [...evidenceState.evidence, e];
    },
    deleteEvidence: (id: string) => {
      evidenceState.evidence = evidenceState.evidence.filter(
        (e: any) => e.id !== id
      );
    },
  };
  const useEvidenceStore = { getState: () => evidenceState };

  const historyState: any = {
    entries: [] as any[],
    push: (entry: any) => historyState.entries.push(entry),
  };
  const useCanvasHistoryStore = { getState: () => historyState };

  return {
    canvasState,
    nodesState,
    evidenceState,
    historyState,
    useCanvasStore,
    useCanvasNodesStore,
    useEvidenceStore,
    useCanvasHistoryStore,
  };
});

vi.mock('@/lib/stores', () => ({ useCanvasStore: h.useCanvasStore }));
vi.mock('@/features/canvas/stores/useCanvasNodesStore', () => ({
  useCanvasNodesStore: h.useCanvasNodesStore,
}));
vi.mock('@/features/evidence/stores/useEvidenceStore', () => ({
  useEvidenceStore: h.useEvidenceStore,
}));
vi.mock('@/features/canvas/stores/useCanvasHistoryStore', () => ({
  useCanvasHistoryStore: h.useCanvasHistoryStore,
}));
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));
vi.mock('@/shared/utils/authenticatedClient', () => ({
  getClientForEnvironment: () => ({}),
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  linkCardToMetric: vi.fn(),
}));

function card(id: string) {
  return {
    id,
    title: id,
    category: 'Core/Value',
    position: { x: 0, y: 0 },
    createdAt: '',
    updatedAt: '',
  } as any;
}

function edge(id: string, sourceId: string, targetId: string) {
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
  } as any;
}

describe('useCanvasActions delete → undo restores relationships', () => {
  beforeEach(() => {
    h.canvasState.canvas = {
      id: 'canvas-1',
      nodes: [card('A'), card('B'), card('S')],
      edges: [edge('e1', 'A', 'B'), edge('e2', 'B', 'S')],
    };
    h.canvasState.selectedNodeIds = [];
    h.nodesState.canvasNodes = [];
    h.evidenceState.evidence = [];
    h.historyState.entries = [];
  });

  it('recreates internal + boundary edges on undo and removes them on redo', async () => {
    const { result } = renderHook(() => useCanvasActions('proj-1', 'user-1'));
    // renderHook + several awaited store round-trips can be starved under the
    // full parallel suite; give this async flow headroom over the 5s default.

    await result.current.deleteByIds(['A', 'B']);

    // Delete removed the cards and their incident edges.
    expect(h.canvasState.canvas.nodes.map((n: any) => n.id)).toEqual(['S']);
    expect(h.canvasState.canvas.edges).toEqual([]);
    expect(h.historyState.entries).toHaveLength(1);

    const entry = h.historyState.entries[0];
    await entry.undo();

    // Nodes back (new ids) + both edges restored.
    const nodes = h.canvasState.canvas.nodes;
    const edges = h.canvasState.canvas.edges;
    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2);

    const newA = nodes.find((n: any) => n.title === 'A')!;
    const newB = nodes.find((n: any) => n.title === 'B')!;
    // Internal edge reconnects the two recreated copies.
    expect(
      edges.some(
        (e: any) => e.sourceId === newA.id && e.targetId === newB.id
      )
    ).toBe(true);
    // Boundary edge reconnects the recreated B to the surviving S.
    expect(
      edges.some((e: any) => e.sourceId === newB.id && e.targetId === 'S')
    ).toBe(true);

    await entry.redo();

    // Redo deletes the recreated edges and nodes again.
    expect(h.canvasState.canvas.nodes.map((n: any) => n.id)).toEqual(['S']);
    expect(h.canvasState.canvas.edges).toEqual([]);
  }, 20000);
});
