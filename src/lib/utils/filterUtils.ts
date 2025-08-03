import type { MetricCard, Relationship, CardCategory } from '@/lib/types';

export interface FilterOptions {
  categories?: CardCategory[];
  tags?: string[];
  owners?: string[];
  confidence?: ('High' | 'Medium' | 'Low')[];
  relationshipTypes?: ('Deterministic' | 'Probabilistic' | 'Causal' | 'Compositional')[];
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface FilterState {
  isActive: boolean;
  options: FilterOptions;
  visibleNodeIds: Set<string>;
  visibleEdgeIds: Set<string>;
}

/**
 * Filter metric cards based on filter options
 */
export function filterMetricCards(
  cards: MetricCard[],
  options: FilterOptions
): MetricCard[] {
  return cards.filter(card => {
    // Category filter
    if (options.categories && options.categories.length > 0) {
      if (!options.categories.includes(card.category)) {
        return false;
      }
    }

    // Tags filter
    if (options.tags && options.tags.length > 0) {
      const cardTags = card.tags || [];
      const hasMatchingTag = options.tags.some(tag => 
        cardTags.some(cardTag => 
          cardTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Owner filter
    if (options.owners && options.owners.length > 0) {
      if (!card.owner || !options.owners.includes(card.owner)) {
        return false;
      }
    }

    // Search term filter
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      const matchesTitle = card.title.toLowerCase().includes(searchLower);
      const matchesDescription = card.description.toLowerCase().includes(searchLower);
      const matchesTags = (card.tags || []).some(tag => 
        tag.toLowerCase().includes(searchLower)
      );
      
      if (!matchesTitle && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    // Date range filter
    if (options.dateRange) {
      const cardDate = new Date(card.createdAt);
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);
      
      if (cardDate < startDate || cardDate > endDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter relationships based on filter options
 */
export function filterRelationships(
  relationships: Relationship[],
  options: FilterOptions
): Relationship[] {
  return relationships.filter(relationship => {
    // Confidence filter
    if (options.confidence && options.confidence.length > 0) {
      if (!options.confidence.includes(relationship.confidence)) {
        return false;
      }
    }

    // Relationship type filter
    if (options.relationshipTypes && options.relationshipTypes.length > 0) {
      if (!options.relationshipTypes.includes(relationship.type)) {
        return false;
      }
    }

    // Search term filter
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      const matchesType = relationship.type.toLowerCase().includes(searchLower);
      const matchesEvidence = (relationship.evidence || []).some(evidence => 
        evidence.title.toLowerCase().includes(searchLower) ||
        evidence.summary.toLowerCase().includes(searchLower)
      );
      
      if (!matchesType && !matchesEvidence) {
        return false;
      }
    }

    // Date range filter
    if (options.dateRange) {
      const relationshipDate = new Date(relationship.createdAt);
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);
      
      if (relationshipDate < startDate || relationshipDate > endDate) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get available filter options from current data
 */
export function getAvailableFilterOptions(
  cards: MetricCard[],
  relationships: Relationship[]
) {
  const categories = [...new Set(cards.map(card => card.category))];
  const tags = [...new Set(cards.flatMap(card => card.tags || []))];
  const owners = [...new Set(cards.map(card => card.owner).filter(Boolean))] as string[];
  const confidenceLevels = [...new Set(relationships.map(rel => rel.confidence))];
  const relationshipTypes = [...new Set(relationships.map(rel => rel.type))];

  return {
    categories,
    tags,
    owners,
    confidence: confidenceLevels,
    relationshipTypes,
  };
}

/**
 * Apply filters and return visible node/edge IDs
 */
export function applyFilters(
  cards: MetricCard[],
  relationships: Relationship[],
  options: FilterOptions
): { visibleNodeIds: Set<string>; visibleEdgeIds: Set<string> } {
  const filteredCards = filterMetricCards(cards, options);
  const filteredRelationships = filterRelationships(relationships, options);

  const visibleNodeIds = new Set(filteredCards.map(card => card.id));
  const visibleEdgeIds = new Set(filteredRelationships.map(rel => rel.id));

  return { visibleNodeIds, visibleEdgeIds };
}

/**
 * Get filter summary for UI display
 */
export function getFilterSummary(options: FilterOptions): string {
  const parts: string[] = [];

  if (options.categories?.length) {
    parts.push(`${options.categories.length} categories`);
  }
  if (options.tags?.length) {
    parts.push(`${options.tags.length} tags`);
  }
  if (options.owners?.length) {
    parts.push(`${options.owners.length} owners`);
  }
  if (options.confidence?.length) {
    parts.push(`${options.confidence.length} confidence levels`);
  }
  if (options.relationshipTypes?.length) {
    parts.push(`${options.relationshipTypes.length} relationship types`);
  }
  if (options.searchTerm) {
    parts.push(`search: "${options.searchTerm}"`);
  }
  if (options.dateRange) {
    parts.push('date range');
  }

  return parts.length > 0 ? parts.join(', ') : 'No filters';
} 