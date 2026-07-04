// Match dashboard widgets to the Strategy bets that target their metrics
// (CVS-172). Pure + I/O-free: given the widgets' metric refs, the loaded impact
// contracts + links, and the canvas cards, compute which actions/hypotheses are
// "on" each widget. Cross-maps tracked ↔ card so a widget bound to a card still
// matches a contract that targets that card's catalogued metric (and vice-versa).

import type { MetricCard } from '@/shared/types';
import type { ImpactContract, ImpactStatus, MetricLink, MetricLinkRole } from './types';

/** Minimal widget shape (structurally matches DashboardWidget). */
export interface WidgetLike {
  id: string;
  title: string | null;
  config: { trackedMetricIds?: string[] | null; cardIds?: string[] | null };
}

export interface WidgetStrategyLink {
  contract: ImpactContract;
  /** The Action/Hypothesis card that owns the bet, if present in the loaded cards. */
  node: MetricCard | null;
  /** Which roles of this contract point at the widget's metric(s). */
  roles: MetricLinkRole[];
}

interface Ids {
  tracked: Set<string>;
  card: Set<string>;
}

/** Expand a set of refs to include cross-mapped ids (card↔tracked via placements). */
function expand(
  trackedIds: Iterable<string>,
  cardIds: Iterable<string>,
  cards: MetricCard[]
): Ids {
  const tracked = new Set<string>(trackedIds);
  const card = new Set<string>(cardIds);
  for (const id of Array.from(card)) {
    const c = cards.find((x) => x.id === id);
    if (c?.trackedMetricId) tracked.add(c.trackedMetricId);
  }
  for (const t of Array.from(tracked)) {
    for (const c of cards) if (c.trackedMetricId === t) card.add(c.id);
  }
  return { tracked, card };
}

function widgetIds(widget: WidgetLike, cards: MetricCard[]): Ids {
  return expand(widget.config.trackedMetricIds ?? [], widget.config.cardIds ?? [], cards);
}

function linkIds(link: MetricLink, cards: MetricCard[]): Ids {
  const tracked = link.refSource === 'tracked' && link.trackedMetricId ? [link.trackedMetricId] : [];
  const card = link.refSource === 'card' && link.cardId ? [link.cardId] : [];
  return expand(tracked, card, cards);
}

function intersects(a: Ids, b: Ids): boolean {
  for (const t of a.tracked) if (b.tracked.has(t)) return true;
  for (const c of a.card) if (b.card.has(c)) return true;
  return false;
}

export function linkedStrategyForWidget(
  widget: WidgetLike,
  entries: Array<{ contract: ImpactContract; links: MetricLink[] }>,
  cards: MetricCard[]
): WidgetStrategyLink[] {
  const wIds = widgetIds(widget, cards);
  const out: WidgetStrategyLink[] = [];
  for (const { contract, links } of entries) {
    const roles = new Set<MetricLinkRole>();
    for (const link of links) {
      if (intersects(wIds, linkIds(link, cards))) roles.add(link.role);
    }
    if (roles.size > 0) {
      out.push({
        contract,
        node: cards.find((c) => c.id === contract.strategyNodeId) ?? null,
        roles: Array.from(roles),
      });
    }
  }
  return out;
}

/** Impact status plus the derived "review_ready" (measuring past its window). */
export type EffectiveStatus = ImpactStatus | 'review_ready';

export function effectiveStatus(
  contract: ImpactContract,
  currentPeriod: string
): EffectiveStatus {
  if (
    contract.impactStatus === 'measuring' &&
    contract.measureEnd &&
    contract.measureEnd < currentPeriod
  ) {
    return 'review_ready';
  }
  return contract.impactStatus;
}

// Attention order: what a dashboard reviewer should notice first.
const ATTENTION_ORDER: EffectiveStatus[] = [
  'review_ready',
  'lost',
  'measuring',
  'planned',
  'inconclusive',
  'won',
  'draft',
];

/** The most attention-worthy status across a widget's linked bets. */
export function dominantStatus(
  links: WidgetStrategyLink[],
  currentPeriod: string
): EffectiveStatus | null {
  let best: EffectiveStatus | null = null;
  let bestRank = Infinity;
  for (const l of links) {
    const s = effectiveStatus(l.contract, currentPeriod);
    const rank = ATTENTION_ORDER.indexOf(s);
    if (rank >= 0 && rank < bestRank) {
      bestRank = rank;
      best = s;
    }
  }
  return best;
}
