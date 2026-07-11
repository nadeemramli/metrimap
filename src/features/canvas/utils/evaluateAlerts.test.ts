import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MetricValue } from '@/shared/types';

vi.mock('@/shared/lib/supabase/services/alertRules', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/shared/lib/supabase/services/alertRules')>();
  return {
    ...actual,
    listAlertRules: vi.fn(),
    emitCardAlert: vi.fn().mockResolvedValue(undefined),
    updateAlertRule: vi.fn().mockResolvedValue(undefined),
  };
});

import {
  emitCardAlert,
  listAlertRules,
} from '@/shared/lib/supabase/services/alertRules';
import { evaluateAlertRules } from './evaluateAlerts';

const client = {} as never;

const rule = {
  id: 'rule-1',
  project_id: 'project-1',
  card_id: 'card-1',
  name: 'High MRR',
  rule_type: 'threshold' as const,
  config: { comparator: 'gt', value: 100 },
  enabled: true,
  created_by: 'user-1',
  last_triggered_at: null,
  last_triggered_value: null,
};

const latest: MetricValue = {
  period: '2026-07',
  value: 150,
  change_percent: 0,
  trend: 'neutral',
};

describe('evaluateAlertRules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('emits alert metadata carrying projectId (so feed/inbox can navigate)', async () => {
    vi.mocked(listAlertRules).mockResolvedValue([rule] as never);
    await evaluateAlertRules({ id: 'card-1', title: 'MRR' }, [latest], client);
    expect(emitCardAlert).toHaveBeenCalledTimes(1);
    const metadata = vi.mocked(emitCardAlert).mock.calls[0][3];
    expect(metadata).toMatchObject({
      projectId: 'project-1',
      cardId: 'card-1',
      ruleId: 'rule-1',
      period: '2026-07',
      value: 150,
    });
  });

  it('does not emit when the rule is not tripped', async () => {
    vi.mocked(listAlertRules).mockResolvedValue([rule] as never);
    await evaluateAlertRules(
      { id: 'card-1', title: 'MRR' },
      [{ ...latest, value: 50 }],
      client
    );
    expect(emitCardAlert).not.toHaveBeenCalled();
  });
});
