import { describe, expect, it } from 'vitest';
import {
  summarizeStrengthTrend,
  toStrengthTrend,
  type RelationshipHistoryPoint,
} from './relationshipHistory';

const pt = (weight: number | null, createdAt = ''): RelationshipHistoryPoint => ({
  id: Math.random().toString(36).slice(2),
  relationshipId: 'r',
  projectId: 'p',
  type: 'Probabilistic',
  confidence: 'Medium',
  weight,
  changedBy: 'u',
  createdAt,
});

describe('toStrengthTrend', () => {
  it('extracts the weight series, dropping null-weight snapshots', () => {
    expect(toStrengthTrend([pt(10), pt(null), pt(30), pt(25)])).toEqual([10, 30, 25]);
  });
  it('is empty when no snapshot recorded a strength', () => {
    expect(toStrengthTrend([pt(null), pt(null)])).toEqual([]);
  });
});

describe('summarizeStrengthTrend', () => {
  it('reports first/current/delta and an upward direction', () => {
    const s = summarizeStrengthTrend([pt(10), pt(20), pt(35)]);
    expect(s).toMatchObject({ points: 3, first: 10, current: 35, delta: 25, direction: 'up' });
  });
  it('detects a downward move', () => {
    expect(summarizeStrengthTrend([pt(50), pt(20)]).direction).toBe('down');
  });
  it('flat when unchanged or single point', () => {
    expect(summarizeStrengthTrend([pt(40)]).direction).toBe('flat');
    expect(summarizeStrengthTrend([pt(40), pt(40)]).direction).toBe('flat');
  });
  it('none when there is no strength history', () => {
    expect(summarizeStrengthTrend([pt(null)])).toMatchObject({ points: 0, direction: 'none', current: null });
  });
});
