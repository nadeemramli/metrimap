import {
  CreateMetricCardSchema,
  UpdateMetricCardSchema,
} from '@/shared/lib/validation/zod';
import type { MetricCard } from '@/shared/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';

export type MetricCardRow = Tables<'metric_cards'>;
export type MetricCardInsert = TablesInsert<'metric_cards'>;
export type MetricCardUpdate = TablesUpdate<'metric_cards'>;

function setIfDefined<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  value: any
) {
  if (value !== undefined) (obj as any)[key] = value;
}

// Transform database row to MetricCard
function transformMetricCard(card: MetricCardRow): MetricCard {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    category: card.category as any,
    subCategory: card.sub_category as any,
    tags: [], // Will be fetched from metric_card_tags junction table
    causalFactors: (card.causal_factors || []) as any,
    dimensions: (card.dimensions || []) as any,
    position: { x: card.position_x, y: card.position_y },
    data: card.data as any,
    sourceType: card.source_type as any,
    formula: card.formula || undefined,
    owner: card.owner_id || undefined,
    assignees: card.assignees || [],
    createdAt: card.created_at || new Date().toISOString(),
    updatedAt: card.updated_at || new Date().toISOString(),
  };
}

// Transform MetricCard to database insert
function transformToInsert(
  card: MetricCard,
  projectId: string,
  userId: string
): MetricCardInsert {
  return {
    project_id: projectId,
    title: card.title,
    description: card.description,
    category: card.category,
    sub_category: card.subCategory,
    position_x: card.position.x,
    position_y: card.position.y,
    data: card.data as any,
    source_type: card.sourceType,
    formula: card.formula,
    causal_factors: card.causalFactors,
    dimensions: card.dimensions,
    assignees: card.assignees,
    owner_id: card.owner && card.owner.trim() !== '' ? card.owner.trim() : null,
    created_by: userId,
  };
}

// Build DB update payload from domain updates
function buildUpdateData(updates: Partial<MetricCard>): MetricCardUpdate {
  const updateData: MetricCardUpdate = {};

  setIfDefined(updateData, 'title', updates.title);
  setIfDefined(updateData, 'description', updates.description);
  setIfDefined(updateData, 'category', updates.category);
  setIfDefined(updateData, 'sub_category', updates.subCategory);

  if (updates.position !== undefined) {
    updateData.position_x = updates.position.x;
    updateData.position_y = updates.position.y;
  }

  setIfDefined(updateData, 'data', updates.data as any);
  setIfDefined(updateData, 'source_type', updates.sourceType);
  setIfDefined(updateData, 'formula', updates.formula);
  setIfDefined(updateData, 'causal_factors', updates.causalFactors);
  setIfDefined(updateData, 'dimensions', updates.dimensions);
  setIfDefined(updateData, 'assignees', updates.assignees);

  const trimmedOwner = updates.owner?.trim();
  if (trimmedOwner) updateData.owner_id = trimmedOwner;

  // Always update the timestamp
  updateData.updated_at = new Date().toISOString();

  return updateData;
}

function validateUpdateData(updateData: MetricCardUpdate) {
  try {
    UpdateMetricCardSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating metric card:', error);
    throw error;
  }
}

async function executeUpdate(
  id: string,
  updateData: MetricCardUpdate,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { data, error } = await client
    .from('metric_cards')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating metric card:', error);
    throw error;
  }

  return data;
}

// Create a new metric card
export async function createMetricCard(
  card: MetricCard,
  projectId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  console.log('🔍 createMetricCard called with:', {
    projectId,
    userId,
    cardTitle: card.title,
    hasAuthenticatedClient: !!authenticatedClient,
  });

  // Validate using Prisma-generated Zod schema
  let insertData = transformToInsert(card, projectId, userId);
  try {
    CreateMetricCardSchema.parse(insertData as unknown);
  } catch (error) {
    console.error('Validation error creating metric card:', error);
    throw error;
  }
  console.log('🔍 Insert data:', insertData);

  const client = authenticatedClient || supabase();

  const { data, error } = await client
    .from('metric_cards')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating metric card:', error);
    throw error;
  }

  console.log('✅ Metric card created successfully:', data);
  return transformMetricCard(data);
}

// Update a metric card
export async function updateMetricCard(
  id: string,
  updates: Partial<MetricCard>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const updateData = buildUpdateData(updates);
  validateUpdateData(updateData);
  const data = await executeUpdate(id, updateData, authenticatedClient);
  return transformMetricCard(data);
}

// Delete a metric card
export async function deleteMetricCard(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { error } = await client.from('metric_cards').delete().eq('id', id);

  if (error) {
    console.error('Error deleting metric card:', error);
    throw error;
  }
}

// Get metric cards for a project
export async function getProjectMetricCards(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { data, error } = await client
    .from('metric_cards')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching metric cards:', error);
    throw error;
  }

  return data?.map(transformMetricCard) || [];
}

// Update metric card position
export async function updateMetricCardPosition(
  id: string,
  position: { x: number; y: number },
  authenticatedClient?: SupabaseClient<Database>
) {
  console.log(`💾 Updating position for metric card ${id}:`, position);

  const client = authenticatedClient || supabase();
  const { data, error } = await client
    .from('metric_cards')
    .update({
      position_x: position.x,
      position_y: position.y,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ Error updating metric card position:', error);
    throw error;
  }

  console.log(`✅ Successfully updated position for metric card ${id}`);
  return transformMetricCard(data);
}
