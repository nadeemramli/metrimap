import { supabase } from '../client';
import type { Tables, TablesInsert, TablesUpdate } from '../types';
import type { MetricCard } from '../../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

export type MetricCardRow = Tables<'metric_cards'>;
export type MetricCardInsert = TablesInsert<'metric_cards'>;
export type MetricCardUpdate = TablesUpdate<'metric_cards'>;

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
function transformToInsert(card: MetricCard, projectId: string, userId: string): MetricCardInsert {
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
    owner_id: card.owner && card.owner.trim() !== '' ? card.owner : null,
    created_by: userId,
  };
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
    hasAuthenticatedClient: !!authenticatedClient
  });
  
  const insertData = transformToInsert(card, projectId, userId);
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
  const updateData: MetricCardUpdate = {};
  
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.subCategory !== undefined) updateData.sub_category = updates.subCategory;
  if (updates.position !== undefined) {
    updateData.position_x = updates.position.x;
    updateData.position_y = updates.position.y;
  }
  if (updates.data !== undefined) updateData.data = updates.data as any;
  if (updates.sourceType !== undefined) updateData.source_type = updates.sourceType;
  if (updates.formula !== undefined) updateData.formula = updates.formula;
  if (updates.causalFactors !== undefined) updateData.causal_factors = updates.causalFactors;
  if (updates.dimensions !== undefined) updateData.dimensions = updates.dimensions;
  if (updates.assignees !== undefined) updateData.assignees = updates.assignees;
  if (updates.owner !== undefined && updates.owner && updates.owner.trim() !== '') {
    updateData.owner_id = updates.owner;
  }
  
  // Always update the timestamp
  updateData.updated_at = new Date().toISOString();

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

  return transformMetricCard(data);
}

// Delete a metric card
export async function deleteMetricCard(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { error } = await client
    .from('metric_cards')
    .delete()
    .eq('id', id);

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