import { create } from 'zustand';

// Session-only Layers-panel state: hide/lock are working-session affordances
// (like muting a track), deliberately not persisted. `rev` bumps on any
// hide/lock change so CanvasPage's node build context can rebuild nodes
// without subscribing to the whole maps.
interface LayersUiState {
  hidden: Record<string, boolean>;
  locked: Record<string, boolean>;
  collapsedGroups: Record<string, boolean>;
  search: string;
  rev: number;
  toggleHidden: (id: string) => void;
  toggleLocked: (id: string) => void;
  toggleGroupCollapsed: (id: string) => void;
  setSearch: (search: string) => void;
}

export const useLayersUiStore = create<LayersUiState>((set) => ({
  hidden: {},
  locked: {},
  collapsedGroups: {},
  search: '',
  rev: 0,
  toggleHidden: (id) =>
    set((s) => ({
      hidden: { ...s.hidden, [id]: !s.hidden[id] },
      rev: s.rev + 1,
    })),
  toggleLocked: (id) =>
    set((s) => ({
      locked: { ...s.locked, [id]: !s.locked[id] },
      rev: s.rev + 1,
    })),
  toggleGroupCollapsed: (id) =>
    set((s) => ({
      collapsedGroups: { ...s.collapsedGroups, [id]: !s.collapsedGroups[id] },
    })),
  setSearch: (search) => set({ search }),
}));
