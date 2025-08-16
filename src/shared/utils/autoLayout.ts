import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';

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
 * Enhanced implementation with robust error handling and validation
 */
export function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  options: Partial<LayoutOptions> = {}
): Node[] {
  console.log('🔄 applyAutoLayout: Starting layout calculation', {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    options,
  });

  // Early return for empty nodes
  if (!nodes.length) {
    console.log('⚠️ applyAutoLayout: No nodes to layout');
    return nodes;
  }

  // Validate inputs
  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    console.error(
      '❌ applyAutoLayout: Invalid input - nodes and edges must be arrays'
    );
    return nodes;
  }

  const opts = { ...defaultOptions, ...options };

  try {
    // Create dagre graph with enhanced configuration
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: opts.direction,
      nodesep: opts.nodeSeparation,
      ranksep: opts.rankSeparation,
      marginx: opts.marginX,
      marginy: opts.marginY,
      // Additional dagre options for better layout
      edgesep: 10, // Separation between edges
      acyclicer: 'greedy', // Algorithm for removing cycles
      ranker: 'tight-tree', // Ranking algorithm
    });

    // Validate and add nodes to dagre graph
    const validNodes = nodes.filter((node) => {
      if (!node.id) {
        console.warn('⚠️ applyAutoLayout: Skipping node without ID', node);
        return false;
      }
      return true;
    });

    validNodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: opts.nodeWidth,
        height: opts.nodeHeight,
      });
    });

    // Validate and add edges to dagre graph
    const validEdges = edges.filter((edge) => {
      if (!edge.source || !edge.target) {
        console.warn(
          '⚠️ applyAutoLayout: Skipping edge without source/target',
          edge
        );
        return false;
      }
      // Check if both source and target nodes exist
      if (
        !dagreGraph.hasNode(edge.source) ||
        !dagreGraph.hasNode(edge.target)
      ) {
        console.warn(
          '⚠️ applyAutoLayout: Skipping edge with missing nodes',
          edge
        );
        return false;
      }
      return true;
    });

    validEdges.forEach((edge) => {
      try {
        dagreGraph.setEdge(edge.source, edge.target);
      } catch (error) {
        console.warn('⚠️ applyAutoLayout: Failed to add edge', edge, error);
      }
    });

    console.log('🔄 applyAutoLayout: Graph prepared', {
      validNodes: validNodes.length,
      validEdges: validEdges.length,
      totalNodes: dagreGraph.nodeCount(),
      totalEdges: dagreGraph.edgeCount(),
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Update node positions with error handling
    const layoutedNodes = validNodes.map((node) => {
      try {
        const nodeWithPosition = dagreGraph.node(node.id);

        if (!nodeWithPosition) {
          console.warn(
            '⚠️ applyAutoLayout: No position calculated for node',
            node.id
          );
          return node; // Return original node if no position calculated
        }

        const newPosition = {
          x: nodeWithPosition.x - nodeWithPosition.width / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        };

        // Validate position values
        if (isNaN(newPosition.x) || isNaN(newPosition.y)) {
          console.warn(
            '⚠️ applyAutoLayout: Invalid position calculated for node',
            node.id,
            newPosition
          );
          return node; // Return original node if position is invalid
        }

        return {
          ...node,
          position: newPosition,
        };
      } catch (error) {
        console.error(
          '❌ applyAutoLayout: Error processing node',
          node.id,
          error
        );
        return node; // Return original node on error
      }
    });

    console.log(
      '✅ applyAutoLayout: Layout calculation completed successfully',
      {
        layoutedNodes: layoutedNodes.length,
      }
    );

    return layoutedNodes;
  } catch (error) {
    console.error(
      '❌ applyAutoLayout: Critical error during layout calculation',
      error
    );
    // Return original nodes on critical error
    return nodes;
  }
}

/**
 * Auto-layout algorithms matching CanvasControls implementation
 */
export const AUTO_LAYOUT_ALGORITHMS = [
  { value: 'TB', label: 'Top to Bottom' },
  { value: 'BT', label: 'Bottom to Top' },
  { value: 'LR', label: 'Left to Right' },
  { value: 'RL', label: 'Right to Left' },
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
export function getOptimalLayoutDirection(
  _nodes: Node[],
  edges: Edge[]
): LayoutDirection {
  // Simple heuristic: if more edges flow horizontally, use LR, otherwise TB
  if (edges.length === 0) return 'TB';

  // For now, default to TB (Top to Bottom) which works well for metric trees
  // This can be enhanced with more sophisticated analysis
  return 'TB';
}

/**
 * Validate layout result and provide debugging information
 */
export function validateLayoutResult(
  originalNodes: Node[],
  layoutedNodes: Node[]
): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check if all nodes are present
  if (originalNodes.length !== layoutedNodes.length) {
    issues.push(
      `Node count mismatch: ${originalNodes.length} -> ${layoutedNodes.length}`
    );
  }

  // Check for missing nodes
  const originalIds = new Set(originalNodes.map((n) => n.id));
  const layoutedIds = new Set(layoutedNodes.map((n) => n.id));

  for (const id of originalIds) {
    if (!layoutedIds.has(id)) {
      issues.push(`Missing node after layout: ${id}`);
    }
  }

  // Check for invalid positions
  layoutedNodes.forEach((node) => {
    if (!node.position || isNaN(node.position.x) || isNaN(node.position.y)) {
      issues.push(
        `Invalid position for node ${node.id}: ${JSON.stringify(node.position)}`
      );
    }
  });

  // Check for overlapping nodes (basic check)
  const positions = layoutedNodes.map((n) => ({ id: n.id, ...n.position }));
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      if (Math.abs(pos1.x - pos2.x) < 10 && Math.abs(pos1.y - pos2.y) < 10) {
        issues.push(
          `Potential overlap between nodes ${pos1.id} and ${pos2.id}`
        );
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Enhanced layout function with validation and debugging
 */
export function applyAutoLayoutWithValidation(
  nodes: Node[],
  edges: Edge[],
  options: Partial<LayoutOptions> = {}
): { nodes: Node[]; validation: { isValid: boolean; issues: string[] } } {
  const layoutedNodes = applyAutoLayout(nodes, edges, options);
  const validation = validateLayoutResult(nodes, layoutedNodes);

  if (!validation.isValid) {
    console.warn('⚠️ Layout validation failed:', validation.issues);
  } else {
    console.log('✅ Layout validation passed');
  }

  return { nodes: layoutedNodes, validation };
}
