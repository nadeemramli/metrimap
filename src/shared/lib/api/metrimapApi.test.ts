import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the domain services so we can assert the facade validates inputs and
// delegates with the mapped args + the injected (RLS-scoped) client.
vi.mock('@/shared/lib/supabase/services/projects', () => ({
  getUserProjects: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));
vi.mock('@/shared/lib/supabase/services/metric-cards', () => ({
  createMetricCard: vi.fn(),
  updateMetricCard: vi.fn(),
  deleteMetricCard: vi.fn(),
  getProjectMetricCards: vi.fn(async () => [{ id: 'c1' }]),
}));
vi.mock('@/shared/lib/supabase/services/relationships', () => ({
  createRelationship: vi.fn(),
  deleteRelationship: vi.fn(),
  getProjectRelationships: vi.fn(async () => [{ id: 'r1' }]),
}));
vi.mock('@/shared/lib/supabase/services/trackedMetrics', () => ({
  writeMetricValues: vi.fn(),
}));

import { createMetrimapApi, API_VERSION } from './metrimapApi';
import * as projects from '@/shared/lib/supabase/services/projects';
import * as cards from '@/shared/lib/supabase/services/metric-cards';
import * as rels from '@/shared/lib/supabase/services/relationships';
import * as tracked from '@/shared/lib/supabase/services/trackedMetrics';

const client = { __authed: true } as never;
const USER = 'user_123';
const PROJECT = '11111111-1111-1111-1111-111111111111';
const NODE_A = '22222222-2222-2222-2222-222222222222';
const NODE_B = '33333333-3333-3333-3333-333333333333';

beforeEach(() => vi.clearAllMocks());

describe('createMetrimapApi — RLS-scoping guards', () => {
  it('throws without an authenticated client', () => {
    expect(() => createMetrimapApi(null as never, USER)).toThrow(/authenticated Supabase client/i);
  });
  it('throws without a userId', () => {
    expect(() => createMetrimapApi(client, '  ')).toThrow(/userId/i);
  });
  it('is versioned', () => {
    expect(createMetrimapApi(client, USER).version).toBe(API_VERSION);
  });
});

describe('canvases', () => {
  it('create maps to createProject with created_by + defaults, passing the client', () => {
    const api = createMetrimapApi(client, USER);
    api.canvases.create({ name: 'My Tree' });
    expect(projects.createProject).toHaveBeenCalledWith(
      { name: 'My Tree', description: null, is_public: false, created_by: USER },
      client
    );
  });
  it('create rejects an empty name (validation)', () => {
    const api = createMetrimapApi(client, USER);
    expect(() => api.canvases.create({ name: '' })).toThrow();
  });
  it('update maps isPublic -> is_public and omits absent fields', () => {
    const api = createMetrimapApi(client, USER);
    api.canvases.update(PROJECT, { isPublic: true });
    expect(projects.updateProject).toHaveBeenCalledWith(PROJECT, { is_public: true }, client);
  });
});

describe('nodes', () => {
  it('createMetric builds a Data/Metric card and delegates with projectId + userId + client', () => {
    const api = createMetrimapApi(client, USER);
    api.nodes.createMetric({ projectId: PROJECT, title: 'MRR' });
    expect(cards.createMetricCard).toHaveBeenCalledTimes(1);
    const [card, projectId, userId, passedClient] = vi.mocked(cards.createMetricCard).mock.calls[0];
    expect(card).toMatchObject({ title: 'MRR', category: 'Data/Metric', causalFactors: [], dimensions: [] });
    expect(projectId).toBe(PROJECT);
    expect(userId).toBe(USER);
    expect(passedClient).toBe(client);
  });
  it('createAction / createValue set their categories', () => {
    const api = createMetrimapApi(client, USER);
    api.nodes.createValue({ projectId: PROJECT, title: 'Profit' });
    api.nodes.createAction({ projectId: PROJECT, title: 'Ship feature' });
    expect(vi.mocked(cards.createMetricCard).mock.calls[0][0].category).toBe('Core/Value');
    expect(vi.mocked(cards.createMetricCard).mock.calls[1][0].category).toBe('Work/Action');
  });
  it('create rejects an unknown category', () => {
    const api = createMetrimapApi(client, USER);
    expect(() =>
      api.nodes.create({ projectId: PROJECT, title: 'x', category: 'Nope' } as never)
    ).toThrow();
  });
});

describe('relationships', () => {
  it('create builds a typed relationship with defaults and delegates', () => {
    const api = createMetrimapApi(client, USER);
    api.relationships.create({ projectId: PROJECT, sourceId: NODE_A, targetId: NODE_B, type: 'Causal' });
    const [rel, projectId, userId] = vi.mocked(rels.createRelationship).mock.calls[0];
    expect(rel).toMatchObject({ sourceId: NODE_A, targetId: NODE_B, type: 'Causal', confidence: 'Medium', evidence: [] });
    expect(projectId).toBe(PROJECT);
    expect(userId).toBe(USER);
  });
  it('create rejects an invalid relationship type', () => {
    const api = createMetrimapApi(client, USER);
    expect(() =>
      api.relationships.create({ projectId: PROJECT, sourceId: NODE_A, targetId: NODE_B, type: 'Bogus' } as never)
    ).toThrow();
  });
});

describe('tree.get', () => {
  it('composes cards + relationships for a project', async () => {
    const api = createMetrimapApi(client, USER);
    const tree = await api.tree.get(PROJECT);
    expect(tree).toEqual({ projectId: PROJECT, cards: [{ id: 'c1' }], relationships: [{ id: 'r1' }] });
    expect(cards.getProjectMetricCards).toHaveBeenCalledWith(PROJECT, client);
    expect(rels.getProjectRelationships).toHaveBeenCalledWith(PROJECT, client);
  });
});

describe('values.push', () => {
  it('fills change_percent/trend defaults and upserts the series', () => {
    const api = createMetrimapApi(client, USER);
    api.values.push({ trackedMetricId: PROJECT, series: [{ period: '2026-01', value: 10 }], source: 'agent' });
    expect(tracked.writeMetricValues).toHaveBeenCalledWith(
      PROJECT,
      [{ period: '2026-01', value: 10, change_percent: 0, trend: 'neutral' }],
      'agent',
      client
    );
  });
  it('rejects an empty series', () => {
    const api = createMetrimapApi(client, USER);
    expect(() => api.values.push({ trackedMetricId: PROJECT, series: [] })).toThrow();
  });
});
