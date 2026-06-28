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
      ),
      metric_cards(count),
      relationships(count),
      groups(count),
      preview_cards:metric_cards(id, title, category),
      preview_rels:relationships(id, source_id, target_id)
    `
    )
    .eq('created_by', userId)
    // Example/template projects live only in the homepage Showcase (read-only),
    // never in the user's own (deletable) list.
    .not('tags', 'cs', '{example}')
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
      ),
      metric_cards(count),
      relationships(count),
      groups(count),
      preview_cards:metric_cards(id, title, category),
      preview_rels:relationships(id, source_id, target_id)
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
  if (!authenticatedClient) {
    console.warn(
      '⚠️ getUserProjects called without an authenticated client; falling back to anon (RLS will hide non-public rows). This usually means the Clerk client was not threaded through.'
    );
  }
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

// Public example/template projects for the homepage Showcase (read-only).
// Public RLS lets anyone (even signed-out) read these, so no auth needed.
export async function getShowcaseProjects(
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();
  const { data, error } = await client
    .from('projects')
    .select(`*, metric_cards(count), relationships(count), groups(count)`)
    .contains('tags', ['example'])
    .eq('is_public', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Deep-copy a project (the real "Duplicate"): clones the project row PLUS all of
// its metric_cards, canvas_nodes, relationships, groups, and the data-flow edges
// in settings — remapping every id so the copy is fully independent. Selects `*`
// and strips identity/timestamp columns, so it survives schema additions.
// Known omission: tag junction rows (metric_card_tags / relationship_tags) are
// not copied yet (project-level `tags[]` array is). Returns the new project id.
export async function duplicateProjectDeep(
  projectId: string,
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<string> {
  const client = authenticatedClient || supabase();

  const { data: orig, error: origErr } = await client
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  if (origErr || !orig) throw origErr ?? new Error('Project not found');

  const [cardsRes, nodesRes, relsRes, groupsRes] = await Promise.all([
    client.from('metric_cards').select('*').eq('project_id', projectId),
    client.from('canvas_nodes').select('*').eq('project_id', projectId),
    client.from('relationships').select('*').eq('project_id', projectId),
    client.from('groups').select('*').eq('project_id', projectId),
  ]);
  for (const r of [cardsRes, nodesRes, relsRes, groupsRes]) {
    if (r.error) throw r.error;
  }
  const cards = cardsRes.data ?? [];
  const nodes = nodesRes.data ?? [];
  const rels = relsRes.data ?? [];
  const groups = groupsRes.data ?? [];

  // One old→new id map covering everything an edge / group / data-flow can point at.
  const idMap = new Map<string, string>();
  for (const c of cards) idMap.set(c.id, crypto.randomUUID());
  for (const n of nodes) idMap.set(n.id, crypto.randomUUID());
  const remap = (id: string) => idMap.get(id) ?? id;

  const newProjectId = crypto.randomUUID();
  const strip = (row: any) => {
    const {
      id: _id,
      project_id: _pid,
      created_at: _ca,
      updated_at: _ua,
      created_by: _cb,
      last_modified_by: _lmb,
      ...rest
    } = row;
    return rest;
  };

  // Remap the data-flow edges stored in settings (source/target = node/card ids).
  const settings: any = orig.settings ? { ...(orig.settings as any) } : {};
  if (Array.isArray(settings.dataFlowEdges)) {
    settings.dataFlowEdges = settings.dataFlowEdges.map((e: any) => ({
      ...e,
      id: crypto.randomUUID(),
      source: remap(e.source),
      target: remap(e.target),
    }));
  }

  // 1. The project row (copy not public; drop the showcase 'example' tag).
  const { error: projErr } = await client.from('projects').insert({
    ...strip(orig),
    id: newProjectId,
    name: `${orig.name} (Copy)`,
    is_public: false,
    tags: (orig.tags ?? []).filter((t: string) => t !== 'example'),
    settings,
    created_by: userId,
  } as any);
  if (projErr) throw projErr;

  // 2. Cards + canvas nodes (only depend on the project).
  if (cards.length) {
    const { error } = await client.from('metric_cards').insert(
      cards.map((c) => ({
        ...strip(c),
        id: remap(c.id),
        project_id: newProjectId,
        created_by: userId,
      })) as any
    );
    if (error) throw error;
  }
  if (nodes.length) {
    const { error } = await client.from('canvas_nodes').insert(
      nodes.map((n) => ({
        ...strip(n),
        id: remap(n.id),
        project_id: newProjectId,
        created_by: userId,
      })) as any
    );
    if (error) throw error;
  }

  // 3. Relationships + groups (reference card/node ids → remap).
  if (rels.length) {
    const { error } = await client.from('relationships').insert(
      rels.map((r) => ({
        ...strip(r),
        id: crypto.randomUUID(),
        project_id: newProjectId,
        source_id: remap(r.source_id),
        target_id: remap(r.target_id),
        created_by: userId,
      })) as any
    );
    if (error) throw error;
  }
  if (groups.length) {
    const { error } = await client.from('groups').insert(
      groups.map((g) => ({
        ...strip(g),
        id: crypto.randomUUID(),
        project_id: newProjectId,
        node_ids: (g.node_ids ?? []).map(remap),
        created_by: userId,
      })) as any
    );
    if (error) throw error;
  }

  return newProjectId;
}

// Star / archive use direct, single-column updates. (The generic updateProject
// store path maps only a fixed camelCase field set, so it can't carry these
// flags.) The columns are in the live DB, the Supabase Database type, and the
// regenerated prisma-zod schema.
export async function setProjectStarred(
  id: string,
  starred: boolean,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = authenticatedClient || supabase();
  const { error } = await client
    .from('projects')
    .update({ is_starred: starred })
    .eq('id', id);
  if (error) throw error;
}

export async function setProjectArchived(
  id: string,
  archived: boolean,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = authenticatedClient || supabase();
  const { error } = await client
    .from('projects')
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw error;
}

// Fetch a single project with all its data
export async function getProjectById(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasProject | null> {
  console.log('🔍 getProjectById called with projectId:', projectId);
  console.log('🔍 authenticatedClient provided:', !!authenticatedClient);

  const client = authenticatedClient || supabase();

  // First, fetch the project
  const { data: project, error: projectError } = await client
    .from('projects')
    .select('*')
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

  // Separately fetch project collaborators with user details
  const { data: collaborators, error: collaboratorsError } = await client
    .from('project_collaborators')
    .select(
      `
      role,
      permissions,
      users(id, name, email, avatar_url)
    `
    )
    .eq('project_id', projectId);

  if (collaboratorsError) {
    console.error('Error fetching collaborators:', collaboratorsError);
    // Don't throw here, just log the error and continue without collaborators
  }

  // Attach collaborators to project
  (project as any).project_collaborators = collaborators || [];

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
    color?: string;
  },
  authenticatedClient?: SupabaseClient<Database>
) {
  const updateData: any = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.color !== undefined) updateData.color = updates.color;
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
