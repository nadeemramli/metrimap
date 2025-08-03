import { supabase } from '../client';
import type { Tables, TablesInsert, TablesUpdate } from '../types';

export type TagRow = Tables<'tags'>;
export type TagInsert = TablesInsert<'tags'>;
export type TagUpdate = TablesUpdate<'tags'>;

// Get all tags for a project (from database)
export async function getProjectTags(projectId: string) {
  console.log("🔍 Fetching project tags for projectId:", projectId);
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  console.log("🔍 Supabase query result:", { data, error });

  if (error) {
    console.error('Error fetching project tags:', error);
    throw error;
  }

  console.log("✅ Project tags fetched successfully:", data?.length || 0, "tags");
  return data || [];
}

// Create a new tag for a project
export async function createTag(tag: Omit<TagInsert, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
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
export async function updateTag(tagId: string, updates: TagUpdate) {
  const { data, error } = await supabase
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
export async function deleteTag(tagId: string) {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId);

  if (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
}

// Search tags by name (for autocomplete)
export async function searchProjectTags(projectId: string, query: string) {
  const { data, error } = await supabase
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
export async function getTagUsageStats(projectId: string) {
  // Get tags with their usage counts
  const { data, error } = await supabase
    .from('tags')
    .select(`
      *,
      metric_cards!inner(project_id),
      relationships!inner(project_id)
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching tag usage stats:', error);
    throw error;
  }

  return data || [];
}

// Get tags for a metric card (database system)
export async function getMetricCardTags(metricCardId: string) {
  console.log("🔍 Getting database tags for metric card:", metricCardId);
  
  try {
    const { data, error } = await supabase
      .from('metric_card_tags')
      .select(`
        tag_id,
        tags!inner(id, name, color, description)
      `)
      .eq('metric_card_id', metricCardId);

    if (error) {
      console.error('Error fetching metric card tags:', error);
      return [];
    }

    const tagNames = data?.map(item => item.tags.name) || [];
    console.log("✅ Database tags found:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error in getMetricCardTags:', error);
    return [];
  }
}

// Add tags to metric card (database system)
export async function addTagsToMetricCard(metricCardId: string, tagNames: string[]) {
  console.log("🏷️ Adding database tags to metric card:", metricCardId, tagNames);
  
  try {
    // Get project ID for the metric card
    const { data: metricCard, error: fetchError } = await supabase
      .from('metric_cards')
      .select('project_id')
      .eq('id', metricCardId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Get tag IDs for the tag names
    const tagIds = await getTagIdsByNames(metricCard.project_id, tagNames);
    
    if (tagIds.length === 0) {
      console.log("⚠️ No database tags found for names:", tagNames);
      return [];
    }

    // Create metric_card_tags relationships
    const relationships = tagIds
      .filter(tagId => tagId !== undefined)
      .map(tagId => ({
        metric_card_id: metricCardId,
        tag_id: tagId!
      }));

    const { error: insertError } = await supabase
      .from('metric_card_tags')
      .insert(relationships);

    if (insertError) {
      console.error('Error creating metric card tag relationships:', insertError);
      throw insertError;
    }

    console.log("✅ Database tags added to metric card:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error adding tags to metric card:', error);
    throw error;
  }
}

// Remove tags from metric card (database system)
export async function removeTagsFromMetricCard(metricCardId: string, tagNames: string[]) {
  console.log("🗑️ Removing database tags from metric card:", metricCardId, tagNames);
  
  try {
    // Get project ID for the metric card
    const { data: metricCard, error: fetchError } = await supabase
      .from('metric_cards')
      .select('project_id')
      .eq('id', metricCardId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Get tag IDs for the tag names
    const tagIds = await getTagIdsByNames(metricCard.project_id, tagNames);
    
    if (tagIds.length === 0) {
      console.log("⚠️ No database tags found for names:", tagNames);
      return [];
    }

    // Remove metric_card_tags relationships
    const filteredTagIds = tagIds.filter(tagId => tagId !== undefined) as string[];
    const { error: deleteError } = await supabase
      .from('metric_card_tags')
      .delete()
      .eq('metric_card_id', metricCardId)
      .in('tag_id', filteredTagIds);

    if (deleteError) {
      console.error('Error removing metric card tag relationships:', deleteError);
      throw deleteError;
    }

    console.log("✅ Database tags removed from metric card:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error removing tags from metric card:', error);
    throw error;
  }
}

// Get tags for a relationship (database system)
export async function getRelationshipTags(relationshipId: string) {
  console.log("🔍 Getting database tags for relationship:", relationshipId);
  
  try {
    const { data, error } = await supabase
      .from('relationship_tags')
      .select(`
        tag_id,
        tags!inner(id, name, color, description)
      `)
      .eq('relationship_id', relationshipId);

    if (error) {
      console.error('Error fetching relationship tags:', error);
      return [];
    }

    const tagNames = data?.map(item => item.tags.name) || [];
    console.log("✅ Database tags found for relationship:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error in getRelationshipTags:', error);
    return [];
  }
}

// Add tags to relationship (database system)
export async function addTagsToRelationship(relationshipId: string, tagNames: string[]) {
  console.log("🏷️ Adding database tags to relationship:", relationshipId, tagNames);
  
  try {
    // Get project ID for the relationship
    const { data: relationship, error: fetchError } = await supabase
      .from('relationships')
      .select('project_id')
      .eq('id', relationshipId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Get tag IDs for the tag names
    const tagIds = await getTagIdsByNames(relationship.project_id, tagNames);
    
    if (tagIds.length === 0) {
      console.log("⚠️ No database tags found for names:", tagNames);
      return [];
    }

    // Create relationship_tags relationships
    const relationships = tagIds
      .filter(tagId => tagId !== undefined)
      .map(tagId => ({
        relationship_id: relationshipId,
        tag_id: tagId!
      }));

    const { error: insertError } = await supabase
      .from('relationship_tags')
      .insert(relationships);

    if (insertError) {
      console.error('Error creating relationship tag relationships:', insertError);
      throw insertError;
    }

    console.log("✅ Database tags added to relationship:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error adding tags to relationship:', error);
    throw error;
  }
}

// Remove tags from relationship (database system)
export async function removeTagsFromRelationship(relationshipId: string, tagNames: string[]) {
  console.log("🗑️ Removing database tags from relationship:", relationshipId, tagNames);
  
  try {
    // Get project ID for the relationship
    const { data: relationship, error: fetchError } = await supabase
      .from('relationships')
      .select('project_id')
      .eq('id', relationshipId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Get tag IDs for the tag names
    const tagIds = await getTagIdsByNames(relationship.project_id, tagNames);
    
    if (tagIds.length === 0) {
      console.log("⚠️ No database tags found for names:", tagNames);
      return [];
    }

    // Remove relationship_tags relationships
    const filteredTagIds = tagIds.filter(tagId => tagId !== undefined) as string[];
    const { error: deleteError } = await supabase
      .from('relationship_tags')
      .delete()
      .eq('relationship_id', relationshipId)
      .in('tag_id', filteredTagIds);

    if (deleteError) {
      console.error('Error removing relationship tag relationships:', deleteError);
      throw deleteError;
    }

    console.log("✅ Database tags removed from relationship:", tagNames);
    return tagNames;
  } catch (error) {
    console.error('Error removing tags from relationship:', error);
    throw error;
  }
}

// Convert legacy tag names to database tag IDs
export async function getTagIdsByNames(projectId: string, tagNames: string[]) {
  console.log("🔄 Converting tag names to IDs:", tagNames);
  
  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('id, name')
      .eq('project_id', projectId)
      .in('name', tagNames);

    if (error) {
      throw error;
    }

    const tagMap = new Map(tags.map(tag => [tag.name, tag.id]));
    const tagIds = tagNames.map(name => tagMap.get(name)).filter(Boolean);
    
    console.log("✅ Tag IDs found:", tagIds);
    return tagIds;
  } catch (error) {
    console.error('Error converting tag names to IDs:', error);
    return [];
  }
}
