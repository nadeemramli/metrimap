import { describe, expect, it } from 'vitest';
import {
  handlesForDirection,
  isPinned,
  resolveEdgeHandles,
} from './edgeAnchors';

describe('handlesForDirection', () => {
  it('maps every layout direction to the downstream→upstream handle pair', () => {
    expect(handlesForDirection('TB')).toEqual({
      sourceHandle: 'bottom-source',
      targetHandle: 'top-target',
    });
    expect(handlesForDirection('BT')).toEqual({
      sourceHandle: 'top-target',
      targetHandle: 'bottom-source',
    });
    expect(handlesForDirection('LR')).toEqual({
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
    });
    expect(handlesForDirection('RL')).toEqual({
      sourceHandle: 'left-target',
      targetHandle: 'right-source',
    });
  });
});

describe('resolveEdgeHandles (CVS-335 hierarchy: pin → layout direction)', () => {
  it('follows the layout direction when nothing is pinned', () => {
    expect(resolveEdgeHandles({}, 'LR')).toEqual({
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
    });
    expect(
      resolveEdgeHandles({ sourceHandle: null, targetHandle: null }, 'TB')
    ).toEqual({
      sourceHandle: 'bottom-source',
      targetHandle: 'top-target',
    });
  });

  it('pinned handles win over the layout direction', () => {
    expect(
      resolveEdgeHandles(
        { sourceHandle: 'left-target', targetHandle: 'right-source' },
        'TB'
      )
    ).toEqual({
      sourceHandle: 'left-target',
      targetHandle: 'right-source',
    });
  });

  it('pins survive a direction change (re-layout never clobbers them)', () => {
    const pinned = {
      sourceHandle: 'bottom-source',
      targetHandle: 'bottom-source',
    };
    for (const dir of ['TB', 'BT', 'LR', 'RL'] as const) {
      expect(resolveEdgeHandles(pinned, dir)).toEqual(pinned);
    }
  });

  it('resolves each side independently (half-pinned edges)', () => {
    expect(
      resolveEdgeHandles({ sourceHandle: 'right-source' }, 'TB')
    ).toEqual({
      sourceHandle: 'right-source',
      targetHandle: 'top-target',
    });
  });
});

describe('isPinned', () => {
  it('is true when either side is pinned, false when neither is', () => {
    expect(isPinned({})).toBe(false);
    expect(isPinned({ sourceHandle: null, targetHandle: null })).toBe(false);
    expect(isPinned({ sourceHandle: 'top-target' })).toBe(true);
    expect(isPinned({ targetHandle: 'left-target' })).toBe(true);
  });
});
