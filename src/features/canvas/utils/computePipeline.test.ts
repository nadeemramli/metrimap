import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MetricCard, MetricValue } from '@/shared/types';
import type { OperatorNodeData } from '@/features/canvas/types/operator';

let mockCards: MetricCard[] = [];
let mockOperators: Array<{ id: string; data: OperatorNodeData }> = [];
let mockSources: Array<{ id: string; title?: string; data: unknown }> = [];

vi.mock('@/features/canvas/stores/useCanvasStore', () => ({
  useCanvasStore: {
    getState: () => ({ canvas: { nodes: mockCards } }),
  },
}));

vi.mock('@/features/canvas/stores/useCanvasNodesStore', () => ({
  useCanvasNodesStore: {
    getState: () => ({
      getNodesByType: (type: string) =>
        type === 'operatorNode'
          ? mockOperators
          : type === 'sourceNode'
            ? mockSources
            : [],
    }),
  },
}));

const { calculateCorrelation, calculateRegression } = vi.hoisted(() => ({
  calculateCorrelation: vi.fn(async (_a: number[], _b: number[]) => 0.5),
  calculateRegression: vi.fn(async (_pairs: [number, number][]) => ({
    slope: 2,
    intercept: 0,
    rSquared: 1,
  })),
}));
vi.mock('@/lib/workers/worker-manager', () => ({
  workerManager: {
    calculateCorrelation,
    calculateRegression,
    calculateMovingAverage: vi.fn(async (series: number[]) => series),
    evaluateFormula: vi.fn(async () => 0),
  },
}));

import { computePipeline, type DataFlowEdge } from './computePipeline';

function point(period: string, value: number): MetricValue {
  return { period, value, change_percent: 0, trend: 'neutral' };
}

function card(id: string, title: string, data: MetricValue[]): MetricCard {
  return { id, title, data } as MetricCard;
}

function correlationOp(id: string): { id: string; data: OperatorNodeData } {
  return {
    id,
    data: {
      label: 'Corr',
      operationType: 'statistical',
      isActive: true,
      inputs: [
        { key: 'a', sourceId: 'cardA', label: 'A' },
        { key: 'b', sourceId: 'cardB', label: 'B' },
      ],
      statistic: { method: 'correlation', xKey: 'a', yKey: 'b' },
    },
  };
}

const edges: DataFlowEdge[] = [
  { id: 'e1', source: 'cardA', target: 'op1' },
  { id: 'e2', source: 'cardB', target: 'op1' },
];

describe('computePipeline statistical alignment', () => {
  beforeEach(() => {
    mockCards = [];
    mockOperators = [];
    mockSources = [];
    calculateCorrelation.mockClear();
    calculateRegression.mockClear();
  });

  it('joins unequal-length card histories on period, keeping only shared periods', async () => {
    const months = [
      '2026-01',
      '2026-02',
      '2026-03',
      '2026-04',
      '2026-05',
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
      '2026-10',
      '2026-11',
      '2026-12',
    ];
    mockCards = [
      card('cardA', 'A', months.map((m, i) => point(m, i + 1))), // Jan–Dec: 1..12
      card('cardB', 'B', months.slice(6).map((m, i) => point(m, (i + 1) * 10))), // Jul–Dec: 10..60
    ];
    mockOperators = [correlationOp('op1')];

    const res = await computePipeline(edges);

    expect(res.warnings).toEqual([]);
    // Only the 6 shared periods (Jul–Dec) pair up: A's 7..12 with B's 10..60.
    expect(calculateCorrelation).toHaveBeenCalledWith(
      [7, 8, 9, 10, 11, 12],
      [10, 20, 30, 40, 50, 60]
    );
  });

  it('skips with a warning when the two series share fewer than 2 periods', async () => {
    mockCards = [
      card('cardA', 'A', [point('2026-01', 1), point('2026-02', 2)]),
      card('cardB', 'B', [point('2026-07', 10), point('2026-08', 20)]),
    ];
    mockOperators = [correlationOp('op1')];

    const res = await computePipeline(edges);

    expect(calculateCorrelation).not.toHaveBeenCalled();
    expect(res.warnings.some((w) => w.includes('needs two ≥2-point series'))).toBe(
      true
    );
  });

  it('tail-aligns the most recent points when one input has no periods', async () => {
    mockCards = [
      card('cardA', 'A', [
        point('2026-01', 1),
        point('2026-02', 2),
        point('2026-03', 3),
        point('2026-04', 4),
      ]),
    ];
    mockSources = [
      { id: 'cardB', data: { series: [{ value: 10 }, { value: 20 }] } },
    ];
    mockOperators = [correlationOp('op1')];

    const res = await computePipeline(edges);

    expect(res.warnings).toEqual([]);
    // The most recent 2 points of A pair with B's 2 points (not A's oldest 2).
    expect(calculateCorrelation).toHaveBeenCalledWith([3, 4], [10, 20]);
  });
});
