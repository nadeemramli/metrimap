import type { Tables } from '@/shared/lib/supabase/types';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import {
  CreateProjectCollaboratorSchema,
  UpdateProjectCollaboratorSchema,
} from '@/shared/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

export type Collaborator = Tables<'project_collaborators'> & {
  users: {
    id: string;
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

// Get all collaborators for a project
export async function getProjectCollaborators(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<Collaborator[]> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('project_collaborators')
    .select(
      `
      *,
      users(id, name, email, avatar_url)
    `
    )
    .eq('project_id', projectId)
    .order('invited_at', { ascending: true });

  if (error) {
    console.error('Error fetching collaborators:', error);
    throw error;
  }

  return (data?.filter((item) => item.users !== null) || []) as Collaborator[];
}

// The guest collaborator tiers (org members are handled by workspace RLS, not
// these rows). Each maps to a coherent permissions[] token set the RLS helpers
// key off, so role and permissions never disagree.
export type ProjectRole =
  | 'viewer'
  | 'commenter'
  | 'editor'
  | 'admin'
  | 'owner'
  | 'member';

export function permissionsForRole(role: string): string[] {
  switch (role) {
    case 'owner':
    case 'admin':
      return ['read', 'comment', 'edit', 'admin'];
    case 'editor':
      return ['read', 'comment', 'edit'];
    case 'commenter':
      return ['read', 'comment'];
    default: // viewer / member / unknown => read-only
      return ['read'];
  }
}

/** Current user's effective permission on a project: none | view | comment | edit. */
export async function getMyProjectPermission(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<'none' | 'view' | 'comment' | 'edit'> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client.rpc('my_project_permission' as never, {
    pid: projectId,
  } as never);
  if (error) throw new Error(error.message);
  return (data as 'none' | 'view' | 'comment' | 'edit') ?? 'none';
}

// Add a collaborator to a project
export async function addCollaborator(
  projectId: string,
  userEmail: string,
  role: ProjectRole = 'viewer',
  permissions?: string[],
  authenticatedClient?: SupabaseClient<Database>
) {
  const perms = permissions ?? permissionsForRole(role);
  const client = resolveClient(authenticatedClient);

  // First, find the user by email
  const { data: userData, error: userError } = await client
    .from('users')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (userError) {
    console.error('Error finding user:', userError);
    throw new Error(`User with email ${userEmail} not found`);
  }

  // Then add the collaboration
  const { data, error } = await client
    .from('project_collaborators')
    .insert(
      (() => {
        const payload = {
          project_id: projectId,
          user_id: userData.id,
          role,
          permissions: perms,
          invited_at: new Date().toISOString(),
        } as const;
        try {
          CreateProjectCollaboratorSchema.parse(payload as unknown);
        } catch (e) {
          console.error('Validation error adding collaborator:', e);
          throw e;
        }
        return payload;
      })()
    )
    .select(
      `
      *,
      users(id, name, email, avatar_url)
    `
    )
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
  },
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('project_collaborators')
    .update(
      (() => {
        try {
          UpdateProjectCollaboratorSchema.parse(updates as unknown);
        } catch (e) {
          console.error('Validation error updating collaborator:', e);
          throw e;
        }
        return updates;
      })()
    )
    .eq('id', collaboratorId)
    .select(
      `
      *,
      users(id, name, email, avatar_url)
    `
    )
    .single();

  if (error) {
    console.error('Error updating collaborator:', error);
    throw error;
  }

  return data;
}

// Remove a collaborator from a project
export async function removeCollaborator(
  collaboratorId: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('project_collaborators')
    .delete()
    .eq('id', collaboratorId);

  if (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }

  return true;
}
