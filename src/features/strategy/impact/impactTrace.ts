// Pure impact-trace resolver (CVS-168). Answers "why are we doing this, which
// metric should move, and where will I see it?" by walking from a strategy
// node's contract links → target/leading/guardrail metrics → the metric-tree
// roll-up path to the KPI → dashboard widgets that show those metrics.
//
// NO I/O: callers pass the already-loaded contract links, canvas cards, tree
// relationships, and dashboard widgets. Consumed by the impact panel (CVS-169),
// dashboard badges (CVS-172), the trace view (CVS-173), and review (CVS-176).
//
// Edge convention (matches value propagation in feedDownstream.ts / runSimulation.ts):
// a relationship source → target means source *drives* target. So a metric
// "rolls up" to the KPI by walking FORWARD along outgoing edges to the terminal
// downstream outcome (a metric node that drives nothing further).

import type { MetricCard, Relationship } from '@/shared/types';
import type { MetricLink, MetricLinkRole } from './types';

/** Categories that participate in the metric-tree roll-up. */
const METRIC_CATEGORIES = new Set(['Data/Metric', 'Core/Value']);

/** Minimal widget shape (structurally matches DashboardWidget.config). */
export interface TraceWidget {
  id: string;
  title: string | null;
  config: {
    source: 'tracked' | 'card';
    trackedMetricIds?: string[];
    cardIds?: string[];
  };
}

export interface TraceWidgetRef {
  id: string;
  title: string | null;
}

/** A resolved metric reference from a contract link, placed on the tree/dashboards. */
export interface TraceMetricRef {
  role: MetricLinkRole;
  refSource: MetricLink['refSource'];
  trackedMetricId: string | null;
  cardId: string | null;
  /** The canvas placement resolved from the provided cards, if present. */
  card: MetricCard | null;
  label: string | null;
  /** True when a placement exists in the provided cards (drawable on the tree). */
  onCanvas: boolean;
  /** Dashboard widgets that display this metric. */
  widgets: TraceWidgetRef[];
}

export interface TraceMissing {
  noTarget: boolean;
  /** Target link exists but no placement was found in the provided cards. */
  targetNotOnCanvas: boolean;
  /** No ancestor metric above the target (target has no roll-up path). */
  noKpiPath: boolean;
  /** Neither target nor any guardrail is shown on a dashboard widget. */
  noDashboard: boolean;
}

export interface ImpactTrace {
  strategyNodeId: string;
  target: TraceMetricRef | null;
  leading: TraceMetricRef[];
  guardrails: TraceMetricRef[];
  /** Ordered path from the target card up to the KPI (inclusive). [] if no target on canvas. */
  kpiPath: MetricCard[];
  /** Terminal downstream outcome node (may equal the target if it is top-level). */
  kpi: MetricCard | null;
  missing: TraceMissing;
}

export interface TraceInput {
  strategyNodeId: string;
  links: MetricLink[];
  cards: MetricCard[];
  relationships: Relationship[];
  widgets?: TraceWidget[];
}

/** All identifiers a ref can be matched by: its tracked id + every card placement id. */
function refIdentifiers(
  link: Pick<MetricLink, 'refSource' | 'trackedMetricId' | 'cardId'>,
  cards: MetricCard[]
): { trackedIds: Set<string>; cardIds: Set<string> } {
  const trackedIds = new Set<string>();
  const cardIds = new Set<string>();
  if (link.refSource === 'card' && link.cardId) {
    cardIds.add(link.cardId);
    const card = cards.find((c) => c.id === link.cardId);
    if (card?.trackedMetricId) trackedIds.add(card.trackedMetricId);
  } else if (link.refSource === 'tracked' && link.trackedMetricId) {
    trackedIds.add(link.trackedMetricId);
    // every canvas placement of this tracked metric
    for (const c of cards) {
      if (c.trackedMetricId === link.trackedMetricId) cardIds.add(c.id);
    }
  }
  return { trackedIds, cardIds };
}

/** Resolve the canvas card that best represents a ref (direct card, or a placement of a tracked metric). */
function resolveCard(
  link: Pick<MetricLink, 'refSource' | 'trackedMetricId' | 'cardId'>,
  cards: MetricCard[]
): MetricCard | null {
  if (link.refSource === 'card' && link.cardId) {
    return cards.find((c) => c.id === link.cardId) ?? null;
  }
  if (link.refSource === 'tracked' && link.trackedMetricId) {
    return cards.find((c) => c.trackedMetricId === link.trackedMetricId) ?? null;
  }
  return null;
}

