import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database, Tables } from '../types';
import type { EvidenceItem } from '@/shared/types';

// Card-scoped evidence (task/action nodes). Relationship evidence lives in
// relationships.ts; card evidence is scoped by card_id + project_id (see the
// evidence_card_scope migration). update/delete are shared (id-based) and reused
// from relationships.ts.

type Client = SupabaseClient<Database>;

function rowToEvidence(row: Tables<'evidence_items'>): EvidenceItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type as EvidenceItem['type'],
    date: row.date,
    owner: row.owner_id || '',
    link: row.link || undefined,
    hypothesis: row.hypothesis || undefined,
    summary: row.summary,
    impactOnConfidence: row.impact_on_confidence || undefined,
  };
}

/** Evidence attached to a metric card, newest first. */
export async function getCardEvidence(
  cardId: string,
  client?: Client
): Promise<EvidenceItem[]> {
  const c = client || supabase();
  const { data, error } = await c
    .from('evidence_items')
    .select('*')
    .eq('card_id', cardId)
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToEvidence);
}

/** Create an evidence item attached to a card. */
export async function createCardEvidence(
  evidence: EvidenceItem,
  cardId: string,
  projectId: string,
  userId: string,
  client?: Client
): Promise<EvidenceItem> {
  const c = client || supabase();
  const { data, error } = await c
    .from('evidence_items')
    .insert({
      card_id: cardId,
      project_id: projectId,
      title: evidence.title,
      type: evidence.type,
      date: evidence.date,
      owner_id: evidence.owner || null,
      link: evidence.link ?? null,
      hypothesis: evidence.hypothesis ?? null,
      summary: evidence.summary,
      impact_on_confidence: evidence.impactOnConfidence ?? null,
      created_by: userId,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToEvidence(data);
}
