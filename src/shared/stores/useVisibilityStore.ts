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
  /** Projects whose restricted-set load was attempted and failed. */
  failed: Record<string, boolean>;
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
  failed: {},

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
        failed: { ...s.failed, [projectId]: false },
      }));
    } catch {
      // Fail CLOSED: until this viewer's restricted set is known, we cannot
      // prove a value is safe to show, so mask everything for this project
      // rather than leaking a hide_value metric on a transient error. (The
      // real boundary is server-side redaction; this is the client pairing.)
      // Keep any previously-loaded set as the best available answer, and mark
      // the project failed so isRestricted masks when no set exists yet.
      set((s) => ({
        failed: { ...s.failed, [projectId]: true },
      }));
      // Self-heal a transient blip so the mask-everything window stays short.
      setTimeout(() => {
        if (get().failed[projectId] && !get().restrictedByProject[projectId]) {
          void get().reload(projectId, client);
        }
      }, 3000);
    } finally {
      set((s) => ({ loading: { ...s.loading, [projectId]: false } }));
    }
  },

  isRestricted: (projectId, cardId) => {
    const set = get().restrictedByProject[projectId];
    if (set) return set.has(cardId);
    // No known set yet: mask only once a load has definitively failed (fail
    // closed); while still loading / not attempted, don't mask.
    return !!get().failed[projectId];
  },
}));
