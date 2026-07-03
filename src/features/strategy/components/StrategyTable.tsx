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
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Hammer,
  MessageSquare,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
  onCreateItem: (category: MetricCard['category'], status: WorkflowStatus) => void;
  onDeleteCard: (cardId: string) => void;
}

interface StrategyTableProps extends StrategyTableHandlers {
  board: StrategyBoardData;
  groups: GroupNode[];
  userMap: Record<string, UserLite>;
  members: ProjectMember[];
  commentCounts: Record<string, number>;
  canEdit: boolean;
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
  canEdit,
  onStatusChange,
  onPriorityChange,
  onAssigneesChange,
  onDueDateChange,
  onOpenCard,
  onOpenComments,
  onCreateItem,
  onDeleteCard,
}: StrategyTableProps) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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
      </div>

      {board.columns.map((column) => {
        const rows = column.cards.filter(matches);
        if (query && rows.length === 0) return null;
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
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[240px]">Item</TableHead>
                      <TableHead className="w-16 text-center">
                        <MessageSquare className="mx-auto h-3.5 w-3.5" />
                      </TableHead>
                      <TableHead className="w-36">Type</TableHead>
                      <TableHead className="w-40">Group</TableHead>
                      <TableHead className="w-28">People</TableHead>
                      <TableHead className="w-28">Due</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-28">Priority</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((card) => {
                      const cardGrps = cardGroups[card.id] || [];
                      const count = commentCounts[card.id] ?? 0;
                      const assignees = card.assignees ?? [];
                      return (
                        <TableRow key={card.id} className="group">
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
