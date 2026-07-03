import { isWorkCard } from '@/features/strategy/utils/groupStrategy';
import type { MetricCard, Relationship } from '@/shared/types';

// Value journey strip: Core/Value cards ordered left→right by canvas position
// (the author's journey order), each summarising its connected metrics'
// health and attached work. Pure + side-effect free.

export interface JourneyStep {
  card: MetricCard;
  /** Trend rollup of connected data-bearing Data/Metric cards. */
  metricHealth: { up: number; down: number; flat: number; total: number };
  /** Connected Action/Hypothesis cards. */
  workCount: number;
}

export function buildValueJourney(
  cards: MetricCard[],
  relationships: Relationship[]
): JourneyStep[] {
  const valueCards = cards
    .filter((c) => c.category === 'Core/Value')
    .sort(
      (a, b) =>
        a.position.x - b.position.x ||
        (a.createdAt || '').localeCompare(b.createdAt || '')
    );
  if (valueCards.length === 0) return [];

  const byId = new Map(cards.map((c) => [c.id, c]));

  return valueCards.map((valueCard) => {
    const neighborIds = new Set<string>();
    relationships.forEach((rel) => {
      if (rel.sourceId === valueCard.id) neighborIds.add(rel.targetId);
      else if (rel.targetId === valueCard.id) neighborIds.add(rel.sourceId);
    });

    const metricHealth = { up: 0, down: 0, flat: 0, total: 0 };
    let workCount = 0;

    neighborIds.forEach((id) => {
      const neighbor = byId.get(id);
      if (!neighbor) return;
      if (neighbor.category === 'Data/Metric') {
        const series = neighbor.data ?? [];
        const latest = series[series.length - 1];
        if (!latest) return;
        if (latest.trend === 'up') metricHealth.up += 1;
        else if (latest.trend === 'down') metricHealth.down += 1;
        else metricHealth.flat += 1;
        metricHealth.total += 1;
      } else if (isWorkCard(neighbor)) {
        workCount += 1;
      }
    });

    return { card: valueCard, metricHealth, workCount };
  });
}
