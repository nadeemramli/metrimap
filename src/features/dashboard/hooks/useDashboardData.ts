// Dashboard server-state hooks (CVS-70).
//
// Wraps the existing Supabase services in TanStack Query so revisiting the dashboard shows
// cached data immediately (stale-while-revalidate) instead of refetching from a spinner.
// Components consume these hooks; they never fetch Supabase directly. Client/UI state stays
// in Zustand — this is only the server-state layer.
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/queries/keys';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { listWidgets } from '@/shared/lib/supabase/services/dashboards';
import {
  getMetricValuesByMetricIds,
  listTrackedMetrics,
} from '@/shared/lib/supabase/services/trackedMetrics';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { getCanvasNodesByProject } from '@/shared/lib/supabase/services/canvasNodes';
import { listContractsWithLinksForProject } from '@/shared/lib/supabase/services/strategyImpact';
import type { ImpactContract, MetricLink } from '@/features/strategy/impact/types';
import type { CanvasNode, GroupNode, MetricCard, MetricValue } from '@/shared/types';
import type { DashboardWidget } from '@/features/dashboard/types';

/** The full bundle the dashboard needs for one canvas, fetched in one query. */
export interface DashboardData {
  widgets: DashboardWidget[];
  trackedNames: Record<string, string>;
  cards: MetricCard[];
  groups: GroupNode[];
  chartNodes: CanvasNode[];
  impactEntries: Array<{ contract: ImpactContract; links: MetricLink[] }>;
}

/**
 * Load the dashboard bundle for a canvas. Cached under a per-canvas key, so navigating away
 * and back is instant while a background refetch keeps it fresh. Individual sub-fetches
 * degrade gracefully (a failed project/nodes/impact load yields empty, matching the prior
 * hand-rolled behavior) rather than failing the whole dashboard.
 */
export function useDashboardData(canvasId: string | undefined) {
  const client = useClerkSupabase();
  return useQuery({
    queryKey: queryKeys.dashboard.data(canvasId ?? ''),
    enabled: Boolean(client && canvasId),
    queryFn: async (): Promise<DashboardData> => {
      const [widgets, metrics, project, nodes, impact] = await Promise.all([
        listWidgets(canvasId!, client!),
        listTrackedMetrics(client!),
        getProjectById(canvasId!, client!).catch(() => null),
        getCanvasNodesByProject(canvasId!, client!).catch(() => [] as CanvasNode[]),
        listContractsWithLinksForProject(canvasId!, client!).catch(() => []),
      ]);
      return {
        widgets,
        trackedNames: Object.fromEntries(metrics.map((m) => [m.id, m.name])),
        cards: project?.nodes ?? [],
        groups: project?.groups ?? [],
        chartNodes: nodes.filter((n) => n.nodeType === 'chartNode'),
        impactEntries: impact,
      };
    },
  });
}

/** Shared series for the tracked metrics referenced by the dashboard's widgets/impact. */
export function useTrackedMetricValues(ids: string[]) {
  const client = useClerkSupabase();
  return useQuery({
    queryKey: queryKeys.metricValues.byIds(ids),
    enabled: Boolean(client) && ids.length > 0,
    queryFn: (): Promise<Record<string, MetricValue[]>> => getMetricValuesByMetricIds(ids, client!),
  });
}
