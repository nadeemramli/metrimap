import { describe, expect, it } from 'vitest';
import { buildDemoStrategyImpact } from './demoStrategyImpact';
import { resolveImpactTrace } from './impactTrace';
import { buildSeriesByKey, evaluateImpact, measuredByNode } from './measurement';
import { linkedStrategyForWidget } from './widgetLinks';

// End-to-end proof (CVS-177): over the canonical demo dataset, the pure pipeline
// engines together yield the straight line Action → target → KPI → dashboard →
// measured result — and degrade correctly for the failure states.

describe('demo Strategy impact — full pipeline', () => {
  const demo = buildDemoStrategyImpact();
  const { contract, links } = demo.entries[0];

  it('resolves the trace: Action → target → KPI, shown on the dashboard widget', () => {
    const trace = resolveImpactTrace({
      strategyNodeId: demo.ids.action,
      links,
      cards: demo.cards,
      relationships: demo.relationships,
      widgets: demo.widgets,
    });
    expect(trace.target?.card?.id).toBe(demo.ids.checkoutCvr);
    expect(trace.kpiPath.map((c) => c.id)).toEqual([demo.ids.checkoutCvr, demo.ids.revenue, demo.ids.kpi]);
    expect(trace.kpi?.id).toBe(demo.ids.kpi);
    expect(trace.target?.widgets.map((w) => w.id)).toEqual([demo.ids.widget]);
    expect(trace.leading.map((l) => l.card?.id)).toEqual([demo.ids.addToCart]);
    expect(trace.guardrails.map((g) => g.card?.id).sort()).toEqual([demo.ids.aov, demo.ids.refundRate].sort());
    expect(trace.missing).toEqual({ noTarget: false, targetNotOnCanvas: false, noKpiPath: false, noDashboard: false });
  });

  it('links the bet to the dashboard widget', () => {
    const linked = linkedStrategyForWidget(demo.widgets[0], demo.entries, demo.cards);
    expect(linked.map((l) => l.node?.id)).toEqual([demo.ids.action]);
    expect(linked[0].roles).toContain('target');
  });

  it('measures a win: target +7% beats +5%, guardrails pass → won', () => {
    const ev = evaluateImpact(contract, links, buildSeriesByKey(links, demo.cards, demo.trackedValues));
    expect(ev.target?.pctDelta).toBeCloseTo(7);
    expect(ev.met).toBe('met');
    expect(ev.guardrailStatus).toBe('pass');
    expect(ev.suggestedResult).toBe('won');

    const measured = measuredByNode(demo.entries, demo.cards, demo.trackedValues);
    expect(measured[demo.ids.action].deltaText).toBe('+7.0%');
    expect(measured[demo.ids.action].met).toBe('met');
  });

  it('groups the work under its pillar in the tree model', () => {
    // The pillar group contains the action + hypothesis (Strategy Tree buckets by group).
    expect(demo.groups[0].nodeIds).toContain(demo.ids.action);
    expect(demo.groups[0].nodeIds).toContain(demo.ids.hypothesis);
  });
});

describe('demo Strategy impact — failure & missing states', () => {
  const demo = buildDemoStrategyImpact();
  const { contract, links } = demo.entries[0];

  it('no target metric → noTarget + inconclusive', () => {
    const noTargetLinks = links.filter((l) => l.role !== 'target');
    const trace = resolveImpactTrace({ strategyNodeId: demo.ids.action, links: noTargetLinks, cards: demo.cards, relationships: demo.relationships, widgets: demo.widgets });
    expect(trace.missing.noTarget).toBe(true);
    const ev = evaluateImpact(contract, noTargetLinks, buildSeriesByKey(noTargetLinks, demo.cards, demo.trackedValues));
    expect(ev.suggestedResult).toBe('inconclusive');
  });

  it('no KPI path → noKpiPath when the metric is not wired upward', () => {
    const noRollup = demo.relationships.filter((r) => !(r.sourceId === demo.ids.revenue && r.targetId === demo.ids.kpi) && !(r.sourceId === demo.ids.checkoutCvr && r.targetId === demo.ids.revenue));
    const trace = resolveImpactTrace({ strategyNodeId: demo.ids.action, links, cards: demo.cards, relationships: noRollup, widgets: demo.widgets });
    expect(trace.missing.noKpiPath).toBe(true);
  });

  it('no dashboard widget → noDashboard', () => {
    const trace = resolveImpactTrace({ strategyNodeId: demo.ids.action, links, cards: demo.cards, relationships: demo.relationships, widgets: [] });
    expect(trace.missing.noDashboard).toBe(true);
  });

  it('guardrail breach blocks the win (inconclusive)', () => {
    // AOV jumps +20% in the window → guardrail fail.
    const breached = {
      ...demo.trackedValues,
      [demo.ids.trackedCheckoutCvr]: demo.trackedValues[demo.ids.trackedCheckoutCvr],
      tm_aov: [
        { period: '2026-05', value: 80, change_percent: 0, trend: 'neutral' as const },
        { period: '2026-07', value: 96, change_percent: 20, trend: 'up' as const },
      ],
    };
    const ev = evaluateImpact(contract, links, buildSeriesByKey(links, demo.cards, breached));
    expect(ev.met).toBe('met'); // target still hit
    expect(ev.guardrailStatus).toBe('fail');
    expect(ev.suggestedResult).toBe('inconclusive'); // blocked
  });

  it('stale / no data in the window → unknown, not zero', () => {
    const stale = { ...demo.trackedValues, [demo.ids.trackedCheckoutCvr]: [{ period: '2026-05', value: 3.0, change_percent: 0, trend: 'neutral' as const }] };
    const ev = evaluateImpact(contract, links, buildSeriesByKey(links, demo.cards, stale));
    expect(ev.target?.hasData).toBe(false);
    expect(ev.met).toBe('unknown');
    expect(ev.suggestedResult).toBe('inconclusive');
  });
});
