import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import type { MetricCard, Relationship } from '@/shared/types';
import { useCallback, useMemo, useState } from 'react';

export type BulkUpdateData = Partial<
  Pick<MetricCard, 'category' | 'owner' | 'tags'> &
    Pick<Relationship, 'type' | 'confidence' | 'weight'>
>;

interface BulkResult {
  success: boolean;
  processed: number;
  errors: string[];
}

export function useBulkOperations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<BulkResult | null>(null);

  const {
    canvas,
    selectedNodeIds,
    selectedEdgeIds,
    updateNode,
    deleteNode,
    duplicateNode,
    updateEdge,
    deleteEdge,
  } = useCanvasStore();

  const selectedMetrics = useMemo(
    () => (canvas?.nodes || []).filter((n) => selectedNodeIds.includes(n.id)),
    [canvas?.nodes, selectedNodeIds]
  );
  const selectedRelationships = useMemo(
    () => (canvas?.edges || []).filter((e) => selectedEdgeIds.includes(e.id)),
    [canvas?.edges, selectedEdgeIds]
  );

  const hasSelection = selectedNodeIds.length + selectedEdgeIds.length > 0;
  const selectionCount = selectedNodeIds.length + selectedEdgeIds.length;

  const bulkUpdateMetrics = useCallback(
    async (data: BulkUpdateData): Promise<BulkResult> => {
      setIsProcessing(true);
      const errors: string[] = [];
      try {
        for (const node of selectedMetrics) {
          const updates: Partial<MetricCard> = {};
          if (data.category !== undefined)
            updates.category = data.category as MetricCard['category'];
          if (data.owner !== undefined) updates.owner = data.owner;
          if (data.tags !== undefined) updates.tags = data.tags as string[];
          if (Object.keys(updates).length > 0) updateNode(node.id, updates);
        }
        const result: BulkResult = {
          success: errors.length === 0,
          processed: selectedMetrics.length,
          errors,
        };
        setLastResult(result);
        return result;
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedMetrics, updateNode]
  );

  const bulkUpdateRelationships = useCallback(
    async (data: BulkUpdateData): Promise<BulkResult> => {
      setIsProcessing(true);
      const errors: string[] = [];
      try {
        for (const edge of selectedRelationships) {
          const updates: Partial<Relationship> = {};
          if (data.type !== undefined)
            updates.type = data.type as Relationship['type'];
          if (data.confidence !== undefined)
            updates.confidence = data.confidence as Relationship['confidence'];
          if (data.weight !== undefined) updates.weight = data.weight as number;
          if (Object.keys(updates).length > 0) updateEdge(edge.id, updates);
        }
        const result: BulkResult = {
          success: errors.length === 0,
          processed: selectedRelationships.length,
          errors,
        };
        setLastResult(result);
        return result;
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedRelationships, updateEdge]
  );

  const bulkDelete = useCallback(async (): Promise<BulkResult> => {
    setIsProcessing(true);
    const errors: string[] = [];
    try {
      for (const nodeId of selectedNodeIds) {
        try {
          deleteNode(nodeId);
        } catch (e: any) {
          errors.push(String(e?.message || e));
        }
      }
      for (const edgeId of selectedEdgeIds) {
        try {
          deleteEdge(edgeId);
        } catch (e: any) {
          errors.push(String(e?.message || e));
        }
      }
      const result: BulkResult = {
        success: errors.length === 0,
        processed: selectedNodeIds.length + selectedEdgeIds.length,
        errors,
      };
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedNodeIds, selectedEdgeIds, deleteNode, deleteEdge]);

  const bulkDuplicate = useCallback(async (): Promise<BulkResult> => {
    setIsProcessing(true);
    const errors: string[] = [];
    try {
      for (const nodeId of selectedNodeIds) {
        try {
          duplicateNode(nodeId);
        } catch (e: any) {
          errors.push(String(e?.message || e));
        }
      }
      const result: BulkResult = {
        success: errors.length === 0,
        processed: selectedNodeIds.length,
        errors,
      };
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedNodeIds, duplicateNode]);

  const bulkAddTags = useCallback(
    async (tags: string[]): Promise<BulkResult> => {
      setIsProcessing(true);
      const errors: string[] = [];
      try {
        for (const node of selectedMetrics) {
          const merged = Array.from(new Set([...(node.tags || []), ...tags]));
          updateNode(node.id, { tags: merged });
        }
        const result: BulkResult = {
          success: errors.length === 0,
          processed: selectedMetrics.length,
          errors,
        };
        setLastResult(result);
        return result;
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedMetrics, updateNode]
  );

  const exportSelection = useCallback(
    async (format: 'json' | 'csv') => {
      const payload = {
        nodes: selectedMetrics,
        edges: selectedRelationships,
      };
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'canvas-selection.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Very simple CSV: counts only
        const csv = `nodes,${selectedMetrics.length}\nedges,${selectedRelationships.length}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'canvas-selection.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [selectedMetrics, selectedRelationships]
  );

  const clearLastResult = useCallback(() => setLastResult(null), []);

  return {
    // selection
    hasSelection,
    selectionCount,
    selectedMetrics,
    selectedRelationships,
    // actions
    isProcessing,
    lastResult,
    bulkUpdateMetrics,
    bulkUpdateRelationships,
    bulkDelete,
    bulkDuplicate,
    bulkAddTags,
    exportSelection,
    clearLastResult,
  };
}
