import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database, Json, Tables } from '../types';
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
    content: (row.content as EvidenceItem['content']) ?? undefined,
  };
}

/** Evidence attached to a metric card, newest first. */
export async function getCardEvidence(
  cardId: string,
  client?: Client
): Promise<EvidenceItem[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('evidence_items')
    .select('*')
    .eq('card_id', cardId)
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToEvidence);
}

/** A single evidence item by id (any scope), or null — the notebook's DB source. */
export async function getEvidenceItemById(
  id: string,
  client?: Client
): Promise<EvidenceItem | null> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('evidence_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToEvidence(data) : null;
}

/** Create an evidence item attached to a card. */
export async function createCardEvidence(
  evidence: EvidenceItem,
  cardId: string,
  projectId: string,
  userId: string,
  client?: Client
): Promise<EvidenceItem> {
  const c = resolveClient(client);
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
      content: (evidence.content ?? null) as Json,
      created_by: userId,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToEvidence(data);
}

/** Create a general project-scoped evidence item (no card / relationship). Used
 *  by the Evidence Repository "New Evidence" so it's DB-backed, not store-only. */
export async function createProjectEvidence(
  evidence: EvidenceItem,
  projectId: string,
  userId: string,
  client?: Client
): Promise<EvidenceItem> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('evidence_items')
    .insert({
      project_id: projectId,
      title: evidence.title,
      type: evidence.type,
      date: evidence.date,
      owner_id: evidence.owner || null,
      link: evidence.link ?? null,
      hypothesis: evidence.hypothesis ?? null,
      summary: evidence.summary || evidence.title,
      impact_on_confidence: evidence.impactOnConfidence ?? null,
      content: (evidence.content ?? null) as Json,
      created_by: userId,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToEvidence(data);
}
