import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

export interface LayoutOptions {
  direction: LayoutDirection;
  nodeWidth: number;
  nodeHeight: number;
  rankSeparation: number;
  nodeSeparation: number;
  marginX: number;
  marginY: number;
}

const defaultOptions: LayoutOptions = {
  direction: 'TB',
  nodeWidth: 320, // MetricCard width from CanvasControls
  nodeHeight: 200, // MetricCard height from CanvasControls
  rankSeparation: 150, // ranksep from CanvasControls
  nodeSeparation: 100, // nodesep from CanvasControls
  marginX: 50, // marginx from CanvasControls
  marginY: 50, // marginy from CanvasControls
};

/**
 * Apply dagre auto-layout to nodes and edges
 * Implementation based on the proven CanvasControls approach
 */
export function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  options: Partial<LayoutOptions> = {}
): Node[] {
  if (!nodes.length) return nodes;
  
  const opts = { ...defaultOptions, ...options };
  
  // Create dagre graph (exact implementation from CanvasControls)
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: opts.direction,
    nodesep: opts.nodeSeparation,
    ranksep: opts.rankSeparation,
    marginx: opts.marginX,
    marginy: opts.marginY,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: opts.nodeWidth,
      height: opts.nodeHeight,
    });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Update node positions (exact calculation from CanvasControls)
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return layoutedNodes;
}

/**
 * Auto-layout algorithms matching CanvasControls implementation
 */
export const AUTO_LAYOUT_ALGORITHMS = [
  { value: "TB", label: "Top to Bottom" },
  { value: "BT", label: "Bottom to Top" },
  { value: "LR", label: "Left to Right" },
  { value: "RL", label: "Right to Left" },
] as const;

/**
 * Get layout direction options for UI (legacy export for compatibility)
 */
export const layoutDirections = AUTO_LAYOUT_ALGORITHMS;

/**
 * Get handle positions based on layout direction
 * Important for React Flow edge positioning
 */
export function getHandlePositionsForDirection(direction: LayoutDirection) {
  switch (direction) {
    case 'TB':
      return { source: 'bottom', target: 'top' };
    case 'BT':
      return { source: 'top', target: 'bottom' };
    case 'LR':
      return { source: 'right', target: 'left' };
    case 'RL':
      return { source: 'left', target: 'right' };
    default:
      return { source: 'bottom', target: 'top' };
  }
}

/**
 * Smart layout that analyzes the graph structure and chooses optimal direction
 */
export function getOptimalLayoutDirection(nodes: Node[], edges: Edge[]): LayoutDirection {
  // Simple heuristic: if more edges flow horizontally, use LR, otherwise TB
  if (edges.length === 0) return 'TB';
  
  // For now, default to TB (Top to Bottom) which works well for metric trees
  // This can be enhanced with more sophisticated analysis
  return 'TB';
}