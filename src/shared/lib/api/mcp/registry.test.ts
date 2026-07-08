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
      createHypothesis: vi.fn(async () => ({ id: 'h' })),
      createDriver: vi.fn(async () => ({ id: 'd' })),
      update: vi.fn(async () => ({ id: 'n' })),
      delete: vi.fn(async () => ({ deleted: 1 })),
      list: vi.fn(async () => []),
    },
    relationships: {
      create: vi.fn(async () => ({ id: 'r' })),
      update: vi.fn(async () => ({ id: 'r' })),
      delete: vi.fn(async () => ({ deleted: 1 })),
      list: vi.fn(async () => []),
    },
    evidence: {
      create: vi.fn(async () => ({ id: 'ev' })),
      list: vi.fn(async () => []),
      update: vi.fn(async () => ({ id: 'ev' })),
    },
    tags: {
      list: vi.fn(async () => []),
      create: vi.fn(async () => ({ id: 't' })),
      tagCard: vi.fn(async () => ['growth']),
      untagCard: vi.fn(async () => ['growth']),
    },
    catalog: {
      listTracked: vi.fn(async () => []),
      listCandidates: vi.fn(async () => []),
      promote: vi.fn(async () => ({ trackedMetricId: 'tm' })),
      values: vi.fn(async () => []),
    },
    comments: {
      list: vi.fn(async () => []),
      create: vi.fn(async () => ({ threadId: 'th', comment: { id: 'cm' } })),
    },
    dashboards: {
      list: vi.fn(async () => ({ widgets: [], groups: [] })),
    },
    groups: {
      list: vi.fn(async () => []),
      create: vi.fn(async () => ({ id: 'g', node_ids: ['a', 'b'] })),
      update: vi.fn(async () => ({ id: 'g', node_ids: ['a'] })),
      addCards: vi.fn(async () => ({ id: 'g', node_ids: ['a', 'b', 'c'] })),
      removeCards: vi.fn(async () => ({ id: 'g', node_ids: ['a'] })),
      delete: vi.fn(async () => ({ deleted: 1 })),
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
import { RateLimiter } from './guards';
import type { AuditSink } from './audit';
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
        'create_driver_node', 'create_relationship', 'create_evidence',
        'push_values', 'layout_tree',
        'upload_csv', 'materialize', 'stage_series',
      ])
    );
  });
  it('listTools mirrors the registry', () => {
    expect(listTools().map((t) => t.name)).toEqual(TOOLS.map((t) => t.name));
  });
  it('every tool carries spec-consistent annotations', () => {
    for (const t of listTools()) {
      expect(t.annotations, t.name).toBeDefined();
      if (t.scope === 'read') {
        expect(t.annotations.readOnlyHint, t.name).toBe(true);
      } else {
        expect(t.annotations.readOnlyHint, t.name).toBe(false);
        expect(typeof t.annotations.destructiveHint, t.name).toBe('boolean');
      }
    }
    const hint = (name: string) =>
      TOOLS.find((t) => t.name === name)!.annotations;
    // Creates are additive; deletes/overwrites stay destructive.
    expect(hint('create_canvas').destructiveHint).toBe(false);
    expect(hint('create_evidence').destructiveHint).toBe(false);
    expect(hint('delete_canvas').destructiveHint).toBe(true);
    expect(hint('delete_node').destructiveHint).toBe(true);
    expect(hint('update_node').destructiveHint).toBe(true);
    expect(hint('list_canvases').readOnlyHint).toBe(true);
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

  it('routes create_evidence to evidence.create (card target)', async () => {
    const input = {
      projectId: PROJECT,
      cardId: NODE_A,
      title: 'Ran an A/B test',
      type: 'Experiment',
      summary: 'Variant B lifted conversion',
    };
    const out = await dispatchTool('create_evidence', input, ctx(['write']));
    expect(fakeApi.evidence.create).toHaveBeenCalledWith(input);
    expect(out).toEqual({ id: 'ev' });
  });

  it('routes create_hypothesis to nodes.createHypothesis', async () => {
    await dispatchTool('create_hypothesis', { projectId: PROJECT, title: 'H1' }, ctx());
    expect(fakeApi.nodes.createHypothesis).toHaveBeenCalled();
  });
  it('splits id + patch for update_relationship', async () => {
    await dispatchTool('update_relationship', { id: NODE_A, weight: 0.7 }, ctx());
    expect(fakeApi.relationships.update).toHaveBeenCalledWith(NODE_A, { weight: 0.7 });
  });
  it('routes general (target-less) create_evidence to evidence.create', async () => {
    await dispatchTool(
      'create_evidence',
      { projectId: PROJECT, title: 'E', type: 'Analysis', summary: 's' },
      ctx()
    );
    expect(fakeApi.evidence.create).toHaveBeenCalled();
  });
  it('routes list_evidence and update_evidence', async () => {
    await dispatchTool('list_evidence', { projectId: PROJECT, cardId: NODE_A }, ctx());
    expect(fakeApi.evidence.list).toHaveBeenCalledWith({ projectId: PROJECT, cardId: NODE_A });
    await dispatchTool('update_evidence', { id: NODE_A, summary: 's2' }, ctx());
    expect(fakeApi.evidence.update).toHaveBeenCalledWith(NODE_A, { summary: 's2' });
  });
  it('routes tag tools to the tags namespace', async () => {
    await dispatchTool('list_tags', { projectId: PROJECT }, ctx());
    expect(fakeApi.tags.list).toHaveBeenCalledWith(PROJECT);
    await dispatchTool('create_tag', { projectId: PROJECT, name: 'growth' }, ctx());
    expect(fakeApi.tags.create).toHaveBeenCalled();
    await dispatchTool('tag_card', { cardId: NODE_A, tags: ['growth'] }, ctx());
    expect(fakeApi.tags.tagCard).toHaveBeenCalledWith({ cardId: NODE_A, tags: ['growth'] });
    await dispatchTool('untag_card', { cardId: NODE_A, tags: ['growth'] }, ctx());
    expect(fakeApi.tags.untagCard).toHaveBeenCalled();
  });
  it('routes catalog tools (discovery unblocks push_values)', async () => {
    await dispatchTool('list_tracked_metrics', {}, ctx());
    expect(fakeApi.catalog.listTracked).toHaveBeenCalled();
    await dispatchTool('list_candidate_cards', {}, ctx());
    expect(fakeApi.catalog.listCandidates).toHaveBeenCalled();
    await dispatchTool('promote_card', { cardId: NODE_A, name: 'MRR' }, ctx());
    expect(fakeApi.catalog.promote).toHaveBeenCalled();
    await dispatchTool('get_metric_values', { trackedMetricId: NODE_B }, ctx());
    expect(fakeApi.catalog.values).toHaveBeenCalledWith({ trackedMetricId: NODE_B });
  });
  it('routes comments + dashboards + groups reads', async () => {
    await dispatchTool('list_comments', { projectId: PROJECT }, ctx());
    expect(fakeApi.comments.list).toHaveBeenCalledWith(PROJECT);
    await dispatchTool(
      'create_comment',
      { projectId: PROJECT, content: 'hi', cardId: NODE_A },
      ctx()
    );
    expect(fakeApi.comments.create).toHaveBeenCalled();
    await dispatchTool('list_dashboards', { projectId: PROJECT }, ctx());
    expect(fakeApi.dashboards.list).toHaveBeenCalledWith(PROJECT);
    await dispatchTool('list_groups', { projectId: PROJECT }, ctx());
    expect(fakeApi.groups.list).toHaveBeenCalledWith(PROJECT);
  });
  it('routes the group write tools (create/update/membership/delete)', async () => {
    await dispatchTool(
      'create_group',
      { projectId: PROJECT, name: 'Funnel', nodeIds: [NODE_A, NODE_B] },
      ctx()
    );
    expect(fakeApi.groups.create).toHaveBeenCalled();
    await dispatchTool('update_group', { id: NODE_A, name: 'Funnel v2' }, ctx());
    expect(fakeApi.groups.update).toHaveBeenCalledWith(NODE_A, {
      name: 'Funnel v2',
    });
    await dispatchTool(
      'add_cards_to_group',
      { groupId: NODE_A, nodeIds: [NODE_B] },
      ctx()
    );
    expect(fakeApi.groups.addCards).toHaveBeenCalled();
    await dispatchTool(
      'remove_cards_from_group',
      { groupId: NODE_A, nodeIds: [NODE_B] },
      ctx()
    );
    expect(fakeApi.groups.removeCards).toHaveBeenCalled();
    await expect(
      dispatchTool('delete_group', { id: NODE_A }, ctx())
    ).resolves.toEqual({ ok: true, id: NODE_A });
  });
  it('delete_node returns an explicit result and not_found on zero rows', async () => {
    await expect(
      dispatchTool('delete_node', { id: NODE_A }, ctx())
    ).resolves.toEqual({ ok: true, id: NODE_A });
    fakeApi.nodes.delete.mockResolvedValueOnce({ deleted: 0 });
    await expect(
      dispatchTool('delete_node', { id: NODE_A }, ctx())
    ).rejects.toMatchObject({ code: 'not_found' });
  });
  it('internal errors from thrown plain objects stay readable', async () => {
    fakeApi.nodes.createMetric.mockRejectedValueOnce({
      message: 'column x does not exist',
      code: 'PGRST204',
    });
    await expect(
      dispatchTool('create_metric', { projectId: PROJECT, title: 'T' }, ctx())
    ).rejects.toMatchObject({ message: 'column x does not exist' });
  });
  it('rejects create_evidence with BOTH card and relationship targets', async () => {
    await expect(
      dispatchTool(
        'create_evidence',
        {
          projectId: PROJECT,
          cardId: NODE_A,
          relationshipId: NODE_B,
          title: 'E',
          type: 'Analysis',
          summary: 's',
        },
        ctx()
      )
    ).rejects.toMatchObject({ code: 'invalid_input' });
  });
  it('accepts target-less create_evidence as general project evidence', async () => {
    await dispatchTool(
      'create_evidence',
      { projectId: PROJECT, title: 'x', type: 'Analysis', summary: 'y' },
      ctx(['write'])
    );
    expect(fakeApi.evidence.create).toHaveBeenCalled();
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

  it('tolerates extra/metadata keys on a no-param tool (connector sends them)', async () => {
    // Regression: list_canvases used `.strict()`, so the SDK/claude.ai connector
    // attaching metadata keys to a no-arg call produced invalid_input. Unknown
    // keys must be stripped, not rejected.
    await expect(
      dispatchTool('list_canvases', { _meta: { progressToken: 1 }, foo: 'bar' }, ctx())
    ).resolves.toEqual(['c1']);
    expect(fakeApi.canvases.list).toHaveBeenCalled();
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

describe('dispatchTool guards (CVS-104)', () => {
  it('rate-limits per user', async () => {
    const rateLimiter = new RateLimiter(1, 0); // one call, no refill
    await dispatchTool('list_canvases', {}, ctx(), { rateLimiter });
    await expect(dispatchTool('list_canvases', {}, ctx(), { rateLimiter })).rejects.toMatchObject({
      code: 'rate_limited',
    });
  });

  it('rejects oversized payloads', async () => {
    await expect(
      dispatchTool('create_canvas', { name: 'a-fairly-long-name' }, ctx(), { maxPayloadBytes: 5 })
    ).rejects.toMatchObject({ code: 'payload_too_large' });
  });

  it('records an ok audit entry on success', async () => {
    const audit: AuditSink = { record: vi.fn(async () => {}) };
    await dispatchTool('create_canvas', { name: 'Tree' }, ctx(), { audit });
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', tool: 'create_canvas', scope: 'write', outcome: 'ok', errorCode: null })
    );
  });

  it('records an error audit entry on invalid input', async () => {
    const audit: AuditSink = { record: vi.fn(async () => {}) };
    await dispatchTool('create_canvas', { name: '' }, ctx(), { audit }).catch(() => {});
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({ tool: 'create_canvas', outcome: 'error', errorCode: 'invalid_input' })
    );
  });
});
