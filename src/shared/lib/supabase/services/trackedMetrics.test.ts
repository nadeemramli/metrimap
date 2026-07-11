import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// The redacting-view probe is irrelevant to these tests (the fake client models
// only the real query chains), so pin the read source to the base table.
vi.mock('../cardsReadSource', () => ({
  cardsReadSource: async () => 'metric_cards',
  resetCardsReadSource: () => {},
}));

import { listCandidateCards, promoteCardToTrackedMetric } from './trackedMetrics';

// Minimal fake PostgREST client covering the chains promoteCardToTrackedMetric
// uses: metric_cards select/update, tracked_metrics insert, metric_values upsert.
function makeFakeClient(existingTrackedMetricId: string | null) {
  const inserted: any[] = [];
  const cardUpdates: any[] = [];
  const client = {
    from(table: string) {
      if (table === 'metric_cards') {
        return {
          select(cols: string) {
            return {
              eq: () => ({
                single: async () =>
                  cols === 'tracked_metric_id'
                    ? {
                        data: { tracked_metric_id: existingTrackedMetricId },
                        error: null,
                      }
                    : { data: { data: [] }, error: null },
              }),
            };
          },
          update(payload: any) {
            cardUpdates.push(payload);
            return { eq: async () => ({ error: null }) };
          },
        };
      }
      if (table === 'tracked_metrics') {
        return {
          insert(payload: any) {
            inserted.push(payload);
            return {
              select: () => ({
                single: async () => ({ data: { id: 'tm-new' }, error: null }),
              }),
            };
          },
        };
      }
      if (table === 'metric_values') {
        return { upsert: async () => ({ error: null }) };
      }
      throw new Error(`unexpected table ${table}`);
    },
  };
  return { client: client as any, inserted, cardUpdates };
}

describe('promoteCardToTrackedMetric', () => {
  it('is idempotent: returns the existing id without inserting a duplicate', async () => {
    const { client, inserted, cardUpdates } = makeFakeClient('tm-existing');
    const id = await promoteCardToTrackedMetric(
      { cardId: 'card-1', name: 'MRR' },
      client
    );
    expect(id).toBe('tm-existing');
    expect(inserted).toHaveLength(0);
    expect(cardUpdates).toHaveLength(0);
  });

  it('promotes an unlinked card: inserts the catalog row and links the card', async () => {
    const { client, inserted, cardUpdates } = makeFakeClient(null);
    const id = await promoteCardToTrackedMetric(
      { cardId: 'card-1', name: 'MRR' },
      client
    );
    expect(id).toBe('tm-new');
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({ name: 'MRR', origin_card_id: 'card-1' });
    expect(cardUpdates).toEqual([{ tracked_metric_id: 'tm-new' }]);
  });
});

// Chainable Supabase mock with per-table result queues: from(table) dequeues
// the next configured result, and the builder resolves to it at any await.
type Result = { data?: unknown; error?: unknown };
function makePagedClient(queues: Record<string, Result[]>) {
  const rangeCalls: Array<{ table: string; range: [number, number] }> = [];
  const client = {
    from: (table: string) => {
      const result = queues[table]?.shift() ?? { data: [], error: null };
      const b: Record<string, unknown> = {};
      const ret = () => b;
      for (const m of ['select', 'contains', 'eq', 'is', 'order', 'in'])
        b[m] = ret;
      b.range = (from: number, to: number) => {
        rangeCalls.push({ table, range: [from, to] });
        return b;
      };
      b.then = (resolve: (r: Result) => unknown) => resolve(result);
      return b;
    },
  } as unknown as SupabaseClient<Database>;
  return { client, rangeCalls };
}

const candidateCard = (i: number, overrides: Record<string, unknown> = {}) => ({
  id: `card-${String(i).padStart(4, '0')}`,
  title: `Card ${i}`,
  project_id: 'p1',
  category: null,
  sub_category: null,
  description: null,
  source_type: null,
  formula: null,
  data: [{ period: '2026-01', value: i, change_percent: 0, trend: 'neutral' }],
  updated_at: null,
  tracked_metric_id: null,
  projects: { name: 'Canvas 1' },
  ...overrides,
});

describe('listCandidateCards', () => {
  it('pages past the 1000-row PostgREST cap instead of truncating', async () => {
    const page1 = Array.from({ length: 1000 }, (_, i) => candidateCard(i));
    const page2 = [
      candidateCard(1000),
      candidateCard(1001, { project_id: 'ex1', projects: { name: 'Example' } }),
      candidateCard(1002, { data: [] }),
    ];
    const { client, rangeCalls } = makePagedClient({
      projects: [{ data: [{ id: 'ex1' }] }],
      metric_cards: [{ data: page1 }, { data: page2 }],
    });

    const candidates = await listCandidateCards(client);

    // 1000 + 3, minus the example-project card and the empty-series card.
    expect(candidates).toHaveLength(1001);
    expect(candidates.some((c) => c.id === 'card-1000')).toBe(true);
    expect(candidates.some((c) => c.id === 'card-1001')).toBe(false);
    expect(candidates.some((c) => c.id === 'card-1002')).toBe(false);
    expect(
      rangeCalls.filter((c) => c.table === 'metric_cards').map((c) => c.range)
    ).toEqual([
      [0, 999],
      [1000, 1999],
    ]);
  });

  it('stops after one short page', async () => {
    const { client, rangeCalls } = makePagedClient({
      projects: [{ data: [] }],
      metric_cards: [{ data: [candidateCard(1)] }],
    });
    const candidates = await listCandidateCards(client);
    expect(candidates).toHaveLength(1);
    expect(rangeCalls.filter((c) => c.table === 'metric_cards')).toHaveLength(1);
  });

  it('throws on a query error instead of returning a partial list', async () => {
    const { client } = makePagedClient({
      projects: [{ data: [] }],
      metric_cards: [{ data: null, error: { message: 'boom' } }],
    });
    await expect(listCandidateCards(client)).rejects.toThrow('boom');
  });
});
