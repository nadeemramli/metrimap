import { useCanvasStore } from '@/lib/stores';
import { Card } from '@/shared/components/ui/card';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { updateMetricCard } from '@/shared/lib/supabase/services/metric-cards';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import type {
  GroupNode,
  MetricCard,
  Relationship,
  WorkflowStatus,
} from '@/shared/types';
import { resolveGroupMembers } from '@/features/dashboard/utils/groupDashboard';
import { StrategyBoard } from '@/features/strategy/components/StrategyBoard';
import { ValueJourneyStrip } from '@/features/strategy/components/ValueJourneyStrip';
import {
  buildGroupStrategy,
  isWorkCard,
} from '@/features/strategy/utils/groupStrategy';
import { buildValueJourney } from '@/features/strategy/utils/valueJourney';
import { Loader2, SquareKanban } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Strategy page: grouping Metric nodes gives a Dashboard; grouping
// Action/Hypothesis nodes gives a Strategy. One pill per group with work
// cards, plus an "All" board over the whole canvas.

const ALL_VIEW = '__all__';

export default function StrategyPage() {
  const { canvasId } = useParams();
  const client = useClerkSupabase();
  const storeCanvas = useCanvasStore((s) => s.canvas);

  const [loadedCards, setLoadedCards] = useState<MetricCard[]>([]);
  const [loadedGroups, setLoadedGroups] = useState<GroupNode[]>([]);
  const [loadedEdges, setLoadedEdges] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<string>(ALL_VIEW);
  // Optimistic status overrides while a drop is persisting (kept on success —
  // they match the DB; reverted on failure).
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, WorkflowStatus>
  >({});

  // Prefer the live in-canvas store when it matches this canvas (fresher,
  // holds unsaved edits); otherwise fall back to what we loaded from the DB.
  const storeMatches = storeCanvas?.id === canvasId;
  const baseCards: MetricCard[] = useMemo(
    () => (storeMatches ? (storeCanvas?.nodes ?? []) : loadedCards),
    [storeMatches, storeCanvas?.nodes, loadedCards]
  );
  const groups: GroupNode[] = useMemo(
    () =>
      storeMatches && (storeCanvas?.groups?.length ?? 0) > 0
        ? (storeCanvas?.groups ?? [])
        : loadedGroups,
    [storeMatches, storeCanvas?.groups, loadedGroups]
  );

  const cards: MetricCard[] = useMemo(
    () =>
      baseCards.map((c) =>
        statusOverrides[c.id] ? { ...c, status: statusOverrides[c.id] } : c
      ),
    [baseCards, statusOverrides]
  );

  useEffect(() => {
    if (!client || !canvasId) return;
    setLoading(true);
    getProjectById(canvasId, client)
      .then((project) => {
        setLoadedCards(project?.nodes ?? []);
        setLoadedGroups(project?.groups ?? []);
        setLoadedEdges(project?.edges ?? []);
      })
      .catch(() => {
        setLoadedCards([]);
        setLoadedGroups([]);
        setLoadedEdges([]);
      })
      .finally(() => setLoading(false));
  }, [client, canvasId]);

  // A group earns a Strategy pill when it contains at least one work card.
  const strategyGroups = useMemo(
    () =>
      groups.filter((g) => resolveGroupMembers(g, cards).some(isWorkCard)),
    [groups, cards]
  );

  const activeGroup = useMemo(
    () => strategyGroups.find((g) => g.id === view) ?? null,
    [strategyGroups, view]
  );

  const members = useMemo(
    () => (activeGroup ? resolveGroupMembers(activeGroup, cards) : cards),
    [activeGroup, cards]
  );

  const board = useMemo(() => buildGroupStrategy(members), [members]);

  // The value chain is the canvas-level backbone — always built from all
  // cards/edges, independent of the selected group pill.
  const edges: Relationship[] = useMemo(
    () => (storeMatches ? (storeCanvas?.edges ?? []) : loadedEdges),
    [storeMatches, storeCanvas?.edges, loadedEdges]
  );
  const journey = useMemo(
    () => buildValueJourney(cards, edges),
    [cards, edges]
  );

  const handleStatusChange = (cardId: string, status: WorkflowStatus) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || !client) return;
    if ((card.status ?? 'backlog') === status) return;

    const previous = card.status ?? null;
    setStatusOverrides((prev) => ({ ...prev, [cardId]: status }));

    updateMetricCard(cardId, { status }, client)
      .then(() => {
        if (storeMatches) {
          useCanvasStore.getState().updateNode(cardId, { status });
        }
      })
      .catch(() => {
        setStatusOverrides((prev) => {
          const next = { ...prev };
          if (previous) next[cardId] = previous;
          else delete next[cardId];
          return next;
        });
        toast.error('Failed to move card');
      });
  };

  usePageHeader({
    title: 'Strategy',
    description: 'Actions and hypotheses across this canvas',
  });

  if (loading && baseCards.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (board.counts.total === 0 && strategyGroups.length === 0) {
    return (
      <div className="p-6">
        <Card className="p-12">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <SquareKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Build your strategy</h3>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Add Action and Hypothesis nodes on the canvas and they show up
                here as a task board. Group them together to get a dedicated
                strategy per initiative — the same way grouping metrics builds
                a dashboard.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      {journey.length > 0 ? (
        <ValueJourneyStrip steps={journey} />
      ) : (
        <p className="mb-4 text-xs text-muted-foreground">
          Add Core/Value nodes on the canvas to map your journey here.
        </p>
      )}

      {/* View selector: one strategy per group with work cards, plus All. */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setView(ALL_VIEW)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
            !activeGroup
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          }`}
        >
          <SquareKanban className="h-3.5 w-3.5" />
          All
        </button>
        {strategyGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setView(g.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
              view === g.id
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted'
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: g.color || '#6366f1' }}
            />
            {g.name}
          </button>
        ))}
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {board.counts.actions} action{board.counts.actions === 1 ? '' : 's'} ·{' '}
        {board.counts.hypotheses} hypothes
        {board.counts.hypotheses === 1 ? 'is' : 'es'} · {board.counts.done}{' '}
        done
      </div>

      <StrategyBoard board={board} onStatusChange={handleStatusChange} />
    </div>
  );
}
