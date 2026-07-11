import { CreateTagSchema, UpdateTagSchema } from '@/shared/lib/validation/zod';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';
import { createLogger } from '@/shared/utils/logger';

const log = createLogger('tags');

export type TagRow = Tables<'tags'>;
export type TagInsert = TablesInsert<'tags'>;
export type TagUpdate = TablesUpdate<'tags'>;

// Get all tags for a project (from database)
export async function getProjectTags(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🔍 Fetching project tags for projectId:", projectId);

  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('tags')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  log.debug('🔍 Supabase query result:', { data, error });

  if (error) {
    console.error('Error fetching project tags:', error);
    throw error;
  }

  log.debug(
    '✅ Project tags fetched successfully:',
    data?.length || 0,
    'tags'
  );
  return data || [];
}

// Create a new tag for a project
export async function createTag(
  tag: Omit<TagInsert, 'id' | 'created_at' | 'updated_at'>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  try {
    CreateTagSchema.parse(tag as unknown);
  } catch (error) {
    console.error('Validation error creating tag:', error);
    throw error;
  }
  const { data, error } = await client
    .from('tags')
    .insert({
      ...tag,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw error;
  }

  return data;
}

// Update a tag
export async function updateTag(
  tagId: string,
  updates: TagUpdate,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  try {
    UpdateTagSchema.parse(updates as unknown);
  } catch (error) {
    console.error('Validation error updating tag:', error);
    throw error;
  }
  const { data, error } = await client
    .from('tags')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tagId)
    .select()
    .single();

  if (error) {
    console.error('Error updating tag:', error);
    throw error;
  }

  return data;
}

// Delete a tag
export async function deleteTag(
  tagId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { error } = await client.from('tags').delete().eq('id', tagId);

  if (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}

// Search tags by name (for autocomplete)
export async function searchProjectTags(
  projectId: string,
  query: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('tags')
    .select('*')
    .eq('project_id', projectId)
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(10);

  if (error) {
    console.error('Error searching project tags:', error);
    throw error;
  }

  return data || [];
}

// Get tag usage statistics
export async function getTagUsageStats(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  // Get tags with their usage counts
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('tags')
    .select(
      `
      *,
      metric_cards!inner(project_id),
      relationships!inner(project_id)
    `
    )
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching tag usage stats:', error);
    throw error;
  }

  return data || [];
}

// Get tags for a metric card (database system)
export async function getMetricCardTags(
  metricCardId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🔍 Getting database tags for metric card:", metricCardId);

  try {
    const client = resolveClient(authenticatedClient);
    const { data, error } = await client
      .from('metric_card_tags')
      .select(
        `
        tag_id,
        tags!inner(id, name, color, description)
      `
      )
      .eq('metric_card_id', metricCardId);

    if (error) {
      console.error('Error fetching metric card tags:', error);
      return [];
    }

    const tagNames = data?.map((item) => item.tags.name) || [];
    // log.debug("✅ Database tags found:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error in getMetricCardTags:', error);
    return [];
  }
}

