// Strategy impact contract model — the measurable "bet" a Work/Action or
// Ideas/Hypothesis card can carry. See CVS-166 "Decision (locked)" and the
// migration 20260709120000_strategy_impact.sql. Scope = workspace-wide.

export type MetricRefSource = 'tracked' | 'card';
export type MetricLinkRole = 'target' | 'leading' | 'guardrail';
export type ExpectedDirection = 'increase' | 'decrease' | 'stabilize';
export type Confidence = 'low' | 'medium' | 'high';
export type ImpactStatus =
  | 'draft'
  | 'planned'
  | 'measuring'
  | 'won'
  | 'lost'
  | 'inconclusive';

export const METRIC_LINK_ROLES: MetricLinkRole[] = ['target', 'leading', 'guardrail'];
export const EXPECTED_DIRECTIONS: ExpectedDirection[] = ['increase', 'decrease', 'stabilize'];
export const CONFIDENCE_LEVELS: Confidence[] = ['low', 'medium', 'high'];
export const IMPACT_STATUSES: ImpactStatus[] = [
  'draft',
  'planned',
  'measuring',
  'won',
  'lost',
  'inconclusive',
];

/** A persisted metric reference on a contract (target / leading / guardrail). */
export interface MetricLink {
  id: string;
  contractId: string;
  role: MetricLinkRole;
  refSource: MetricRefSource;
  trackedMetricId: string | null;
  cardId: string | null;
}

/** A metric reference before persistence (no id / contract_id yet). */
export interface MetricLinkInput {
  role: MetricLinkRole;
  refSource: MetricRefSource;
  trackedMetricId?: string | null;
  cardId?: string | null;
}

/** The impact contract owned by one strategy node (Action or Hypothesis). */
export interface ImpactContract {
  id: string;
  workspaceId: string | null;
  /** Origin canvas; nullable so a bet outlives the canvas it was drawn on. */
  projectId: string | null;
  strategyNodeId: string;
  expectedDirection: ExpectedDirection | null;
  expectedDeltaValue: number | null;
  expectedDeltaUnit: string | null;
  baselineStart: string | null;
  baselineEnd: string | null;
  measureStart: string | null;
  measureEnd: string | null;
  baselineIsManual: boolean;
  confidence: Confidence | null;
  impactStatus: ImpactStatus;
  ownerLabel: string | null;
  resultNote: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactContractWithLinks {
  contract: ImpactContract;
  links: MetricLink[];
}
