// Single source of truth for which floating-toolbar actions each node type
// exposes (CVS-67). The per-node toolbar previously rendered a near-uniform
// superset for every type; drive visibility from this capability map instead so
// each node shows only the actions it supports (no chart/data on a comment node,
// no settings on a plain metric, etc.).
//
// Owner-confirmed action sets. Actions a given toolbar can't yet render (it has
// no handler wired) are simply omitted at render time — this map is the intent,
// so wiring a new action later is a one-line manifest edit.

export type NodeToolbarAction =
  | 'view'
  | 'edit'
  | 'settings'
  | 'duplicate'
  | 'comment'
  | 'chart'
  | 'data'
  | 'connect'
  | 'resolve'
  | 'config'
  | 'delete';

export type ToolbarNodeType =
  | 'metric'
  | 'metricCard'
  | 'value'
  | 'action'
  | 'hypothesis'
  | 'evidence'
  | 'source'
  | 'chart'
  | 'comment'
  | 'whiteboard';

export const NODE_TOOLBAR_MANIFEST: Record<ToolbarNodeType, NodeToolbarAction[]> = {
  metric: ['view', 'edit', 'duplicate', 'chart', 'data', 'comment', 'delete'],
  metricCard: ['view', 'edit', 'duplicate', 'chart', 'data', 'comment', 'delete'],
  value: ['view', 'edit', 'duplicate', 'comment', 'delete'],
  action: ['view', 'edit', 'duplicate', 'comment', 'delete'],
  hypothesis: ['view', 'edit', 'duplicate', 'comment', 'delete'],
  evidence: ['view', 'edit', 'delete'],
  source: ['connect', 'data', 'settings', 'delete'],
  chart: ['config', 'settings', 'delete'],
  comment: ['edit', 'resolve', 'delete'],
  whiteboard: ['edit', 'delete'],
};

/**
 * Actions for a node type, or `null` if the type is unknown (callers should then
 * fall back to their existing behavior rather than hide everything).
 */
export function getNodeToolbarActions(
  nodeType: string | undefined
): NodeToolbarAction[] | null {
  if (!nodeType) return null;
  return NODE_TOOLBAR_MANIFEST[nodeType as ToolbarNodeType] ?? null;
}

/** Whether a node type's toolbar should show a given action (unknown type → true). */
export function nodeToolbarHas(
  nodeType: string | undefined,
  action: NodeToolbarAction
): boolean {
  const actions = getNodeToolbarActions(nodeType);
  return actions ? actions.includes(action) : true;
}
