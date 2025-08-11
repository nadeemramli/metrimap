/**
 * Data Transformers
 * Utilities for transforming database entities to application types
 * Extracted from projects service to eliminate duplication and improve maintainability
 */

import type {
  Group as DBGroup,
  MetricCard as DBMetricCard,
  Project as DBProject,
  Relationship as DBRelationship,
} from '@/lib/supabase/services/projects';
import type {
  CanvasProject,
  GroupNode,
  MetricCard as MetricCardType,
  Relationship,
} from '@/lib/types';

/**
 * Transform database MetricCard to application MetricCard type
 */
export function transformMetricCard(card: DBMetricCard): MetricCardType {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    category: card.category as any,
    subCategory: card.sub_category as any,
    tags: [], // Tags are now stored in metric_card_tags junction table
    causalFactors: (card.causal_factors || []) as any,
    dimensions: (card.dimensions || []) as any,
    segments: [],
    position: { x: card.position_x, y: card.position_y },
    parentId: undefined,
    data: card.data as any,
    sourceType: card.source_type as any,
    formula: card.formula || undefined,
    owner: card.owner_id || '',
    assignees: card.assignees || [],
    createdAt: card.created_at || new Date().toISOString(),
    updatedAt: card.updated_at || new Date().toISOString(),
  };
}

/**
 * Transform database MetricCard to application MetricCard with card field for compatibility
 */
export function transformMetricCardWithCompatibility(
  card: DBMetricCard
): MetricCardType & { card: MetricCardType } {
  const transformedCard = transformMetricCard(card);

  return {
    ...transformedCard,
    // Add card data for CanvasPreview compatibility
    card: transformedCard,
  };
}

/**
 * Transform database Relationship to application Relationship type
 */
export function transformRelationship(rel: DBRelationship): Relationship {
  console.log('🔍 Transforming relationship:', rel);

  const transformed = {
    id: rel.id,
    sourceId: rel.source_id,
    targetId: rel.target_id,
    source: rel.source_id, // For CanvasPreview compatibility
    target: rel.target_id, // For CanvasPreview compatibility
    type: rel.type as any,
    confidence: rel.confidence as any,
    weight: rel.weight || 1,
    description: rel.description || '',
    evidence:
      rel.evidence_items?.map((evidence: any) => ({
        id: evidence.id,
        title: evidence.title,
        type: evidence.type as any,
        date: evidence.date,
        owner: evidence.owner_id || '',
        link: evidence.link || undefined,
        hypothesis: evidence.hypothesis || undefined,
        summary: evidence.summary,
        impactOnConfidence: evidence.impact_on_confidence || undefined,
      })) || [],
    createdAt: rel.created_at || new Date().toISOString(),
    updatedAt: rel.updated_at || new Date().toISOString(),
  };

  console.log('🔍 Transformed relationship:', transformed);
  return transformed;
}

/**
 * Transform database Group to application GroupNode type
 */
export function transformGroup(group: DBGroup): GroupNode {
  return {
    id: group.id,
    name: group.name,
    description: group.description || '',
    color: group.color || '#e5e7eb',
    nodeIds: group.node_ids || [],
    position: { x: group.position_x, y: group.position_y },
    size: { width: group.width, height: group.height },
    isCollapsed: false,
    createdAt: group.created_at || new Date().toISOString(),
    updatedAt: group.updated_at || new Date().toISOString(),
  };
}

/**
 * Transform database Project with related data to CanvasProject type
 */
export function transformCanvasProject(
  project: DBProject & { project_collaborators?: any[] },
  metricCards: DBMetricCard[],
  relationships: DBRelationship[],
  groups: DBGroup[]
): CanvasProject {
  return {
    id: project.id,
    name: project.name,
    description: project.description || '',
    tags: project.tags || [],
    collaborators:
      project.project_collaborators?.map((pc: any) => pc.users.email) || [],

    // Transform metric cards to match our MetricCard interface
    nodes: metricCards?.map(transformMetricCardWithCompatibility) || [],

    // Transform relationships to match our Relationship interface
    edges: relationships?.map(transformRelationship) || [],

    // Transform groups to match our GroupNode interface
    groups: groups?.map(transformGroup) || [],

    settings: (project.settings as any) || {},
    createdAt: project.created_at || new Date().toISOString(),
    updatedAt: project.updated_at || new Date().toISOString(),
    lastModifiedBy: project.last_modified_by || project.created_by,
  };
}

/**
 * Batch transform multiple MetricCards
 */
export function transformMetricCards(cards: DBMetricCard[]): MetricCardType[] {
  return cards.map(transformMetricCard);
}

/**
 * Batch transform multiple Relationships
 */
export function transformRelationships(
  relationships: DBRelationship[]
): Relationship[] {
  return relationships.map(transformRelationship);
}

/**
 * Batch transform multiple Groups
 */
export function transformGroups(groups: DBGroup[]): GroupNode[] {
  return groups.map(transformGroup);
}
