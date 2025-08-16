/**
 * Enhanced Edge Connection Handler
 * Handles creating connections between nodes with proper validation and edge type selection
 */

import type { Relationship } from '@/shared/types';
import type { Connection, Node } from '@xyflow/react';
import {
  getEdgeTypeForConnection,
  validateConnection,
  wouldCreateCycle,
} from './edgeConnectionRules';

export interface ConnectionResult {
  success: boolean;
  edgeData?: any;
  error?: string;
  edgeType?: 'relationship' | 'dataFlow' | 'reference';
}

export interface ConnectionHandlerOptions {
  nodes: Node[];
  existingEdges: Array<{ source: string; target: string; type?: string }>;
  onCreateRelationship?: (
    relationshipData: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  onCreateDataFlow?: (edgeData: any) => void;
  onCreateReference?: (edgeData: any) => void;
}

/**
 * Enhanced connection handler that validates and creates appropriate edge types
 */
export function handleNodeConnection(
  connection: Connection,
  options: ConnectionHandlerOptions
): ConnectionResult {
  console.log('🔗 Enhanced connection handler:', connection);

  const {
    nodes,
    existingEdges,
    onCreateRelationship,
    onCreateDataFlow,
    onCreateReference,
  } = options;

  // Find source and target nodes
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) {
    const error = 'Source or target node not found';
    console.error('❌', error);
    return { success: false, error };
  }

  // Validate connection
  const validation = validateConnection(sourceNode, targetNode);
  if (!validation.isValid) {
    const error = validation.reason || 'Invalid connection';
    console.error('❌ Connection validation failed:', error);
    return { success: false, error };
  }

  // Get edge type
  const edgeInfo = getEdgeTypeForConnection(sourceNode, targetNode);
  if (!edgeInfo) {
    const error = 'Could not determine edge type';
    console.error('❌', error);
    return { success: false, error };
  }

  // Check for cycles in data flow connections
  if (edgeInfo.edgeType === 'dataFlowEdge') {
    if (
      wouldCreateCycle(connection.source!, connection.target!, existingEdges)
    ) {
      const error = 'Connection would create a cycle in data flow';
      console.error('❌', error);
      return { success: false, error };
    }
  }

  // Create appropriate edge based on type
  try {
    switch (edgeInfo.edgeType) {
      case 'relationshipEdge':
        return handleRelationshipEdge(
          connection,
          sourceNode,
          targetNode,
          edgeInfo,
          onCreateRelationship
        );

      case 'dataFlowEdge':
        return handleDataFlowEdge(
          connection,
          sourceNode,
          targetNode,
          onCreateDataFlow
        );

      case 'referenceEdge':
        return handleReferenceEdge(
          connection,
          sourceNode,
          targetNode,
          onCreateReference
        );

      default:
        const error = `Unknown edge type: ${edgeInfo.edgeType}`;
        console.error('❌', error);
        return { success: false, error };
    }
  } catch (error) {
    console.error('❌ Error creating edge:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown error creating edge',
    };
  }
}

/**
 * Handle relationship edge creation (business logic connections)
 * User will choose relationship type (Deterministic, Probabilistic, Causal, Compositional) in RelationshipSheet
 */
function handleRelationshipEdge(
  connection: Connection,
  sourceNode: Node,
  targetNode: Node,
  edgeInfo: { relationshipType?: any },
  onCreateRelationship?: (data: any) => Promise<void>
): ConnectionResult {
  const relationshipData = {
    sourceId: connection.source!,
    targetId: connection.target!,
    type: 'Deterministic' as const, // Default type, user can change in RelationshipSheet
    weight: 1.0,
    confidence: 'Medium' as const,
    evidence: [],
    notes: `Connection between ${getNodeTitle(sourceNode)} and ${getNodeTitle(targetNode)}`,
  };

  if (onCreateRelationship) {
    onCreateRelationship(relationshipData);
  }

  console.log(
    '✅ Created relationship edge (Dynamic Edge) - user can edit in RelationshipSheet'
  );
  return {
    success: true,
    edgeData: relationshipData,
    edgeType: 'relationship',
  };
}

