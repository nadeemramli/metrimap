// The data contract for metric values. Every path that populates a card's
// `data: MetricValue[]` (manual entry, generated sample, file, warehouse)
// resolves to the SAME shape via this module — see
// docs/backlog/data-source-architecture.md (Principle 1: define the contract first).
//
// Phase 1 ships the zero-backend paths only: `manual` and `generated`.
// `file` / `warehouse` reuse `deriveSeries` once their fetch layers exist.

import type { MetricValue } from '@/shared/types';

export type SourceOrigin = 'manual' | 'generated' | 'file' | 'warehouse';

export type Granularity =
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Quarterly'
  | 'Yearly';

/**
 * The seam everything plugs into: a resolved series for one card, plus where it
 * came from. RCA/drift read `series`; the UI reads `origin`/`refreshedAt`.
 */
export interface SourceBinding {
  cardId: string;
  series: MetricValue[];
  refreshedAt: string;
  origin: SourceOrigin;
}

/** A raw point before change/trend are derived. */
export interface RawPoint {
  period: string;
  value: number;
}

// A change smaller than this (in %) reads as flat rather than up/down — keeps
// floating-point noise from flipping the trend arrow.
const TREND_EPSILON = 0.01;

function trendFor(changePercent: number): MetricValue['trend'] {
  if (changePercent > TREND_EPSILON) return 'up';
  if (changePercent < -TREND_EPSILON) return 'down';
  return 'neutral';
}

/**
 * Fill `change_percent` and `trend` for a period-ordered list of points. This is
 * the single place that logic lives — manual edits, paste, and generation all
 * route through it so a series is never "dumb" (change/trend hard-coded to 0).
 */
export function deriveSeries(points: RawPoint[]): MetricValue[] {
  return points.map((point, index) => {
    const prev = index > 0 ? points[index - 1].value : undefined;
    let changePercent = 0;
    if (prev !== undefined && prev !== 0) {
      changePercent = ((point.value - prev) / Math.abs(prev)) * 100;
    } else if (prev === 0 && point.value !== 0) {
      // Growth from zero has no defined percentage; signal direction only.
      changePercent = point.value > 0 ? 100 : -100;
    }
    changePercent = Math.round(changePercent * 100) / 100;
    return {
      period: point.period,
      value: point.value,
      change_percent: changePercent,
      trend: trendFor(changePercent),
    };
  });
}

// --- Period labels --------------------------------------------------------
// Periods are emitted as parseable date strings so the existing chart
// (`new Date(item.period)`) keeps working.

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function isoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function stepDate(start: Date, granularity: Granularity, steps: number): Date {
  const d = new Date(start.getTime());
  switch (granularity) {
    case 'Daily':
      d.setUTCDate(d.getUTCDate() + steps);
      break;
    case 'Weekly':
      d.setUTCDate(d.getUTCDate() + steps * 7);
      break;
    case 'Monthly':
      d.setUTCMonth(d.getUTCMonth() + steps);
      break;
    case 'Quarterly':
      d.setUTCMonth(d.getUTCMonth() + steps * 3);
      break;
    case 'Yearly':
      d.setUTCFullYear(d.getUTCFullYear() + steps);
      break;
  }
  return d;
}

/**
 * Build `count` period labels ending at `anchor` (default: today, UTC), walking
 * backward by `granularity`, returned oldest-first.
 */
export function buildPeriods(
  count: number,
  granularity: Granularity,
  anchor?: Date
): string[] {
  const end = anchor ?? new Date();
  const periods: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    periods.push(isoDate(stepDate(end, granularity, -i)));
  }
  return periods;
}

// --- Deterministic generation --------------------------------------------

// Mulberry32 — a tiny seeded PRNG. Deterministic so generated samples (and their
// tests) are reproducible for a given seed.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface GenerateOptions {
  periods: number;
  granularity: Granularity;
  /** Starting value of the series. */
  start: number;
  /** Compounding growth per period as a fraction (0.05 = +5%/period). */
  growth: number;
  /** Seasonal swing as a fraction of the trend value (0 = none, 0.2 = ±20%). */
  seasonality: number;
  /** Random jitter as a fraction of the trend value (0 = smooth). */
  noise: number;
  /** Periods per seasonal cycle (e.g. 12 for monthly-yearly seasonality). */
  seasonPeriod?: number;
  /** Seed for reproducibility. */
  seed?: number;
  /** Anchor date for the latest period. */
  anchor?: Date;
}

