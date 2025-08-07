import { useState, useCallback, useMemo } from 'react';
import { useCanvasStore } from '@/lib/stores';
import type { MetricCard, Relationship } from '@/lib/types';
import { generateUUID } from '@/lib/utils/validation';

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  errors: string[];
  updatedIds: string[];
}

export interface BulkUpdateData {
  category?: string;
  tags?: string[];
  owner?: string;
  assignees?: string[];
  // For relationships
  type?: string;
  confidence?: string;
  weight?: number;
}

export interface BulkOperationOptions {
  confirmRequired?: boolean;
  validateBeforeExecute?: boolean;
  trackHistory?: boolean;
}

export const useBulkOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<BulkOperationResult | null>(null);
  
  const {
    selectedNodeIds,
    canvas,
    updateNode,
    deleteNode,
    updateEdge,
    deleteEdge,
    addNode,
    clearSelection,
  } = useCanvasStore();

  // Get selected items
  const selectedMetrics = useMemo(() => {
    if (!canvas?.nodes) return [];
    return canvas.nodes.filter(node => selectedNodeIds.includes(node.id));
  }, [canvas?.nodes, selectedNodeIds]);

  const selectedRelationships = useMemo(() => {
    if (!canvas?.edges) return [];
    return canvas.edges.filter(edge => selectedNodeIds.includes(edge.id));
  }, [canvas?.edges, selectedNodeIds]);

  const hasSelection = selectedNodeIds.length > 0;
  const selectionCount = selectedNodeIds.length;
  const isMultiSelect = selectedNodeIds.length > 1;

  // Bulk update metrics
  const bulkUpdateMetrics = useCallback(async (
    updateData: BulkUpdateData,
    targetIds?: string[]
  ): Promise<BulkOperationResult> => {
    setIsProcessing(true);
    
    try {
      const idsToUpdate = targetIds || selectedNodeIds;
      const metricsToUpdate = canvas?.nodes.filter(node => idsToUpdate.includes(node.id)) || [];
      
      if (metricsToUpdate.length === 0) {
        throw new Error('No metrics selected for update');
      }

      const errors: string[] = [];
      const updatedIds: string[] = [];

      for (const metric of metricsToUpdate) {
        try {
          const updates: Partial<MetricCard> = {
            updatedAt: new Date().toISOString(),
          };

          // Apply updates
          if (updateData.category) updates.category = updateData.category as any;
          if (updateData.tags) updates.tags = updateData.tags;
          if (updateData.owner) updates.owner = updateData.owner;
          if (updateData.assignees) updates.assignees = updateData.assignees;

          updateNode(metric.id, updates);
          updatedIds.push(metric.id);
        } catch (error) {
          errors.push(`Failed to update ${metric.title}: ${error}`);
        }
      }

      const result: BulkOperationResult = {
        success: errors.length === 0,
        processed: updatedIds.length,
        errors,
        updatedIds,
      };

      setLastResult(result);
      return result;
    } catch (error) {
      const result: BulkOperationResult = {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        updatedIds: [],
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [canvas?.nodes, selectedNodeIds, updateNode]);

  // Bulk update relationships
  const bulkUpdateRelationships = useCallback(async (
    updateData: BulkUpdateData,
    targetIds?: string[]
  ): Promise<BulkOperationResult> => {
    setIsProcessing(true);
    
    try {
      const idsToUpdate = targetIds || selectedNodeIds;
      const relationshipsToUpdate = canvas?.edges.filter(edge => idsToUpdate.includes(edge.id)) || [];
      
      if (relationshipsToUpdate.length === 0) {
        throw new Error('No relationships selected for update');
      }

      const errors: string[] = [];
      const updatedIds: string[] = [];

      for (const relationship of relationshipsToUpdate) {
        try {
          const updates: Partial<Relationship> = {
            updatedAt: new Date().toISOString(),
          };

          // Apply updates
          if (updateData.type) updates.type = updateData.type as any;
          if (updateData.confidence) updates.confidence = updateData.confidence as any;
          if (updateData.weight !== undefined) updates.weight = updateData.weight;

          updateEdge(relationship.id, updates);
          updatedIds.push(relationship.id);
        } catch (error) {
          errors.push(`Failed to update relationship ${relationship.id}: ${error}`);
        }
      }

      const result: BulkOperationResult = {
        success: errors.length === 0,
        processed: updatedIds.length,
        errors,
        updatedIds,
      };

      setLastResult(result);
      return result;
    } catch (error) {
      const result: BulkOperationResult = {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        updatedIds: [],
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [canvas?.edges, selectedNodeIds, updateEdge]);

  // Bulk delete
  const bulkDelete = useCallback(async (
    targetIds?: string[]
  ): Promise<BulkOperationResult> => {
    setIsProcessing(true);
    
    try {
      const idsToDelete = targetIds || selectedNodeIds;
      
      if (idsToDelete.length === 0) {
        throw new Error('No items selected for deletion');
      }

      const errors: string[] = [];
      const deletedIds: string[] = [];

      // Delete metrics
      const metricsToDelete = canvas?.nodes.filter(node => idsToDelete.includes(node.id)) || [];
      for (const metric of metricsToDelete) {
        try {
          deleteNode(metric.id);
          deletedIds.push(metric.id);
        } catch (error) {
          errors.push(`Failed to delete metric ${metric.title}: ${error}`);
        }
      }

      // Delete relationships
      const relationshipsToDelete = canvas?.edges.filter(edge => idsToDelete.includes(edge.id)) || [];
      for (const relationship of relationshipsToDelete) {
        try {
          deleteEdge(relationship.id);
          deletedIds.push(relationship.id);
        } catch (error) {
          errors.push(`Failed to delete relationship ${relationship.id}: ${error}`);
        }
      }

      // Clear selection after deletion
      clearSelection();

      const result: BulkOperationResult = {
        success: errors.length === 0,
        processed: deletedIds.length,
        errors,
        updatedIds: deletedIds,
      };

      setLastResult(result);
      return result;
    } catch (error) {
      const result: BulkOperationResult = {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        updatedIds: [],
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedNodeIds, canvas?.nodes, canvas?.edges, deleteNode, deleteEdge, clearSelection]);

  // Bulk duplicate
  const bulkDuplicate = useCallback(async (
    targetIds?: string[]
  ): Promise<BulkOperationResult> => {
    setIsProcessing(true);
    
    try {
      const idsToDuplicate = targetIds || selectedNodeIds;
      const metricsToDuplicate = canvas?.nodes.filter(node => idsToDuplicate.includes(node.id)) || [];
      
      if (metricsToDuplicate.length === 0) {
        throw new Error('No metrics selected for duplication');
      }

      const errors: string[] = [];
      const duplicatedIds: string[] = [];

      for (const metric of metricsToDuplicate) {
        try {
          const duplicatedMetric: MetricCard = {
            ...metric,
            id: generateUUID(),
            title: `${metric.title} (Copy)`,
            position: {
              x: metric.position.x + 50,
              y: metric.position.y + 50,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          addNode(duplicatedMetric);
          duplicatedIds.push(duplicatedMetric.id);
        } catch (error) {
          errors.push(`Failed to duplicate ${metric.title}: ${error}`);
        }
      }

      const result: BulkOperationResult = {
        success: errors.length === 0,
        processed: duplicatedIds.length,
        errors,
        updatedIds: duplicatedIds,
      };

      setLastResult(result);
      return result;
    } catch (error) {
      const result: BulkOperationResult = {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        updatedIds: [],
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedNodeIds, canvas?.nodes, addNode]);

  // Bulk tag operations
  const bulkAddTags = useCallback(async (
    tags: string[],
    targetIds?: string[]
  ): Promise<BulkOperationResult> => {
    const idsToUpdate = targetIds || selectedNodeIds;
    const metricsToUpdate = canvas?.nodes.filter(node => idsToUpdate.includes(node.id)) || [];
    
    const updateData: BulkUpdateData = {
      tags: Array.from(new Set([...tags])), // Remove duplicates
    };

    // Merge with existing tags
    for (const metric of metricsToUpdate) {
      if (metric.tags) {
        updateData.tags = Array.from(new Set([...metric.tags, ...tags]));
      }
    }

    return bulkUpdateMetrics(updateData, targetIds);
  }, [selectedNodeIds, canvas?.nodes, bulkUpdateMetrics]);

  const bulkRemoveTags = useCallback(async (
    tags: string[],
    targetIds?: string[]
  ): Promise<BulkOperationResult> => {
    setIsProcessing(true);
    
    try {
      const idsToUpdate = targetIds || selectedNodeIds;
      const metricsToUpdate = canvas?.nodes.filter(node => idsToUpdate.includes(node.id)) || [];
      
      const errors: string[] = [];
      const updatedIds: string[] = [];

      for (const metric of metricsToUpdate) {
        try {
          const filteredTags = metric.tags?.filter(tag => !tags.includes(tag)) || [];
          
          updateNode(metric.id, {
            tags: filteredTags,
            updatedAt: new Date().toISOString(),
          });
          
          updatedIds.push(metric.id);
        } catch (error) {
          errors.push(`Failed to update tags for ${metric.title}: ${error}`);
        }
      }

      const result: BulkOperationResult = {
        success: errors.length === 0,
        processed: updatedIds.length,
        errors,
        updatedIds,
      };

      setLastResult(result);
      return result;
    } catch (error) {
      const result: BulkOperationResult = {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        updatedIds: [],
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedNodeIds, canvas?.nodes, updateNode]);

  // Export selected items
  const exportSelection = useCallback(async (
    format: 'json' | 'csv' = 'json',
    targetIds?: string[]
  ) => {
    const idsToExport = targetIds || selectedNodeIds;
    const metricsToExport = canvas?.nodes.filter(node => idsToExport.includes(node.id)) || [];
    const relationshipsToExport = canvas?.edges.filter(edge => 
      idsToExport.includes(edge.sourceId) || idsToExport.includes(edge.targetId)
    ) || [];

    const exportData = {
      metrics: metricsToExport,
      relationships: relationshipsToExport,
      exportedAt: new Date().toISOString(),
      count: {
        metrics: metricsToExport.length,
        relationships: relationshipsToExport.length,
      },
    };

    if (format === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `metrimap-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Simple CSV export for metrics
      const csvHeaders = ['ID', 'Title', 'Description', 'Category', 'Tags', 'Owner', 'Created', 'Updated'];
      const csvRows = metricsToExport.map(metric => [
        metric.id,
        metric.title,
        metric.description || '',
        metric.category,
        metric.tags?.join(';') || '',
        metric.owner || '',
        metric.createdAt,
        metric.updatedAt,
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `metrimap-metrics-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  }, [selectedNodeIds, canvas?.nodes, canvas?.edges]);

  return {
    // State
    isProcessing,
    lastResult,
    hasSelection,
    selectionCount,
    isMultiSelect,
    selectedMetrics,
    selectedRelationships,

    // Bulk operations
    bulkUpdateMetrics,
    bulkUpdateRelationships,
    bulkDelete,
    bulkDuplicate,
    bulkAddTags,
    bulkRemoveTags,
    exportSelection,

    // Utilities
    clearLastResult: () => setLastResult(null),
  };
};