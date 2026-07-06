// Pure helpers for the Strategy impact contract. No I/O — safe to unit test and
// to reuse from the impact panel (CVS-169), board columns (CVS-170), and the
// trace resolver (CVS-168).

import type {
  Confidence,
  ImpactContract,
  ImpactStatus,
  MetricLink,
  MetricLinkInput,
  MetricLinkRole,
  MetricRefSource,
} from './types';

/** Stable identity for a metric reference, e.g. `tracked:<uuid>` / `card:<uuid>`. */
export function metricRefKey(ref: {
  refSource: MetricRefSource;
  trackedMetricId?: string | null;
  cardId?: string | null;
}): string | null {
  if (ref.refSource === 'tracked') return ref.trackedMetricId ? `tracked:${ref.trackedMetricId}` : null;
  if (ref.refSource === 'card') return ref.cardId ? `card:${ref.cardId}` : null;
  return null;
}

/**
 * Mirrors the DB CHECK constraint: exactly one ref column populated and it must
 * match `refSource`. Guards inserts before they hit Postgres.
 */
export function isValidLinkInput(input: MetricLinkInput): boolean {
  const hasTracked = !!input.trackedMetricId;
  const hasCard = !!input.cardId;
  if (input.refSource === 'tracked') return hasTracked && !hasCard;
  if (input.refSource === 'card') return hasCard && !hasTracked;
  return false;
}

/** Bucket links by role, preserving order within each role. */
export function groupLinksByRole(
  links: MetricLink[]
): Record<MetricLinkRole, MetricLink[]> {
  const out: Record<MetricLinkRole, MetricLink[]> = {
    target: [],
    leading: [],
    guardrail: [],
  };
  for (const link of links) {
    if (out[link.role]) out[link.role].push(link);
  }
  return out;
}

/** The primary target metric of a bet (first `target` link), or null. */
export function targetLink(links: MetricLink[]): MetricLink | null {
  return links.find((l) => l.role === 'target') ?? null;
}

/** Human-readable expected delta, e.g. `+5%`, `-3 (absolute)`, `stabilize`. */
export function describeExpectedDelta(contract: ImpactContract): string | null {
  const { expectedDirection, expectedDeltaValue, expectedDeltaUnit } = contract;
  if (!expectedDirection) return null;
  if (expectedDirection === 'stabilize') return 'stabilize';
  if (expectedDeltaValue == null) {
    return expectedDirection === 'increase' ? 'increase' : 'decrease';
  }
  const sign = expectedDirection === 'increase' ? '+' : '-';
  const magnitude = Math.abs(expectedDeltaValue);
  if (expectedDeltaUnit === 'percent') return `${sign}${magnitude}%`;
  const unit = expectedDeltaUnit ? ` ${expectedDeltaUnit}` : '';
  return `${sign}${magnitude}${unit}`;
}

/**
 * A contract is "measurable" once it has a target metric plus a baseline and a
 * measurement window — the minimum the delta engine (CVS-174) needs.
 */
export function isMeasurable(contract: ImpactContract, links: MetricLink[]): boolean {
  const hasTarget = links.some((l) => l.role === 'target');
  const hasBaseline = !!contract.baselineStart || contract.baselineIsManual;
  const hasWindow = !!contract.measureStart;
  return hasTarget && hasBaseline && hasWindow;
}

/** A minimal card shape for resolving a target metric to a readable label. */
export interface LabelledCard {
  id: string;
  title: string;
  trackedMetricId?: string | null;
}

/** Compact, scannable view of a contract for board/table columns (CVS-170). */
export interface ImpactSummary {
  hasTarget: boolean;
  targetLabel: string | null;
  status: ImpactStatus;
  deltaText: string | null;
  confidence: Confidence | null;
  measureEnd: string | null;
}

export function summarizeImpact(
  contract: ImpactContract,
  links: MetricLink[],
  cards: LabelledCard[]
): ImpactSummary {
  const t = targetLink(links);
  let targetLabel: string | null = null;
  if (t) {
    if (t.refSource === 'card' && t.cardId) {
      targetLabel = cards.find((c) => c.id === t.cardId)?.title ?? 'Metric card';
    } else if (t.refSource === 'tracked' && t.trackedMetricId) {
      targetLabel =
        cards.find((c) => c.trackedMetricId === t.trackedMetricId)?.title ?? 'Tracked metric';
    }
  }
  return {
    hasTarget: !!t,
    targetLabel,
    status: contract.impactStatus,
    deltaText: describeExpectedDelta(contract),
    confidence: contract.confidence,
    measureEnd: contract.measureEnd,
  };
}

export type ImpactFilter =
  | 'all'
  | 'has_target'
  | 'missing_target'
  | 'measuring'
  | 'review_ready'
  | 'won'
  | 'lost'
  | 'inconclusive';

export const IMPACT_FILTERS: { value: ImpactFilter; label: string }[] = [
  { value: 'all', label: 'All impact' },
  { value: 'has_target', label: 'Has target' },
  { value: 'missing_target', label: 'Missing target' },
  { value: 'measuring', label: 'Measuring' },
  { value: 'review_ready', label: 'Review ready' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'inconclusive', label: 'Inconclusive' },
];

/**
 * Predicate for a strategy item given its impact summary (or undefined when the
 * item has no contract). `currentPeriod` is a 'YYYY-MM' used for "review ready"
 * (window has ended while still measuring).
 */
export function matchesImpactFilter(
  filter: ImpactFilter,
  summary: ImpactSummary | undefined,
  currentPeriod: string
): boolean {
  if (filter === 'all') return true;
  if (filter === 'missing_target') return !summary || !summary.hasTarget;
  if (!summary) return false;
  switch (filter) {
    case 'has_target':
      return summary.hasTarget;
    case 'measuring':
      return summary.status === 'measuring';
    case 'review_ready':
      return (
        summary.status === 'measuring' &&
        !!summary.measureEnd &&
        summary.measureEnd < currentPeriod
      );
    case 'won':
      return summary.status === 'won';
    case 'lost':
      return summary.status === 'lost';
    case 'inconclusive':
      return summary.status === 'inconclusive';
    default:
      return true;
  }
}