// Add tags to metric card (database system)
export async function addTagsToMetricCard(
  metricCardId: string,
  tagNames: string[],
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🏷️ Adding database tags to metric card:", metricCardId, tagNames);

  try {
    const client = resolveClient(authenticatedClient);
    // Get project ID for the metric card
    const { data: metricCard, error: fetchError } = await client
      .from('metric_cards')
      .select('project_id')
      .eq('id', metricCardId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Resolve tag IDs, creating any tags that don't exist yet
    const tagIds = await resolveOrCreateTagIds(
      metricCard.project_id,
      tagNames,
      authenticatedClient
    );

    if (tagIds.length === 0) {
      log.debug('⚠️ No database tags found for names:', tagNames);
      return [];
    }

    // Create metric_card_tags relationships
    const relationships = tagIds
      .filter((tagId) => tagId !== undefined)
      .map((tagId) => ({
        metric_card_id: metricCardId,
        tag_id: tagId!,
      }));

    const { error: insertError } = await client
      .from('metric_card_tags')
      .insert(relationships);

    if (insertError) {
      console.error(
        'Error creating metric card tag relationships:',
        insertError
      );
      throw insertError;
    }

    // log.debug("✅ Database tags added to metric card:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error adding tags to metric card:', error);
    throw error;
  }
}

// Remove tags from metric card (database system)
export async function removeTagsFromMetricCard(
  metricCardId: string,
  tagNames: string[],
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🗑️ Removing database tags from metric card:", metricCardId, tagNames);

  try {
    const client = resolveClient(authenticatedClient);
    // Get project ID for the metric card
    const { data: metricCard, error: fetchError } = await client
      .from('metric_cards')
      .select('project_id')
      .eq('id', metricCardId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Get tag IDs for the tag names
    const tagIds = await getTagIdsByNames(
      metricCard.project_id,
      tagNames,
      authenticatedClient
    );

    if (tagIds.length === 0) {
      log.debug('⚠️ No database tags found for names:', tagNames);
      return [];
    }

    // Remove metric_card_tags relationships
    const filteredTagIds = tagIds.filter(
      (tagId) => tagId !== undefined
    ) as string[];
    const { error: deleteError } = await client
      .from('metric_card_tags')
      .delete()
      .eq('metric_card_id', metricCardId)
      .in('tag_id', filteredTagIds);

    if (deleteError) {
      console.error(
        'Error removing metric card tag relationships:',
        deleteError
      );
      throw deleteError;
    }

    // log.debug("✅ Database tags removed from metric card:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error removing tags from metric card:', error);
    throw error;
  }
}

// Get tags for a relationship (database system)
export async function getRelationshipTags(
  relationshipId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🔍 Getting database tags for relationship:", relationshipId);

  try {
    const client = resolveClient(authenticatedClient);
    const { data, error } = await client
      .from('relationship_tags')
      .select(
        `
        tag_id,
        tags!inner(id, name, color, description)
      `
      )
      .eq('relationship_id', relationshipId);

    if (error) {
      console.error('Error fetching relationship tags:', error);
      return [];
    }

    const tagNames = data?.map((item) => item.tags.name) || [];
    // log.debug("✅ Database tags found for relationship:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error in getRelationshipTags:', error);
    return [];
  }
}

// Add tags to relationship (database system)
export async function addTagsToRelationship(
  relationshipId: string,
  tagNames: string[],
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🏷️ Adding database tags to relationship:", relationshipId, tagNames);

  try {
    const client = resolveClient(authenticatedClient);
    // Get project ID for the relationship
    const { data: relationship, error: fetchError } = await client
      .from('relationships')
      .select('project_id')
      .eq('id', relationshipId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Resolve tag IDs, creating any tags that don't exist yet
    const tagIds = await resolveOrCreateTagIds(
      relationship.project_id,
      tagNames,
      authenticatedClient
    );

    if (tagIds.length === 0) {
      log.debug('⚠️ No database tags found for names:', tagNames);
      return [];
    }

    // Create relationship_tags relationships
    const relationships = tagIds
      .filter((tagId) => tagId !== undefined)
      .map((tagId) => ({
        relationship_id: relationshipId,
        tag_id: tagId!,
      }));

    const { error: insertError } = await client
      .from('relationship_tags')
      .insert(relationships);

    if (insertError) {
      console.error(
        'Error creating relationship tag relationships:',
        insertError
      );
      throw insertError;
    }

    // log.debug("✅ Database tags added to relationship:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error adding tags to relationship:', error);
    throw error;
  }
}

// Remove tags from relationship (database system)
export async function removeTagsFromRelationship(
  relationshipId: string,
  tagNames: string[],
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🗑️ Removing database tags from relationship:", relationshipId, tagNames);

  try {
    const client = resolveClient(authenticatedClient);
    // Get project ID for the relationship
    const { data: relationship, error: fetchError } = await client
      .from('relationships')
      .select('project_id')
      .eq('id', relationshipId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Get tag IDs for the tag names
    const tagIds = await getTagIdsByNames(
      relationship.project_id,
      tagNames,
      authenticatedClient
    );

    if (tagIds.length === 0) {
      log.debug('⚠️ No database tags found for names:', tagNames);
      return [];
    }

    // Remove relationship_tags relationships
    const filteredTagIds = tagIds.filter(
      (tagId) => tagId !== undefined
    ) as string[];
    const { error: deleteError } = await client
      .from('relationship_tags')
      .delete()
      .eq('relationship_id', relationshipId)
      .in('tag_id', filteredTagIds);

    if (deleteError) {
      console.error(
        'Error removing relationship tag relationships:',
        deleteError
      );
      throw deleteError;
    }

    // log.debug("✅ Database tags removed from relationship:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error removing tags from relationship:', error);
    throw error;
  }
}

// Convert legacy tag names to database tag IDs
export async function getTagIdsByNames(
  projectId: string,
  tagNames: string[],
  authenticatedClient?: SupabaseClient<Database>
) {
  // log.debug("🔄 Converting tag names to IDs:", tagNames);

  try {
    const client = resolveClient(authenticatedClient);
    const { data: tags, error } = await client
      .from('tags')
      .select('id, name')
      .eq('project_id', projectId)
      .in('name', tagNames);

    if (error) {
      throw error;
    }

    const tagMap = new Map(tags.map((tag) => [tag.name, tag.id]));
    const tagIds = tagNames.map((name) => tagMap.get(name)).filter(Boolean);

    log.debug('✅ Tag IDs found:', tagIds);
    return tagIds;
  } catch (error) {
    console.error('Error converting tag names to IDs:', error);
    throw error;
  }
}

// Resolve tag names to ids, creating any missing tags rows in the project.
// The tag-input UI can call add-tag persistence before its createProjectTag
// insert lands, so a brand-new tag name may not exist yet — silently skipping
// it dropped the junction row and lost the tag on reload.
async function resolveOrCreateTagIds(
  projectId: string,
  tagNames: string[],
  authenticatedClient?: SupabaseClient<Database>
): Promise<string[]> {
  const client = resolveClient(authenticatedClient);
  const { data: existing, error } = await client
    .from('tags')
    .select('id, name')
    .eq('project_id', projectId)
    .in('name', tagNames);

  if (error) {
    console.error('Error resolving tag names to IDs:', error);
    throw error;
  }

  const tagMap = new Map(existing.map((tag) => [tag.name, tag.id]));
  const missingNames = tagNames.filter((name) => !tagMap.has(name));

  if (missingNames.length > 0) {
    log.debug('🏷️ Creating missing tags before attach:', missingNames);
    const { data: created, error: insertError } = await client
      .from('tags')
      // created_by is nullable in the DB and defaulted by RLS context; the
      // generated Insert type marks it required, so cast the minimal payload.
      .insert(
        missingNames.map(
          (name) =>
            ({ project_id: projectId, name }) as Database['public']['Tables']['tags']['Insert']
        )
      )
      .select('id, name');

    if (insertError) {
      console.error('Error creating missing tags:', insertError);
      throw insertError;
    }

    created?.forEach((tag) => tagMap.set(tag.name, tag.id));
  }

  return tagNames
    .map((name) => tagMap.get(name))
    .filter((id): id is string => Boolean(id));
}
