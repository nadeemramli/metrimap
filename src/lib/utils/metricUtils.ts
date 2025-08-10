import type { MetricCard, Relationship } from '@/lib/types';

/**
 * Get the appropriate color classes for a metric category badge
 */
export const getCategoryColor = (category: MetricCard['category']) => {
  switch (category) {
    case 'Core/Value':
      return 'bg-blue-50 border-blue-200 text-blue-900';
    case 'Data/Metric':
      return 'bg-green-50 border-green-200 text-green-900';
    case 'Work/Action':
      return 'bg-orange-50 border-orange-200 text-orange-900';
    case 'Ideas/Hypothesis':
      return 'bg-purple-50 border-purple-200 text-purple-900';
    case 'Metadata':
      return 'bg-gray-50 border-gray-200 text-gray-900';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-900';
  }
};

/**
 * Get the appropriate color classes for a relationship type badge
 */
export const getRelationshipTypeColor = (type: Relationship['type']) => {
  switch (type) {
    case 'Deterministic':
      return 'bg-gray-50 border-gray-200 text-gray-900';
    case 'Probabilistic':
      return 'bg-blue-50 border-blue-200 text-blue-900';
    case 'Causal':
      return 'bg-red-50 border-red-200 text-red-900';
    case 'Compositional':
      return 'bg-purple-50 border-purple-200 text-purple-900';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-900';
  }
};
