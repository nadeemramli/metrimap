/**
 * Canvas Data Converters
 * Utilities for converting between canvas data models and ReactFlow nodes/edges
 */

import { DynamicEdge, OperativeEdge } from '@/features/canvas/components/edges';
import DataFlowEdge from '@/features/canvas/components/edges/DataFlowEdge';
import ReferenceEdge from '@/features/canvas/components/edges/ReferenceEdge';

// Import existing node types
import { GroupNode, MetricCard } from '@/features/canvas/components/nodes';
import EvidenceNode from '@/features/canvas/components/nodes/EvidenceNode';
import ChartNode from '@/features/canvas/components/nodes/chart-node';
import OperatorNode from '@/features/canvas/components/nodes/operator-node';
import SourceNode from '@/features/canvas/components/nodes/source-node/source-node';

// Import new PRD-based node types
import ActionNode from '@/features/canvas/components/nodes/ActionNode';
import HypothesisNode from '@/features/canvas/components/nodes/HypothesisNode';
import MetricNode from '@/features/canvas/components/nodes/MetricNode';
import ValueNode from '@/features/canvas/components/nodes/ValueNode';

import type {
  EvidenceItem,
  GroupNode as GroupNodeType,
  MetricCard as MetricCardType,
  Relationship,
  RelationshipType,
} from '@/shared/types';
import { MarkerType, type Edge, type Node } from '@xyflow/react';
import type { LayoutDirection } from '@/shared/utils/autoLayout';
import { normalizeOperatorData } from '@/features/canvas/utils/operatorMigration';

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

// Anchor an edge to the direction-appropriate handle on each side so the tree
// reads with clear parent→child flow instead of every edge funnelling through
// one handle. Every node type now exposes all four handles (top-target /
// bottom-source / left-target / right-source) and connectionMode is loose, so
// all four layout directions anchor cleanly — the edge leaves the parent's
// "downstream" side and enters the child's "upstream" side.
export const handlesForDirection = (
  dir: LayoutDirection
): { sourceHandle?: string; targetHandle?: string } => {
  switch (dir) {
    case 'TB':
      return { sourceHandle: 'bottom-source', targetHandle: 'top-target' };
    case 'BT':
      return { sourceHandle: 'top-target', targetHandle: 'bottom-source' };
    case 'LR':
      return { sourceHandle: 'right-source', targetHandle: 'left-target' };
    case 'RL':
      return { sourceHandle: 'left-target', targetHandle: 'right-source' };
    default:
      return {};
  }
};

// Arrowhead color mirrors DynamicEdge's stroke logic (gray for formulaic/zero,
// green for positive weight, red for negative).
const arrowColorForRelationship = (relationship: Relationship): string => {
  if (
    relationship.type === 'Deterministic' ||
    relationship.type === 'Compositional'
  )
    return '#6b7280';
  const w = relationship.weight;
  if (w === undefined || w === 0) return '#6b7280';
  return w > 0 ? '#16a34a' : '#dc2626';
};

// Convert Relationship to ReactFlow Edge with DynamicEdge
export const convertToEdge = (
  relationship: Relationship,
  onOpenRelationshipSheet: (relationshipId: string) => void,
  onSwitchToRelationship: (relationshipId: string) => void,
  isRelationshipSheetOpen: boolean,
  layoutDirection: LayoutDirection = 'TB'
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

  const { sourceHandle, targetHandle } = handlesForDirection(layoutDirection);

  return {
    id: relationship.id,
    source: relationship.sourceId,
    target: relationship.targetId,
    sourceHandle,
    targetHandle,
    type: 'dynamicEdge',
    animated: shouldAnimate, // Animate dotted lines (Probabilistic and Compositional)
    zIndex: getEdgeZIndex(relationship.type), // Use React Flow's edge z-index system
    // Explicit arrowhead so every relationship shows parent→child direction.
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: arrowColorForRelationship(relationship),
    },
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
  selectable: true,
  draggable: true,
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
  ) => void,
  onColorChange?: (groupId: string, color: string) => void
): Node => ({
  id: group.id,
  position: group.position,
  data: {
    group,
    onEditGroup,
    onDeleteGroup,
    onToggleCollapse,
    onResizeGroup,
    onColorChange,
  },
  type: 'groupNode',
  style: {
    width: group.size.width,
    height: group.isCollapsed ? 60 : group.size.height,
  },
  draggable: true,
  selectable: true,
  // Drag the frame only from its header bar (Figma-style); the body sits behind
  // the cards (zIndex 0 + ordered first) so the cards stay interactive.
  dragHandle: '.group-drag-handle',
  zIndex: 0,
  className: 'group-node',
});

