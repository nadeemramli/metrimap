// Operative-node data model (revamp). See the product vault.
//
// An operative node binds each incoming data-flow edge to a named input (a, b,
// c…) by connection order. Its operation combines those inputs into one output
// value that chains forward into the next card. `x` stays available in formulas
// as a back-compat alias = SUM of all inputs.

export type OperatorOperationType =
  | 'formula'
  | 'aggregate'
  | 'gate'
  | 'toggle'
  | 'statistical';

export type AggregateOp = 'sum' | 'avg' | 'min' | 'max' | 'product' | 'count';

export type CompareOp = '>' | '>=' | '<' | '<=' | '==' | '!=';

export type StatisticMethod = 'correlation' | 'regression' | 'movingAverage';

// One named input binding: key is the formula variable (a, b, …), sourceId is the
// upstream node it reads, label is a human name (defaults to the source title).
export interface OperatorInput {
  key: string;
  sourceId: string;
  label: string;
}

export interface OperatorGateConfig {
  compare: CompareOp;
  threshold: number;
  inputKey?: string; // which input is gated (defaults to first / x)
}

export interface OperatorStatisticConfig {
  method: StatisticMethod;
  window?: number; // movingAverage
  xKey?: string; // correlation / regression
  yKey?: string;
}

export interface OperatorNodeData {
  label: string;
  operationType: OperatorOperationType;
  isActive: boolean;
  inputs?: OperatorInput[];

  // formula
  formula?: string;
  // aggregate
  aggregateOp?: AggregateOp;
  // gate
  gate?: OperatorGateConfig;
  // toggle
  toggleValue?: boolean;
  // statistical
  statistic?: OperatorStatisticConfig;

  // Legacy fields kept so pre-revamp rows type-check until normalized.
  booleanValue?: boolean;
  dateValue?: string;
}

// The on-disk shape may still be the legacy one (operationType 'boolean' /
// 'datePicker', booleanValue, dateValue). Treat reads as loose.
export type RawOperatorData = Record<string, unknown>;
