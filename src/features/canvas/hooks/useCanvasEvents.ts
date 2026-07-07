import { useCallback, useMemo, useRef } from 'react';
import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useCanvasStore } from '@/lib/stores';
import { useAppStore } from '@/shared/stores/useAppStore';
import { getViewportCenterPosition } from '@/features/canvas/utils/viewportCenter';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';

interface UseCanvasEventsOptions {
  state: any;
  canvasMachine: any;
  viewportSync: {
    updateViewport: (v: { x: number; y: number; zoom: number }) => void;
  };
  onApplyLayout?: () => void;
}

/**
 * Minimal event handlers used by CanvasPage. Extend as needed.
 */
export function useCanvasEvents({
  state,
  onApplyLayout,
}: UseCanvasEventsOptions) {
  const { screenToFlowPosition } = useReactFlow();

  // Keep the latest props reachable from stable handlers WITHOUT changing their
  // identity. `state` (from useCanvasPageState) is a fresh object every render, so
  // closing over it directly would give every handler a new identity each render —
  // which rebuilds the `nodes`/`edges` memos that depend on these handlers and
  // feeds React Flow new props each render (the React #185 "max update depth" loop
  // on /canvas/:id). Reading through a ref keeps handlers referentially stable.
  const latest = useRef({ state, onApplyLayout, screenToFlowPosition });
  latest.current = { state, onApplyLayout, screenToFlowPosition };

  const handlePaneClick = useCallback(() => {
    // Clicking empty canvas clears the (controlled) selection. Without this,
    // React Flow's native pane-click deselect is immediately overridden by our
    // `selected` prop (derived from selectedNodeIds), so nodes stay stuck
    // selected and there's no way back to "nothing selected" (CVS-68).
    useCanvasStore.getState().clearSelection();
  }, []);

  const handleOpenSettingsSheet = useCallback((nodeId: string) => {
    const { state } = latest.current;
    console.log('🔧 Opening settings sheet for node:', nodeId);
    state.setIsSettingsSheetOpen(true);
    state.setSettingsCardId?.(nodeId);
  }, []);

  const handleOpenRelationshipSheet = useCallback((edgeId: string) => {
    const { state } = latest.current;
    console.log('🔗 Opening relationship sheet for edge:', edgeId);
    state.setIsRelationshipSheetOpen(true);
    state.setRelationshipSheetId?.(edgeId);
  }, []);

  const handleSwitchToCard = useCallback((nodeId: string) => {
    handleOpenSettingsSheet(nodeId);
  }, [handleOpenSettingsSheet]);

  const handleSwitchToRelationship = useCallback((edgeId: string) => {
    handleOpenRelationshipSheet(edgeId);
  }, [handleOpenRelationshipSheet]);

  const handleToggleCollapse = useCallback((groupId: string) => {
    latest.current.state.toggleGroupCollapsed?.(groupId);
  }, []);

  const handleUpdateGroupSize = useCallback((
    groupId: string,
    size: { width: number; height: number }
  ) => {
    latest.current.state.updateGroupSize?.(groupId, size);
  }, []);

  const handleOpenFilters = useCallback(() => {
    latest.current.state.setIsFiltersOpen?.(true);
  }, []);

  const handleAddEvidence = useCallback(() => {
    const { state, screenToFlowPosition } = latest.current;
    // The page-state hook never implemented addEvidenceAtCenter, so the button
    // was a silent no-op. Add a positioned evidence item directly so an
    // evidence node appears on the canvas (it renders from the evidence store).
    const { user } = useAppStore.getState();
    const now = new Date().toISOString();
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `evidence_${Date.now()}`;
    useEvidenceStore.getState().addEvidence({
      id,
      title: 'New Evidence',
      type: 'Analysis',
      date: now.slice(0, 10),
      summary: '',
      owner: user?.name || 'You',
      ownerId: user?.id,
      hypothesis: '',
      impactOnConfidence: '',
      link: '',
      createdAt: now,
      updatedAt: now,
      createdBy: user?.id || 'unknown',
      position: getViewportCenterPosition(
        screenToFlowPosition,
        state.reactFlowRef?.current
      ),
      isVisible: true,
      // Card-first creation: the node opens expanded with the title in edit
      // mode (see EvidenceNode + justCreatedEvidenceId), not as a bare icon.
      isExpanded: true,
      comments: [],
      context: { type: 'general' },
    } as any);
    useEvidenceStore.getState().setJustCreatedEvidenceId(id);
    // Also call the legacy hook if a page ever provides it.
    state.addEvidenceAtCenter?.();
  }, []);

  const handleApplyLayout = useCallback(() => {
    console.log('🔄 Layout button clicked');
    const { onApplyLayout } = latest.current;
    if (onApplyLayout) {
      onApplyLayout();
    } else {
      console.warn('⚠️ No layout handler provided');
    }
  }, []);

  const handleGroupSelectedNodes = useCallback(() => {
    // The page-state hook never implemented groupSelectedNodes, so the button
    // was a no-op. Drive the real canvas-store action with the live selection,
    // which persists a group (DB) and tags member cards with parentId.
    const { selectedNodeIds, groupSelectedNodes } = useCanvasStore.getState();
    if (!selectedNodeIds || selectedNodeIds.length < 2) {
      toast.error('Select at least 2 cards to group');
      return;
    }
    Promise.resolve(groupSelectedNodes(selectedNodeIds))
      .then(() => toast.success('Grouped selected cards'))
      .catch((err) => {
        console.error('Group failed', err);
        toast.error('Could not group selected cards');
      });
  }, []);

  const handleUngroupSelectedGroups = useCallback(() => {
    const groupIds = latest.current.state.selectedGroupIds || [];
    if (groupIds.length === 0) {
      toast.error('Select a group to ungroup');
      return;
    }
    Promise.resolve(useCanvasStore.getState().ungroupSelectedGroups(groupIds))
      .then(() => toast.success('Ungrouped'))
      .catch((err) => {
        console.error('Ungroup failed', err);
        toast.error('Could not ungroup');
      });
  }, []);

  const handleDeleteSelectedItems = useCallback(() => {
    latest.current.state.deleteSelectedItems?.();
  }, []);

  const handleDuplicateSelectedItems = useCallback(() => {
    latest.current.state.duplicateSelectedItems?.();
  }, []);

  const handleOpenSelectedSettings = useCallback(() => {
    // Open the Settings sheet for the (first) selected node. The page-state hook
    // never implemented openSelectedSettings, so wire it to the real opener.
    const { selectedNodeIds } = useCanvasStore.getState();
    if (selectedNodeIds.length > 0) {
      handleOpenSettingsSheet(selectedNodeIds[0]);
    } else {
      toast.error('Select a card first');
    }
  }, [handleOpenSettingsSheet]);

  // Modals/Sheets integration used by CanvasModals
  const handleApplyFilters = useCallback((filters?: any) => {
    latest.current.state.applyFilters?.(filters);
  }, []);
  const handleCloseSettingsSheet = useCallback(() => {
    const { state } = latest.current;
    console.log('🔧 Closing settings sheet');
    state.setIsSettingsSheetOpen?.(false);
    state.setSettingsCardId?.(undefined);
    state.setSettingsInitialTab?.(undefined);
  }, []);
  const handleCloseRelationshipSheet = useCallback(() => {
    const { state } = latest.current;
    console.log('🔗 Closing relationship sheet');
    state.setIsRelationshipSheetOpen?.(false);
    state.setRelationshipSheetId?.(undefined);
  }, []);

  return useMemo(
    () => ({
      handlePaneClick,
      handleOpenSettingsSheet,
      handleOpenRelationshipSheet,
      handleSwitchToCard,
      handleSwitchToRelationship,
      handleToggleCollapse,
      handleUpdateGroupSize,
      handleOpenFilters,
      handleAddEvidence,
      handleApplyLayout,
      handleGroupSelectedNodes,
      handleUngroupSelectedGroups,
      handleDeleteSelectedItems,
      handleDuplicateSelectedItems,
      handleOpenSelectedSettings,
      handleApplyFilters,
      handleCloseSettingsSheet,
      handleCloseRelationshipSheet,
    }),
    [
      handlePaneClick,
      handleOpenSettingsSheet,
      handleOpenRelationshipSheet,
      handleSwitchToCard,
      handleSwitchToRelationship,
      handleToggleCollapse,
      handleUpdateGroupSize,
      handleOpenFilters,
      handleAddEvidence,
      handleApplyLayout,
      handleGroupSelectedNodes,
      handleUngroupSelectedGroups,
      handleDeleteSelectedItems,
      handleDuplicateSelectedItems,
      handleOpenSelectedSettings,
      handleApplyFilters,
      handleCloseSettingsSheet,
      handleCloseRelationshipSheet,
    ]
  );
}
