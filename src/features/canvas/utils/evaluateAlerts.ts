// Client-side alert evaluation: called from the card value write-through path
// (canvasStore.persistNodeUpdate) after new values land. Loads the card's
// enabled rules, checks the latest value, and emits an 'alert' notification for
// any that trip — debounced so the SAME value doesn't re-alert on every save.
//
// This is the immediate, in-app half of alerting. A scheduled server-side sweep
// (edge function + pg_cron) is a planned follow-up to catch changes made outside
// the app (e.g. warehouse-source refreshes).

import type { SupabaseClient } from '@supabase/supabase-js';
import type { MetricValue } from '@/shared/types';
import {
  describeRule,
  emitCardAlert,
  isRuleTripped,
  listAlertRules,
  updateAlertRule,
} from '@/shared/lib/supabase/services/alertRules';

interface CardLike {
  id: string;
  title?: string;
}

export async function evaluateAlertRules(
  card: CardLike,
  data: MetricValue[] | undefined,
  client: SupabaseClient | null | undefined
): Promise<void> {
  if (!client || !Array.isArray(data) || data.length === 0) return;
  const latest = data[data.length - 1];
  if (!latest || typeof latest.value !== 'number') return;

  let rules;
  try {
    rules = await listAlertRules(card.id, client as never);
  } catch (e) {
    console.error('Alert eval: failed to load rules', e);
    return;
  }

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const tripped = isRuleTripped(rule, latest);
    if (!tripped) continue;
    // Debounce: don't re-alert for the exact same latest value.
    if (rule.last_triggered_value === latest.value) continue;

    const label = card.title || 'Metric';
    try {
      await emitCardAlert(
        rule.id,
        `Alert: ${label}`,
        `${label} ${describeRule(rule)} — now ${latest.value} (${latest.period})`,
        {
          projectId: rule.project_id,
          cardId: card.id,
          ruleId: rule.id,
          period: latest.period,
          value: latest.value,
        },
        client as never
      );
      await updateAlertRule(
        rule.id,
        // last_triggered_* aren't in the Partial<> type; cast through.
        {
          last_triggered_at: new Date().toISOString(),
          last_triggered_value: latest.value,
        } as never,
        client as never
      );
      console.log(`🔔 Alert fired: ${label} (${describeRule(rule)})`);
    } catch (e) {
      console.error('Alert eval: failed to emit', e);
    }
  }
}
