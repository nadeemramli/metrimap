/**
 * Canvas Data Converters
 * Utilities for converting between canvas data models and ReactFlow nodes/edges
 */

import { DynamicEdge, OperativeEdge } from '@/features/canvas/components/edges';
import { GroupNode, MetricCard } from '@/features/canvas/components/nodes';
import EvidenceNode from '@/features/canvas/components/nodes/EvidenceNode';
import ChartNode from '@/features/canvas/components/nodes/chart-node';
import OperatorNode from '@/features/canvas/components/nodes/operator-node';
import SourceNode from '@/features/canvas/components/nodes/source-node/source-node';
import type {
  EvidenceItem,
  GroupNode as GroupNodeType,
  MetricCard as MetricCardType,
  Relationship,
  RelationshipType,
} from '@/shared/types';
import type { Edge, Node } from '@xyflow/react';

// Convert MetricCard to ReactFlow Node
export const convertToNode = (
  card: MetricCardType,
  onOpenSettings: (cardId: string, tab?: string) => void,
  onNodeClick: (cardId: string) => void,
  onSwitchToCard: (cardId: string, tab?: string) => void,
  isSettingsSheetOpen: boolean,
  selectedNodeIds: string[] = []
): Node => ({
  id: card.id,
  position: card.position,
  parentId: card.parentId, // React Flow subflow support
  data: {
    card: card, // Store full card data for our custom component
    onOpenSettings, // Pass the settings callback
    onNodeClick, // Pass the click callback
    onSwitchToCard, // Pass the switch callback for persistent sheets
    isSettingsSheetOpen, // Pass the sheet open state
  },
  type: 'metricCard', // Use our custom node type
  selected: selectedNodeIds.includes(card.id),
  selectable: true, // Ensure nodes are selectable
  draggable: true, // Ensure nodes are draggable
  // Let React Flow handle layering naturally
});

// Convert Relationship to ReactFlow Edge with DynamicEdge
export const convertToEdge = (
  relationship: Relationship,
  onOpenRelationshipSheet: (relationshipId: string) => void,
  onSwitchToRelationship: (relationshipId: string) => void,
  isRelationshipSheetOpen: boolean
): Edge => {
  // Determine if edge should be animated based on relationship type
  const shouldAnimate =
    relationship.type === 'Probabilistic' ||
    relationship.type === 'Compositional';

  // Set z-index based on relationship type for proper layering
  const getEdgeZIndex = (type: RelationshipType) => {
    switch (type) {
      case 'Deterministic':
        return 1; // Base layer
      case 'Probabilistic':
        return 2; // Above deterministic
      case 'Causal':
        return 3; // Above probabilistic
      case 'Compositional':
        return 4; // Above causal
      default:
        return 1;
    }
  };

  return {
    id: relationship.id,
    source: relationship.sourceId,
    target: relationship.targetId,
    type: 'dynamicEdge',
    animated: shouldAnimate, // Animate dotted lines (Probabilistic and Compositional)
    zIndex: getEdgeZIndex(relationship.type), // Use React Flow's edge z-index system
    data: {
      relationship,
      onOpenRelationshipSheet,
      onSwitchToRelationship,
      isRelationshipSheetOpen,
      // Add a unique identifier to force re-rendering when relationship data changes
      renderKey: `${relationship.id}-${relationship.type}-${relationship.weight}-${relationship.confidence}`,
    },
  };
};

// Convert EvidenceItem to ReactFlow Node
export const convertToEvidenceNode = (
  evidence: EvidenceItem,
  onUpdateEvidence: (id: string, updates: Partial<EvidenceItem>) => void,
  onDeleteEvidence: (id: string) => void
): Node => ({
  id: evidence.id,
  type: 'evidenceNode',
  position: evidence.position || { x: 100, y: 100 },
  data: {
    evidence,
    onUpdateEvidence,
    onDeleteEvidence,
  },
  dragHandle: '.evidence-drag-handle',
});

// Convert GroupNode to ReactFlow Node
export const convertToGroupNode = (
  group: GroupNodeType,
  onEditGroup: (groupId: string) => void,
  onDeleteGroup: (groupId: string) => void,
  onToggleCollapse: (groupId: string) => void,
  onResizeGroup: (
    groupId: string,
    size: { width: number; height: number }
  ) => void
): Node => ({
  id: group.id,
  position: group.position,
  data: {
    group,
    onEditGroup,
    onDeleteGroup,
    onToggleCollapse,
    onResizeGroup,
  },
  type: 'groupNode',
  style: {
    width: group.size.width,
    height: group.isCollapsed ? 60 : group.size.height,
  },
  draggable: true,
  selectable: true,
  // Configure as subflow container
  className: 'group-node',
  // Ensure group is treated as a container
  extent: 'parent',
});

// Import additional node components
import { WhiteboardNode } from '@/features/canvas/components/nodes';
import CommentNode from '@/features/canvas/components/nodes/comment-node';

// Define custom node and edge types for ReactFlow
export const nodeTypes = {
  metricCard: MetricCard,
  groupNode: GroupNode,
  evidenceNode: EvidenceNode,
  sourceNode: SourceNode,
  chartNode: ChartNode,
  operatorNode: OperatorNode,
  whiteboardNode: WhiteboardNode,
  commentNode: CommentNode,
};

export const edgeTypes = {
  dynamicEdge: DynamicEdge,
  operativeEdge: OperativeEdge,
};
