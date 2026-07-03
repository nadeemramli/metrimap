import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/lib/stores';
import { getMetricValues } from '@/shared/lib/supabase/services/trackedMetrics';
import type { MetricValue } from '@/shared/types';

// Live cross-canvas catalog propagation. When a Tracked Metric's shared VALUES
// (metric_values) or DEFINITION (tracked_metrics) change in another session,
// update the referencing cards on THIS canvas without a reload — the load-time
// hydration and the same-canvas push-down already cover the other paths.
//
// Uses local-only updateNode (no persist, no canvas broadcast): the catalog is
// the source of truth, so we just mirror it onto referenced cards. RLS applies
// at the realtime layer, so a session only receives changes it can see
// (catalog is currently owner-scoped, so this mainly serves one user with
// several canvases open — the common case).

/** Cards on the current canvas that reference a given tracked metric. */
function referencingCards(metricId: string) {
  return (useCanvasStore.getState().canvas?.nodes || []).filter(
    (n) => (n as { trackedMetricId?: string | null }).trackedMetricId === metricId
  );
}

export function useCatalogRealtime(
  canvasId: string | undefined,
  client: SupabaseClient | null | undefined
) {
  // Per-metric debounce: a series write upserts one row per period → many
  // events for one logical change; coalesce into a single refetch.
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!client || !canvasId) return;

    const refreshValues = (metricId: string) => {
      if (!metricId || referencingCards(metricId).length === 0) return;
      clearTimeout(timers.current[metricId]);
      timers.current[metricId] = setTimeout(async () => {
        try {
          const series = (await getMetricValues(
            metricId,
            client
          )) as MetricValue[];
          if (!series?.length) return;
          for (const card of referencingCards(metricId)) {
            useCanvasStore.getState().updateNode(card.id, { data: series });
          }
          console.log(`📈 catalog values synced for metric ${metricId}`);
        } catch (e) {
          console.error('Catalog realtime: value refetch failed', e);
        }
      }, 400);
    };

    const channel = client
      .channel(`catalog:${canvasId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'metric_values' },
        (payload) => {
          const row = (payload.new ?? payload.old) as {
            tracked_metric_id?: string;
          };
          if (row?.tracked_metric_id) refreshValues(row.tracked_metric_id);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tracked_metrics' },
        (payload) => {
          const def = payload.new as {
            id?: string;
            name?: string | null;
            formula?: string | null;
          };
          if (!def?.id) return;
          const cards = referencingCards(def.id);
          if (cards.length === 0) return;
          for (const card of cards) {
            const updates: { title?: string; formula?: string } = {};
            if (def.name && def.name !== card.title) updates.title = def.name;
            if ((def.formula ?? undefined) !== card.formula)
              updates.formula = def.formula ?? undefined;
            if (Object.keys(updates).length)
              useCanvasStore.getState().updateNode(card.id, updates);
          }
          console.log(`🏷️ catalog definition synced for metric ${def.id}`);
        }
      )
      .subscribe();

    const pending = timers.current;
    return () => {
      Object.values(pending).forEach(clearTimeout);
      void client.removeChannel(channel);
    };
  }, [client, canvasId]);
}
