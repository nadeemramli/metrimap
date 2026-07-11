import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  CanvasProject,
  MetricCard,
  Relationship,
} from '@/shared/types';
import {
  createMetricCard,
  updateMetricCard,
} from '@/shared/lib/supabase/services/metric-cards';
import { createRelationship } from '@/shared/lib/supabase/services/relationships';
import { useCanvasStore } from './canvasStore';

vi.mock('@/shared/lib/supabase/services/metric-cards', () => ({
  createMetricCard: vi.fn(),
  updateMetricCard: vi.fn(),
  deleteMetricCard: vi.fn(),
}));
vi.mock('@/shared/lib/supabase/services/projects', () => ({
  createGroup: vi.fn(),
  createProject: vi.fn(),
  deleteGroup: vi.fn(),
  updateGroup: vi.fn(),
}));
vi.mock('@/shared/lib/supabase/services/relationships', () => ({
  createRelationship: vi.fn(),
  updateRelationship: vi.fn(),
  deleteRelationship: vi.fn(),
}));
vi.mock('@/features/projects/stores/useProjectsStore', () => ({
  useProjectsStore: { getState: () => ({ projects: [] }) },
}));
vi.mock('@/shared/stores/useAppStore', () => ({
  useAppStore: { getState: () => ({ user: { id: 'user_test1' } }) },
}));
vi.mock('@/shared/utils/authenticatedClient', () => ({
  getAuthenticatedClient: () => null,
  getClientForEnvironment: () => ({}),
}));
vi.mock('@/shared/lib/analytics', () => ({ track: vi.fn() }));
vi.mock('@/features/canvas/realtime/canvasSyncChannel', () => ({
  broadcastCanvasChange: vi.fn(),
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  syncCardValuesToCatalog: vi.fn(),
}));
vi.mock('@/features/canvas/utils/evaluateAlerts', () => ({
  evaluateAlertRules: vi.fn(),
}));

