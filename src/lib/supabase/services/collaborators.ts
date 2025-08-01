import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

export type Collaborator = Tables<'project_collaborators'> & {
  users: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

// Get all collaborators for a project
export async function getProjectCollaborators(projectId: string): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from('project_collaborators')
    .select(`
      *,
      users(id, name, email, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching collaborators:', error);
    throw error;
  }

  return (data?.filter(item => item.users !== null) || []) as Collaborator[];
}

// Add a collaborator to a project
export async function addCollaborator(
  projectId: string, 
  userEmail: string, 
  role: 'owner' | 'admin' | 'editor' | 'viewer' = 'viewer',
  permissions: string[] = ['read']
) {
  // First, find the user by email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (userError) {
    console.error('Error finding user:', userError);
    throw new Error(`User with email ${userEmail} not found`);
  }

  // Then add the collaboration
  const { data, error } = await supabase
    .from('project_collaborators')
    .insert({
      project_id: projectId,
      user_id: userData.id,
      role,
      permissions,
      invited_at: new Date().toISOString(),
    })
    .select(`
      *,
      users(id, name, email, avatar_url)
    `)
    .single();

  if (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }

  return data;
}

// Update a collaborator's role/permissions
export async function updateCollaborator(
  collaboratorId: string,
  updates: {
    role?: string;
    permissions?: string[];
  }
) {
  const { data, error } = await supabase
    .from('project_collaborators')
    .update(updates)
    .eq('id', collaboratorId)
    .select(`
      *,
      users(id, name, email, avatar_url)
    `)
    .single();

  if (error) {
    console.error('Error updating collaborator:', error);
    throw error;
  }

  return data;
}

// Remove a collaborator from a project
export async function removeCollaborator(collaboratorId: string) {
  const { error } = await supabase
    .from('project_collaborators')
    .delete()
    .eq('id', collaboratorId);

  if (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }

  return true;
}