// Import additional node components
import { WhiteboardNode } from '@/features/canvas/components/nodes';
import CommentNode from '@/features/canvas/components/nodes/comment-node';
import type { CanvasNode } from '@/shared/types';

// Convert CanvasNode to ReactFlow Node
export const convertToCanvasNode = (
  canvasNode: CanvasNode,
  selectedNodeIds: string[] = []
): Node => ({
  id: canvasNode.id,
  type: canvasNode.nodeType,
  position: canvasNode.position,
  data: {
    ...canvasNode.data,
    title: canvasNode.title,
    projectId: canvasNode.projectId,
    // Ensure all node types have the required data structure
    ...(canvasNode.nodeType === 'commentNode' && {
      title: canvasNode.title || 'Comment',
    }),
    // Operator: normalize legacy data (boolean→toggle, datePicker→passthrough)
    // and the new shape (named inputs, per-type config) at read time.
    ...(canvasNode.nodeType === 'operatorNode' &&
      normalizeOperatorData(canvasNode.data as any)),
    ...(canvasNode.nodeType === 'sourceNode' && {
      title: canvasNode.title || 'Source',
      sourceType: canvasNode.data?.sourceType || 'warehouse',
    }),
    ...(canvasNode.nodeType === 'chartNode' && {
      title: canvasNode.title || 'Chart',
      chartType: canvasNode.data?.chartType || 'area',
      seriesCardIds: canvasNode.data?.seriesCardIds || [],
      showLegend: canvasNode.data?.showLegend ?? true,
    }),
    ...(canvasNode.nodeType === 'whiteboardNode' && {
      shape: canvasNode.data?.shape || 'rect',
    }),
  },
  // Whiteboard nodes render at 100% of their container, so they need an explicit
  // node size. Honour data.width/height (set on create / in seeds), else default.
  ...(canvasNode.nodeType === 'whiteboardNode' && {
    style: {
      width: canvasNode.data?.width ?? 240,
      height: canvasNode.data?.height ?? 120,
    },
  }),
  selected: selectedNodeIds.includes(canvasNode.id),
  selectable: true,
  draggable: true,
});

// Define custom node and edge types for ReactFlow
export const nodeTypes = {
  // Legacy node types (for backward compatibility)
  metricCard: MetricCard,
  groupNode: GroupNode,
  evidenceNode: EvidenceNode,
  sourceNode: SourceNode,
  chartNode: ChartNode,
  operatorNode: OperatorNode,
  whiteboardNode: WhiteboardNode,
  commentNode: CommentNode,

  // New PRD-based node types
  valueNode: ValueNode,
  actionNode: ActionNode,
  hypothesisNode: HypothesisNode,
  metricNode: MetricNode,
};

export const edgeTypes = {
  dynamicEdge: DynamicEdge, // Relationship Edge - Business logic connections
  operativeEdge: OperativeEdge, // Data Flow Edge - Data pipeline connections
  dataFlowEdge: DataFlowEdge, // Alternative Data Flow Edge component
  referenceEdge: ReferenceEdge, // Reference Edge - Simple reference connections
};
