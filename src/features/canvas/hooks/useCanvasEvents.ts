import { useEvidenceStore } from '@/features/evidence/stores/useEvidenceStore';
import { useAppStore } from '@/shared/stores/useAppStore';

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
  const handlePaneClick = () => {
    // Clear any transient UI or selections if neededs
  };

  const handleOpenSettingsSheet = (nodeId: string) => {
    console.log('🔧 Opening settings sheet for node:', nodeId);
    state.setIsSettingsSheetOpen(true);
    state.setSettingsCardId?.(nodeId);
  };

  const handleOpenRelationshipSheet = (edgeId: string) => {
    console.log('🔗 Opening relationship sheet for edge:', edgeId);
    state.setIsRelationshipSheetOpen(true);
    state.setRelationshipSheetId?.(edgeId);
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
    // The page-state hook never implemented addEvidenceAtCenter, so the button
    // was a silent no-op. Add a positioned evidence item directly so an
    // evidence node appears on the canvas (it renders from the evidence store).
    const { user } = useAppStore.getState();
    const now = new Date().toISOString();
    useEvidenceStore.getState().addEvidence({
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `evidence_${Date.now()}`,
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
      position: { x: 250 + Math.random() * 200, y: 150 + Math.random() * 200 },
      isVisible: true,
      isExpanded: false,
      comments: [],
      context: { type: 'general' },
    } as any);
    // Also call the legacy hook if a page ever provides it.
    state.addEvidenceAtCenter?.();
  };

  const handleApplyLayout = () => {
    console.log('🔄 Layout button clicked');
    if (onApplyLayout) {
      onApplyLayout();
    } else {
      console.warn('⚠️ No layout handler provided');
    }
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
    console.log('🔧 Closing settings sheet');
    state.setIsSettingsSheetOpen?.(false);
    state.setSettingsCardId?.(undefined);
    state.setSettingsInitialTab?.(undefined);
  };
  const handleCloseRelationshipSheet = () => {
    console.log('🔗 Closing relationship sheet');
    state.setIsRelationshipSheetOpen?.(false);
    state.setRelationshipSheetId?.(undefined);
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
