// Strategy impact measurement engine (CVS-174). Pure + I/O-free: given a
// contract, its metric links, and each metric's series (keyed by metricRefKey),
// compute baseline → measurement-window deltas, expected-vs-actual for the
// target, and guardrail pass/fail. Reuses the canvas time-travel primitives
// (valueAsOf) so "value as of a period" behaves identically to the rest of the app.
//
// NOT causal attribution or significance — just baseline/current comparison.

import type { MetricCard, MetricValue } from '@/shared/types';
import { metricRefKey } from './impactContract';
import type { ImpactContract, MetricLink, MetricLinkRole } from './types';

export type MetTarget = 'met' | 'missed' | 'unknown';
export type GuardrailStatus = 'pass' | 'fail' | 'unknown';
export type SuggestedResult = 'won' | 'lost' | 'inconclusive';

export interface MetricEval {
  role: MetricLinkRole;
  refKey: string | null;
  baseline: number | null;
  windowValue: number | null;
  absDelta: number | null;
  pctDelta: number | null;
  hasData: boolean;
  /** True when the series is user-entered card data, not a catalogued snapshot. */
  manual: boolean;
}

export interface GuardrailEval extends MetricEval {
  status: GuardrailStatus;
}

export interface ImpactEvaluation {
  target: MetricEval | null;
  leading: MetricEval[];
  guardrails: GuardrailEval[];
  expected: { direction: ImpactContract['expectedDirection']; value: number | null; unit: string | null } | null;
  /** Whether the target hit its expected delta. */
  met: MetTarget;
  /** Aggregate guardrail health. */
  guardrailStatus: GuardrailStatus;
  /** Suggested review outcome — never auto-applied; a failed guardrail blocks "won". */
  suggestedResult: SuggestedResult;
}

const DEFAULT_GUARDRAIL_TOLERANCE_PCT = 5;

/**
 * Representative value for a window = the last series point that actually falls
 * inside [start, end]. Requiring an in-window point (rather than the last point
 * before it) is what lets us report "no data in the measurement window" instead
 * of silently reusing the baseline value. When only `end` is set we fall back to
 * "as of end" (last point at/before it). Assumes the series is period-ascending.
 */
function windowValue(series: MetricValue[] | undefined, start: string | null, end: string | null): number | null {
  if (!Array.isArray(series) || series.length === 0) return null;
  const hi = end ?? start;
  if (!hi) return null;
  const inWindow = series.filter(
    (d) => d.period <= hi && (start ? d.period >= start : true)
  );
  return inWindow.length ? inWindow[inWindow.length - 1].value : null;
}

function evalMetric(
  link: MetricLink,
  contract: ImpactContract,
  seriesByKey: Record<string, MetricValue[]>
): MetricEval {
  const refKey = metricRefKey(link);
  const series = refKey ? seriesByKey[refKey] : undefined;
  const baseline = windowValue(series, contract.baselineStart, contract.baselineEnd);
  const windowVal = windowValue(series, contract.measureStart, contract.measureEnd);
  const hasData = baseline != null && windowVal != null;
  const absDelta = hasData ? windowVal! - baseline! : null;
  const pctDelta =
    hasData && baseline !== 0 ? (absDelta! / Math.abs(baseline!)) * 100 : null;
  return {
    role: link.role,
    refKey,
    baseline,
    windowValue: windowVal,
    absDelta,
    pctDelta,
    hasData,
    manual: link.refSource === 'card',
  };
}

function judgeMet(
  direction: ImpactContract['expectedDirection'],
  expectedVal: number | null,
  actual: number | null
): MetTarget {
  if (actual == null || !direction) return 'unknown';
  if (direction === 'stabilize') {
    const tol = expectedVal ?? 0;
    return Math.abs(actual) <= (tol || 1e-9) ? 'met' : 'missed';
  }
  const sign = direction === 'increase' ? 1 : -1;
  if (expectedVal == null) return sign * actual > 0 ? 'met' : 'missed';
  return sign * actual >= expectedVal ? 'met' : 'missed';
}

function judgeGuardrail(e: MetricEval, tolerancePct: number): GuardrailStatus {
  if (!e.hasData) return 'unknown';
  if (e.pctDelta != null) return Math.abs(e.pctDelta) > tolerancePct ? 'fail' : 'pass';
  // baseline was 0 (no pct): any non-zero move is a breach.
  return e.absDelta != null && Math.abs(e.absDelta) > 0 ? 'fail' : 'pass';
}