/** Widgets that display a given ref (by tracked id or card id). */
function widgetsForRef(
  link: Pick<MetricLink, 'refSource' | 'trackedMetricId' | 'cardId'>,
  cards: MetricCard[],
  widgets: TraceWidget[]
): TraceWidgetRef[] {
  const { trackedIds, cardIds } = refIdentifiers(link, cards);
  const out: TraceWidgetRef[] = [];
  for (const w of widgets) {
    const wTracked = w.config?.trackedMetricIds ?? [];
    const wCards = w.config?.cardIds ?? [];
    const shows =
      wTracked.some((id) => trackedIds.has(id)) || wCards.some((id) => cardIds.has(id));
    if (shows) out.push({ id: w.id, title: w.title });
  }
  return out;
}

function toMetricRef(
  link: MetricLink,
  cards: MetricCard[],
  widgets: TraceWidget[]
): TraceMetricRef {
  const card = resolveCard(link, cards);
  return {
    role: link.role,
    refSource: link.refSource,
    trackedMetricId: link.trackedMetricId,
    cardId: link.cardId,
    card,
    label: card?.title ?? null,
    onCanvas: !!card,
    widgets: widgetsForRef(link, cards, widgets),
  };
}

/**
 * Walk forward (source → target) from a metric card to its terminal downstream
 * outcome, returning the longest roll-up path (the KPI chain). Deterministic:
 * ties break on the lowest next-card id. Cycle-safe.
 */
function rollUpPath(start: MetricCard, cards: MetricCard[], edges: Relationship[]): MetricCard[] {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const outgoing = new Map<string, string[]>();
  for (const e of edges) {
    const s = byId.get(e.sourceId);
    const t = byId.get(e.targetId);
    if (!s || !t) continue;
    if (!METRIC_CATEGORIES.has(s.category) || !METRIC_CATEGORIES.has(t.category)) continue;
    const list = outgoing.get(e.sourceId) ?? [];
    list.push(e.targetId);
    outgoing.set(e.sourceId, list);
  }

  const memo = new Map<string, MetricCard[]>();
  const walk = (id: string, visiting: Set<string>): MetricCard[] => {
    const card = byId.get(id);
    if (!card) return [];
    if (memo.has(id)) return memo.get(id)!;
    const nexts = (outgoing.get(id) ?? [])
      .filter((n) => byId.has(n) && !visiting.has(n))
      .sort();
    let best: MetricCard[] = [];
    visiting.add(id);
    for (const n of nexts) {
      const sub = walk(n, visiting);
      if (sub.length > best.length) best = sub;
    }
    visiting.delete(id);
    const path = [card, ...best];
    memo.set(id, path);
    return path;
  };

  return walk(start.id, new Set());
}

/** Build the full impact trace for a strategy node from already-loaded data. */
export function resolveImpactTrace(input: TraceInput): ImpactTrace {
  const { strategyNodeId, links, cards, relationships } = input;
  const widgets = input.widgets ?? [];

  const targetLinks = links.filter((l) => l.role === 'target');
  const target = targetLinks.length ? toMetricRef(targetLinks[0], cards, widgets) : null;
  const leading = links.filter((l) => l.role === 'leading').map((l) => toMetricRef(l, cards, widgets));
  const guardrails = links.filter((l) => l.role === 'guardrail').map((l) => toMetricRef(l, cards, widgets));

  const kpiPath = target?.card ? rollUpPath(target.card, cards, relationships) : [];
  const kpi = kpiPath.length ? kpiPath[kpiPath.length - 1] : null;

  const anyOnDashboard =
    (target?.widgets.length ?? 0) > 0 || guardrails.some((g) => g.widgets.length > 0);

  const missing: TraceMissing = {
    noTarget: !target,
    targetNotOnCanvas: !!target && !target.onCanvas,
    noKpiPath: kpiPath.length < 2,
    noDashboard: !anyOnDashboard,
  };

  return { strategyNodeId, target, leading, guardrails, kpiPath, kpi, missing };
}
