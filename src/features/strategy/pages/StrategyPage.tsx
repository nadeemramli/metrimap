import { useCanvasStore, useAppStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useConfirm } from '@/shared/components/ConfirmDialog';
import { usePageHeader } from '@/shared/hooks/usePageHeader';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useProjectMembers } from '@/features/canvas/hooks/useProjectMembers';
import { useCanvasPermission } from '@/features/canvas/hooks/useCanvasPermission';
import {
  createMetricCard,
  deleteMetricCard,
  updateMetricCard,
} from '@/shared/lib/supabase/services/metric-cards';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { getUsersByIds, type UserLite } from '@/shared/lib/supabase/services/users';
import {
  getCommentCountsByCard,
  notifyCardAssigned,
} from '@/shared/lib/supabase/services/collaboration';
import type {
  CardWorkflow,
  GroupNode,
  MetricCard,
  Relationship,
  WorkflowStatus,
} from '@/shared/types';
import type { PriorityLevel } from '@/features/canvas/utils/workflow';
import { resolveGroupMembers } from '@/features/dashboard/utils/groupDashboard';
import { StrategyBoard } from '@/features/strategy/components/StrategyBoard';
import { StrategyTable } from '@/features/strategy/components/StrategyTable';
import { StrategyTree } from '@/features/strategy/components/StrategyTree';
import { CardCommentSheet } from '@/features/strategy/components/CardCommentSheet';
import { StrategyImpactSheet } from '@/features/strategy/components/StrategyImpactSheet';
import { listContractsWithLinksForProject } from '@/shared/lib/supabase/services/strategyImpact';
import {
  summarizeImpact,
  type ImpactSummary,
} from '@/features/strategy/impact/impactContract';
import type {
  ImpactContract,
  MetricLink,
} from '@/features/strategy/impact/types';
import { ValueJourneyStrip } from '@/features/strategy/components/ValueJourneyStrip';
import { TaskPanel } from '@/features/canvas/components/panels/task-panel/TaskPanel';
import {
  buildGroupStrategy,
  isWorkCard,
} from '@/features/strategy/utils/groupStrategy';
import { buildValueJourney } from '@/features/strategy/utils/valueJourney';
import { cn } from '@/shared/utils';
import { Loader2, Plus, SquareKanban, Table as TableIcon, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Strategy page: grouping Metric nodes gives a Dashboard; grouping
// Action/Hypothesis nodes gives a Strategy. Board (kanban) and Table
// (Monday.com-style) views over the same work cards.

const ALL_VIEW = '__all__';
type ViewMode = 'board' | 'table' | 'tree';

export default function StrategyPage() {
  const { canvasId } = useParams();
  const client = useClerkSupabase();
  const storeCanvas = useCanvasStore((s) => s.canvas);
  const userId = useAppStore((s) => s.user?.id);
  const confirm = useConfirm();

  const { members } = useProjectMembers(canvasId, Boolean(canvasId));
  const { canEdit } = useCanvasPermission(canvasId);

  const [loadedCards, setLoadedCards] = useState<MetricCard[]>([]);
  const [loadedGroups, setLoadedGroups] = useState<GroupNode[]>([]);
  const [loadedEdges, setLoadedEdges] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<string>(ALL_VIEW);
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  // Optimistic patches (status/priority/assignees/dueDate) kept on success —
  // they mirror the DB; reverted on failure. Session-created cards + deletes.
  const [cardOverrides, setCardOverrides] = useState<
    Record<string, Partial<MetricCard>>
  >({});
  const [extraCards, setExtraCards] = useState<MetricCard[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const [fetchedUsers, setFetchedUsers] = useState<Record<string, UserLite>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const [settingsCardId, setSettingsCardId] = useState<string | null>(null);
  const [commentCardId, setCommentCardId] = useState<string | null>(null);
  const [impactCardId, setImpactCardId] = useState<string | null>(null);
  const [impactEntries, setImpactEntries] = useState<
    Array<{ contract: ImpactContract; links: MetricLink[] }>
  >([]);
  const [impactReload, setImpactReload] = useState(0);

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

  const cards: MetricCard[] = useMemo(() => {
    const applyOverride = (c: MetricCard) => {
      const o = cardOverrides[c.id];
      return o ? { ...c, ...o } : c;
    };
    const merged = baseCards.map(applyOverride);
    const seen = new Set(merged.map((c) => c.id));
    const extras = extraCards
      .filter((c) => !seen.has(c.id))
      .map(applyOverride);
    return [...merged, ...extras].filter((c) => !deletedIds.has(c.id));
  }, [baseCards, extraCards, cardOverrides, deletedIds]);

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

  // Resolve assignee/owner ids → display info (batched, keyed by id set).
  const peopleIds = useMemo(() => {
    const set = new Set<string>();
    for (const c of cards) {
      (c.assignees ?? []).forEach((id) => id && set.add(id));
      if (c.owner) set.add(c.owner);
    }
    return Array.from(set).sort();
  }, [cards]);
  const peopleKey = peopleIds.join(',');
  useEffect(() => {
    if (!client || peopleIds.length === 0) return;
    getUsersByIds(peopleIds, client)
      .then(setFetchedUsers)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, peopleKey]);

  const refreshCommentCounts = useMemo(
    () => () => {
      if (!client || !canvasId) return;
      getCommentCountsByCard(canvasId, client)
        .then(setCommentCounts)
        .catch(() => {});
    },
    [client, canvasId]
  );
  useEffect(() => {
    refreshCommentCounts();
  }, [refreshCommentCounts]);

  // Impact contracts for this canvas → keyed summaries for board/table columns.
  useEffect(() => {
    if (!client || !canvasId) return;
    listContractsWithLinksForProject(canvasId, client)
      .then(setImpactEntries)
      .catch(() => setImpactEntries([]));
  }, [client, canvasId, impactReload]);

  const impactSummaries = useMemo(() => {
    const map: Record<string, ImpactSummary> = {};
    for (const { contract, links } of impactEntries) {
      map[contract.strategyNodeId] = summarizeImpact(contract, links, cards);
    }
    return map;
  }, [impactEntries, cards]);

  const impactByNode = useMemo(() => {
    const map: Record<string, { contract: ImpactContract; links: MetricLink[] }> = {};
    for (const e of impactEntries) map[e.contract.strategyNodeId] = e;
    return map;
  }, [impactEntries]);

  // Members carry avatars too — merge so a just-assigned person resolves before
  // the batched user fetch returns.
  const userMap = useMemo(() => {
    const m: Record<string, UserLite> = {};
    for (const mm of members) {
      m[mm.id] = {
        id: mm.id,
        name: mm.name,
        email: mm.email,
        avatar_url: mm.avatarUrl ?? null,
      };
    }
    return { ...m, ...fetchedUsers };
  }, [members, fetchedUsers]);

  // A group earns a Strategy pill when it contains at least one work card.
  const strategyGroups = useMemo(
    () => groups.filter((g) => resolveGroupMembers(g, cards).some(isWorkCard)),
    [groups, cards]
  );
  const activeGroup = useMemo(
    () => strategyGroups.find((g) => g.id === view) ?? null,
    [strategyGroups, view]
  );
  const scopedCards = useMemo(
    () => (activeGroup ? resolveGroupMembers(activeGroup, cards) : cards),
    [activeGroup, cards]
  );
  const board = useMemo(() => buildGroupStrategy(scopedCards), [scopedCards]);

  // The value chain is the canvas-level backbone — always all cards/edges.
  const edges: Relationship[] = useMemo(
    () => (storeMatches ? (storeCanvas?.edges ?? []) : loadedEdges),
    [storeMatches, storeCanvas?.edges, loadedEdges]
  );
  const journey = useMemo(
    () => buildValueJourney(cards, edges),
    [cards, edges]
  );

  // Optimistic patch → persist → conditional store sync → revert on failure.
  const applyPatch = (cardId: string, patch: Partial<MetricCard>) => {
    if (!client) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const restore: Partial<MetricCard> = {};
    for (const k of Object.keys(patch) as (keyof MetricCard)[]) {
      (restore as Record<string, unknown>)[k] = card[k];
    }
    setCardOverrides((p) => ({ ...p, [cardId]: { ...(p[cardId] ?? {}), ...patch } }));
    updateMetricCard(cardId, patch, client)
      .then(() => {
        if (storeMatches) useCanvasStore.getState().updateNode(cardId, patch);
      })
      .catch(() => {
        setCardOverrides((p) => ({
          ...p,
          [cardId]: { ...(p[cardId] ?? {}), ...restore },
        }));
        toast.error('Update failed');
      });
  };

  const handleStatusChange = (cardId: string, status: WorkflowStatus) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || (card.status ?? 'backlog') === status) return;
    applyPatch(cardId, { status });
  };
  const handlePriorityChange = (cardId: string, priority: PriorityLevel) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const workflow: CardWorkflow = { ...(card.workflow ?? {}), priority };
    applyPatch(cardId, { workflow });
  };
  const handleDueDateChange = (cardId: string, dueDate: string | undefined) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const workflow: CardWorkflow = { ...(card.workflow ?? {}), dueDate };
    applyPatch(cardId, { workflow });
  };
  const handleAssigneesChange = (cardId: string, assignees: string[]) => {
    const prev = cards.find((c) => c.id === cardId)?.assignees ?? [];
    applyPatch(cardId, { assignees });
    const added = assignees.filter((id) => !prev.includes(id));
    if (added.length > 0 && client) {
      void notifyCardAssigned(cardId, added, client).catch((e) =>
        console.error('assigned notification failed', e)
      );
    }
  };

  const handleCreateItem = async (
    category: MetricCard['category'],
    status: WorkflowStatus
  ) => {
    if (!client || !canvasId || !userId) return;
    try {
      const created = await createMetricCard(
        {
          id: '',
          title:
            category === 'Ideas/Hypothesis' ? 'New hypothesis' : 'New action',
          description: '',
          category,
          tags: [],
          causalFactors: [],
          dimensions: [],
          position: { x: 0, y: 0 },
          assignees: [],
          owner: userId,
          status,
          workflow: {},
          createdAt: '',
          updatedAt: '',
        } as MetricCard,
        canvasId,
        userId,
        client
      );
      setExtraCards((p) => [...p, created]);
      if (storeMatches) useCanvasStore.getState().addNode(created);
      // Open settings so the user can rename immediately.
      setSettingsCardId(created.id);
    } catch {
      toast.error('Failed to create item');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const ok = await confirm({
      title: 'Delete this item?',
      description: 'It is removed from the canvas too. This cannot be undone.',
      actionLabel: 'Delete',
      destructive: true,
    });
    if (!ok || !client) return;
    setDeletedIds((p) => new Set(p).add(cardId));
    try {
      await deleteMetricCard(cardId, client);
      if (storeMatches) useCanvasStore.getState().deleteNode(cardId);
    } catch {
      setDeletedIds((p) => {
        const n = new Set(p);
        n.delete(cardId);
        return n;
      });
      toast.error('Failed to delete item');
    }
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

  const isEmpty = board.counts.total === 0 && strategyGroups.length === 0;
  if (isEmpty) {
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
                Add Action and Hypothesis nodes on the canvas — or start one
                here. Group them together to get a dedicated strategy per
                initiative, the same way grouping metrics builds a dashboard.
              </p>
            </div>
            <Button
              disabled={!canEdit || !canvasId}
              onClick={() => void handleCreateItem('Work/Action', 'backlog')}
            >
              <Plus className="mr-2 h-4 w-4" />
              New action
            </Button>
          </div>
        </Card>
        <TaskPanel
          isOpen={Boolean(settingsCardId)}
          onClose={() => setSettingsCardId(null)}
          cardId={settingsCardId ?? undefined}
          card={cards.find((c) => c.id === settingsCardId)}
          projectId={canvasId}
          onPersist={(updates) => {
            if (settingsCardId) applyPatch(settingsCardId, updates);
          }}
          onDelete={async () => {
            if (settingsCardId) await handleDeleteCard(settingsCardId);
          }}
        />
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

      {/* Group pills + Board/Table toggle */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setView(ALL_VIEW)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
            !activeGroup
              ? 'border-transparent bg-primary text-primary-foreground'
              : 'border-border bg-background hover:bg-muted'
          )}
        >
          <SquareKanban className="h-3.5 w-3.5" />
          All
        </button>
        {strategyGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setView(g.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
              view === g.id
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-muted'
            )}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: g.color || '#6366f1' }}
            />
            {g.name}
          </button>
        ))}

        <div className="ml-auto flex items-center rounded-md border shadow-sm">
          <Button
            variant={viewMode === 'board' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 gap-1.5 rounded-r-none"
            onClick={() => setViewMode('board')}
          >
            <SquareKanban className="h-3.5 w-3.5" />
            Board
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 gap-1.5 rounded-none"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="h-3.5 w-3.5" />
            Table
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 gap-1.5 rounded-l-none"
            onClick={() => setViewMode('tree')}
          >
            <Target className="h-3.5 w-3.5" />
            Tree
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {board.counts.actions} action{board.counts.actions === 1 ? '' : 's'} ·{' '}
        {board.counts.hypotheses} hypothes
        {board.counts.hypotheses === 1 ? 'is' : 'es'} · {board.counts.done}{' '}
        done
      </div>

      {viewMode === 'board' ? (
        <StrategyBoard
          board={board}
          onStatusChange={handleStatusChange}
          onCardClick={setSettingsCardId}
          impactSummaries={impactSummaries}
        />
      ) : viewMode === 'tree' ? (
        <StrategyTree
          cards={scopedCards}
          groups={groups}
          relationships={edges}
          impactByNode={impactByNode}
          onOpenImpact={setImpactCardId}
        />
      ) : (
        <StrategyTable
          board={board}
          groups={groups}
          userMap={userMap}
          members={members}
          commentCounts={commentCounts}
          impactSummaries={impactSummaries}
          canEdit={canEdit}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onAssigneesChange={handleAssigneesChange}
          onDueDateChange={handleDueDateChange}
          onOpenCard={setSettingsCardId}
          onOpenComments={setCommentCardId}
          onOpenImpact={setImpactCardId}
          onCreateItem={handleCreateItem}
          onDeleteCard={handleDeleteCard}
        />
      )}

      <TaskPanel
        isOpen={Boolean(settingsCardId)}
        onClose={() => setSettingsCardId(null)}
        cardId={settingsCardId ?? undefined}
        card={cards.find((c) => c.id === settingsCardId)}
        projectId={canvasId}
        onPersist={(updates) => {
          if (settingsCardId) applyPatch(settingsCardId, updates);
        }}
        onDelete={async () => {
          if (settingsCardId) await handleDeleteCard(settingsCardId);
        }}
      />
      <CardCommentSheet
        cardId={commentCardId}
        cardTitle={cards.find((c) => c.id === commentCardId)?.title}
        open={Boolean(commentCardId)}
        onOpenChange={(open) => !open && setCommentCardId(null)}
        onClosed={refreshCommentCounts}
      />
      <StrategyImpactSheet
        cardId={impactCardId}
        cardTitle={cards.find((c) => c.id === impactCardId)?.title}
        projectId={canvasId}
        cards={cards}
        relationships={edges}
        canEdit={canEdit}
        open={Boolean(impactCardId)}
        onOpenChange={(open) => {
          if (!open) {
            setImpactCardId(null);
            setImpactReload((n) => n + 1);
          }
        }}
      />
    </div>
  );
}