export function evaluateImpact(
  contract: ImpactContract,
  links: MetricLink[],
  seriesByKey: Record<string, MetricValue[]>,
  opts?: { guardrailTolerancePct?: number }
): ImpactEvaluation {
  const tol = opts?.guardrailTolerancePct ?? DEFAULT_GUARDRAIL_TOLERANCE_PCT;

  const targetLink = links.find((l) => l.role === 'target') ?? null;
  const target = targetLink ? evalMetric(targetLink, contract, seriesByKey) : null;
  const leading = links
    .filter((l) => l.role === 'leading')
    .map((l) => evalMetric(l, contract, seriesByKey));
  const guardrails: GuardrailEval[] = links
    .filter((l) => l.role === 'guardrail')
    .map((l) => {
      const e = evalMetric(l, contract, seriesByKey);
      return { ...e, status: judgeGuardrail(e, tol) };
    });

  const expected = contract.expectedDirection
    ? {
        direction: contract.expectedDirection,
        value: contract.expectedDeltaValue,
        unit: contract.expectedDeltaUnit,
      }
    : null;

  // Compare actual against expectation in the expected unit.
  const actualForCompare =
    target == null
      ? null
      : contract.expectedDeltaUnit === 'absolute'
        ? target.absDelta
        : target.pctDelta;
  const met = judgeMet(contract.expectedDirection, contract.expectedDeltaValue, actualForCompare);

  const guardrailStatus: GuardrailStatus = guardrails.some((g) => g.status === 'fail')
    ? 'fail'
    : guardrails.every((g) => g.status === 'pass')
      ? 'pass'
      : 'unknown';

  let suggestedResult: SuggestedResult;
  if (!target || met === 'unknown') suggestedResult = 'inconclusive';
  else if (guardrailStatus === 'fail') suggestedResult = 'inconclusive';
  else if (met === 'met') suggestedResult = 'won';
  else suggestedResult = 'lost';

  return { target, leading, guardrails, expected, met, guardrailStatus, suggestedResult };
}

/**
 * Build the series-by-refKey map for a contract's links from the loaded
 * tracked-metric snapshots + canvas card data. Pure — callers do the I/O.
 */
export function buildSeriesByKey(
  links: MetricLink[],
  cards: MetricCard[],
  trackedValues: Record<string, MetricValue[]>
): Record<string, MetricValue[]> {
  const map: Record<string, MetricValue[]> = {};
  for (const l of links) {
    const key = metricRefKey(l);
    if (!key) continue;
    if (l.refSource === 'tracked' && l.trackedMetricId) {
      map[key] = trackedValues[l.trackedMetricId] ?? [];
    } else if (l.refSource === 'card' && l.cardId) {
      map[key] = cards.find((c) => c.id === l.cardId)?.data ?? [];
    }
  }
  return map;
}

/** Compact measured outcome for chips/badges/trace (CVS-176). */
export interface MeasuredImpact {
  deltaText: string | null;
  pctDelta: number | null;
  met: MetTarget;
  guardrailStatus: GuardrailStatus;
  hasData: boolean;
}

export function toMeasured(ev: ImpactEvaluation): MeasuredImpact {
  const t = ev.target;
  const hasData = !!t?.hasData;
  let deltaText: string | null = null;
  if (t && hasData) {
    const pct = t.pctDelta != null ? `${t.pctDelta > 0 ? '+' : ''}${t.pctDelta.toFixed(1)}%` : null;
    const abs = t.absDelta != null ? `${t.absDelta > 0 ? '+' : ''}${t.absDelta}` : null;
    deltaText = pct ?? abs;
  }
  return { deltaText, pctDelta: t?.pctDelta ?? null, met: ev.met, guardrailStatus: ev.guardrailStatus, hasData };
}

/** Evaluate many contracts at once → measured summary keyed by strategy node id. */
export function measuredByNode(
  entries: Array<{ contract: ImpactContract; links: MetricLink[] }>,
  cards: MetricCard[],
  trackedValues: Record<string, MetricValue[]>
): Record<string, MeasuredImpact> {
  const out: Record<string, MeasuredImpact> = {};
  for (const { contract, links } of entries) {
    const ev = evaluateImpact(contract, links, buildSeriesByKey(links, cards, trackedValues));
    if (ev.target) out[contract.strategyNodeId] = toMeasured(ev);
  }
  return out;
}
