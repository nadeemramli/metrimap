import {
  CreateGroupSchema,
  CreateProjectSchema,
  UpdateGroupSchema,
  UpdateProjectSchema,
} from '@/shared/lib/validation/zod';
import type { CanvasProject } from '@/shared/types';
import { transformCanvasProject } from '@/shared/utils/dataTransformers';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types';

export type Project = Tables<'projects'>;
export type ProjectInsert = TablesInsert<'projects'>;
export type ProjectUpdate = TablesUpdate<'projects'>;

export type MetricCard = Tables<'metric_cards'>;
export type Relationship = Tables<'relationships'>;
export type Group = Tables<'groups'>;

async function fetchOwnedProjects(
  userId: string,
  client: SupabaseClient<Database>
) {
  const { data, error } = await client
    .from('projects')
    .select(
      `
      *,
      project_collaborators(
        role,
        permissions,
        users(id, name, email, avatar_url)
      )
    `
    )
    .eq('created_by', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchCollaboratedProjectIds(
  userId: string,
  client: SupabaseClient<Database>
) {
  const { data, error } = await client
    .from('project_collaborators')
    .select('project_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((c) => c.project_id).filter((id) => id !== null);
}

async function fetchCollaboratedProjects(
  projectIds: string[],
  userId: string,
  client: SupabaseClient<Database>
) {
  if (projectIds.length === 0) return [] as any[];
  const { data, error } = await client
    .from('projects')
    .select(
      `
      *,
      project_collaborators(
        role,
        permissions,
        users(id, name, email, avatar_url)
      )
    `
    )
    .in('id', projectIds)
    .neq('created_by', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

function combineAndSortProjects(owned: any[], collaborated: any[]) {
  return [...owned, ...collaborated].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

// Fetch all projects for a user (fixed to eliminate RLS circular dependencies)
export async function getUserProjects(
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const owned = await fetchOwnedProjects(userId, client);
  const collabIds = await fetchCollaboratedProjectIds(userId, client);
  const collaborated = await fetchCollaboratedProjects(
    collabIds,
    userId,
    client
  );
  return combineAndSortProjects(owned, collaborated);
}

// Fetch a single project with all its data
export async function getProjectById(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasProject | null> {
  console.log('🔍 getProjectById called with projectId:', projectId);
  console.log('🔍 authenticatedClient provided:', !!authenticatedClient);

  const client = authenticatedClient || supabase();
  const { data: project, error: projectError } = await client
    .from('projects')
    .select(
      `
      *,
      project_collaborators(
        role,
        permissions,
        users(id, name, email, avatar_url)
      )
    `
    )
    .eq('id', projectId)
    .maybeSingle();

  if (projectError) {
    console.error('Error fetching project:', projectError);
    throw projectError;
  }

  if (!project) {
    console.log('❌ No project found for ID:', projectId);
    return null;
  }

  console.log('✅ Project found:', project.name);

  // Fetch metric cards
  const { data: metricCards, error: cardsError } = await client
    .from('metric_cards')
    .select('*')
    .eq('project_id', projectId);

  console.log('🔍 Metric cards query result:', {
    data: metricCards?.length || 0,
    error: cardsError,
  });

  if (cardsError) {
    console.error('Error fetching metric cards:', cardsError);
    throw cardsError;
  }

  console.log('✅ Metric cards fetched:', metricCards?.length || 0);

  // Fetch relationships with evidence
  let relationships: any[] = [];

  // First try with evidence_items
  const { data: relationshipsWithEvidence, error: relationshipsError } =
    await client
      .from('relationships')
      .select(
        `
      *,
      evidence_items(*)
    `
      )
      .eq('project_id', projectId);

  if (relationshipsError) {
    console.error(
      'Error fetching relationships with evidence:',
      relationshipsError
    );
    // Try fetching relationships without evidence_items
    const { data: relationshipsWithoutEvidence, error: relationshipsError2 } =
      await client
        .from('relationships')
        .select('*')
        .eq('project_id', projectId);

    if (relationshipsError2) {
      console.error(
        'Error fetching relationships (second attempt):',
        relationshipsError2
      );
      throw relationshipsError2;
    }

    console.log(
      '⚠️ Relationships fetched without evidence_items:',
      relationshipsWithoutEvidence?.length || 0
    );
    relationships = relationshipsWithoutEvidence || [];
  } else {
    console.log(
      '✅ Relationships fetched with evidence:',
      relationshipsWithEvidence?.length || 0
    );
    relationships = relationshipsWithEvidence || [];
  }

  // If we still have no relationships, try a simpler query
  if (relationships.length === 0) {
    console.log('🔍 No relationships found, trying simple query...');
    const { data: simpleRelationships, error: simpleError } = await client
      .from('relationships')
      .select('id, source_id, target_id, type, confidence, weight, project_id')
      .eq('project_id', projectId);

    if (simpleError) {
      console.error('Error with simple relationships query:', simpleError);
    } else {
      console.log(
        '✅ Simple relationships query successful:',
        simpleRelationships?.length || 0
      );
      relationships = simpleRelationships || [];
    }
  }

  console.log('✅ Final relationships count:', relationships.length);
  console.log('🔍 Sample relationship:', relationships?.[0]);

  // Fetch groups
  const { data: groups, error: groupsError } = await client
    .from('groups')
    .select('*')
    .eq('project_id', projectId);

  console.log('🔍 Groups query result:', {
    data: groups?.length || 0,
    error: groupsError,
  });

  if (groupsError) {
    console.error('Error fetching groups:', groupsError);
    throw groupsError;
  }

  console.log('✅ Groups fetched:', groups?.length || 0);

  // Transform database data to CanvasProject format using extracted transformer
  const canvasProject = transformCanvasProject(
    project,
    metricCards || [],
    relationships || [],
    groups || []
  );

  console.log('✅ CanvasProject created with:', {
    nodes: canvasProject.nodes.length,
    edges: canvasProject.edges.length,
    groups: canvasProject.groups.length,
  });
  console.log('🔍 Sample transformed relationship:', canvasProject.edges?.[0]);

  return canvasProject;
}

// Create a new project
export async function createProject(
  project: Omit<ProjectInsert, 'id'>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  // Validate payload using Prisma-generated Zod schema
  try {
    CreateProjectSchema.parse(project as unknown);
  } catch (error) {
    console.error('Validation error creating project:', error);
    throw error;
  }
  const { data, error } = await client
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
}

// Update a project
export async function updateProject(
  id: string,
  updates: ProjectUpdate,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  // Validate update payload
  try {
    UpdateProjectSchema.parse(updates as unknown);
  } catch (error) {
    console.error('Validation error updating project:', error);
    throw error;
  }
  const { data, error } = await client
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
}

// Toggle project public visibility
export async function setProjectPublic(
  id: string,
  isPublic: boolean,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const updateData = { is_public: isPublic } as any;
  try {
    UpdateProjectSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating project visibility:', error);
    throw error;
  }
  const { data, error } = await client
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project visibility:', error);
    throw error;
  }

  return data;
}

// Convenience helpers for settings JSON merges
export async function mergeProjectSettings(
  projectId: string,
  partialSettings: Record<string, any>,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { data: proj, error: fetchErr } = await client
    .from('projects')
    .select('settings')
    .eq('id', projectId)
    .single();
  if (fetchErr) throw fetchErr;
  const base: Record<string, any> =
    proj && proj.settings && typeof proj.settings === 'object'
      ? (proj.settings as Record<string, any>)
      : {};
  const next = { ...base, ...partialSettings } as any;
  return updateProject(projectId, { settings: next } as any, client);
}

// Delete a project
export async function deleteProject(
  id: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { error } = await client.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Duplicate a project
export async function duplicateProject(
  projectId: string,
  newName: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const originalProject = await getProjectById(projectId, authenticatedClient);

  if (!originalProject) {
    throw new Error('Project not found');
  }

  // Create new project
  const newProject = await createProject(
    {
      name: newName,
      description: originalProject.description,
      tags: originalProject.tags,
      settings: originalProject.settings as any,
      created_by: userId,
      last_modified_by: userId,
    },
    authenticatedClient
  );

  // TODO: Copy metric cards, relationships, and groups
  // This would involve creating new records with new IDs

  return newProject;
}

// Group database operations
export async function createGroup(
  group: {
    id: string;
    name: string;
    nodeIds: string[];
    position: { x: number; y: number };
    size: { width: number; height: number };
    projectId: string;
    createdBy: string;
  },
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const insertData = {
    id: group.id,
    name: group.name,
    node_ids: group.nodeIds,
    position_x: group.position.x,
    position_y: group.position.y,
    width: group.size.width,
    height: group.size.height,
    project_id: group.projectId,
    created_by: group.createdBy,
  } as const;
  // Validate against Prisma create input (which excludes id)
  const prismaCreatePayload = {
    name: insertData.name,
    node_ids: insertData.node_ids,
    position_x: insertData.position_x,
    position_y: insertData.position_y,
    width: insertData.width,
    height: insertData.height,
    project_id: insertData.project_id,
    created_by: insertData.created_by,
  } as const;
  try {
    CreateGroupSchema.parse(prismaCreatePayload as unknown);
  } catch (error) {
    console.error('Validation error creating group:', error);
    throw error;
  }
  const { data, error } = await client
    .from('groups')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating group:', error);
    throw error;
  }

  return data;
}

export async function updateGroup(
  groupId: string,
  updates: {
    name?: string;
    nodeIds?: string[];
    position?: { x: number; y: number };
    size?: { width: number; height: number };
  },
  authenticatedClient?: SupabaseClient<Database>
) {
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.nodeIds !== undefined) updateData.node_ids = updates.nodeIds;
  if (updates.position !== undefined) {
    updateData.position_x = updates.position.x;
    updateData.position_y = updates.position.y;
  }
  if (updates.size !== undefined) {
    updateData.width = updates.size.width;
    updateData.height = updates.size.height;
  }

  const client = authenticatedClient || supabase();
  try {
    UpdateGroupSchema.parse(updateData as unknown);
  } catch (error) {
    console.error('Validation error updating group:', error);
    throw error;
  }
  const { data, error } = await client
    .from('groups')
    .update(updateData)
    .eq('id', groupId)
    .select()
    .single();

  if (error) {
    console.error('Error updating group:', error);
    throw error;
  }

  return data;
}

export async function deleteGroup(
  groupId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { error } = await client.from('groups').delete().eq('id', groupId);

  if (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}
