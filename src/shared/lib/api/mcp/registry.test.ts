import { describe, it, expect, vi, beforeEach } from 'vitest';

// Shared fake API so we can assert the registry dispatches to the CVS-98 layer.
const { fakeApi } = vi.hoisted(() => ({
  fakeApi: {
    canvases: {
      list: vi.fn(async () => ['c1']),
      get: vi.fn(async () => ({ id: 'p' })),
      create: vi.fn(async () => ({ id: 'new' })),
      update: vi.fn(async () => ({ id: 'p' })),
      delete: vi.fn(async () => undefined),
    },
    nodes: {
      createMetric: vi.fn(async () => ({ id: 'n' })),
      createValue: vi.fn(async () => ({ id: 'v' })),
      createAction: vi.fn(async () => ({ id: 'a' })),
      createDriver: vi.fn(async () => ({ id: 'd' })),
      update: vi.fn(async () => ({ id: 'n' })),
      delete: vi.fn(async () => undefined),
      list: vi.fn(async () => []),
    },
    relationships: {
      create: vi.fn(async () => ({ id: 'r' })),
      delete: vi.fn(async () => undefined),
      list: vi.fn(async () => []),
    },
    tree: {
      get: vi.fn(async (pid: string) => ({ projectId: pid, cards: [], relationships: [] })),
      layout: vi.fn(async (pid: string) => ({ projectId: pid, count: 0, positions: [] })),
    },
    values: { push: vi.fn(async () => undefined) },
    ingest: {
      stageSeries: vi.fn(async () => ({ batchId: 'b', kind: 'series', rowCount: 1 })),
      uploadCsv: vi.fn(async () => ({ batchId: 'b', kind: 'csv', columns: [], rowCount: 0 })),
      materialize: vi.fn(async () => ({ batchId: 'b', cardId: 'c', materialized: 1, skipped: 0, errors: [] })),
    },
  },
}));

vi.mock('../metrimapApi', () => ({ createMetrimapApi: vi.fn(() => fakeApi) }));

import { TOOLS, listTools, dispatchTool } from './registry';
import { McpToolError } from './errors';
import type { McpAuthContext } from './authContext';

const ctx = (scopes?: ('read' | 'write')[]): McpAuthContext => ({
  userId: 'u1',
  client: {} as never,
  scopes,
});
const PROJECT = '11111111-1111-1111-1111-111111111111';
const NODE_A = '22222222-2222-2222-2222-222222222222';
const NODE_B = '33333333-3333-3333-3333-333333333333';

beforeEach(() => vi.clearAllMocks());

describe('registry metadata', () => {
  it('exposes uniquely-named tools, each with a description + schema', () => {
    const names = TOOLS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    for (const t of TOOLS) {
      expect(t.description.length).toBeGreaterThan(0);
      expect(t.inputSchema).toBeDefined();
      expect(['read', 'write']).toContain(t.scope);
    }
    expect(names).toEqual(
      expect.arrayContaining([
        'list_canvases', 'create_canvas', 'get_tree', 'create_metric',
        'create_driver_node', 'create_relationship', 'push_values', 'layout_tree',
        'upload_csv', 'materialize', 'stage_series',
      ])
    );
  });
  it('listTools mirrors the registry', () => {
    expect(listTools().map((t) => t.name)).toEqual(TOOLS.map((t) => t.name));
  });
});

describe('dispatchTool', () => {
  it('routes a valid call to the API layer and returns the result', async () => {
    const out = await dispatchTool('create_canvas', { name: 'My Tree' }, ctx());
    expect(fakeApi.canvases.create).toHaveBeenCalledWith({ name: 'My Tree' });
    expect(out).toEqual({ id: 'new' });
  });

  it('routes create_metric to nodes.createMetric', async () => {
    await dispatchTool('create_metric', { projectId: PROJECT, title: 'MRR' }, ctx());
    expect(fakeApi.nodes.createMetric).toHaveBeenCalledWith({ projectId: PROJECT, title: 'MRR' });
  });

  it('routes get_tree to tree.get', async () => {
    const out = await dispatchTool('get_tree', { projectId: PROJECT }, ctx());
    expect(fakeApi.tree.get).toHaveBeenCalledWith(PROJECT);
    expect(out).toMatchObject({ projectId: PROJECT });
  });

  it('routes create_driver_node to nodes.createDriver', async () => {
    await dispatchTool('create_driver_node', { projectId: PROJECT, title: 'Signups' }, ctx());
    expect(fakeApi.nodes.createDriver).toHaveBeenCalledWith({ projectId: PROJECT, title: 'Signups' });
  });

  it('routes layout_tree to tree.layout with direction', async () => {
    await dispatchTool('layout_tree', { projectId: PROJECT, direction: 'LR' }, ctx());
    expect(fakeApi.tree.layout).toHaveBeenCalledWith(PROJECT, 'LR');
  });

  it('routes materialize to ingest.materialize', async () => {
    await dispatchTool('materialize', { batchId: PROJECT, mapping: { cardId: NODE_A } }, ctx());
    expect(fakeApi.ingest.materialize).toHaveBeenCalledWith({ batchId: PROJECT, mapping: { cardId: NODE_A } });
  });

  it('splits id + patch for update_node', async () => {
    await dispatchTool('update_node', { id: NODE_A, title: 'renamed' }, ctx());
    expect(fakeApi.nodes.update).toHaveBeenCalledWith(NODE_A, { title: 'renamed' });
  });

  it('throws not_found for an unknown tool', async () => {
    await expect(dispatchTool('nope', {}, ctx())).rejects.toMatchObject({
      name: 'McpToolError',
      code: 'not_found',
    });
  });

  it('throws invalid_input (with issues) for bad args', async () => {
    const err = (await dispatchTool('create_canvas', { name: '' }, ctx()).catch(
      (e) => e
    )) as McpToolError;
    expect(err).toBeInstanceOf(McpToolError);
    expect(err.code).toBe('invalid_input');
    expect(err.details).toBeTruthy();
    expect(fakeApi.canvases.create).not.toHaveBeenCalled();
  });

  it('enforces the write scope', async () => {
    await expect(dispatchTool('create_canvas', { name: 'x' }, ctx(['read']))).rejects.toMatchObject({
      code: 'forbidden',
    });
    // read tools are allowed with only the read scope
    await expect(dispatchTool('list_canvases', {}, ctx(['read']))).resolves.toEqual(['c1']);
  });

  it('wraps downstream failures as internal', async () => {
    fakeApi.relationships.create.mockRejectedValueOnce(new Error('db exploded'));
    const err = (await dispatchTool(
      'create_relationship',
      { projectId: PROJECT, sourceId: NODE_A, targetId: NODE_B, type: 'Causal' },
      ctx()
    ).catch((e) => e)) as McpToolError;
    expect(err).toBeInstanceOf(McpToolError);
    expect(err.code).toBe('internal');
    expect(err.message).toMatch(/db exploded/);
  });
});
