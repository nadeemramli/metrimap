import { useAppStore } from '@/lib/stores';
import {
  getProjectCollaborators,
  type Collaborator,
} from '@/shared/lib/supabase/services/collaborators';
import { whenAuthenticatedClientReady } from '@/shared/utils/authenticatedClient';
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

/** Minimal shape of a live-presence teammate (from usePresence). */
export interface PresenceLike {
  userId: string;
  name: string;
  avatar?: string;
}

/**
 * Resolves who can be mentioned / shown as a comment author on a project.
 *
 * Sources, merged and deduped by user id: invited `project_collaborators`, the
 * live `presence` roster (anyone currently on the canvas — key, since an owner
 * collaborator row is not seeded yet, backlog P1-12), and always the signed-in
 * user. Without the presence merge the picker frequently offered only yourself.
 */
export function useProjectMembers(
  projectId?: string,
  enabled: boolean = true,
  presence: PresenceLike[] = []
): UseProjectMembers {
  const user = useAppStore((s) => s.user);
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    if (!enabled || !projectId) return;
    setIsLoading(true);
    // Wait for the Clerk-authenticated client instead of calling
    // getClientForEnvironment() synchronously — it THROWS if the client isn't set
    // yet (it's evaluated as an argument, so the .catch below never sees it),
    // which crashed the Strategy page on first render (CVS-22).
    whenAuthenticatedClientReady()
      .then((client) => getProjectCollaborators(projectId, client))
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

    // Merge live-presence teammates who aren't already invited collaborators.
    // They're mentionable by name and their id targets a real notification.
    for (const p of presence) {
      if (!p.userId || map[p.userId]) continue;
      map[p.userId] = {
        id: p.userId,
        name: p.name || 'Someone',
        email: '',
        avatarUrl: p.avatar ?? null,
        isSelf: p.userId === user?.id,
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
  }, [collaborators, presence, user?.id, user?.name, user?.email]);

  const reload = React.useCallback(() => setReloadKey((k) => k + 1), []);

  return { members, byId, isLoading, reload };
}
