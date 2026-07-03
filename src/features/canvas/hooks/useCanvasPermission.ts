import { useEffect, useState } from 'react';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { getMyProjectPermission } from '@/shared/lib/supabase/services/collaborators';

export type PermissionLevel = 'none' | 'view' | 'comment' | 'edit';

export interface CanvasPermission {
  level: PermissionLevel;
  canView: boolean;
  canComment: boolean;
  canEdit: boolean;
  loading: boolean;
}

/**
 * The current user's effective permission on a canvas, from the authoritative
 * my_project_permission RPC (which reuses the RLS helpers). UI gating built on
 * this matches exactly what the DB will allow — RLS remains the real boundary;
 * this just avoids showing edit affordances that would silently fail.
 *
 * Optimistic default is 'edit' while loading so the common case (owner / org
 * member) never flashes a read-only state; it corrects down if restricted.
 */
export function useCanvasPermission(
  projectId: string | undefined
): CanvasPermission {
  const client = useClerkSupabase();
  const [level, setLevel] = useState<PermissionLevel>('edit');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !projectId) return;
    let active = true;
    setLoading(true);
    getMyProjectPermission(projectId, client)
      .then((lvl) => {
        if (active) setLevel(lvl);
      })
      .catch((e) => {
        console.error('Failed to resolve canvas permission', e);
        // Fail safe-ish: assume view-only rather than granting edit on error.
        if (active) setLevel('view');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [client, projectId]);

  return {
    level,
    canView: level !== 'none',
    canComment: level === 'comment' || level === 'edit',
    canEdit: level === 'edit',
    loading,
  };
}
