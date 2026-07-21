// @ts-nocheck
// TODO(type-debt): pre-existing type errors quarantined when strict type-checking
// was enabled. See docs/architecture/TYPE_CHECK_DEBT.md. Fix the errors and remove
// this directive — do not add new code here assuming it is type-checked.
import {
  CreateEvidenceItemSchema,
  CreateRelationshipSchema,
  UpdateEvidenceItemSchema,
  UpdateRelationshipSchema,
} from '@/shared/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import { appendRelationshipHistory } from './relationshipHistory';
import { evidenceOwnerId } from './evidence';
import type { EvidenceItem, Relationship } from '../../types';
import type {
  Database,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../types';

export type RelationshipRow = Tables<'relationships'>;
export type RelationshipInsert = TablesInsert<'relationships'>;
export type RelationshipUpdate = TablesUpdate<'relationships'>;

export type EvidenceItemRow = Tables<'evidence_items'>;
export type EvidenceItemInsert = TablesInsert<'evidence_items'>;
export type EvidenceItemUpdate = TablesUpdate<'evidence_items'>;

// Transform database row to Relationship
function transformRelationship(
  rel: RelationshipRow,
  evidence: EvidenceItemRow[] = []
): Relationship {
  return {
    id: rel.id,
    sourceId: rel.source_id || '',
    targetId: rel.target_id || '',
    type: rel.type as any,
    confidence: rel.confidence as any,
    weight: rel.weight || undefined,
    notes: rel.description || undefined,
    evidence: evidence.map(transformEvidenceItem),
    causalMetadata: (rel.causal_metadata as Relationship['causalMetadata']) ?? undefined,
    sourceHandle: rel.source_handle ?? undefined,
    targetHandle: rel.target_handle ?? undefined,
    createdAt: rel.created_at || new Date().toISOString(),
    updatedAt: rel.updated_at || new Date().toISOString(),
  };
}

// Transform database row to EvidenceItem. card_id/relationship_id are the DB
// truth for scope — mapped to `context` so store filters keep working.
function transformEvidenceItem(evidence: EvidenceItemRow): EvidenceItem {
  const context: EvidenceItem['context'] = evidence.card_id
    ? { type: 'card', targetId: evidence.card_id }
    : evidence.relationship_id
      ? { type: 'relationship', targetId: evidence.relationship_id }
      : { type: 'general' };
  return {
    id: evidence.id,
    title: evidence.title,
    type: evidence.type as any,
    date: evidence.date,
    owner: evidence.owner_id || '',
    link: evidence.link || undefined,
    hypothesis: evidence.hypothesis || undefined,
    summary: evidence.summary,
    impactOnConfidence: evidence.impact_on_confidence || undefined,
    content: (evidence.content as EvidenceItem['content']) ?? undefined,
    context,
    createdAt: evidence.created_at ?? undefined,
    updatedAt: evidence.updated_at ?? undefined,
    createdBy: evidence.created_by,
  };
}

// Transform Relationship to database insert
function transformToInsert(
  rel: Relationship,
  projectId: string,
  userId: string
): RelationshipInsert {
  return {
    project_id: projectId,
    source_id: rel.sourceId,
    target_id: rel.targetId,
    type: rel.type,
    confidence: rel.confidence,
    weight: rel.weight,
    // causal_metadata is set post-validation in createRelationship — the
    // generated Json schema rejects raw null (wants DbNull/JsonNull sentinels).
    // Notes live in the `description` column (domain calls it `notes`).
    description: rel.notes ?? null,
    created_by: userId,
  };
}

// Create a new relationship
export async function createRelationship(
  relationship: Relationship,
  projectId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const insertData = transformToInsert(relationship, projectId, userId);
  try {
    CreateRelationshipSchema.parse(insertData as unknown);
  } catch (error) {
    console.error('Validation error creating relationship:', error);
    throw error;
  }
  // Pinned endpoints (CVS-335) are set AFTER validation — the strict generated
  // schema predates these columns and would reject them (same as evidence
  // date/content); the Postgres text columns accept them directly.
  // causal_metadata too: the generated Json union rejects raw null.
  insertData.causal_metadata = (relationship.causalMetadata ?? null) as Json;
  if (relationship.sourceHandle !== undefined) {
    insertData.source_handle = relationship.sourceHandle ?? null;
  }
  if (relationship.targetHandle !== undefined) {
    insertData.target_handle = relationship.targetHandle ?? null;
  }
  const client = resolveClient(authenticatedClient);

  const { data, error } = await client
    .from('relationships')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating relationship:', error);
    throw error;
  }

  return transformRelationship(data);
}

