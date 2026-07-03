import { describe, expect, it } from 'vitest';
import {
  describeRule,
  isRuleTripped,
  type AlertRule,
} from './alertRules';

const mv = (value: number, change_percent = 0) => ({
  period: '2026-07',
  value,
  change_percent,
  trend: 'neutral' as const,
});

const rule = (rule_type: AlertRule['rule_type'], config: any): AlertRule => ({
  id: 'r',
  project_id: 'p',
  card_id: 'c',
  name: null,
  rule_type,
  config,
  enabled: true,
  created_by: 'u',
  last_triggered_at: null,
  last_triggered_value: null,
});

describe('isRuleTripped', () => {
  it('threshold gt/lt/gte/lte', () => {
    expect(isRuleTripped(rule('threshold', { comparator: 'gt', value: 100 }), mv(120))).toBe(true);
    expect(isRuleTripped(rule('threshold', { comparator: 'gt', value: 100 }), mv(100))).toBe(false);
    expect(isRuleTripped(rule('threshold', { comparator: 'gte', value: 100 }), mv(100))).toBe(true);
    expect(isRuleTripped(rule('threshold', { comparator: 'lt', value: 50 }), mv(40))).toBe(true);
    expect(isRuleTripped(rule('threshold', { comparator: 'lte', value: 50 }), mv(51))).toBe(false);
  });

  it('change up/down by magnitude', () => {
    expect(isRuleTripped(rule('change', { direction: 'down', pct: 10 }), mv(90, -12))).toBe(true);
    expect(isRuleTripped(rule('change', { direction: 'down', pct: 10 }), mv(95, -5))).toBe(false);
    expect(isRuleTripped(rule('change', { direction: 'up', pct: 10 }), mv(120, 15))).toBe(true);
    expect(isRuleTripped(rule('change', { direction: 'up', pct: 10 }), mv(120, 8))).toBe(false);
  });

  it('band breach', () => {
    expect(isRuleTripped(rule('band', { min: 10, max: 20 }), mv(25))).toBe(true);
    expect(isRuleTripped(rule('band', { min: 10, max: 20 }), mv(5))).toBe(true);
    expect(isRuleTripped(rule('band', { min: 10, max: 20 }), mv(15))).toBe(false);
  });
});

describe('describeRule', () => {
  it('renders readable summaries', () => {
    expect(describeRule(rule('threshold', { comparator: 'gt', value: 100 }))).toBe('value > 100');
    expect(describeRule(rule('change', { direction: 'down', pct: 10 }))).toBe('dropped ≥ 10%');
    expect(describeRule(rule('band', { min: 10, max: 20 }))).toBe('outside 10–20');
  });
});
