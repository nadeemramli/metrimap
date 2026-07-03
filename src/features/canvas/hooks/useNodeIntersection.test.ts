import { describe, expect, it } from 'vitest';
import { diffHighlight } from './useNodeIntersection';

describe('diffHighlight', () => {
  it('adds all targets when nothing was highlighted', () => {
    expect(diffHighlight(new Set(), ['a', 'b'])).toEqual({
      add: ['a', 'b'],
      remove: [],
    });
  });

  it('removes all when the drag leaves every target', () => {
    expect(diffHighlight(new Set(['a', 'b']), [])).toEqual({
      add: [],
      remove: ['a', 'b'],
    });
  });

  it('computes incremental add/remove as the drag moves', () => {
    expect(diffHighlight(new Set(['a', 'b']), ['b', 'c'])).toEqual({
      add: ['c'],
      remove: ['a'],
    });
  });

  it('is a no-op when the target set is unchanged', () => {
    expect(diffHighlight(new Set(['a', 'b']), ['a', 'b'])).toEqual({
      add: [],
      remove: [],
    });
  });
});
