// Named-input helpers for operative nodes. Pure + typed (shared by the compute
// pipeline's derive-fallback and by CanvasPage's edge lifecycle wiring).
// See the product vault (Phase B).

import type { OperatorInput } from '@/features/canvas/types/operator';

export interface EdgeLike {
  id: string;
  source: string;
  target: string;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

// First unused single letter (a, b, c…); falls back to v<n> past 26 inputs.
export function nextInputKey(existing: OperatorInput[]): string {
  const used = new Set(existing.map((i) => i.key));
  for (const ch of ALPHA) if (!used.has(ch)) return ch;
  return `v${existing.length}`;
}

// Add a binding for a new upstream source (no-op if that source is already bound).
export function addInput(
  existing: OperatorInput[],
  sourceId: string,
  label: string
): OperatorInput[] {
  if (existing.some((i) => i.sourceId === sourceId)) return existing;
  return [...existing, { key: nextInputKey(existing), sourceId, label }];
}

// Remove the binding for a source. Remaining keys are intentionally NOT re-keyed
// (renaming b→a would silently break formulas).
export function removeInputBySource(
  existing: OperatorInput[],
  sourceId: string
): OperatorInput[] {
  return existing.filter((i) => i.sourceId !== sourceId);
}

// Derive ordered inputs from the edges feeding an operator, deterministic by edge
// id. Used when an operator has edges but no persisted `inputs[]` yet (legacy).
export function deriveInputsFromEdges(
  edges: EdgeLike[],
  operatorId: string,
  titleResolver?: (sourceId: string) => string
): OperatorInput[] {
  const incoming = edges
    .filter((e) => e.target === operatorId)
    .slice()
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return incoming.map((e, i) => ({
    key: ALPHA[i] ?? `v${i}`,
    sourceId: e.source,
    label: titleResolver ? titleResolver(e.source) : e.source,
  }));
}
