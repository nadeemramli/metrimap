import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';

interface UseProjectsRealtimeOptions {
  client: SupabaseClient | null;
  activeOrgId: string | null;
  onChange: () => void;
}

/**
 * Real-time project-list sync. When a project in the ACTIVE workspace is
 * created / updated / deleted by anyone in the org, debounce-refetch the list so
 * teammates' canvases appear without a manual reload. Scoped server-side by the
 * `workspace_id` filter (and RLS), so you only hear about your own workspace.
 */
export function useProjectsRealtime({
  client,
  activeOrgId,
  onChange,
}: UseProjectsRealtimeOptions) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!client || !activeOrgId) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const debouncedChange = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => onChangeRef.current(), 400);
    };

    const channel = client
      .channel(`projects-list-${activeOrgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `workspace_id=eq.${activeOrgId}`,
        },
        debouncedChange
      )
      .subscribe();

    return () => {
      if (timer) clearTimeout(timer);
      void client.removeChannel(channel);
    };
  }, [client, activeOrgId]);
}
