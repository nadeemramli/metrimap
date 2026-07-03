import { create } from 'zustand';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  isRuleTripped,
  type AlertRule,
} from '@/shared/lib/supabase/services/alertRules';
import type { MetricValue } from '@/shared/types';

// Project-wide alert rules, loaded once per canvas so metric cards can show a
// "monitored/breached" badge without each fetching its own rules. Kept in sync
// by the Alerts editor via the *Local helpers.

interface AlertRulesState {
  rulesByCard: Record<string, AlertRule[]>;
  loadForProject: (
    projectId: string,
    client: SupabaseClient
  ) => Promise<void>;
  upsertLocal: (rule: AlertRule) => void;
  removeLocal: (cardId: string, ruleId: string) => void;
  setEnabledLocal: (cardId: string, ruleId: string, enabled: boolean) => void;
  clear: () => void;
}

export const useAlertRulesStore = create<AlertRulesState>((set) => ({
  rulesByCard: {},

  loadForProject: async (projectId, client) => {
    const { data, error } = await client
      .from('alert_rules')
      .select(
        'id, project_id, card_id, name, rule_type, config, enabled, created_by, last_triggered_at, last_triggered_value'
      )
      .eq('project_id', projectId);
    if (error) {
      console.error('Failed to load alert rules for project', error);
      return;
    }
    const byCard: Record<string, AlertRule[]> = {};
    for (const r of (data ?? []) as unknown as AlertRule[]) {
      (byCard[r.card_id] ||= []).push(r);
    }
    set({ rulesByCard: byCard });
  },

  upsertLocal: (rule) =>
    set((s) => {
      const list = (s.rulesByCard[rule.card_id] || []).filter(
        (r) => r.id !== rule.id
      );
      return {
        rulesByCard: { ...s.rulesByCard, [rule.card_id]: [...list, rule] },
      };
    }),

  removeLocal: (cardId, ruleId) =>
    set((s) => ({
      rulesByCard: {
        ...s.rulesByCard,
        [cardId]: (s.rulesByCard[cardId] || []).filter((r) => r.id !== ruleId),
      },
    })),

  setEnabledLocal: (cardId, ruleId, enabled) =>
    set((s) => ({
      rulesByCard: {
        ...s.rulesByCard,
        [cardId]: (s.rulesByCard[cardId] || []).map((r) =>
          r.id === ruleId ? { ...r, enabled } : r
        ),
      },
    })),

  clear: () => set({ rulesByCard: {} }),
}));

/** { monitored, breached } for a card given its latest value. */
export function alertStateFor(
  rules: AlertRule[] | undefined,
  latest: MetricValue | undefined
): { monitored: boolean; breached: boolean } {
  const enabled = (rules || []).filter((r) => r.enabled);
  if (enabled.length === 0) return { monitored: false, breached: false };
  const breached = latest
    ? enabled.some((r) => isRuleTripped(r, latest))
    : false;
  return { monitored: true, breached };
}
