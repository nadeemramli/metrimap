import { describe, it, expect } from 'vitest';
import { queryKeys } from './keys';

describe('queryKeys', () => {
  it('scopes the dashboard bundle by canvas id under the dashboard namespace', () => {
    expect(queryKeys.dashboard.data('c1')).toEqual(['dashboard', 'data', 'c1']);
    // Nested under `dashboard.all` so a broad invalidation clears it.
    expect(queryKeys.dashboard.data('c1').slice(0, 1)).toEqual(queryKeys.dashboard.all);
  });

  it('makes metric-value keys order-independent so [a,b] and [b,a] share a cache entry', () => {
    expect(queryKeys.metricValues.byIds(['b', 'a'])).toEqual(queryKeys.metricValues.byIds(['a', 'b']));
    expect(queryKeys.metricValues.byIds(['a', 'b'])).toEqual(['metricValues', ['a', 'b']]);
  });

  it('does not mutate the caller-supplied id array', () => {
    const ids = ['z', 'a'];
    queryKeys.metricValues.byIds(ids);
    expect(ids).toEqual(['z', 'a']);
  });
});
