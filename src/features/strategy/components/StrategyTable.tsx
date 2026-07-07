import type { ProjectMember } from '@/features/canvas/hooks/useProjectMembers';
import type { StrategyBoardData } from '@/features/strategy/utils/groupStrategy';
import {
  PRIORITY_LEVELS,
  PRIORITY_STYLES,
  WORKFLOW_STATUSES,
  WORKFLOW_STATUS_STYLES,
  type PriorityLevel,
} from '@/features/canvas/utils/workflow';
import { AssigneeCell } from '@/features/strategy/components/AssigneeCell';
import { DueDateCell } from '@/features/strategy/components/DueDateCell';
import {
  EditablePill,
  type PillOption,
} from '@/features/strategy/components/EditablePill';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import type { GroupNode, MetricCard, WorkflowStatus } from '@/shared/types';
import type { UserLite } from '@/shared/lib/supabase/services/users';
import { cn } from '@/shared/utils';
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Hammer,
  MessageSquare,
  MoreVertical,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ImpactChip } from '@/features/strategy/components/ImpactChip';
import {
  IMPACT_FILTERS,
  matchesImpactFilter,
  type ImpactFilter,
  type ImpactSummary,
} from '@/features/strategy/impact/impactContract';
import type { MeasuredImpact } from '@/features/strategy/impact/measurement';

const STATUS_OPTIONS: PillOption<WorkflowStatus>[] = WORKFLOW_STATUSES.map(
  (s) => ({ value: s.value, label: s.label, className: WORKFLOW_STATUS_STYLES[s.value] })
);
const PRIORITY_OPTIONS: PillOption<PriorityLevel>[] = PRIORITY_LEVELS.map((p) => ({
  value: p,
  label: p,
  className: PRIORITY_STYLES[p],
}));

export interface StrategyTableHandlers {
  onStatusChange: (cardId: string, status: WorkflowStatus) => void;
  onPriorityChange: (cardId: string, priority: PriorityLevel) => void;
  onAssigneesChange: (cardId: string, ids: string[]) => void;
  onDueDateChange: (cardId: string, iso: string | undefined) => void;
  onOpenCard: (cardId: string) => void;
  onOpenComments: (cardId: string) => void;
  onOpenImpact: (cardId: string) => void;
  onCreateItem: (category: MetricCard['category'], status: WorkflowStatus) => void;
  onDeleteCard: (cardId: string) => void;
}

interface StrategyTableProps extends StrategyTableHandlers {
  board: StrategyBoardData;
  groups: GroupNode[];
  userMap: Record<string, UserLite>;
  members: ProjectMember[];
  commentCounts: Record<string, number>;
  impactSummaries: Record<string, ImpactSummary>;
  measuredMap?: Record<string, MeasuredImpact>;
  canEdit: boolean;
}

// Column sorting (within each status section). Cycles asc → desc → off.
type SortKey = 'title' | 'type' | 'group' | 'due' | 'priority';
type SortState = { key: SortKey; dir: 'asc' | 'desc' } | null;

// Monday-style header cell: quiet label on a muted band; the sort arrow ghosts
// in on hover and locks in (flipping for desc) once the column is sorted.
function SortableHead({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sort?.key === sortKey;
  return (
    <TableHead
      className={cn('p-0', className)}
      aria-sort={
        active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined
      }
    >
      <button
        onClick={() => onSort(sortKey)}
        className={cn(
          'group/head flex h-9 w-full items-center gap-1 px-2 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground',
          active ? 'text-foreground' : 'text-muted-foreground'
        )}
        title={`Sort by ${label.toLowerCase()}`}
      >
        {label}
        <ArrowUp
          className={cn(
            'h-3 w-3 transition-all duration-150',
            active
              ? cn('opacity-100', sort.dir === 'desc' && 'rotate-180')
              : 'opacity-0 group-hover/head:opacity-40'
          )}
        />
      </button>
    </TableHead>
  );
}

function TypeCell({ card }: { card: MetricCard }) {
  const isHypothesis = card.category === 'Ideas/Hypothesis';
  const Icon = isHypothesis ? FlaskConical : Hammer;
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon
        className={cn(
          'h-3.5 w-3.5',
          isHypothesis ? 'text-purple-500' : 'text-blue-500'
        )}
      />
      {card.subCategory || (isHypothesis ? 'Hypothesis' : 'Action')}
    </span>
  );
}

