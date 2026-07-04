// Strategy Tree view (CVS-171): KPI → pillar (group) → hypothesis/action →
// linked metrics. Adapts the Speero-style strategy tree to Metrimap — work cards
// anchor to tracked metrics and roll up to the KPI via the CVS-168 resolver.
// Pillars/problems = canvas groups (per the CVS-166 locked decision). Read-only
// structure view; editing happens in the Impact panel (opens via onOpenImpact).

import { useMemo, useState } from 'react';
import { FlaskConical, Hammer, Target, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ImpactChip } from '@/features/strategy/components/ImpactChip';
import { isWorkCard } from '@/features/strategy/utils/groupStrategy';
import {
  IMPACT_FILTERS,
  matchesImpactFilter,
  summarizeImpact,
  type ImpactFilter,
} from '@/features/strategy/impact/impactContract';
import { resolveImpactTrace } from '@/features/strategy/impact/impactTrace';
import type { ImpactContract, MetricLink } from '@/features/strategy/impact/types';
import type { GroupNode, MetricCard, Relationship } from '@/shared/types';

interface StrategyTreeProps {
  cards: MetricCard[];
  groups: GroupNode[];
  relationships: Relationship[];
  impactByNode: Record<string, { contract: ImpactContract; links: MetricLink[] }>;
  onOpenImpact: (cardId: string) => void;
  onOpenTrace?: (cardId: string) => void;
}

const UNGROUPED = '__ungrouped__';

export function StrategyTree({
  cards,
  groups,
  relationships,
  impactByNode,
  onOpenImpact,
  onOpenTrace,
}: StrategyTreeProps) {
  const [filter, setFilter] = useState<ImpactFilter>('all');
  const currentPeriod = useMemo(() => new Date().toISOString().slice(0, 7), []);

  // KPIs = the Core/Value backbone of the canvas.
  const kpis = useMemo(
    () => cards.filter((c) => c.category === 'Core/Value'),
    [cards]
  );

  const workCards = useMemo(() => {
    const work = cards.filter(isWorkCard);
    return work.filter((c) => {
      const entry = impactByNode[c.id];
      const summary = entry
        ? summarizeImpact(entry.contract, entry.links, cards)
        : undefined;
      return matchesImpactFilter(filter, summary, currentPeriod);
    });
  }, [cards, impactByNode, filter, currentPeriod]);

  // Bucket work cards under their pillar (group), or Ungrouped.
  const pillars = useMemo(() => {
    const groupOf = (card: MetricCard): GroupNode | null =>
      groups.find(
        (g) => (g.nodeIds || []).includes(card.id) || card.parentId === g.id
      ) ?? null;
    const buckets = new Map<string, { group: GroupNode | null; items: MetricCard[] }>();
    for (const card of workCards) {
      const g = groupOf(card);
      const key = g?.id ?? UNGROUPED;
      if (!buckets.has(key)) buckets.set(key, { group: g, items: [] });
      buckets.get(key)!.items.push(card);
    }
    // Groups first (stable order), Ungrouped last.
    return Array.from(buckets.values()).sort((a, b) => {
      if (!a.group) return 1;
      if (!b.group) return -1;
      return a.group.name.localeCompare(b.group.name);
    });
  }, [workCards, groups]);

  return (
    <div className="space-y-5">
      {/* KPI header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          KPIs
        </span>
        {kpis.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            Add Core/Value nodes on the canvas to anchor the tree.
          </span>
        ) : (
          kpis.map((k) => (
            <span
              key={k.id}
              className="inline-flex items-center gap-1.5 rounded-full border bg-primary/5 px-3 py-1 text-sm font-medium"
            >
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              {k.title || 'Untitled'}
            </span>
          ))
        )}
        <div className="ml-auto">
          <Select value={filter} onValueChange={(v) => setFilter(v as ImpactFilter)}>
            <SelectTrigger className="h-8 w-40" aria-label="Filter tree by impact">
              <Target className="h-3.5 w-3.5 opacity-70" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMPACT_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {pillars.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No strategy items match this filter.
        </p>
      ) : (
        pillars.map(({ group, items }) => (
          <div key={group?.id ?? UNGROUPED} className="space-y-2">
            {/* Pillar / problem grouping */}
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: group?.color || '#94a3b8' }}
              />
              <span className="text-sm font-semibold">
                {group?.name ?? 'Ungrouped'}
              </span>
              <span className="text-xs text-muted-foreground">
                {items.length} item{items.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="ml-1.5 space-y-2 border-l pl-4">
              {items.map((card) => (
                <StrategyTreeItem
                  key={card.id}
                  card={card}
                  entry={impactByNode[card.id]}
                  cards={cards}
                  relationships={relationships}
                  onOpenImpact={onOpenImpact}
                  onOpenTrace={onOpenTrace}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

interface StrategyTreeItemProps {
  card: MetricCard;
  entry?: { contract: ImpactContract; links: MetricLink[] };
  cards: MetricCard[];
  relationships: Relationship[];
  onOpenImpact: (cardId: string) => void;
  onOpenTrace?: (cardId: string) => void;
}

function StrategyTreeItem({
  card,
  entry,
  cards,
  relationships,
  onOpenImpact,
  onOpenTrace,
}: StrategyTreeItemProps) {
  const isHypothesis = card.category === 'Ideas/Hypothesis';
  const KindIcon = isHypothesis ? FlaskConical : Hammer;

  const links = useMemo(() => entry?.links ?? [], [entry]);
  const trace = useMemo(
    () =>
      resolveImpactTrace({
        strategyNodeId: card.id,
        links,
        cards,
        relationships,
        widgets: [],
      }),
    [card.id, links, cards, relationships]
  );
  const summary = entry
    ? summarizeImpact(entry.contract, entry.links, cards)
    : undefined;

  const kpiPathLabels = trace.kpiPath.map((c) => c.title || 'Untitled');

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => onOpenImpact(card.id)}
          className="flex items-center gap-2 text-left text-sm font-medium hover:text-primary"
        >
          <KindIcon
            className={isHypothesis ? 'h-4 w-4 text-purple-500' : 'h-4 w-4 text-blue-500'}
          />
          {card.title || 'Untitled'}
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {summary && <ImpactChip summary={summary} />}
          {onOpenTrace && trace.target && (
            <button
              onClick={() => onOpenTrace(card.id)}
              className="text-[11px] text-primary hover:underline"
            >
              Trace
            </button>
          )}
        </div>
      </div>

      {!trace.target ? (
        <button
          onClick={() => onOpenImpact(card.id)}
          className="mt-2 text-xs text-muted-foreground hover:text-primary"
        >
          + Add a target metric to measure impact
        </button>
      ) : (
        <div className="mt-2 space-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium">
              {kpiPathLabels.length > 0
                ? kpiPathLabels.join(' → ')
                : `${trace.target.label}${
                    trace.missing.targetNotOnCanvas ? ' (not on this canvas)' : ' (no KPI path yet)'
                  }`}
            </span>
          </div>
          {trace.leading.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Leading:</span>
              <span>{trace.leading.map((l) => l.label ?? '—').join(', ')}</span>
            </div>
          )}
          {trace.guardrails.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Guardrails:</span>
              <span>{trace.guardrails.map((g) => g.label ?? '—').join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
