import {
  CreateEvidenceItemSchema,
  CreateRelationshipSchema,
  UpdateEvidenceItemSchema,
  UpdateRelationshipSchema,
} from '@/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { EvidenceItem, Relationship } from '../../types';
import { supabase } from '../client';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';

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
    evidence: evidence.map(transformEvidenceItem),
    createdAt: rel.created_at || new Date().toISOString(),
    updatedAt: rel.updated_at || new Date().toISOString(),
  };
}

// Transform database row to EvidenceItem
function transformEvidenceItem(evidence: EvidenceItemRow): EvidenceItem {
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
  const client = authenticatedClient || supabase();

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

  const client = authenticatedClient || supabase();
  try {
    UpdateRelationshipSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating relationship:', error);
    throw error;
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

  return transformRelationship(data);
}

// Delete a relationship
export async function deleteRelationship(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { error } = await client.from('relationships').delete().eq('id', id);

  if (error) {
    console.error('Error deleting relationship:', error);
    throw error;
  }
}

// Get relationships for a project
export async function getProjectRelationships(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
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
    date: evidence.date,
    owner_id: evidence.owner || null,
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

  const client = authenticatedClient || supabase();
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
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.owner !== undefined) updateData.owner_id = updates.owner;
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.hypothesis !== undefined)
    updateData.hypothesis = updates.hypothesis;
  if (updates.summary !== undefined) updateData.summary = updates.summary;
  if (updates.impactOnConfidence !== undefined)
    updateData.impact_on_confidence = updates.impactOnConfidence;

  const client = authenticatedClient || supabase();
  try {
    UpdateEvidenceItemSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating evidence item:', error);
    throw error;
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
