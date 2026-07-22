import { describe, it, expect } from 'vitest';
import {
  CreateMetricCardSchema,
  CreateRelationshipSchema,
  UpdateRelationshipSchema,
} from '@/shared/lib/validation/zod';

type StrictSchema = { safeParse: (v: unknown) => { success: boolean; error?: { issues: unknown } } };

// Regression: the hand-maintained Prisma-Zod mirrors are .strict(), so any
// column the services inject but the mirror doesn't declare kills the whole
// write path with unrecognized_keys (z_index broke every card create,
// causal_metadata every relationship create — found via the MCP connector).
// These parse the EXACT insert shapes transformToInsert builds.
describe('service insert payloads vs strict Prisma-Zod mirrors', () => {
  it('metric-card insert (incl. z_index) passes CreateMetricCardSchema', () => {
    const r = (CreateMetricCardSchema as StrictSchema).safeParse({
      project_id: '11111111-1111-1111-1111-111111111111',
      title: 'T',
      description: '',
      category: 'Data/Metric',
      sub_category: undefined,
      position_x: 0,
      position_y: 0,
      z_index: null,
      data: undefined,
      source_type: undefined,
      formula: undefined,
      causal_factors: [],
      dimensions: [],
      assignees: [],
      owner_id: null,
      status: null,
      workflow: {},
      created_by: 'user_x',
    });
    expect(r.error?.issues ?? []).toEqual([]);
    expect(r.success).toBe(true);
  });

  it('relationship insert (incl. causal_metadata) passes CreateRelationshipSchema', () => {
    const r = (CreateRelationshipSchema as StrictSchema).safeParse({
      project_id: '11111111-1111-1111-1111-111111111111',
      source_id: '22222222-2222-2222-2222-222222222222',
      target_id: '33333333-3333-3333-3333-333333333333',
      type: 'Causal',
      confidence: 'Medium',
      weight: undefined,
      // causal_metadata is set post-validation (the generated Json union
      // rejects raw null — wants DbNull/JsonNull sentinels), so it is NOT
      // part of the parsed shape anymore (CVS-337).
      created_by: 'user_x',
    });
    expect(r.error?.issues ?? []).toEqual([]);
    expect(r.success).toBe(true);
  });

  it('relationship update with causal_metadata passes UpdateRelationshipSchema', () => {
    const r = (UpdateRelationshipSchema as StrictSchema).safeParse({
      type: 'Probabilistic',
      confidence: 'High',
      weight: 0.8,
      causal_metadata: { factors: ['price'] },
    });
    expect(r.error?.issues ?? []).toEqual([]);
    expect(r.success).toBe(true);
  });
});
