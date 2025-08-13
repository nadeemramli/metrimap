import { CreateTagSchema, UpdateTagSchema } from '@/shared/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';

export type TagRow = Tables<'tags'>;
export type TagInsert = TablesInsert<'tags'>;
export type TagUpdate = TablesUpdate<'tags'>;

// Get all tags for a project (from database)
export async function getProjectTags(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  // console.log("🔍 Fetching project tags for projectId:", projectId);

  const client = authenticatedClient || supabase();
  const { data, error } = await client
    .from('tags')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  console.log('🔍 Supabase query result:', { data, error });

  if (error) {
    console.error('Error fetching project tags:', error);
    throw error;
  }

  console.log(
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  const client = authenticatedClient || supabase();
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
  // console.log("🔍 Getting database tags for metric card:", metricCardId);

  try {
    const client = authenticatedClient || supabase();
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
    // console.log("✅ Database tags found:", tagNames);
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
  // console.log("🏷️ Adding database tags to metric card:", metricCardId, tagNames);

  try {
    const client = authenticatedClient || supabase();
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
      console.log('⚠️ No database tags found for names:', tagNames);
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

    // console.log("✅ Database tags added to metric card:", tagNames);
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
  // console.log("🗑️ Removing database tags from metric card:", metricCardId, tagNames);

  try {
    const client = authenticatedClient || supabase();
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
      console.log('⚠️ No database tags found for names:', tagNames);
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

    // console.log("✅ Database tags removed from metric card:", tagNames);
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
  // console.log("🔍 Getting database tags for relationship:", relationshipId);

  try {
    const client = authenticatedClient || supabase();
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
    // console.log("✅ Database tags found for relationship:", tagNames);
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
  // console.log("🏷️ Adding database tags to relationship:", relationshipId, tagNames);

  try {
    const client = authenticatedClient || supabase();
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
      console.log('⚠️ No database tags found for names:', tagNames);
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

    // console.log("✅ Database tags added to relationship:", tagNames);
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
  // console.log("🗑️ Removing database tags from relationship:", relationshipId, tagNames);

  try {
    const client = authenticatedClient || supabase();
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
      console.log('⚠️ No database tags found for names:', tagNames);
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

    // console.log("✅ Database tags removed from relationship:", tagNames);
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
  // console.log("🔄 Converting tag names to IDs:", tagNames);

  try {
    const client = authenticatedClient || supabase();
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

    console.log('✅ Tag IDs found:', tagIds);
    return tagIds;
  } catch (error) {
    console.error('Error converting tag names to IDs:', error);
    return [];
  }
}
