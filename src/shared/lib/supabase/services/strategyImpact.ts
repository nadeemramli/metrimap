// Client access layer for Strategy impact contracts + metric links. Rows are
// workspace-scoped (RLS: creator OR org-member; see the strategy_impact
// migration). One contract per strategy node (Action/Hypothesis card); target/
// leading/guardrail metric refs live in strategy_metric_links. Callers may inject
// a Clerk-authed client so RLS applies; otherwise the anon singleton is used.

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database } from '../types';
import type {
  ImpactContract,
  ImpactStatus,
  MetricLink,
  MetricLinkInput,
} from '@/features/strategy/impact/types';
import { isValidLinkInput } from '@/features/strategy/impact/impactContract';

type Client = SupabaseClient<Database>;

const CONTRACT_COLS =
  'id, workspace_id, project_id, strategy_node_id, expected_direction, expected_delta_value, expected_delta_unit, baseline_start, baseline_end, measure_start, measure_end, baseline_is_manual, confidence, impact_status, owner_label, result_note, created_by, created_at, updated_at';

const LINK_COLS = 'id, contract_id, role, ref_source, tracked_metric_id, card_id';

type ContractRow = Database['public']['Tables']['strategy_impact_contracts']['Row'];
type LinkRow = Database['public']['Tables']['strategy_metric_links']['Row'];

