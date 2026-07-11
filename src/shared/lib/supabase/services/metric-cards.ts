import {
  CreateMetricCardSchema,
  UpdateMetricCardSchema,
} from '@/shared/lib/validation/zod';
import type { MetricCard } from '@/shared/types';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';
import { createLogger } from '@/shared/utils/logger';
import { cardsReadSource } from '../cardsReadSource';

const log = createLogger('metric-cards');

export type MetricCardRow = Tables<'metric_cards'>;
export type MetricCardInsert = TablesInsert<'metric_cards'>;
export type MetricCardUpdate = TablesUpdate<'metric_cards'>;

// Every metric_cards column EXCEPT `data`. Writes must RETURNING these explicit
// columns: after the hide_value migration, reading `data` off metric_cards is
// REVOKEd (it's only readable via the redacting metric_cards_visible view), so
// a bare `.select()` (= all columns) would fail. Keep in sync with the table.
const CARD_COLUMNS_NO_DATA =
  'id, project_id, title, description, category, sub_category, position_x, position_y, source_type, formula, causal_factors, dimensions, owner_id, assignees, created_at, updated_at, created_by, updated_by, status, workflow, z_index, tracked_metric_id';

function setIfDefined<T extends Record<string, any>>(
  obj: T,
  key: keyof T,
  value: any
) {
  if (value !== undefined) (obj as any)[key] = value;
}

/** metric_cards.owner_id is an FK to users(id) (Clerk ids), but the settings
 *  form lets users type free text. Persist only real user ids; anything else
 *  (display names, empty string) stores no owner. Mirrors evidenceOwnerId. */
export function cardOwnerId(owner?: string | null): string | null {
  const trimmed = owner?.trim();
  return trimmed && /^user_[A-Za-z0-9]+$/.test(trimmed) ? trimmed : null;
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
    zIndex: (card as { z_index?: number | null }).z_index ?? null,
    data: card.data as any,
    sourceType: card.source_type as any,
    trackedMetricId: (card as any).tracked_metric_id ?? null,
    formula: card.formula || undefined,
    owner: card.owner_id || undefined,
    assignees: card.assignees || [],
    status: (card.status as MetricCard['status']) ?? null,
    workflow: (card.workflow ?? {}) as MetricCard['workflow'],
    createdAt: card.created_at || new Date().toISOString(),
    updatedAt: card.updated_at || new Date().toISOString(),
    updatedBy: (card as { updated_by?: string | null }).updated_by ?? null,
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
    z_index: card.zIndex ?? null,
    data: card.data as any,
    source_type: card.sourceType,
    formula: card.formula,
    causal_factors: card.causalFactors,
    dimensions: card.dimensions,
    assignees: card.assignees,
    owner_id: cardOwnerId(card.owner),
    status: card.status ?? null,
    workflow: (card.workflow ?? {}) as MetricCardInsert['workflow'],
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

  setIfDefined(updateData, 'z_index', updates.zIndex);

  setIfDefined(updateData, 'data', updates.data as any);
  setIfDefined(updateData, 'source_type', updates.sourceType);
  setIfDefined(updateData, 'formula', updates.formula);
  setIfDefined(updateData, 'causal_factors', updates.causalFactors);
  setIfDefined(updateData, 'dimensions', updates.dimensions);
  setIfDefined(updateData, 'assignees', updates.assignees);
  setIfDefined(updateData, 'status', updates.status);
  setIfDefined(updateData, 'workflow', updates.workflow as any);

  if (updates.owner !== undefined) {
    updateData.owner_id = cardOwnerId(updates.owner);
  }

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
  const client = resolveClient(authenticatedClient);
  // RETURNING must avoid `data` (REVOKEd post hide_value migration). Re-attach
  // the value series the caller just wrote so it still sees what it persisted.
  const { data, error } = await client
    .from('metric_cards')
    .update(updateData)
    .eq('id', id)
    .select(CARD_COLUMNS_NO_DATA)
    .single();

  if (error) {
    console.error('Error updating metric card:', error);
    throw error;
  }

  if (updateData.data !== undefined) {
    (data as MetricCardRow).data = updateData.data as MetricCardRow['data'];
  }

  return data as MetricCardRow;
}

// Create a new metric card
export async function createMetricCard(
  card: MetricCard,
  projectId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  log.debug('🔍 createMetricCard called with:', {
    projectId,
    userId,
    cardTitle: card.title,
    hasAuthenticatedClient: !!authenticatedClient,
  });

  // Validate using Prisma-generated Zod schema
  const insertData = transformToInsert(card, projectId, userId);
  try {
    CreateMetricCardSchema.parse(insertData as unknown);
  } catch (error) {
    console.error('Validation error creating metric card:', error);
    throw error;
  }
  log.debug('🔍 Insert data:', insertData);

  const client = resolveClient(authenticatedClient);

  // RETURNING avoids `data` (REVOKEd post hide_value migration); merge the
  // series we just inserted back so callers reading data get their value.
  const { data, error } = await client
    .from('metric_cards')
    .insert(insertData)
    .select(CARD_COLUMNS_NO_DATA)
    .single();

  if (error) {
    console.error('❌ Error creating metric card:', error);
    throw error;
  }

  if (insertData.data !== undefined) {
    (data as MetricCardRow).data = insertData.data as MetricCardRow['data'];
  }

  log.debug('✅ Metric card created successfully:', data);
  return transformMetricCard(data as MetricCardRow);
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
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('metric_cards')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('Error deleting metric card:', error);
    throw error;
  }
  return { deleted: data?.length ?? 0 };
}

// Get metric cards for a project
export async function getProjectMetricCards(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  // Read through the redacting view so hide_value nodes come back with data
  // blanked server-side (falls back to the base table pre-migration).
  const src = await cardsReadSource(client);
  const { data, error } = await client
    .from(src as 'metric_cards')
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
  log.debug(`💾 Updating position for metric card ${id}:`, position);

  const client = resolveClient(authenticatedClient);
  // Position-only write; RETURNING avoids `data` (REVOKEd post hide_value
  // migration). Callers use id/position, not the value series.
  const { data, error } = await client
    .from('metric_cards')
    .update({
      position_x: position.x,
      position_y: position.y,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(CARD_COLUMNS_NO_DATA)
    .single();

  if (error) {
    console.error('❌ Error updating metric card position:', error);
    throw error;
  }

  log.debug(`✅ Successfully updated position for metric card ${id}`);
  return transformMetricCard(data as MetricCardRow);
}
