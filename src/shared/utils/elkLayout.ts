// ELK (Eclipse Layout Kernel) layout with ORTHOGONAL edge routing.
//
// Why ELK over Dagre here: Dagre only positions nodes — React Flow then draws
// each edge independently from a single handle, so sibling edges stack on one
// point and parallel edges overlap. ELK assigns ports along node borders AND
// computes routed edge sections (bend-points) in dedicated channels, so we can
// render edges along its computed path and avoid the overlaps. See
// docs/backlog/operator-control-feature.md siblings for the grouping/layout work.

import type {
  ElkExtendedEdge,
  ElkNode,
} from 'elkjs/lib/elk.bundled.js';
import type { Edge, Node } from '@xyflow/react';
import type { LayoutDirection } from './autoLayout';

// elkjs (the bundled ELK port) is ~1.5MB, so load it lazily on the first layout
// run and keep it out of the initial bundle. Cached after first import.
type ElkInstance = { layout: (graph: ElkNode) => Promise<ElkNode> };
let elkPromise: Promise<ElkInstance> | null = null;
function getElk(): Promise<ElkInstance> {
  if (!elkPromise) {
    elkPromise = import('elkjs/lib/elk.bundled.js').then(
      (mod) => new mod.default()
    );
  }
  return elkPromise;
}

export interface RoutedPoint {
  x: number;
  y: number;
}

export interface ElkLayoutResult {
  nodes: Node[];
  // Per-edge routed polyline (absolute flow coords): [start, ...bends, end].
  edgePoints: Record<string, RoutedPoint[]>;
}

const DIRECTION_MAP: Record<LayoutDirection, string> = {
  TB: 'DOWN',
  BT: 'UP',
  LR: 'RIGHT',
  RL: 'LEFT',
};

const DEFAULT_W = 320;
const DEFAULT_H = 200;

/**
 * Run ELK 'layered' layout with orthogonal edge routing. Returns the nodes with
 * new positions plus the routed bend-points per edge (so a custom edge can draw
 * the exact channel ELK reserved instead of a naive handle-to-handle curve).
 *
 * ELK is async. For a flat (non-nested) graph the section points are in the
 * root coordinate system, which equals React Flow's flow coords once we apply
 * the returned node positions — so the points can be used directly as the SVG
 * path.
 */
export async function elkLayout(
  nodes: Node[],
  edges: Edge[],
  opts: { direction?: LayoutDirection } = {}
): Promise<ElkLayoutResult> {
  if (!nodes.length) return { nodes, edgePoints: {} };

  const direction = opts.direction || 'TB';
  const nodeIds = new Set(nodes.map((n) => n.id));
  const validEdges = edges.filter(
    (e) => e.source && e.target && nodeIds.has(e.source) && nodeIds.has(e.target)
  );

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': DIRECTION_MAP[direction],
      'elk.edgeRouting': 'ORTHOGONAL',
      // Spacing: keep ranks tall (it's a tree) and give edges roomy channels so
      // parallel lanes read clearly rather than crowding each other.
      'elk.layered.spacing.nodeNodeBetweenLayers': '200',
      'elk.spacing.nodeNode': '100',
      'elk.spacing.edgeEdge': '40',
      'elk.spacing.edgeNode': '56',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '40',
      'elk.layered.spacing.edgeNodeBetweenLayers': '48',
      // Balanced, centered tree shape; respect existing order for stability.
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
      // Spread multiple edges across distinct ports on a node border so they
      // don't all leave/enter from one point.
      'elk.portConstraints': 'FREE',
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.measured?.width ?? (n.width as number) ?? DEFAULT_W,
      height: n.measured?.height ?? (n.height as number) ?? DEFAULT_H,
    })),
    edges: validEdges.map(
      (e): ElkExtendedEdge => ({
        id: e.id,
        sources: [e.source],
        targets: [e.target],
      })
    ),
  };

  const elk = await getElk();
  const res = await elk.layout(graph);

  const posById = new Map<string, RoutedPoint>();
  (res.children || []).forEach((c) => {
    posById.set(c.id, { x: c.x ?? 0, y: c.y ?? 0 });
  });

  const layoutedNodes = nodes.map((n) => {
    const p = posById.get(n.id);
    return p ? { ...n, position: p } : n;
  });

  const edgePoints: Record<string, RoutedPoint[]> = {};
  (res.edges || []).forEach((e) => {
    const section = e.sections?.[0];
    if (!section) return;
    const pts: RoutedPoint[] = [
      section.startPoint,
      ...(section.bendPoints || []),
      section.endPoint,
    ];
    if (pts.length >= 2) edgePoints[e.id] = pts;
  });

  return { nodes: layoutedNodes, edgePoints };
}