// Update a relationship
export async function updateRelationship(
  id: string,
  updates: Partial<Relationship>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const updateData: RelationshipUpdate = {};

  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.confidence !== undefined)
    updateData.confidence = updates.confidence;
  if (updates.weight !== undefined) updateData.weight = updates.weight;
  // Notes live in the `description` column (domain calls it `notes`).
  if (updates.notes !== undefined) updateData.description = updates.notes ?? null;

  const client = resolveClient(authenticatedClient);
  try {
    UpdateRelationshipSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating relationship:', error);
    throw error;
  }
  // Pinned endpoints (CVS-335) — set AFTER validation, like evidence
  // date/content: the strict generated schema doesn't know these columns.
  // Explicit null un-pins (edge goes back to following the layout).
  // causal_metadata post-validation too (Json schema rejects raw null).
  if (updates.causalMetadata !== undefined) {
    updateData.causal_metadata = (updates.causalMetadata ?? null) as Json;
  }
  if (updates.sourceHandle !== undefined) {
    updateData.source_handle = updates.sourceHandle ?? null;
  }
  if (updates.targetHandle !== undefined) {
    updateData.target_handle = updates.targetHandle ?? null;
  }
  const { data, error } = await client
    .from('relationships')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating relationship:', error);
    throw error;
  }

  // Record a strength/confidence/type snapshot for the audit trail + trend.
  // Best-effort: never fail the update if history can't be written.
  try {
    await appendRelationshipHistory(
      {
        relationshipId: id,
        projectId: data.project_id,
        type: data.type,
        confidence: data.confidence,
        weight: data.weight,
      },
      client
    );
  } catch (historyError) {
    console.error('Failed to record relationship history:', historyError);
  }

  return transformRelationship(data);
}

// Delete a relationship
export async function deleteRelationship(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('relationships')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('Error deleting relationship:', error);
    throw error;
  }
  return { deleted: data?.length ?? 0 };
}

// Get relationships for a project
export async function getProjectRelationships(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('relationships')
    .select(
      `
      *,
      evidence_items(*)
    `
    )
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching relationships:', error);
    throw error;
  }

  return (
    data?.map((rel: any) => transformRelationship(rel, rel.evidence_items)) ||
    []
  );
}

// Evidence Items

// Create evidence item
export async function createEvidenceItem(
  evidence: EvidenceItem,
  relationshipId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const insertData: EvidenceItemInsert = {
    relationship_id: relationshipId,
    title: evidence.title,
    type: evidence.type,
    // owner_id is a users(id) FK — a display name here fails the insert (CVS-279).
    owner_id: evidenceOwnerId(evidence.owner),
    link: evidence.link,
    hypothesis: evidence.hypothesis,
    summary: evidence.summary,
    impact_on_confidence: evidence.impactOnConfidence,
    created_by: userId,
  };
  try {
    CreateEvidenceItemSchema.parse(insertData as unknown);
  } catch (error) {
    console.error('Validation error creating evidence item:', error);
    throw error;
  }
  // `date` (date-only string, schema validates it as datetime) + jsonb `content`
  // are set AFTER validation — the strict generated schema would reject them but
  // the Postgres columns accept them directly (CVS-34).
  insertData.date = evidence.date;
  if (evidence.content !== undefined) {
    insertData.content = (evidence.content ?? null) as Json;
  }

  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('evidence_items')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating evidence item:', error);
    throw error;
  }

  return transformEvidenceItem(data);
}

// Update evidence item
export async function updateEvidenceItem(
  id: string,
  updates: Partial<EvidenceItem>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const updateData: EvidenceItemUpdate = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.owner !== undefined)
    updateData.owner_id = evidenceOwnerId(updates.owner);
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.hypothesis !== undefined)
    updateData.hypothesis = updates.hypothesis;
  if (updates.summary !== undefined) updateData.summary = updates.summary;
  if (updates.impactOnConfidence !== undefined)
    updateData.impact_on_confidence = updates.impactOnConfidence;

  const client = resolveClient(authenticatedClient);
  try {
    UpdateEvidenceItemSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating evidence item:', error);
    throw error;
  }
  // The generated (strict) Zod schema validates `date` as a datetime, but the app
  // uses date-only strings ("2026-07-04"); and `content` is jsonb the schema
  // doesn't know. Set both AFTER validation — the Postgres `date`/`jsonb` columns
  // accept the values directly, and the strict parse would otherwise reject them
  // (CVS-34 — this is what broke evidence autosave-to-DB).
  if (updates.date !== undefined) {
    updateData.date = updates.date;
  }
  if (updates.content !== undefined) {
    updateData.content = (updates.content ?? null) as Json;
  }
  // Context is stored as scope columns; the stale generated schema doesn't
  // know card_id/relationship_id either, so these are also post-validation.
  if (updates.context !== undefined) {
    const ctx = updates.context;
    updateData.card_id =
      ctx?.type === 'card' ? (ctx.targetId ?? null) : null;
    updateData.relationship_id =
      ctx?.type === 'relationship' ? (ctx.targetId ?? null) : null;
  }
  const { data, error } = await client
    .from('evidence_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating evidence item:', error);
    throw error;
  }

  return transformEvidenceItem(data);
}

// Delete evidence item
export async function deleteEvidenceItem(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { error } = await client.from('evidence_items').delete().eq('id', id);

  if (error) {
    console.error('Error deleting evidence item:', error);
    throw error;
  }
}

// Get evidence items for a relationship
export async function getRelationshipEvidence(
  relationshipId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('evidence_items')
    .select('*')
    .eq('relationship_id', relationshipId);

  if (error) {
    console.error('Error fetching evidence items:', error);
    throw error;
  }

  return data?.map(transformEvidenceItem) || [];
}
