import type { CardCategory, MetricCard, Relationship } from '@/shared/types';

export interface FilterOptions {
  categories?: CardCategory[];
  tags?: string[];
  owners?: string[];
  confidence?: ('High' | 'Medium' | 'Low')[];
  relationshipTypes?: (
    | 'Deterministic'
    | 'Probabilistic'
    | 'Causal'
    | 'Compositional'
  )[];
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

// Helper predicates to reduce complexity
const normalize = (v?: string) => (v ?? '').toLowerCase();

const matchesCategories = (card: MetricCard, options: FilterOptions): boolean =>
  !options.categories?.length || options.categories.includes(card.category);

function matchesTags(card: MetricCard, options: FilterOptions): boolean {
  const tags = options.tags;
  if (!tags || tags.length === 0) return true;
  const cardTags = card.tags || [];
  if (cardTags.length === 0) return false;
  const haystack = cardTags.map(normalize).join(' ');
  return tags.map(normalize).some((s) => haystack.includes(s));
}

function matchesOwner(card: MetricCard, options: FilterOptions): boolean {
  const { owners } = options;
  if (!owners || owners.length === 0) return true;
  return !!card.owner && owners.includes(card.owner);
}

function matchesSearch(card: MetricCard, options: FilterOptions): boolean {
  const { searchTerm } = options;
  if (!searchTerm) return true;
  const q = normalize(searchTerm);
  const inTitle = normalize(card.title).includes(q);
  const inDesc = normalize(card.description).includes(q);
  const inTags = (card.tags || []).some((tag) => normalize(tag).includes(q));
  return inTitle || inDesc || inTags;
}

function matchesDate(card: MetricCard, options: FilterOptions): boolean {
  const { dateRange } = options;
  if (!dateRange) return true;
  const cardDate = new Date(card.createdAt);
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  return !(cardDate < startDate || cardDate > endDate);
}

function buildMetricCardPredicate(options: FilterOptions) {
  return (card: MetricCard) =>
    matchesCategories(card, options) &&
    matchesTags(card, options) &&
    matchesOwner(card, options) &&
    matchesSearch(card, options) &&
    matchesDate(card, options);
}

// Relationship helpers
const matchesConfidence = (
  rel: Relationship,
  options: FilterOptions
): boolean =>
  !options.confidence?.length ||
  options.confidence.includes(rel.confidence as any);

function matchesRelType(rel: Relationship, options: FilterOptions): boolean {
  const { relationshipTypes } = options;
  if (!relationshipTypes || relationshipTypes.length === 0) return true;
  return relationshipTypes.includes(rel.type as any);
}

function matchesRelSearch(rel: Relationship, options: FilterOptions): boolean {
  const { searchTerm } = options;
  if (!searchTerm) return true;
  const q = normalize(searchTerm);
  const inType = normalize(rel.type).includes(q);
  const inEvidence = (rel.evidence || []).some(
    (e) => normalize(e.title).includes(q) || normalize(e.summary).includes(q)
  );
  return inType || inEvidence;
}

function matchesRelDate(rel: Relationship, options: FilterOptions): boolean {
  const { dateRange } = options;
  if (!dateRange) return true;
  const relDate = new Date(rel.createdAt);
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  return !(relDate < startDate || relDate > endDate);
}

function buildRelationshipPredicate(options: FilterOptions) {
  return (rel: Relationship) =>
    matchesConfidence(rel, options) &&
    matchesRelType(rel, options) &&
    matchesRelSearch(rel, options) &&
    matchesRelDate(rel, options);
}

/**
 * Filter metric cards based on filter options
 */
export function filterMetricCards(
  cards: MetricCard[],
  options: FilterOptions
): MetricCard[] {
  const predicate = buildMetricCardPredicate(options);
  return cards.filter(predicate);
}

/**
 * Filter relationships based on filter options
 */
export function filterRelationships(
  relationships: Relationship[],
  options: FilterOptions
): Relationship[] {
  const predicate = buildRelationshipPredicate(options);
  return relationships.filter(predicate);
}

/**
 * Get available filter options from current data
 */
export function getAvailableFilterOptions(
  cards: MetricCard[],
  relationships: Relationship[]
) {
  const categories = [...new Set(cards.map((card) => card.category))];
  const tags = [...new Set(cards.flatMap((card) => card.tags || []))];
  const owners = [
    ...new Set(cards.map((card) => card.owner).filter(Boolean)),
  ] as string[];
  const confidenceLevels = [
    ...new Set(relationships.map((rel) => rel.confidence)),
  ];
  const relationshipTypes = [...new Set(relationships.map((rel) => rel.type))];

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

  const visibleNodeIds = new Set(filteredCards.map((card) => card.id));
  const visibleEdgeIds = new Set(filteredRelationships.map((rel) => rel.id));

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
