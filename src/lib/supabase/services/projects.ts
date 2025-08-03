import { supabase } from '../client';
import type { Tables, TablesInsert, TablesUpdate } from '../types';
import type { CanvasProject } from '../../types';

export type Project = Tables<'projects'>;
export type ProjectInsert = TablesInsert<'projects'>;
export type ProjectUpdate = TablesUpdate<'projects'>;

export type MetricCard = Tables<'metric_cards'>;
export type Relationship = Tables<'relationships'>;
export type Group = Tables<'groups'>;

// Fetch all projects for a user (fixed to eliminate RLS circular dependencies)
export async function getUserProjects(userId: string) {
  // Step 1: Get projects owned by user (RLS handles this)
  const { data: ownedProjects, error: ownedError } = await supabase
    .from('projects')
    .select(`
      *,
      project_collaborators(
        role,
        permissions,
        users(id, name, email, avatar_url)
      )
    `)
    .eq('created_by', userId)
    .order('updated_at', { ascending: false });

  if (ownedError) {
    console.error('Error fetching owned projects:', ownedError);
    throw ownedError;
  }

  // Step 2: Get project IDs where user is a collaborator
  const { data: collaborations, error: collabError } = await supabase
    .from('project_collaborators')
    .select('project_id')
    .eq('user_id', userId);

  if (collabError) {
    console.error('Error fetching collaborations:', collabError);
    throw collabError;
  }

  // Step 3: Get collaborated projects (if any)
  let collaboratedProjects: any[] = [];
  if (collaborations && collaborations.length > 0) {
    const projectIds = collaborations.map(c => c.project_id).filter(id => id !== null);
    
    if (projectIds.length > 0) {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_collaborators(
            role,
            permissions,
            users(id, name, email, avatar_url)
          )
        `)
        .in('id', projectIds)
        .neq('created_by', userId) // Avoid duplicates with owned projects
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching collaborated projects:', error);
        throw error;
      }

      collaboratedProjects = data || [];
    }
  }

  // Step 4: Combine and sort all projects
  const allProjects = [...(ownedProjects || []), ...collaboratedProjects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return allProjects;
}

// Fetch a single project with all its data
export async function getProjectById(projectId: string): Promise<CanvasProject | null> {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      *,
      project_collaborators(
        role,
        permissions,
        users(id, name, email, avatar_url)
      )
    `)
    .eq('id', projectId)
    .single();

  if (projectError) {
    console.error('Error fetching project:', projectError);
    throw projectError;
  }

  if (!project) return null;

  // Fetch metric cards
  const { data: metricCards, error: cardsError } = await supabase
    .from('metric_cards')
    .select('*')
    .eq('project_id', projectId);

  if (cardsError) {
    console.error('Error fetching metric cards:', cardsError);
    throw cardsError;
  }

  // Fetch relationships with evidence
  const { data: relationships, error: relationshipsError } = await supabase
    .from('relationships')
    .select(`
      *,
      evidence_items(*)
    `)
    .eq('project_id', projectId);

  if (relationshipsError) {
    console.error('Error fetching relationships:', relationshipsError);
    throw relationshipsError;
  }

  // Fetch groups
  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('*')
    .eq('project_id', projectId);

  if (groupsError) {
    console.error('Error fetching groups:', groupsError);
    throw groupsError;
  }

  // Transform database data to CanvasProject format
  const canvasProject: CanvasProject = {
    id: project.id,
    name: project.name,
    description: project.description || '',
    tags: project.tags || [],
    collaborators: project.project_collaborators?.map((pc: any) => pc.users.email) || [],
    
    // Transform metric cards to match our MetricCard interface
    nodes: metricCards?.map((card: MetricCard) => ({
      id: card.id,
      title: card.title,
      description: card.description || '',
      category: card.category as any,
      subCategory: card.sub_category as any,
      tags: card.tags || [],
      causalFactors: (card.causal_factors || []) as any,
      dimensions: (card.dimensions || []) as any,
      position: { x: card.position_x, y: card.position_y },
      data: card.data as any,
      sourceType: card.source_type as any,
      formula: card.formula || undefined,
      owner: undefined, // We'll need to resolve this
      assignees: card.assignees || [],
      createdAt: card.created_at || new Date().toISOString(),
      updatedAt: card.updated_at || new Date().toISOString(),
    })) || [],

    // Transform relationships to match our Relationship interface
    edges: relationships?.map((rel: any) => ({
      id: rel.id,
      sourceId: rel.source_id,
      targetId: rel.target_id,
      type: rel.type as any,
      confidence: rel.confidence as any,
      weight: rel.weight || undefined,
      evidence: rel.evidence_items?.map((evidence: any) => ({
        id: evidence.id,
        title: evidence.title,
        type: evidence.type as any,
        date: evidence.date,
        owner: evidence.owner_id || '',
        link: evidence.link || undefined,
        hypothesis: evidence.hypothesis || undefined,
        summary: evidence.summary,
        impactOnConfidence: evidence.impact_on_confidence || undefined,
      })) || [],
      createdAt: rel.created_at || new Date().toISOString(),
      updatedAt: rel.updated_at || new Date().toISOString(),
    })) || [],

    // Transform groups to match our GroupNode interface
    groups: groups?.map((group: Group) => ({
      id: group.id,
      name: group.name,
      nodeIds: group.node_ids || [],
      position: { x: group.position_x, y: group.position_y },
      size: { width: group.width, height: group.height },
    })) || [],

    settings: project.settings as any || {},
    createdAt: project.created_at || new Date().toISOString(),
    updatedAt: project.updated_at || new Date().toISOString(),
    lastModifiedBy: project.last_modified_by || project.created_by,
  };

  return canvasProject;
}

// Create a new project
export async function createProject(project: Omit<ProjectInsert, 'id'>) {
  const { data, error } = await supabase
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
export async function updateProject(id: string, updates: ProjectUpdate) {
  const { data, error } = await supabase
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

// Delete a project
export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Duplicate a project
export async function duplicateProject(projectId: string, newName: string, userId: string) {
  const originalProject = await getProjectById(projectId);
  
  if (!originalProject) {
    throw new Error('Project not found');
  }

  // Create new project
  const newProject = await createProject({
    name: newName,
    description: originalProject.description,
    tags: originalProject.tags,
    settings: originalProject.settings as any,
    created_by: userId,
    last_modified_by: userId,
  });

  // TODO: Copy metric cards, relationships, and groups
  // This would involve creating new records with new IDs
  
  return newProject;
}

// Group database operations
export async function createGroup(group: {
  id: string;
  name: string;
  nodeIds: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  projectId: string;
  createdBy: string;
}) {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      id: group.id,
      name: group.name,
      node_ids: group.nodeIds,
      position_x: group.position.x,
      position_y: group.position.y,
      width: group.size.width,
      height: group.size.height,
      project_id: group.projectId,
      created_by: group.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating group:', error);
    throw error;
  }

  return data;
}

export async function updateGroup(groupId: string, updates: {
  name?: string;
  nodeIds?: string[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}) {
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

  const { data, error } = await supabase
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

export async function deleteGroup(groupId: string) {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId);

  if (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
}