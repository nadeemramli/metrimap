import { describe, it, expect } from 'vitest';
import {
  transformMetricCard,
  transformRelationship,
} from './dataTransformers';
import type {
  MetricCard as DBMetricCard,
  Relationship as DBRelationship,
} from '@/shared/lib/supabase/services/projects';

const baseCard: DBMetricCard = {
  id: 'card-1',
  title: 'MRR',
  description: 'Monthly recurring revenue',
  category: 'Data/Metric',
  sub_category: null,
  data: null,
  position_x: 10,
  position_y: 20,
  source_type: null,
  tracked_metric_id: null,
  formula: null,
  causal_factors: null,
  dimensions: null,
  assignees: null,
  owner_id: null,
  status: 'in_progress',
  workflow: { priority: 'High' },
  z_index: 7,
  project_id: 'proj-1',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
  created_by: 'user-1',
  last_modified_by: null,
} as DBMetricCard;

const baseRelationship: DBRelationship = {
  id: 'rel-1',
  source_id: 'card-1',
  target_id: 'card-2',
  type: 'Causal',
  confidence: 'High',
  weight: 0,
  causal_metadata: {
    status: 'validated',
    checklist: [{ id: 'c1', checked: true, notes: 'Temporal precedence' }],
  },
  description: 'notes live in description',
  project_id: 'proj-1',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
  created_by: 'user-1',
  last_modified_by: null,
} as DBRelationship;

describe('transformMetricCard', () => {
  it('round-trips status, workflow, and z_index from the DB row', () => {
    const card = transformMetricCard(baseCard);
    expect(card.status).toBe('in_progress');
    expect(card.workflow).toEqual({ priority: 'High' });
    expect(card.zIndex).toBe(7);
  });

  it('defaults status to null and workflow to {} when unset', () => {
    const card = transformMetricCard({
      ...baseCard,
      status: null,
      workflow: null,
      z_index: null,
    } as DBMetricCard);
    expect(card.status).toBeNull();
    expect(card.workflow).toEqual({});
    expect(card.zIndex).toBeNull();
  });
});

describe('transformRelationship', () => {
  it('maps description to notes and preserves causal_metadata', () => {
    const rel = transformRelationship(baseRelationship);
    expect(rel.notes).toBe('notes live in description');
    expect(rel.causalMetadata).toEqual({
      status: 'validated',
      checklist: [{ id: 'c1', checked: true, notes: 'Temporal precedence' }],
    });
  });

  it('preserves a saved weight of 0 instead of coercing it to 1', () => {
    const rel = transformRelationship(baseRelationship);
    expect(rel.weight).toBe(0);
  });

  it('leaves notes/causalMetadata/weight undefined when unset', () => {
    const rel = transformRelationship({
      ...baseRelationship,
      description: null,
      causal_metadata: null,
      weight: null,
    } as DBRelationship);
    expect(rel.notes).toBeUndefined();
    expect(rel.causalMetadata).toBeUndefined();
    expect(rel.weight).toBeUndefined();
  });
});
