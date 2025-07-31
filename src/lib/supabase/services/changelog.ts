import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

export type ChangelogEntry = Tables<'changelog'> & {
  users: {
    id: string;
    name: string | null;
    email: string;
  };
};

// Get changelog for a project
export async function getProjectChangelog(projectId: string): Promise<ChangelogEntry[]> {
  const { data, error } = await supabase
    .from('changelog')
    .select(`
      *,
      users(id, name, email)
    `)
    .eq('project_id', projectId)
    .order('timestamp', { ascending: false })
    .limit(50); // Limit to recent 50 entries

  if (error) {
    console.error('Error fetching changelog:', error);
    throw error;
  }

  return data || [];
}

// Create a changelog entry
export async function createChangelogEntry(
  projectId: string,
  userId: string,
  action: string,
  target: string,
  targetName: string,
  description: string,
  metadata?: any
) {
  const { data, error } = await supabase
    .from('changelog')
    .insert({
      project_id: projectId,
      user_id: userId,
      action,
      target,
      target_name: targetName,
      description,
      metadata,
      timestamp: new Date().toISOString(),
    })
    .select(`
      *,
      users(id, name, email)
    `)
    .single();

  if (error) {
    console.error('Error creating changelog entry:', error);
    throw error;
  }

  return data;
}

// Helper function to log common actions
export const logAction = {
  projectUpdated: (projectId: string, userId: string, changes: string[]) =>
    createChangelogEntry(
      projectId,
      userId,
      'updated',
      'project',
      'Project Settings',
      `Updated: ${changes.join(', ')}`,
      { changes }
    ),
  
  collaboratorAdded: (projectId: string, userId: string, collaboratorEmail: string, role: string) =>
    createChangelogEntry(
      projectId,
      userId,
      'added',
      'collaborator',
      collaboratorEmail,
      `Added ${collaboratorEmail} as ${role}`,
      { role, email: collaboratorEmail }
    ),
    
  collaboratorRemoved: (projectId: string, userId: string, collaboratorEmail: string) =>
    createChangelogEntry(
      projectId,
      userId,
      'removed',
      'collaborator',
      collaboratorEmail,
      `Removed ${collaboratorEmail} from project`,
      { email: collaboratorEmail }
    ),
    
  nodeCreated: (projectId: string, userId: string, nodeName: string, nodeType: string) =>
    createChangelogEntry(
      projectId,
      userId,
      'created',
      'node',
      nodeName,
      `Created ${nodeType}: ${nodeName}`,
      { nodeType }
    ),
    
  nodeDeleted: (projectId: string, userId: string, nodeName: string, nodeType: string) =>
    createChangelogEntry(
      projectId,
      userId,
      'deleted',
      'node',
      nodeName,
      `Deleted ${nodeType}: ${nodeName}`,
      { nodeType }
    ),
    
  relationshipCreated: (projectId: string, userId: string, source: string, target: string, type: string) =>
    createChangelogEntry(
      projectId,
      userId,
      'created',
      'relationship',
      `${source} → ${target}`,
      `Created ${type} relationship from ${source} to ${target}`,
      { source, target, relationshipType: type }
    ),
};