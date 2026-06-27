// Lazy, read-time migration of operator node data to the revamped shape.
// Pure + side-effect free (used by both convertToCanvasNode and computePipeline);
// it never writes to the DB — persistence happens the next time the user edits or
// runs. See docs/backlog/operator-revamp-feature.md (Phase 0).

import type {
  OperatorInput,
  OperatorNodeData,
  OperatorOperationType,
  RawOperatorData,
} from '@/features/canvas/types/operator';

const VALID_TYPES: OperatorOperationType[] = [
  'formula',
  'aggregate',
  'gate',
  'toggle',
  'statistical',
];

export function normalizeOperatorData(
  raw: RawOperatorData | null | undefined
): OperatorNodeData {
  const data = (raw || {}) as Record<string, any>;

  const legacyType = data.operationType as string | undefined;
  let operationType: OperatorOperationType;
  let formula: string | undefined = data.formula;
  let toggleValue: boolean | undefined = data.toggleValue;

  if (legacyType === 'boolean') {
    // Legacy boolean gate → toggle pass-through.
    operationType = 'toggle';
    if (toggleValue === undefined) toggleValue = !!data.booleanValue;
  } else if (legacyType === 'datePicker') {
    // datePicker was never a real transform → passthrough formula.
    operationType = 'formula';
    if (!formula) formula = 'x';
  } else if (VALID_TYPES.includes(legacyType as OperatorOperationType)) {
    operationType = legacyType as OperatorOperationType;
  } else {
    operationType = 'formula';
  }

  const inputs: OperatorInput[] | undefined = Array.isArray(data.inputs)
    ? (data.inputs as OperatorInput[])
    : undefined;

  return {
    // Spread first so we don't drop any forward-compatible fields, then override.
    ...(data as object),
    label: typeof data.label === 'string' ? data.label : 'Operator',
    operationType,
    isActive: data.isActive ?? true,
    inputs,
    formula,
    toggleValue,
  } as OperatorNodeData;
}
