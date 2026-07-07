import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getProductSystemFlow, productSystemFlows } from './flows';

const REQUIRED_FLOW_IDS = [
  'strategy-to-impact',
  'teams-to-dashboards',
  'experimentation-to-knowledge',
  'instrumentation-to-trust',
  'agent-to-operating-map',
  'workflow-orchestration',
];

describe('product system flow registry', () => {
  it('contains all six operating loops', () => {
    expect(productSystemFlows.map((f) => f.id)).toEqual(REQUIRED_FLOW_IDS);
  });

  it('every flow has ordered steps with unique ids and complete copy', () => {
    for (const flow of productSystemFlows) {
      expect(flow.title).toBeTruthy();
      expect(flow.shortTitle).toBeTruthy();
      expect(flow.summary).toBeTruthy();
      expect(flow.steps.length).toBeGreaterThanOrEqual(4);

      const ids = new Set(flow.steps.map((s) => s.id));
      expect(ids.size).toBe(flow.steps.length);

      flow.steps.forEach((step, i) => {
        expect(step.order).toBe(i + 1);
        expect(step.label).toBeTruthy();
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
      });
    }
  });

  it('relationships only reference steps that exist in their flow', () => {
    for (const flow of productSystemFlows) {
      const ids = new Set(flow.steps.map((s) => s.id));
      for (const rel of flow.relationships ?? []) {
        expect(ids.has(rel.from), `${flow.id}: ${rel.from}`).toBe(true);
        expect(ids.has(rel.to), `${flow.id}: ${rel.to}`).toBe(true);
      }
    }
  });

  it('getProductSystemFlow resolves by id', () => {
    expect(getProductSystemFlow('strategy-to-impact')?.shortTitle).toBe(
      'Strategy → Impact'
    );
    expect(getProductSystemFlow('nope')).toBeUndefined();
  });

  it('public/product-system-flows.json mirrors the registry (canvasm.app contract)', () => {
    const artifact = JSON.parse(
      readFileSync('public/product-system-flows.json', 'utf8')
    );
    expect(artifact.version).toBe(1);
    // Round-trip through JSON so undefined-valued optionals compare equal.
    expect(artifact.flows).toEqual(
      JSON.parse(JSON.stringify(productSystemFlows))
    );
  });
});
