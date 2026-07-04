import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database } from '../types';
import type { MetricValue } from '@/shared/types';

type Client = SupabaseClient<Database>;

export type AlertRuleType = 'threshold' | 'change' | 'band';
export type Comparator = 'gt' | 'lt' | 'gte' | 'lte';

// Per-type config. threshold: latest value vs a fixed bound. change: latest
// period-over-period change_percent beyond a magnitude in a direction. band:
// latest value outside a healthy [min, max] range.
export type AlertConfig =
  | { comparator: Comparator; value: number } // threshold
  | { direction: 'up' | 'down'; pct: number } // change
  | { min: number; max: number }; // band

export interface AlertRule {
  id: string;
  project_id: string;
  card_id: string;
  name: string | null;
  rule_type: AlertRuleType;
  config: AlertConfig;
  enabled: boolean;
  created_by: string;
  last_triggered_at: string | null;
  last_triggered_value: number | null;
}

const SELECT =
  'id, project_id, card_id, name, rule_type, config, enabled, created_by, last_triggered_at, last_triggered_value';

export async function listAlertRules(
  cardId: string,
  client?: Client
): Promise<AlertRule[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('alert_rules')
    .select(SELECT)
    .eq('card_id', cardId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AlertRule[];
}

export async function createAlertRule(
  input: {
    projectId: string;
    cardId: string;
    name?: string | null;
    ruleType: AlertRuleType;
    config: AlertConfig;
  },
  client?: Client
): Promise<AlertRule> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('alert_rules')
    .insert({
      project_id: input.projectId,
      card_id: input.cardId,
      name: input.name ?? null,
      rule_type: input.ruleType,
      config: input.config as unknown as Database['public']['Tables']['alert_rules']['Insert']['config'],
    })
    .select(SELECT)
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as AlertRule;
}

export async function updateAlertRule(
  id: string,
  updates: Partial<Pick<AlertRule, 'name' | 'enabled' | 'config' | 'rule_type'>>,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('alert_rules')
    .update(updates as never)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteAlertRule(
  id: string,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c.from('alert_rules').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Emit an alert notification to the rule creator + card owner (SECURITY DEFINER RPC). */
export async function emitCardAlert(
  ruleId: string,
  title: string,
  description: string,
  metadata: Record<string, unknown>,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c.rpc('emit_card_alert' as never, {
    p_rule_id: ruleId,
    p_title: title,
    p_description: description,
    p_metadata: metadata,
  } as never);
  if (error) throw new Error(error.message);
}

// ---- Pure evaluation (unit-tested; no I/O) --------------------------------

/** Does `rule` trip on the latest metric value? */
export function isRuleTripped(rule: AlertRule, latest: MetricValue): boolean {
  const cfg = rule.config as AlertConfig;
  switch (rule.rule_type) {
    case 'threshold': {
      const { comparator, value } = cfg as { comparator: Comparator; value: number };
      if (comparator === 'gt') return latest.value > value;
      if (comparator === 'lt') return latest.value < value;
      if (comparator === 'gte') return latest.value >= value;
      if (comparator === 'lte') return latest.value <= value;
      return false;
    }
    case 'change': {
      const { direction, pct } = cfg as { direction: 'up' | 'down'; pct: number };
      return direction === 'up'
        ? latest.change_percent >= pct
        : latest.change_percent <= -pct;
    }
    case 'band': {
      const { min, max } = cfg as { min: number; max: number };
      return latest.value < min || latest.value > max;
    }
    default:
      return false;
  }
}

/** Human-readable summary of a rule, e.g. "value > 100" or "dropped ≥ 10%". */
export function describeRule(rule: AlertRule): string {
  const cfg = rule.config as AlertConfig;
  if (rule.rule_type === 'threshold') {
    const { comparator, value } = cfg as { comparator: Comparator; value: number };
    const sym = { gt: '>', lt: '<', gte: '≥', lte: '≤' }[comparator];
    return `value ${sym} ${value}`;
  }
  if (rule.rule_type === 'change') {
    const { direction, pct } = cfg as { direction: 'up' | 'down'; pct: number };
    return direction === 'up' ? `rose ≥ ${pct}%` : `dropped ≥ ${pct}%`;
  }
  const { min, max } = cfg as { min: number; max: number };
  return `outside ${min}–${max}`;
}
