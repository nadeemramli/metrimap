import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import { track } from '@/shared/lib/analytics';
import type { Database, Json, Tables } from '../types';
import type { EvidenceItem } from '@/shared/types';

// Card-scoped evidence (task/action nodes). Relationship evidence lives in
// relationships.ts; card evidence is scoped by card_id + project_id (see the
// evidence_card_scope migration). update/delete are shared (id-based) and reused
// from relationships.ts.

type Client = SupabaseClient<Database>;

/** evidence_items.owner_id is an FK to users(id) (Clerk ids), but the domain
 *  EvidenceItem.owner usually carries a display name (EvidenceDialog prefills
 *  one) — writing that violated the FK and failed every dialog save. Persist
 *  only real user ids; anything else stores no owner. */
export function evidenceOwnerId(owner?: string | null): string | null {
  return owner && /^user_[A-Za-z0-9]+$/.test(owner) ? owner : null;
}

/** Client-generated ids are UUIDs; legacy store items may carry `evidence_...`
 *  fallback ids that can't be inserted into the uuid PK. */
export function isEvidenceUuid(id: string | undefined | null): boolean {
  return (
    !!id &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}

/** card_id/relationship_id are the DB truth for scope — map them back to the
 *  domain `context` so store filters (getGeneralEvidence & co.) keep working
 *  on hydrated rows. */
export function rowToEvidence(row: Tables<'evidence_items'>): EvidenceItem {
  const context: EvidenceItem['context'] = row.card_id
    ? { type: 'card', targetId: row.card_id }
    : row.relationship_id
      ? { type: 'relationship', targetId: row.relationship_id }
      : { type: 'general' };
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
    isPublic: row.is_public ?? false,
    content: (row.content as EvidenceItem['content']) ?? undefined,
    context,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
    createdBy: row.created_by,
  };
}

/**
 * Toggle an evidence item's public read-only share. When on, anyone with the
 * link can view it at /embed/evidence/:id (RLS: is_public disjunct). Writes stay
 * project-access gated, so only editors can flip this.
 */
export async function setEvidencePublic(
  id: string,
  isPublic: boolean,
  client?: Client
): Promise<void> {
  const c = resolveClient(client);
  const { error } = await c
    .from('evidence_items')
    .update({ is_public: isPublic })
    .eq('id', id);
  if (error) throw new Error(error.message);
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

/** All of a project's evidence items (any scope), newest first. */
export async function getProjectEvidence(
  projectId: string,
  client?: Client
): Promise<EvidenceItem[]> {
  const c = resolveClient(client);
  const { data, error } = await c
    .from('evidence_items')
    .select('*')
    .eq('project_id', projectId)
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
      // Keep the client-generated UUID so canvas nodes / edges / panels that
      // already reference the item never need an id swap.
      ...(isEvidenceUuid(evidence.id) ? { id: evidence.id } : {}),
      card_id: cardId,
      project_id: projectId,
      title: evidence.title,
      type: evidence.type,
      date: evidence.date,
      owner_id: evidenceOwnerId(evidence.owner),
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
  // Value/governance signal: evidence backs decisions in the tree.
  track('evidence_created', { scope: 'card', evidence_type: evidence.type });
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
      ...(isEvidenceUuid(evidence.id) ? { id: evidence.id } : {}),
      project_id: projectId,
      title: evidence.title,
      type: evidence.type,
      date: evidence.date,
      owner_id: evidenceOwnerId(evidence.owner),
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
  track('evidence_created', { scope: 'project', evidence_type: evidence.type });
  return rowToEvidence(data);
}

/** Bulk insert for the legacy settings-blob → evidence_items migration.
 *  UUID ids are preserved; non-UUID (legacy `evidence_...`) ids get fresh
 *  DB-generated ids — callers must remap references via the returned rows
 *  (same array order as the input). */
export async function insertProjectEvidenceBatch(
  items: EvidenceItem[],
  projectId: string,
  userId: string,
  client?: Client
): Promise<EvidenceItem[]> {
  if (!items.length) return [];
  const c = resolveClient(client);
  const rows = items.map((e) => ({
    ...(isEvidenceUuid(e.id) ? { id: e.id } : {}),
    project_id: projectId,
    card_id: e.context?.type === 'card' ? (e.context.targetId ?? null) : null,
    relationship_id:
      e.context?.type === 'relationship' ? (e.context.targetId ?? null) : null,
    title: e.title,
    type: e.type,
    date: e.date,
    owner_id: evidenceOwnerId(e.owner),
    link: e.link ?? null,
    hypothesis: e.hypothesis ?? null,
    summary: e.summary || e.title,
    impact_on_confidence: e.impactOnConfidence ?? null,
    content: (e.content ?? null) as Json,
    // created_by must be a real user id — legacy items may carry 'unknown'.
    created_by: /^user_[A-Za-z0-9]+$/.test(e.createdBy ?? '')
      ? (e.createdBy as string)
      : userId,
  }));
  const { data, error } = await c
    .from('evidence_items')
    .insert(rows)
    .select('*');
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToEvidence);
}