function rowToContract(r: ContractRow): ImpactContract {
  return {
    id: r.id,
    workspaceId: r.workspace_id,
    projectId: r.project_id,
    strategyNodeId: r.strategy_node_id,
    expectedDirection: r.expected_direction as ImpactContract['expectedDirection'],
    expectedDeltaValue: r.expected_delta_value,
    expectedDeltaUnit: r.expected_delta_unit,
    baselineStart: r.baseline_start,
    baselineEnd: r.baseline_end,
    measureStart: r.measure_start,
    measureEnd: r.measure_end,
    baselineIsManual: r.baseline_is_manual,
    confidence: r.confidence as ImpactContract['confidence'],
    impactStatus: r.impact_status as ImpactStatus,
    ownerLabel: r.owner_label,
    resultNote: r.result_note,
    createdBy: r.created_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToLink(r: LinkRow): MetricLink {
  return {
    id: r.id,
    contractId: r.contract_id,
    role: r.role as MetricLink['role'],
    refSource: r.ref_source as MetricLink['refSource'],
    trackedMetricId: r.tracked_metric_id,
    cardId: r.card_id,
  };
}

/** The contract for a single strategy node, or null if the node has no bet. */
export async function getContractForNode(
  strategyNodeId: string,
  client?: Client
): Promise<ImpactContract | null> {
  const c = client || supabase();
  const { data, error } = await c
    .from('strategy_impact_contracts')
    .select(CONTRACT_COLS)
    .eq('strategy_node_id', strategyNodeId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToContract(data as ContractRow) : null;
}

/** Every contract originating on a canvas (uses project_id for the canvas filter). */
export async function listContractsForProject(
  projectId: string,
  client?: Client
): Promise<ImpactContract[]> {
  const c = client || supabase();
  const { data, error } = await c
    .from('strategy_impact_contracts')
    .select(CONTRACT_COLS)
    .eq('project_id', projectId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToContract(r as ContractRow));
}

/** Every contract the caller can see (RLS scopes to their workspace). Portfolio view. */
export async function listContractsForWorkspace(client?: Client): Promise<ImpactContract[]> {
  const c = client || supabase();
  const { data, error } = await c
    .from('strategy_impact_contracts')
    .select(CONTRACT_COLS);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToContract(r as ContractRow));
}

export interface UpsertContractInput {
  strategyNodeId: string;
  projectId?: string | null;
  expectedDirection?: ImpactContract['expectedDirection'];
  expectedDeltaValue?: number | null;
  expectedDeltaUnit?: string | null;
  baselineStart?: string | null;
  baselineEnd?: string | null;
  measureStart?: string | null;
  measureEnd?: string | null;
  baselineIsManual?: boolean;
  confidence?: ImpactContract['confidence'];
  impactStatus?: ImpactStatus;
  ownerLabel?: string | null;
  resultNote?: string | null;
}

/**
 * Create or update the contract for a node. Keyed on strategy_node_id (unique),
 * so this is idempotent — editing a node's bet upserts the single row.
 */
export async function upsertContract(
  input: UpsertContractInput,
  client?: Client
): Promise<ImpactContract> {
  const c = client || supabase();
  const row: Database['public']['Tables']['strategy_impact_contracts']['Insert'] = {
    strategy_node_id: input.strategyNodeId,
    updated_at: new Date().toISOString(),
  };
  if (input.projectId !== undefined) row.project_id = input.projectId;
  if (input.expectedDirection !== undefined) row.expected_direction = input.expectedDirection;
  if (input.expectedDeltaValue !== undefined) row.expected_delta_value = input.expectedDeltaValue;
  if (input.expectedDeltaUnit !== undefined) row.expected_delta_unit = input.expectedDeltaUnit;
  if (input.baselineStart !== undefined) row.baseline_start = input.baselineStart;
  if (input.baselineEnd !== undefined) row.baseline_end = input.baselineEnd;
  if (input.measureStart !== undefined) row.measure_start = input.measureStart;
  if (input.measureEnd !== undefined) row.measure_end = input.measureEnd;
  if (input.baselineIsManual !== undefined) row.baseline_is_manual = input.baselineIsManual;
  if (input.confidence !== undefined) row.confidence = input.confidence;
  if (input.impactStatus !== undefined) row.impact_status = input.impactStatus;
  if (input.ownerLabel !== undefined) row.owner_label = input.ownerLabel;
  if (input.resultNote !== undefined) row.result_note = input.resultNote;

  const { data, error } = await c
    .from('strategy_impact_contracts')
    .upsert(row, { onConflict: 'strategy_node_id' })
    .select(CONTRACT_COLS)
    .single();
  if (error) throw new Error(error.message);
  return rowToContract(data as ContractRow);
}

export async function deleteContract(id: string, client?: Client): Promise<void> {
  const c = client || supabase();
  const { error } = await c.from('strategy_impact_contracts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Read the metric links (target/leading/guardrail) for a contract. */
export async function getMetricLinks(
  contractId: string,
  client?: Client
): Promise<MetricLink[]> {
  const c = client || supabase();
  const { data, error } = await c
    .from('strategy_metric_links')
    .select(LINK_COLS)
    .eq('contract_id', contractId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToLink(r as LinkRow));
}

/**
 * Replace a contract's metric links wholesale (delete-then-insert). Simpler than
 * diffing, and the set is small. Validates each input against the DB CHECK first.
 */
export async function setMetricLinks(
  contractId: string,
  links: MetricLinkInput[],
  client?: Client
): Promise<MetricLink[]> {
  const invalid = links.find((l) => !isValidLinkInput(l));
  if (invalid) {
    throw new Error(
      `Invalid metric link: ref_source '${invalid.refSource}' must have exactly its matching id`
    );
  }
  const c = client || supabase();
  const { error: delError } = await c
    .from('strategy_metric_links')
    .delete()
    .eq('contract_id', contractId);
  if (delError) throw new Error(delError.message);

  if (!links.length) return [];
  const rows = links.map((l) => ({
    contract_id: contractId,
    role: l.role,
    ref_source: l.refSource,
    tracked_metric_id: l.refSource === 'tracked' ? l.trackedMetricId ?? null : null,
    card_id: l.refSource === 'card' ? l.cardId ?? null : null,
  }));
  const { data, error } = await c
    .from('strategy_metric_links')
    .insert(rows)
    .select(LINK_COLS);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToLink(r as LinkRow));
}
