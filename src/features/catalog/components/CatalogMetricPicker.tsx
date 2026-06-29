'use client';

// Add a catalogued Tracked Metric to the current canvas: creates a metric card
// pre-linked to the metric (tracked_metric_id) and seeded with its shared series,
// so it reads the same values as every other placement of that metric.

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useCanvasStore } from '@/lib/stores';
import { useNodeStore } from '@/features/canvas/stores/useNodeStore';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getMetricValues,
  linkCardToMetric,
  listTrackedMetrics,
  type TrackedMetric,
} from '@/shared/lib/supabase/services/trackedMetrics';
import type { MetricCard } from '@/shared/types';
import { Database, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CatalogMetricPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvasId: string;
  position: { x: number; y: number };
}

export function CatalogMetricPicker({
  open,
  onOpenChange,
  canvasId,
  position,
}: CatalogMetricPickerProps) {
  const client = useClerkSupabase();
  const [metrics, setMetrics] = useState<TrackedMetric[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !client) return;
    setBusy(true);
    listTrackedMetrics(client)
      .then(setMetrics)
      .catch((e) =>
        toast.error(e instanceof Error ? e.message : 'Failed to load catalog')
      )
      .finally(() => setBusy(false));
  }, [open, client]);

  const filtered = query
    ? metrics.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase())
      )
    : metrics;

  const addToCanvas = async (metric: TrackedMetric) => {
    if (!client) return;
    setAddingId(metric.id);
    try {
      const series = await getMetricValues(metric.id, client);
      // Create the card (zod strips tracked_metric_id, so link separately).
      const newCard = await useNodeStore.getState().createNode(
        {
          title: metric.name,
          description: '',
          category: 'Data/Metric' as MetricCard['category'],
          tags: [],
          causalFactors: [],
          dimensions: [],
          segments: [],
          assignees: [],
          position,
          data: series,
          formula: metric.formula ?? undefined,
        } as Omit<MetricCard, 'id' | 'createdAt' | 'updatedAt'>,
        canvasId
      );
      await linkCardToMetric(newCard.id, metric.id, client);
      // Add locally with the link + shared series so it renders immediately.
      useCanvasStore.getState().addNode({
        ...newCard,
        trackedMetricId: metric.id,
        data: series,
      } as MetricCard);
      toast.success(`Added "${metric.name}" from catalog`);
      onOpenChange(false);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to add metric to canvas'
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Add from Metric Catalog
          </DialogTitle>
          <DialogDescription>
            Place a catalogued metric on this canvas — it shares its definition
            and values with every other placement.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search metrics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="max-h-72 overflow-auto space-y-1">
          {busy ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {metrics.length === 0
                ? 'No catalogued metrics yet. Catalog one from a sourced card first.'
                : 'No metrics match your search.'}
            </p>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => addToCanvas(m)}
                disabled={addingId !== null}
                className="w-full flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm hover:bg-muted transition-colors disabled:opacity-50"
              >
                <span className="min-w-0">
                  <span className="font-medium">{m.name}</span>
                  {m.unit && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({m.unit})
                    </span>
                  )}
                </span>
                {addingId === m.id ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
