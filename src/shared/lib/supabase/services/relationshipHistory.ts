// Relationship history — strength/confidence/type snapshots over time for the
// audit trail + strength-trend sparkline. One row per relationship edit; the
// weight snapshots power the trend. See migration 20260712120000.

import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database } from '../types';

type Client = SupabaseClient<Database>;
type Row = Database['public']['Tables']['relationship_history']['Row'];

const COLS =
  'id, relationship_id, project_id, type, confidence, weight, changed_by, created_at';

export interface RelationshipHistoryPoint {
  id: string;
  relationshipId: string;
  projectId: string | null;
  type: string | null;
  confidence: string | null;
  weight: number | null;
  changedBy: string;
  createdAt: string;
}

function rowToPoint(r: Row): RelationshipHistoryPoint {
  return {
    id: r.id,
    relationshipId: r.relationship_id,
    projectId: r.project_id,
    type: r.type,
    confidence: r.confidence,
    weight: r.weight,
    changedBy: r.changed_by,
    createdAt: r.created_at,
  };
}

/** Record a snapshot of a relationship's strength/confidence/type at edit time. */
export async function appendRelationshipHistory(
  input: {
    relationshipId: string;
    projectId?: string | null;
    type?: string | null;
    confidence?: string | null;
    weight?: number | null;
  },
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c.from('relationship_history').insert({
    relationship_id: input.relationshipId,
    project_id: input.projectId ?? null,
    type: input.type ?? null,
    confidence: input.confidence ?? null,
    weight: input.weight ?? null,
  });
  if (error) throw new Error(error.message);
}

/** All snapshots for a relationship, oldest → newest. */
export async function getRelationshipHistory(
  relationshipId: string,
  client?: Client
): Promise<RelationshipHistoryPoint[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('relationship_history')
    .select(COLS)
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToPoint(r as Row));
}

/** The weight series (points that recorded a strength), oldest → newest. */
export function toStrengthTrend(points: RelationshipHistoryPoint[]): number[] {
  return points
    .filter((p) => typeof p.weight === 'number')
    .map((p) => p.weight as number);
}

export interface StrengthTrendSummary {
  points: number;
  first: number | null;
  current: number | null;
  delta: number | null;
  direction: 'up' | 'down' | 'flat' | 'none';
}

/** Compact summary of how a relationship's strength has moved over its history. */
export function summarizeStrengthTrend(
  points: RelationshipHistoryPoint[]
): StrengthTrendSummary {
  const series = toStrengthTrend(points);
  if (series.length === 0) {
    return { points: 0, first: null, current: null, delta: null, direction: 'none' };
  }
  const first = series[0];
  const current = series[series.length - 1];
  const delta = Number((current - first).toFixed(2));
  const direction =
    series.length < 2 || delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down';
  return { points: series.length, first, current, delta, direction };
}
