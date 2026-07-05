// Typed query-key factory for TanStack Query (CVS-70).
//
// One place that owns every server-state cache key, so invalidation and prefetch are
// type-safe and consistent instead of stringly-typed per call site. Keys are hierarchical
// — invalidating a broader key (e.g. `dashboard.all`) clears everything nested under it.
// As pages migrate off hand-rolled fetching, add their keys here rather than inline.

export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    /** The full dashboard bundle (widgets + catalog names + project + charts + impact). */
    data: (canvasId: string) => ['dashboard', 'data', canvasId] as const,
  },
  metricValues: {
    all: ['metricValues'] as const,
    /** Shared series for a set of tracked-metric ids (order-independent). */
    byIds: (ids: readonly string[]) => ['metricValues', [...ids].sort()] as const,
  },
} as const;
