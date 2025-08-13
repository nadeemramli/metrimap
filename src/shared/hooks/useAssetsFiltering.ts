import type { MetricCard, Relationship } from '@/shared/types';
import { useMemo } from 'react';

type SortField =
  | 'name'
  | 'category'
  | 'updated'
  | 'connections'
  | 'confidence'
  | 'type';
type SortOrder = 'asc' | 'desc';

interface UseAssetsFilteringProps {
  metrics: MetricCard[];
  relationships: Relationship[];
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  categoryFilter: string;
  typeFilter: string;
  confidenceFilter: string;
}

export function useAssetsFiltering({
  metrics,
  relationships,
  searchQuery,
  sortField,
  sortOrder,
  categoryFilter,
  typeFilter,
  confidenceFilter,
}: UseAssetsFilteringProps) {
  const filteredMetrics = useMemo(() => {
    let filtered = metrics.filter(
      (metric: MetricCard) =>
        metric.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (metric: MetricCard) => metric.category === categoryFilter
      );
    }

    return filtered.sort((a: MetricCard, b: MetricCard) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return a.title.localeCompare(b.title) * multiplier;
        case 'category':
          return a.category.localeCompare(b.category) * multiplier;
        case 'updated':
          return (
            (new Date(a.updatedAt).getTime() -
              new Date(b.updatedAt).getTime()) *
            multiplier
          );
        default:
          return 0;
      }
    });
  }, [metrics, searchQuery, categoryFilter, sortField, sortOrder]);

  const filteredRelationships = useMemo(() => {
    let filtered = relationships.filter((rel: Relationship) => {
      const sourceNode = metrics.find((m: MetricCard) => m.id === rel.sourceId);
      const targetNode = metrics.find((m: MetricCard) => m.id === rel.targetId);
      return (
        sourceNode?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        targetNode?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rel.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (rel: Relationship) => rel.type === typeFilter
      );
    }

    // Apply confidence filter
    if (confidenceFilter !== 'all') {
      filtered = filtered.filter(
        (rel: Relationship) => rel.confidence === confidenceFilter
      );
    }

    // Apply sorting
    return filtered.sort((a: Relationship, b: Relationship) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          const sourceNodeA = metrics.find(
            (m: MetricCard) => m.id === a.sourceId
          );
          const sourceNodeB = metrics.find(
            (m: MetricCard) => m.id === b.sourceId
          );
          const targetNodeA = metrics.find(
            (m: MetricCard) => m.id === a.targetId
          );
          const targetNodeB = metrics.find(
            (m: MetricCard) => m.id === b.targetId
          );
          const nameA = `${sourceNodeA?.title || 'Unknown'} → ${targetNodeA?.title || 'Unknown'}`;
          const nameB = `${sourceNodeB?.title || 'Unknown'} → ${targetNodeB?.title || 'Unknown'}`;
          return nameA.localeCompare(nameB) * multiplier;
        case 'type':
          return a.type.localeCompare(b.type) * multiplier;
        case 'confidence':
          return a.confidence.localeCompare(b.confidence) * multiplier;
        case 'updated':
          return (
            (new Date(a.updatedAt).getTime() -
              new Date(b.updatedAt).getTime()) *
            multiplier
          );
        default:
          return 0;
      }
    });
  }, [
    relationships,
    metrics,
    searchQuery,
    typeFilter,
    confidenceFilter,
    sortField,
    sortOrder,
  ]);

  return {
    filteredMetrics,
    filteredRelationships,
  };
}
