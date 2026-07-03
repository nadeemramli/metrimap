import { WORKFLOW_STATUSES } from '@/features/canvas/utils/workflow';
import type { MetricCard, WorkflowStatus } from '@/shared/types';

// Strategy boards from canvas groups: grouping Metric nodes gives a Dashboard;
// grouping Action/Hypothesis nodes gives a Strategy — a unified lifecycle
// kanban over the group's work cards. Pure + side-effect free.

export function isWorkCard(card: MetricCard): boolean {
  return (
    card.category === 'Work/Action' || card.category === 'Ideas/Hypothesis'
  );
}

export interface StrategyColumn {
  status: WorkflowStatus;
  label: string;
  cards: MetricCard[];
}

export interface StrategyBoardData {
  columns: StrategyColumn[];
  counts: {
    actions: number;
    hypotheses: number;
    total: number;
    done: number;
  };
}

const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

function columnSort(a: MetricCard, b: MetricCard): number {
  const pa = PRIORITY_ORDER[a.workflow?.priority ?? ''] ?? 3;
  const pb = PRIORITY_ORDER[b.workflow?.priority ?? ''] ?? 3;
  if (pa !== pb) return pa - pb;
  return (a.title || '').localeCompare(b.title || '');
}

export function buildGroupStrategy(members: MetricCard[]): StrategyBoardData {
  const work = members.filter(isWorkCard);

  const columns: StrategyColumn[] = WORKFLOW_STATUSES.map(
    ({ value, label }) => ({
      status: value,
      label,
      cards: work
        .filter((c) => (c.status ?? 'backlog') === value)
        .sort(columnSort),
    })
  );

  const counts = work.reduce(
    (acc, c) => {
      if (c.category === 'Work/Action') acc.actions += 1;
      else acc.hypotheses += 1;
      if ((c.status ?? 'backlog') === 'done') acc.done += 1;
      acc.total += 1;
      return acc;
    },
    { actions: 0, hypotheses: 0, total: 0, done: 0 }
  );

  return { columns, counts };
}