/**
 * Handle data flow edge creation (data pipeline connections)
 * These are Operative Edges for data processing pipelines
 */
function handleDataFlowEdge(
  connection: Connection,
  sourceNode: Node,
  targetNode: Node,
  onCreateDataFlow?: (data: any) => void
): ConnectionResult {
  const edgeData = {
    id: `${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
    type: 'operativeEdge', // Use operativeEdge type to match existing system
    data: {
      label: getDataFlowLabel(sourceNode, targetNode),
      sourceType: sourceNode.type,
      targetType: targetNode.type,
    },
  };

  if (onCreateDataFlow) {
    onCreateDataFlow(edgeData);
  }

  console.log(
    '✅ Created data flow edge (Operative Edge):',
    edgeData.data.label
  );
  return {
    success: true,
    edgeData,
    edgeType: 'dataFlow',
  };
}

/**
 * Handle reference edge creation (metadata, evidence, comments)
 * These are Simple Edges for lightweight reference connections
 */
function handleReferenceEdge(
  connection: Connection,
  sourceNode: Node,
  targetNode: Node,
  onCreateReference?: (data: any) => void
): ConnectionResult {
  const edgeData = {
    id: `${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
    type: 'referenceEdge', // Simple edge type
    data: {
      label: getReferenceLabel(sourceNode, targetNode),
      sourceType: sourceNode.type,
      targetType: targetNode.type,
    },
  };

  if (onCreateReference) {
    onCreateReference(edgeData);
  }

  console.log('✅ Created reference edge (Simple Edge):', edgeData.data.label);
  return {
    success: true,
    edgeData,
    edgeType: 'reference',
  };
}

/**
 * Get node title for display
 */
function getNodeTitle(node: Node): string {
  return (
    node.data?.card?.title ||
    node.data?.title ||
    node.data?.label ||
    `${node.type} (${node.id.slice(0, 8)})`
  );
}

/**
 * Get appropriate label for data flow edges
 */
function getDataFlowLabel(sourceNode: Node, targetNode: Node): string {
  const sourceType = sourceNode.type;
  const targetType = targetNode.type;

  if (sourceType === 'sourceNode' && targetType === 'metricCard') {
    return 'Data Feed';
  }
  if (sourceType === 'sourceNode' && targetType === 'operatorNode') {
    return 'Raw Data';
  }
  if (sourceType === 'operatorNode' && targetType === 'metricCard') {
    return 'Processed Data';
  }
  if (sourceType === 'operatorNode' && targetType === 'chartNode') {
    return 'Visualization Data';
  }
  if (sourceType === 'metricCard' && targetType === 'chartNode') {
    return 'Metric Data';
  }

  return 'Data Flow';
}

/**
 * Get appropriate label for reference edges
 */
function getReferenceLabel(sourceNode: Node, targetNode: Node): string {
  const sourceType = sourceNode.type;

  switch (sourceType) {
    case 'evidenceNode':
      return 'Evidence';
    case 'metadataNode':
      return 'Metadata';
    case 'commentNode':
      return 'Comment';
    default:
      return 'Reference';
  }
}

/**
 * Validate if a connection is allowed (exported for external use)
 */
export function isConnectionAllowed(
  sourceNode: Node,
  targetNode: Node,
  existingEdges: Array<{ source: string; target: string; type?: string }> = []
): { allowed: boolean; reason?: string } {
  const validation = validateConnection(sourceNode, targetNode);

  if (!validation.isValid) {
    return { allowed: false, reason: validation.reason };
  }

  const edgeInfo = getEdgeTypeForConnection(sourceNode, targetNode);
  if (!edgeInfo) {
    return { allowed: false, reason: 'Could not determine edge type' };
  }

  // Check for cycles in data flow
  if (edgeInfo.edgeType === 'dataFlowEdge') {
    if (wouldCreateCycle(sourceNode.id, targetNode.id, existingEdges)) {
      return { allowed: false, reason: 'Would create cycle in data flow' };
    }
  }

  return { allowed: true };
}
