import { describe, it, expect } from 'vitest';
import {
  getNodeToolbarActions,
  nodeToolbarHas,
  NODE_TOOLBAR_MANIFEST,
} from './nodeToolbarManifest';

describe('nodeToolbarManifest', () => {
  it('does not put chart/data on a comment node', () => {
    const comment = getNodeToolbarActions('comment')!;
    expect(comment).not.toContain('chart');
    expect(comment).not.toContain('data');
    expect(comment).toContain('resolve');
  });

  it('hides settings on plain metric/value/action/hypothesis', () => {
    for (const t of ['metric', 'value', 'action', 'hypothesis'] as const) {
      expect(nodeToolbarHas(t, 'settings')).toBe(false);
      expect(nodeToolbarHas(t, 'view')).toBe(true);
      expect(nodeToolbarHas(t, 'delete')).toBe(true);
    }
  });

  it('gives metric the chart + data + comment actions', () => {
    expect(nodeToolbarHas('metric', 'chart')).toBe(true);
    expect(nodeToolbarHas('metric', 'data')).toBe(true);
    expect(nodeToolbarHas('metric', 'comment')).toBe(true);
  });

  it('every node type includes delete', () => {
    for (const actions of Object.values(NODE_TOOLBAR_MANIFEST)) {
      expect(actions).toContain('delete');
    }
  });

  it('falls back to visible for unknown / missing types', () => {
    expect(getNodeToolbarActions('mystery')).toBeNull();
    expect(getNodeToolbarActions(undefined)).toBeNull();
    expect(nodeToolbarHas('mystery', 'chart')).toBe(true); // unknown → don't hide
    expect(nodeToolbarHas(undefined, 'view')).toBe(true);
  });
});