/**
 * Generate a realistic `MetricValue[]` from a trend + seasonality + noise model.
 * Doubles as the seed/template engine (docs: "Generate sample data IS the
 * seed→template feature"). Values stay non-negative and rounded to 2 dp.
 */
export function generateSeries(options: GenerateOptions): MetricValue[] {
  const {
    periods,
    granularity,
    start,
    growth,
    seasonality,
    noise,
    seasonPeriod = 12,
    seed = 1,
    anchor,
  } = options;

  const labels = buildPeriods(periods, granularity, anchor);
  const rand = mulberry32(seed);

  const raw: RawPoint[] = labels.map((period, i) => {
    const trendValue = start * Math.pow(1 + growth, i);
    const seasonal =
      seasonality !== 0
        ? trendValue * seasonality * Math.sin((2 * Math.PI * i) / seasonPeriod)
        : 0;
    const jitter = noise !== 0 ? trendValue * noise * (rand() * 2 - 1) : 0;
    const value = Math.max(0, trendValue + seasonal + jitter);
    return { period, value: Math.round(value * 100) / 100 };
  });

  return deriveSeries(raw);
}

// --- Parsing (paste / import) --------------------------------------------

/**
 * Parse pasted CSV or JSON into a derived `MetricValue[]`.
 *
 * CSV: two columns `period,value` (a header row is auto-detected and skipped).
 * JSON: an array of `{ period, value }` (extra fields ignored) or `[period, value]` tuples.
 *
 * Throws with a human-readable message on malformed input so callers can surface it.
 */
export function parseSeries(input: string): MetricValue[] {
  const text = input.trim();
  if (!text) throw new Error('Nothing to import — paste CSV or JSON first.');

  const points =
    text.startsWith('[') || text.startsWith('{')
      ? parseJson(text)
      : parseCsv(text);

  if (points.length === 0) {
    throw new Error('No valid period/value rows found.');
  }
  return deriveSeries(points);
}

/**
 * Map query/result rows (e.g. from the warehouse proxy or a parsed file) into a
 * derived `MetricValue[]`. Each row must carry a `period` (or `date`/`x`) and a
 * `value` (or `y`). Same contract as everything else — the warehouse path is
 * just another producer.
 */
export function seriesFromRows(
  rows: Array<Record<string, unknown>>
): MetricValue[] {
  const points: RawPoint[] = rows.map((row, i) => {
    const period = row.period ?? row.date ?? row.x;
    const value = row.value ?? row.y;
    if (period === undefined || value === undefined) {
      throw new Error(
        `Row ${i + 1} is missing a "period" or "value" column. Alias your SQL columns as period and value.`
      );
    }
    return { period: String(period), value: toNumber(value, i) };
  });
  return deriveSeries(points);
}

function parseJson(text: string): RawPoint[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON.');
  }
  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of { period, value } objects.');
  }
  return parsed.map((row, i) => {
    if (Array.isArray(row)) {
      return { period: String(row[0]), value: toNumber(row[1], i) };
    }
    if (row && typeof row === 'object') {
      const obj = row as Record<string, unknown>;
      const period = obj.period ?? obj.date ?? obj.x;
      const value = obj.value ?? obj.y;
      if (period === undefined || value === undefined) {
        throw new Error(`Row ${i + 1} is missing "period" or "value".`);
      }
      return { period: String(period), value: toNumber(value, i) };
    }
    throw new Error(`Row ${i + 1} is not an object or tuple.`);
  });
}

function parseCsv(text: string): RawPoint[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Skip a header row if the second column isn't numeric.
  const first = lines[0]?.split(',') ?? [];
  const hasHeader = first.length >= 2 && isNaN(parseFloat(first[1]));
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line, i) => {
    const cols = line.split(',').map((c) => c.trim());
    if (cols.length < 2) {
      throw new Error(`Line ${i + 1} needs two columns: period,value.`);
    }
    return { period: cols[0], value: toNumber(cols[1], i) };
  });
}

function toNumber(raw: unknown, index: number): number {
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw));
  if (isNaN(n)) {
    throw new Error(`Row ${index + 1} has a non-numeric value: "${raw}".`);
  }
  return n;
}
