import type { Database } from '@/shared/lib/supabase/types';
import { getMyRestrictedCards } from '@/shared/lib/supabase/services/accessTags';
import type { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';

/**
 * Node-level visibility for the current viewer (CVS-122). One `my_restricted_cards`
 * call per project yields the set of cards restricted for this viewer, which the
 * node cards read to show a "Restricted" badge + mask the value (the client
 * pairing for hide_value; hide_node rows are already RLS-filtered). Loaded lazily
 * by the first node that mounts — no CanvasPage wiring needed.
 */
interface VisibilityState {
  restrictedByProject: Record<string, Set<string>>;
  loading: Record<string, boolean>;
  ensureLoaded: (
    projectId: string,
    client: SupabaseClient<Database>
  ) => Promise<void>;
  reload: (
    projectId: string,
    client: SupabaseClient<Database>
  ) => Promise<void>;
  isRestricted: (projectId: string, cardId: string) => boolean;
}

export const useVisibilityStore = create<VisibilityState>((set, get) => ({
  restrictedByProject: {},
  loading: {},

  ensureLoaded: async (projectId, client) => {
    const { restrictedByProject, loading } = get();
    if (restrictedByProject[projectId] || loading[projectId]) return;
    await get().reload(projectId, client);
  },

  reload: async (projectId, client) => {
    set((s) => ({ loading: { ...s.loading, [projectId]: true } }));
    try {
      const ids = await getMyRestrictedCards(projectId, client);
      set((s) => ({
        restrictedByProject: {
          ...s.restrictedByProject,
          [projectId]: new Set(ids),
        },
      }));
    } catch {
      // Fail open on the CLIENT only (RLS is the real boundary): show nothing
      // as restricted rather than blanking a whole canvas on a transient error.
      set((s) => ({
        restrictedByProject: {
          ...s.restrictedByProject,
          [projectId]: s.restrictedByProject[projectId] ?? new Set(),
        },
      }));
    } finally {
      set((s) => ({ loading: { ...s.loading, [projectId]: false } }));
    }
  },

  isRestricted: (projectId, cardId) =>
    !!get().restrictedByProject[projectId]?.has(cardId),
}));
