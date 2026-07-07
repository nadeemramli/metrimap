import { create } from 'zustand';

export type CollabTab = 'people' | 'comments' | 'activity';

/**
 * The one open right-dock panel. A single discriminated value (not booleans)
 * makes exclusivity structural: opening any panel closes the previous one.
 */
export type RightPanel =
  | { kind: 'collaboration'; tab: CollabTab }
  | { kind: 'cardSettings'; cardId?: string; initialTab?: string }
  | { kind: 'relationship'; relationshipId?: string }
  | { kind: 'sourceConfig'; nodeId: string }
  | { kind: 'chartSettings'; nodeId: string }
  | { kind: 'groupEdit'; groupId: string }
  | { kind: 'evidenceEdit'; evidenceId: string }
  /** Generic slot for sub-page detail panels (dashboard/strategy/assets…).
      `id` is page-scoped, e.g. 'widget:<uuid>' or 'impact:<cardId>'. */
  | { kind: 'page'; id: string };

export type LeftPanel = 'layers';

export type DockSide = 'left' | 'right';

interface CanvasPanelState {
  rightPanel: RightPanel | null;
  leftPanel: LeftPanel | null;
  /** Dock slot elements registered by the hosts in CanvasLayout — DockPanel portals into them. */
  rightHostEl: HTMLElement | null;
  leftHostEl: HTMLElement | null;
  /** Widths declared by the currently open panel (px). */
  rightWidth: number;
  leftWidth: number;
  /** How many DockPanels are actually rendering content into each host.
      The hosts size themselves by THIS, not by rightPanel/leftPanel — if the
      owning page unmounts (route change), the column collapses instead of
      persisting as an empty shell. */
  rightContentCount: number;
  leftContentCount: number;
  openRight: (panel: RightPanel) => void;
  closeRight: () => void;
  toggleLayers: () => void;
  closeLeft: () => void;
  setHostEl: (side: DockSide, el: HTMLElement | null) => void;
  setPanelWidth: (side: DockSide, width: number) => void;
  registerContent: (side: DockSide) => void;
  unregisterContent: (side: DockSide) => void;
  reset: () => void;
}

export const useCanvasPanelStore = create<CanvasPanelState>((set) => ({
  rightPanel: null,
  leftPanel: null,
  rightHostEl: null,
  leftHostEl: null,
  rightWidth: 420,
  leftWidth: 280,
  rightContentCount: 0,
  leftContentCount: 0,
  openRight: (panel) => set({ rightPanel: panel }),
  closeRight: () => set({ rightPanel: null }),
  toggleLayers: () =>
    set((s) => ({ leftPanel: s.leftPanel === 'layers' ? null : 'layers' })),
  closeLeft: () => set({ leftPanel: null }),
  setHostEl: (side, el) =>
    set(side === 'right' ? { rightHostEl: el } : { leftHostEl: el }),
  setPanelWidth: (side, width) =>
    set(side === 'right' ? { rightWidth: width } : { leftWidth: width }),
  registerContent: (side) =>
    set((s) =>
      side === 'right'
        ? { rightContentCount: s.rightContentCount + 1 }
        : { leftContentCount: s.leftContentCount + 1 }
    ),
  unregisterContent: (side) =>
    set((s) =>
      side === 'right'
        ? { rightContentCount: Math.max(0, s.rightContentCount - 1) }
        : { leftContentCount: Math.max(0, s.leftContentCount - 1) }
    ),
  reset: () => set({ rightPanel: null, leftPanel: null }),
}));

/**
 * Sub-page helper: claim the right dock for a page-scoped panel id.
 * `open(id)` replaces whatever panel is open (structural exclusivity);
 * `close()` only closes if this page's panel is still the open one.
 */
export function usePagePanel() {
  const openId = useCanvasPanelStore((s) =>
    s.rightPanel?.kind === 'page' ? s.rightPanel.id : null
  );
  return {
    openId,
    open: (id: string) =>
      useCanvasPanelStore.getState().openRight({ kind: 'page', id }),
    close: () => {
      const s = useCanvasPanelStore.getState();
      if (s.rightPanel?.kind === 'page') s.closeRight();
    },
  };
}
