/**
 * Edge Connection Rules and Validation
 * Defines which node types can connect to each other and what edge types to use
 */

import type { RelationshipType } from '@/shared/types';
import type { Node } from '@xyflow/react';

// Define all possible node types in the system
export type NodeType =
  | 'metricCard' // Current - will become metricNode
  | 'valueNode' // New - Core business value
  | 'actionNode' // New - Tasks and initiatives
  | 'hypothesisNode' // New - Ideas and brainstorming
  | 'evidenceNode' // Existing - Reports and documentation
  | 'metadataNode' // New - Context and enrichment
  | 'sourceNode' // Existing - Data sources
  | 'chartNode' // Existing - Visualizations
  | 'operatorNode' // Existing - Data operations
  | 'commentNode' // Existing - Comments
  | 'whiteboardNode' // Existing - Drawing
  | 'groupNode'; // Existing - Grouping

// Define edge types - matching the 3 actual edge types in the system
export type EdgeType =
  | 'relationshipEdge' // Dynamic Edge - For business logic connections with 4 relationship types
  | 'dataFlowEdge' // Operative Edge - For data pipeline connections
  | 'referenceEdge'; // Simple Edge - For metadata, evidence, and comment references

// Define connection rules
export interface ConnectionRule {
  sourceTypes: NodeType[];
  targetTypes: NodeType[];
  edgeType: EdgeType;
  relationshipType?: RelationshipType;
  description: string;
  isValid: boolean;
}

// Connection rules matrix
export const CONNECTION_RULES: ConnectionRule[] = [
  // RELATIONSHIP EDGES (Dynamic Edge) - Business logic connections
  // User chooses relationship type (Deterministic, Probabilistic, Causal, Compositional) in RelationshipSheet
  {
    sourceTypes: ['metricCard', 'valueNode'],
    targetTypes: ['metricCard', 'valueNode'],
    edgeType: 'relationshipEdge',
    description: 'Business logic relationships between core nodes',
    isValid: true,
  },
  {
    sourceTypes: ['actionNode'],
    targetTypes: ['metricCard', 'valueNode', 'actionNode'],
    edgeType: 'relationshipEdge',
    description: 'Action relationships with metrics and values',
    isValid: true,
  },
  {
    sourceTypes: ['hypothesisNode'],
    targetTypes: ['metricCard', 'valueNode', 'actionNode', 'hypothesisNode'],
    edgeType: 'relationshipEdge',
    description: 'Hypothesis relationships with business nodes',
    isValid: true,
  },

  // DATA FLOW EDGES (Operative Edge) - Data pipeline connections
  // These are for data processing and visualization pipelines
  {
    sourceTypes: ['sourceNode'],
    targetTypes: ['metricCard', 'operatorNode'],
    edgeType: 'dataFlowEdge',
    description: 'Data source to metric or data operator',
    isValid: true,
  },
  {
    sourceTypes: ['operatorNode'],
    targetTypes: ['metricCard', 'chartNode', 'operatorNode'],
    edgeType: 'dataFlowEdge',
    description: 'Data operator to metric, chart, or another operator',
    isValid: true,
  },
  {
    sourceTypes: ['metricCard'],
    targetTypes: ['chartNode', 'operatorNode'],
    edgeType: 'dataFlowEdge',
    description: 'Metric to visualization or data operator',
    isValid: true,
  },

  // REFERENCE EDGES (Simple Edge) - Simple reference connections
  // These are lightweight connections for context and documentation
  {
    sourceTypes: ['evidenceNode'],
    targetTypes: [
      'metricCard',
      'valueNode',
      'actionNode',
      'hypothesisNode',
      'sourceNode',
      'chartNode',
      'operatorNode',
    ],
    edgeType: 'referenceEdge',
    description: 'Evidence supporting any node',
    isValid: true,
  },
  {
    sourceTypes: ['metadataNode'],
    targetTypes: [
      'metricCard',
      'valueNode',
      'actionNode',
      'hypothesisNode',
      'sourceNode',
      'chartNode',
      'operatorNode',
    ],
    edgeType: 'referenceEdge',
    description: 'Metadata enriching any node',
    isValid: true,
  },
  {
    sourceTypes: ['commentNode'],
    targetTypes: [
      'metricCard',
      'valueNode',
      'actionNode',
      'hypothesisNode',
      'sourceNode',
      'chartNode',
      'operatorNode',
    ],
    edgeType: 'referenceEdge',
    description: 'Comments on any node',
    isValid: true,
  },
];

/**
 * Validate if a connection between two nodes is allowed
 */
export function validateConnection(
  sourceNode: Node,
  targetNode: Node
): {
  isValid: boolean;
  rule?: ConnectionRule;
  reason?: string;
} {
  const sourceType = sourceNode.type as NodeType;
  const targetType = targetNode.type as NodeType;

  // Find matching rule
  const rule = CONNECTION_RULES.find(
    (rule) =>
      rule.sourceTypes.includes(sourceType) &&
      rule.targetTypes.includes(targetType) &&
      rule.isValid
  );

  if (rule) {
    return {
      isValid: true,
      rule,
    };
  }

  return {
    isValid: false,
    reason: `Connection from ${sourceType} to ${targetType} is not allowed`,
  };
}

/**
 * Get the appropriate edge type for a connection
 */
export function getEdgeTypeForConnection(
  sourceNode: Node,
  targetNode: Node
): {
  edgeType: EdgeType;
  relationshipType?: RelationshipType;
} | null {
  const validation = validateConnection(sourceNode, targetNode);

  if (!validation.isValid || !validation.rule) {
    return null;
  }

  return {
    edgeType: validation.rule.edgeType,
    relationshipType: validation.rule.relationshipType,
  };
}

/**
 * Get all valid target types for a given source type
 */
export function getValidTargetsForSource(sourceType: NodeType): NodeType[] {
  const validTargets = new Set<NodeType>();

  CONNECTION_RULES.filter(
    (rule) => rule.sourceTypes.includes(sourceType) && rule.isValid
  ).forEach((rule) => {
    rule.targetTypes.forEach((target) => validTargets.add(target));
  });

  return Array.from(validTargets);
}

/**
 * Get all valid source types for a given target type
 */
export function getValidSourcesForTarget(targetType: NodeType): NodeType[] {
  const validSources = new Set<NodeType>();

  CONNECTION_RULES.filter(
    (rule) => rule.targetTypes.includes(targetType) && rule.isValid
  ).forEach((rule) => {
    rule.sourceTypes.forEach((source) => validSources.add(source));
  });

  return Array.from(validSources);
}

/**
 * Check if a connection would create a cycle (for data flow edges)
 */
export function wouldCreateCycle(
  sourceId: string,
  targetId: string,
  existingEdges: Array<{ source: string; target: string; type?: string }>
): boolean {
  // Only check cycles for data flow edges
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true; // Back edge found, cycle detected
    }
    if (visited.has(nodeId)) {
      return false; // Already processed
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Check all outgoing edges from this node
    const outgoingEdges = existingEdges.filter(
      (edge) => edge.source === nodeId
    );
    for (const edge of outgoingEdges) {
      if (hasCycle(edge.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Add the proposed edge temporarily
  const edgesWithProposed = [
    ...existingEdges,
    { source: sourceId, target: targetId },
  ];

  // Check if adding this edge creates a cycle
  return hasCycle(sourceId);
}
