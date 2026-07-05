import { describe, expect, it } from 'vitest';
import {
  getCausalStatusMeta,
  getRelationshipEdgeStyle,
  getRelationshipStroke,
} from './relationshipTypeMeta';

// CVS-165 — the drawn line encodes relationship quality (direction/strength/confidence).
describe('getRelationshipEdgeStyle', () => {
  it('strong positive high-confidence reads healthy green, solid, thick', () => {
    const s = getRelationshipEdgeStyle('Causal', 80, 'High');
    expect(s.tone).toBe('positive');
    expect(s.stroke).toBe('#16a34a');
    expect(s.opacity).toBe(1);
    expect(s.strokeDasharray).toBeUndefined(); // Causal is a solid type
    expect(s.strokeWidth).toBeGreaterThan(3); // strength → width
    expect(s.loose).toBe(false);
  });

  it('negative/inverse warns red regardless of magnitude', () => {
    expect(getRelationshipEdgeStyle('Causal', -70, 'High').stroke).toBe('#dc2626');
    expect(getRelationshipEdgeStyle('Probabilistic', -5, 'High').tone).toBe('negative');
  });

  it('weak / low correlation warns amber (not green)', () => {
    const s = getRelationshipEdgeStyle('Probabilistic', 10, 'Medium');
    expect(s.tone).toBe('weak');
    expect(s.stroke).toBe('#d97706');
  });

  it('unknown strength (weight 0) is neutral + loose (dashed)', () => {
    const s = getRelationshipEdgeStyle('Probabilistic', 0, 'Medium');
    expect(s.tone).toBe('neutral');
    expect(s.stroke).toBe('#9ca3af');
    expect(s.loose).toBe(true);
    expect(s.strokeDasharray).toBeTruthy();
  });

  it('low confidence looks loose: dashed, dimmer, thinner', () => {
    const strong = getRelationshipEdgeStyle('Causal', 80, 'High');
    const lowConf = getRelationshipEdgeStyle('Causal', 80, 'Low');
    expect(lowConf.loose).toBe(true);
    expect(lowConf.strokeDasharray).toBeTruthy();
    expect(lowConf.opacity).toBeLessThan(strong.opacity);
    expect(lowConf.strokeWidth).toBeLessThan(strong.strokeWidth);
    // same colour (still positive) — only firmness changes
    expect(lowConf.stroke).toBe(strong.stroke);
  });

  it('structural types (deterministic/compositional) are definitional gray, not strength-coloured', () => {
    const det = getRelationshipEdgeStyle('Deterministic', 90, 'High');
    expect(det.tone).toBe('structural');
    expect(det.stroke).toBe('#6b7280');
    const comp = getRelationshipEdgeStyle('Compositional', -90, 'Low');
    expect(comp.tone).toBe('structural');
    expect(comp.stroke).toBe('#6b7280'); // ignores weight sign
  });

  it('width scales with strength magnitude', () => {
    const weak = getRelationshipEdgeStyle('Causal', 20, 'High').strokeWidth;
    const strong = getRelationshipEdgeStyle('Causal', 90, 'High').strokeWidth;
    expect(strong).toBeGreaterThan(weak);
  });

  it('exploratory links read loose: neutral, dashed, dim — even with a strong weight', () => {
    const s = getRelationshipEdgeStyle('Exploratory', 90, 'High');
    expect(s.tone).toBe('neutral');
    expect(s.stroke).toBe('#9ca3af'); // neutral gray, never strength-coloured
    expect(s.loose).toBe(true);
    expect(s.strokeDasharray).toBeTruthy();
    expect(s.opacity).toBeLessThan(1); // dimmer than a validated link
  });
});

describe('getRelationshipStroke (delegates to edge style)', () => {
  it('returns the tone colour', () => {
    expect(getRelationshipStroke('Causal', 80)).toBe('#16a34a');
    expect(getRelationshipStroke('Causal', -80)).toBe('#dc2626');
    expect(getRelationshipStroke('Probabilistic', 5)).toBe('#d97706');
    expect(getRelationshipStroke('Deterministic', 80)).toBe('#6b7280');
  });
});

// CVS-264 — causal validation/refutation state.
describe('getCausalStatusMeta', () => {
  it('refuted warns (negative tone) so it never looks healthy', () => {
    const m = getCausalStatusMeta('refuted');
    expect(m.warn).toBe(true);
    expect(m.tone).toBe('negative');
    expect(m.color).toBe('#dc2626');
  });

  it('validated is positive and does not warn', () => {
    const m = getCausalStatusMeta('validated');
    expect(m.tone).toBe('positive');
    expect(m.warn).toBe(false);
  });

  it('validating reads amber/weak', () => {
    expect(getCausalStatusMeta('validating').tone).toBe('weak');
  });

  it('undefined / unknown defaults to unvalidated (neutral, no warn)', () => {
    expect(getCausalStatusMeta(undefined).status).toBe('unvalidated');
    expect(getCausalStatusMeta('bogus').tone).toBe('neutral');
    expect(getCausalStatusMeta('bogus').warn).toBe(false);
  });
});
