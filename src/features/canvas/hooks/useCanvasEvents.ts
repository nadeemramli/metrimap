interface UseCanvasEventsOptions {
  state: any;
  canvasMachine: any;
  viewportSync: {
    updateViewport: (v: { x: number; y: number; zoom: number }) => void;
  };
}

/**
 * Minimal event handlers used by CanvasPage. Extend as needed.
 */
export function useCanvasEvents({
  state,
  canvasMachine,
  viewportSync,
}: UseCanvasEventsOptions) {
  const handlePaneClick = () => {
    // Clear any transient UI or selections if needed
  };

  const handleOpenSettingsSheet = (nodeId: string) => {
    state.setIsSettingsSheetOpen(true);
    state.setActiveNodeId?.(nodeId);
  };

  const handleOpenRelationshipSheet = (edgeId: string) => {
    state.setIsRelationshipSheetOpen(true);
    state.setActiveEdgeId?.(edgeId);
  };

  const handleSwitchToCard = (nodeId: string) => {
    handleOpenSettingsSheet(nodeId);
  };

  const handleSwitchToRelationship = (edgeId: string) => {
    handleOpenRelationshipSheet(edgeId);
  };

  const handleToggleCollapse = (groupId: string) => {
    state.toggleGroupCollapsed?.(groupId);
  };

  const handleUpdateGroupSize = (
    groupId: string,
    size: { width: number; height: number }
  ) => {
    state.updateGroupSize?.(groupId, size);
  };

  const handleOpenFilters = () => {
    state.setIsFiltersOpen?.(true);
  };

  const handleAddEvidence = () => {
    state.addEvidenceAtCenter?.();
  };

  const handleApplyLayout = () => {
    state.applyLayout?.();
  };

  const handleGroupSelectedNodes = () => {
    state.groupSelectedNodes?.();
  };

  const handleUngroupSelectedGroups = () => {
    state.ungroupSelectedGroups?.();
  };

  const handleDeleteSelectedItems = () => {
    state.deleteSelectedItems?.();
  };

  const handleDuplicateSelectedItems = () => {
    state.duplicateSelectedItems?.();
  };

  const handleOpenSelectedSettings = () => {
    state.openSelectedSettings?.();
  };

  // Modals/Sheets integration used by CanvasModals
  const handleApplyFilters = (filters?: any) => {
    state.applyFilters?.(filters);
  };
  const handleCloseSettingsSheet = () => {
    state.setIsSettingsSheetOpen?.(false);
  };
  const handleCloseRelationshipSheet = () => {
    state.setIsRelationshipSheetOpen?.(false);
  };

  return {
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
  };
}
