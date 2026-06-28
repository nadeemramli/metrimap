import { useAppStore } from '@/lib/stores';
import {
  getProjectCollaborators,
  type Collaborator,
} from '@/shared/lib/supabase/services/collaborators';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import * as React from 'react';

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role?: string;
  /** project_collaborators row id; absent for the self-merged fallback row. */
  collaboratorId?: string;
  isSelf?: boolean;
}

export interface UseProjectMembers {
  members: ProjectMember[];
  byId: Record<string, ProjectMember>;
  isLoading: boolean;
  reload: () => void;
}

/**
 * Resolves who can be mentioned / shown as a comment author on a project.
 *
 * NOTE: an owner `project_collaborators` row is not seeded yet (backlog P1-12),
 * so `getProjectCollaborators` is frequently empty. We always merge the current
 * signed-in user so the mention picker and author resolution are never blank.
 */
export function useProjectMembers(
  projectId?: string,
  enabled: boolean = true
): UseProjectMembers {
  const user = useAppStore((s) => s.user);
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    if (!enabled || !projectId) return;
    setIsLoading(true);
    getProjectCollaborators(projectId, getClientForEnvironment())
      .then((rows) => {
        if (mounted) setCollaborators(rows || []);
      })
      .catch((e) => {
        console.error('useProjectMembers: failed to load collaborators', e);
        if (mounted) setCollaborators([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [projectId, enabled, reloadKey]);

  const { members, byId } = React.useMemo(() => {
    const map: Record<string, ProjectMember> = {};

    for (const c of collaborators) {
      if (!c.users) continue;
      map[c.users.id] = {
        id: c.users.id,
        name: c.users.name || c.users.email,
        email: c.users.email,
        avatarUrl: c.users.avatar_url,
        role: c.role,
        collaboratorId: c.id,
        isSelf: c.users.id === user?.id,
      };
    }

    // Always include the signed-in user so the picker is never empty.
    if (user?.id && !map[user.id]) {
      map[user.id] = {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        isSelf: true,
      };
    }

    const list = Object.values(map).sort((a, b) => {
      if (a.isSelf) return -1;
      if (b.isSelf) return 1;
      return a.name.localeCompare(b.name);
    });

    return { members: list, byId: map };
  }, [collaborators, user?.id, user?.name, user?.email]);

  const reload = React.useCallback(() => setReloadKey((k) => k + 1), []);

  return { members, byId, isLoading, reload };
}