const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const DB_ID_1 = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const DB_ID_2 = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const PARENT = 'ffffffff-ffff-4fff-8fff-ffffffffffff';

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const makeNode = (
  id: string,
  overrides: Partial<MetricCard> = {}
): MetricCard => ({
  id,
  title: `Node ${id.slice(0, 4)}`,
  description: '',
  category: 'Data/Metric',
  tags: [],
  causalFactors: [],
  dimensions: [],
  position: { x: 0, y: 0 },
  data: [],
  assignees: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const makeCanvas = (
  nodes: MetricCard[],
  edges: Relationship[] = []
): CanvasProject => ({
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Test canvas',
  description: '',
  tags: [],
  collaborators: [],
  nodes,
  edges,
  groups: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastModifiedBy: 'user_test1',
});

beforeEach(() => {
  vi.clearAllMocks();
  useCanvasStore.setState({
    canvas: undefined,
    selectedNodeIds: [],
    selectedEdgeIds: [],
    pendingChanges: new Set<string>(),
    localOnlyNodeIds: new Set<string>(),
    isSaving: false,
    lastSaved: undefined,
    error: undefined,
  });
});

afterEach(() => {
  // Neuter any follow-up save timers scheduled by the store so they no-op.
  useCanvasStore.setState({
    pendingChanges: new Set<string>(),
    localOnlyNodeIds: new Set<string>(),
    isSaving: false,
  });
});

describe('saveAllPendingChanges', () => {
  it('keeps ids added mid-save and writes the freshest node state', async () => {
    const resolvers: Record<string, () => void> = {};
    vi.mocked(updateMetricCard).mockImplementation(
      (id) =>
        new Promise<MetricCard>((resolve) => {
          resolvers[id] = () => resolve(makeNode(id));
        })
    );

    useCanvasStore.setState({
      canvas: makeCanvas([makeNode(A), makeNode(B), makeNode(C)]),
      pendingChanges: new Set([A, B]),
    });

    const save = useCanvasStore.getState().saveAllPendingChanges();
    await tick();
    expect(resolvers[A]).toBeDefined();

    // Mid-save (A's request in flight): re-drag B and dirty C.
    useCanvasStore.getState().updateNode(B, { position: { x: 999, y: 111 } });
    useCanvasStore.getState().addPendingChange(C);

    resolvers[A]();
    await tick();
    resolvers[B]();
    await save;

    // B was re-read right before its write, so the latest position went out.
    const bCall = vi
      .mocked(updateMetricCard)
      .mock.calls.find((call) => call[0] === B);
    expect(bCall?.[1].position).toEqual({ x: 999, y: 111 });

    const state = useCanvasStore.getState();
    expect(state.isSaving).toBe(false);
    expect(state.pendingChanges.has(C)).toBe(true); // survived the in-flight save
    expect(state.pendingChanges.has(A)).toBe(false);
    expect(state.pendingChanges.has(B)).toBe(false);
    expect(state.error).toBeUndefined();
  });

  it('INSERTs local-only fallback nodes and re-keys them to the DB id', async () => {
    vi.mocked(createMetricCard).mockResolvedValue(makeNode(DB_ID_1));
    const edge: Relationship = {
      id: DB_ID_2,
      sourceId: C,
      targetId: A,
      type: 'Compositional',
      confidence: 'High',
      evidence: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useCanvasStore.setState({
      canvas: {
        ...makeCanvas([makeNode(A), makeNode(C)], [edge]),
        groups: [
          {
            id: 'group-1',
            name: 'Group',
            nodeIds: [C],
            position: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
          },
        ],
      },
      pendingChanges: new Set([C]),
      localOnlyNodeIds: new Set([C]),
      selectedNodeIds: [C],
    });

    await useCanvasStore.getState().saveAllPendingChanges();

    expect(createMetricCard).toHaveBeenCalledTimes(1);
    expect(updateMetricCard).not.toHaveBeenCalled();

    const state = useCanvasStore.getState();
    const nodeIds = state.canvas!.nodes.map((n) => n.id);
    expect(nodeIds).toContain(DB_ID_1);
    expect(nodeIds).not.toContain(C);
    expect(state.canvas!.edges[0].sourceId).toBe(DB_ID_1);
    expect(state.canvas!.groups[0].nodeIds).toEqual([DB_ID_1]);
    expect(state.selectedNodeIds).toEqual([DB_ID_1]);
    expect(state.localOnlyNodeIds.size).toBe(0);
    expect(state.pendingChanges.size).toBe(0);
    expect(state.error).toBeUndefined();
  });

  it('marks nodes from the create-failure fallback as local-only and pending', async () => {
    vi.mocked(createMetricCard).mockRejectedValue(new Error('network down'));
    useCanvasStore.setState({ canvas: makeCanvas([]) });

    await useCanvasStore.getState().createNode({
      title: 'Offline card',
      description: '',
      category: 'Data/Metric',
      tags: [],
      causalFactors: [],
      dimensions: [],
      position: { x: 10, y: 20 },
      assignees: [],
    });

    const state = useCanvasStore.getState();
    expect(state.canvas!.nodes).toHaveLength(1);
    const tempId = state.canvas!.nodes[0].id;
    expect(state.pendingChanges.has(tempId)).toBe(true);
    expect(state.localOnlyNodeIds.has(tempId)).toBe(true);
  });
});

describe('sliceMetricByDimensions', () => {
  it('persists dimension cards, relationships, and the parent rewrite', async () => {
    const dbIds = [DB_ID_1, DB_ID_2];
    let created = 0;
    vi.mocked(createMetricCard).mockImplementation(async (card) => ({
      ...card,
      id: dbIds[created++],
    }));
    vi.mocked(createRelationship).mockImplementation(async (rel) => ({
      ...rel,
      id: `rel-${rel.sourceId}`,
    }));
    vi.mocked(updateMetricCard).mockResolvedValue(makeNode(PARENT));

    const parent = makeNode(PARENT, { title: 'Revenue' });
    useCanvasStore.setState({ canvas: makeCanvas([parent]) });

    const ids = await useCanvasStore
      .getState()
      .sliceMetricByDimensions(PARENT, ['US', 'EU'], 'forfeit');

    expect(ids).toEqual(dbIds);
    expect(createMetricCard).toHaveBeenCalledTimes(2);
    expect(createRelationship).toHaveBeenCalledTimes(2);
    // Relationships reference the DB-issued card ids, not client temp ids.
    expect(vi.mocked(createRelationship).mock.calls[0][0].sourceId).toBe(
      dbIds[0]
    );
    expect(vi.mocked(createRelationship).mock.calls[0][0].targetId).toBe(
      PARENT
    );
    // Parent rewrite persisted with a formula built from the DB ids.
    expect(updateMetricCard).toHaveBeenCalledWith(
      PARENT,
      expect.objectContaining({
        sourceType: 'Calculated',
        formula: `[${dbIds[0]}].value + [${dbIds[1]}].value`,
        data: [],
      }),
      expect.anything()
    );

    const state = useCanvasStore.getState();
    expect(state.canvas!.nodes.map((n) => n.id)).toEqual(
      expect.arrayContaining([PARENT, ...dbIds])
    );
    expect(state.canvas!.edges).toHaveLength(2);
    const parentNode = state.canvas!.nodes.find((n) => n.id === PARENT)!;
    expect(parentNode.formula).toBe(
      `[${dbIds[0]}].value + [${dbIds[1]}].value`
    );
    expect(parentNode.sourceType).toBe('Calculated');
  });

  it('leaves local state untouched when persistence fails', async () => {
    vi.mocked(createMetricCard).mockRejectedValue(new Error('rls denied'));
    const parent = makeNode(PARENT);
    useCanvasStore.setState({ canvas: makeCanvas([parent]) });

    await expect(
      useCanvasStore.getState().sliceMetricByDimensions(PARENT, ['US'], 'manual')
    ).rejects.toThrow('rls denied');

    const state = useCanvasStore.getState();
    expect(state.canvas!.nodes).toHaveLength(1);
    expect(state.canvas!.edges).toHaveLength(0);
    expect(state.canvas!.nodes[0].sourceType).toBeUndefined();
  });
});