export function StrategyTable({
  board,
  groups,
  userMap,
  members,
  commentCounts,
  impactSummaries,
  measuredMap,
  canEdit,
  onStatusChange,
  onPriorityChange,
  onAssigneesChange,
  onDueDateChange,
  onOpenCard,
  onOpenComments,
  onOpenImpact,
  onCreateItem,
  onDeleteCard,
}: StrategyTableProps) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>('all');
  const [sort, setSort] = useState<SortState>(null);
  // 'YYYY-MM' — drives the "review ready" filter (window ended while measuring).
  const currentPeriod = useMemo(() => new Date().toISOString().slice(0, 7), []);

  // cardId -> the groups it belongs to (dot + name), from group node_ids.
  const cardGroups = useMemo(() => {
    const map: Record<string, Array<{ name: string; color: string }>> = {};
    for (const g of groups) {
      for (const id of g.nodeIds || []) {
        (map[id] ??= []).push({ name: g.name, color: g.color || '#6366f1' });
      }
    }
    return map;
  }, [groups]);

  const query = search.trim().toLowerCase();
  const matches = (c: MetricCard) =>
    !query || (c.title || '').toLowerCase().includes(query);

  const toggle = (status: string) =>
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));

  const toggleSort = (key: SortKey) =>
    setSort((prev) =>
      prev?.key !== key
        ? { key, dir: 'asc' }
        : prev.dir === 'asc'
          ? { key, dir: 'desc' }
          : null
    );

  // Missing values (no group, no due date, no priority) always sort last.
  const sortRows = (rows: MetricCard[]): MetricCard[] => {
    if (!sort) return rows;
    const dirMul = sort.dir === 'asc' ? 1 : -1;
    const val = (c: MetricCard): string | number | undefined => {
      switch (sort.key) {
        case 'title':
          return (c.title || '').toLowerCase();
        case 'type':
          return (
            c.subCategory ||
            (c.category === 'Ideas/Hypothesis' ? 'hypothesis' : 'action')
          ).toLowerCase();
        case 'group':
          return cardGroups[c.id]?.[0]?.name.toLowerCase();
        case 'due':
          return c.workflow?.dueDate;
        case 'priority': {
          const p = c.workflow?.priority;
          return p ? PRIORITY_LEVELS.indexOf(p) : undefined;
        }
      }
    };
    return [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      return (va < vb ? -1 : va > vb ? 1 : 0) * dirMul;
    });
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5" disabled={!canEdit}>
              <Plus className="h-3.5 w-3.5" />
              New item
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onSelect={() => onCreateItem('Work/Action', 'backlog')}
              className="gap-2"
            >
              <Hammer className="h-4 w-4 text-blue-500" /> Action
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onCreateItem('Ideas/Hypothesis', 'backlog')}
              className="gap-2"
            >
              <FlaskConical className="h-4 w-4 text-purple-500" /> Hypothesis
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="h-8 max-w-xs"
        />

        <Select
          value={impactFilter}
          onValueChange={(v) => setImpactFilter(v as ImpactFilter)}
        >
          <SelectTrigger className="h-8 w-40" aria-label="Filter by impact">
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

      {board.columns.map((column) => {
        const rows = sortRows(
          column.cards
            .filter(matches)
            .filter((c) =>
              matchesImpactFilter(
                impactFilter,
                impactSummaries[c.id],
                currentPeriod
              )
            )
        );
        if ((query || impactFilter !== 'all') && rows.length === 0) return null;
        const isCollapsed = collapsed[column.status];

        return (
          <div key={column.status} className="rounded-lg border">
            <button
              onClick={() => toggle(column.status)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold',
                  WORKFLOW_STATUS_STYLES[column.status]
                )}
              >
                {column.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {rows.length} item{rows.length === 1 ? '' : 's'}
              </span>
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto border-t">
                <Table>
                  <TableHeader>
                    {/* A distinct header band (vs body rows): muted background,
                        quiet small labels, sortable columns with hover arrows. */}
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <SortableHead
                        label="Item"
                        sortKey="title"
                        sort={sort}
                        onSort={toggleSort}
                        className="min-w-[240px]"
                      />
                      <TableHead className="w-16 text-center">
                        <MessageSquare className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                      </TableHead>
                      <SortableHead
                        label="Type"
                        sortKey="type"
                        sort={sort}
                        onSort={toggleSort}
                        className="w-36"
                      />
                      <SortableHead
                        label="Group"
                        sortKey="group"
                        sort={sort}
                        onSort={toggleSort}
                        className="w-40"
                      />
                      <TableHead className="w-48 text-xs font-medium text-muted-foreground">
                        Impact
                      </TableHead>
                      <TableHead className="w-28 text-xs font-medium text-muted-foreground">
                        People
                      </TableHead>
                      <SortableHead
                        label="Due"
                        sortKey="due"
                        sort={sort}
                        onSort={toggleSort}
                        className="w-28"
                      />
                      <TableHead className="w-32 text-xs font-medium text-muted-foreground">
                        Status
                      </TableHead>
                      <SortableHead
                        label="Priority"
                        sortKey="priority"
                        sort={sort}
                        onSort={toggleSort}
                        className="w-28"
                      />
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((card) => {
                      const cardGrps = cardGroups[card.id] || [];
                      const count = commentCounts[card.id] ?? 0;
                      const assignees = card.assignees ?? [];
                      return (
                        <TableRow
                          key={card.id}
                          className="group cursor-pointer transition-colors duration-150 hover:bg-accent/50"
                          onDoubleClick={(e) => {
                            // Don't hijack double-clicks on inline controls.
                            const t = e.target as HTMLElement;
                            if (t.closest('button, a, input, [role="checkbox"]'))
                              return;
                            onOpenCard(card.id);
                          }}
                          title="Double-click to open"
                        >
                          <TableCell>
                            <button
                              onClick={() => onOpenCard(card.id)}
                              className="text-left text-sm font-medium hover:text-primary hover:underline"
                            >
                              {card.title || 'Untitled'}
                            </button>
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => onOpenComments(card.id)}
                              className={cn(
                                'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs',
                                count > 0
                                  ? 'text-primary'
                                  : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                              )}
                              title="Open discussion"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              {count > 0 ? count : ''}
                            </button>
                          </TableCell>
                          <TableCell>
                            <TypeCell card={card} />
                          </TableCell>
                          <TableCell>
                            {cardGrps.length === 0 ? (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs">
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full"
                                  style={{ backgroundColor: cardGrps[0].color }}
                                />
                                <span className="truncate">
                                  {cardGrps[0].name}
                                </span>
                                {cardGrps.length > 1 && (
                                  <span className="text-muted-foreground">
                                    +{cardGrps.length - 1}
                                  </span>
                                )}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {impactSummaries[card.id] ? (
                              <button
                                onClick={() => onOpenImpact(card.id)}
                                className="text-left"
                                title="Edit impact"
                              >
                                <ImpactChip summary={impactSummaries[card.id]} measured={measuredMap?.[card.id]} />
                              </button>
                            ) : (
                              <button
                                onClick={() => onOpenImpact(card.id)}
                                className="text-xs text-muted-foreground opacity-0 hover:text-primary group-hover:opacity-100"
                              >
                                + Impact
                              </button>
                            )}
                          </TableCell>
                          <TableCell>
                            <AssigneeCell
                              assigneeIds={assignees}
                              userMap={userMap}
                              members={members}
                              disabled={!canEdit}
                              onChange={(ids) =>
                                onAssigneesChange(card.id, ids)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <DueDateCell
                              value={card.workflow?.dueDate}
                              disabled={!canEdit}
                              onChange={(iso) => onDueDateChange(card.id, iso)}
                            />
                          </TableCell>
                          <TableCell>
                            <EditablePill
                              value={card.status ?? 'backlog'}
                              options={STATUS_OPTIONS}
                              disabled={!canEdit}
                              onChange={(s) => onStatusChange(card.id, s)}
                            />
                          </TableCell>
                          <TableCell>
                            <EditablePill
                              value={card.workflow?.priority}
                              options={PRIORITY_OPTIONS}
                              disabled={!canEdit}
                              placeholder="Set"
                              onChange={(p) => onPriorityChange(card.id, p)}
                            />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onSelect={() => onOpenCard(card.id)}
                                >
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => onOpenComments(card.id)}
                                >
                                  Discussion
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => onOpenImpact(card.id)}
                                >
                                  <Target className="mr-2 h-4 w-4" />
                                  Impact
                                </DropdownMenuItem>
                                {canEdit && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onSelect={() => onDeleteCard(card.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {canEdit && !query && (
                  <button
                    onClick={() =>
                      onCreateItem('Work/Action', column.status)
                    }
                    className="flex w-full items-center gap-1.5 px-4 py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
