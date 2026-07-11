import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MetricCard, MetricValue } from '@/shared/types';

const persistNodeUpdate = vi.fn();
let mockNodes: MetricCard[] = [];

vi.mock('@/features/canvas/stores/useCanvasStore', () => ({
  useCanvasStore: {
    getState: () => ({
      canvas: { nodes: mockNodes },
      persistNodeUpdate,
    }),
  },
}));

const mockCardValues = new Map<string, number>();
vi.mock('@/features/canvas/utils/computePipeline', () => ({
  computePipeline: vi.fn(async () => ({
    operatorValues: new Map<string, number>(),
    cardValues: mockCardValues,
    warnings: [] as string[],
  })),
}));

import { runPipeline } from './runSimulation';

function card(id: string, title: string, data: MetricValue[]): MetricCard {
  return { id, title, data } as MetricCard;
}

describe('runPipeline', () => {
  beforeEach(() => {
    persistNodeUpdate.mockReset();
    persistNodeUpdate.mockResolvedValue(undefined);
    mockCardValues.clear();
    mockNodes = [];
  });

  it('appends a new period point comparing against the previous period', async () => {
    mockNodes = [
      card('c1', 'MRR', [
        { period: '2026-06', value: 100, change_percent: 0, trend: 'neutral' },
      ]),
    ];
    mockCardValues.set('c1', 110);

    const res = await runPipeline([], { period: '2026-07' });

    expect(res.updated).toBe(1);
    expect(res.changes[0].before).toBe(100);
    const persisted = persistNodeUpdate.mock.calls[0][1].data as MetricValue[];
    expect(persisted).toHaveLength(2);
    expect(persisted[1]).toEqual({
      period: '2026-07',
      value: 110,
      change_percent: 10,
      trend: 'up',
    });
  });

  it('keeps the prior-period baseline when re-running in the same period', async () => {
    mockNodes = [
      card('c1', 'MRR', [
        { period: '2026-06', value: 100, change_percent: 0, trend: 'neutral' },
        { period: '2026-07', value: 110, change_percent: 10, trend: 'up' },
      ]),
    ];
    mockCardValues.set('c1', 110);

    const res = await runPipeline([], { period: '2026-07' });

    // Baseline must be June (100), not the July point being replaced (110).
    expect(res.changes[0].before).toBe(100);
    const persisted = persistNodeUpdate.mock.calls[0][1].data as MetricValue[];
    expect(persisted).toHaveLength(2);
    expect(persisted[1]).toEqual({
      period: '2026-07',
      value: 110,
      change_percent: 10,
      trend: 'up',
    });
  });

  it('uses a null baseline when replacing the only point in the series', async () => {
    mockNodes = [
      card('c1', 'MRR', [
        { period: '2026-07', value: 110, change_percent: 0, trend: 'neutral' },
      ]),
    ];
    mockCardValues.set('c1', 120);

    const res = await runPipeline([], { period: '2026-07' });

    expect(res.changes[0].before).toBeNull();
    const persisted = persistNodeUpdate.mock.calls[0][1].data as MetricValue[];
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toEqual({
      period: '2026-07',
      value: 120,
      change_percent: 0,
      trend: 'neutral',
    });
  });
});
