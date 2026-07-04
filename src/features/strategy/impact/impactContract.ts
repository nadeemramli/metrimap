// Pure helpers for the Strategy impact contract. No I/O — safe to unit test and
// to reuse from the impact panel (CVS-169), board columns (CVS-170), and the
// trace resolver (CVS-168).

import type {
  ImpactContract,
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
