/**
 * Canvas Event Handlers
 * Centralized event handling logic for the CanvasPage component
 */

import { useCanvasStateMachine } from '@/lib/hooks/useCanvasStateMachine';
import { useCanvasViewportSync } from '@/lib/hooks/useCanvasViewportSync';
import { useAppStore, useCanvasStore } from '@/lib/stores';
import { useEvidenceStore } from '@/lib/stores/evidenceStore';
import type { EvidenceItem } from '@/lib/types';
import { applyAutoLayout } from '@/lib/utils/autoLayout';
import { applyFilters, type FilterOptions } from '@/lib/utils/filterUtils';
import type { Node } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { CanvasPageState } from './useCanvasPageState';

interface UseCanvasEventsProps {
  state: CanvasPageState;
  canvasMachine: ReturnType<typeof useCanvasStateMachine>;
  viewportSync: ReturnType<typeof useCanvasViewportSync>;
}

export function useCanvasEvents({
  state,
  canvasMachine,
  viewportSync,
}: UseCanvasEventsProps) {
  const { canvasId } = useParams();
  const navigate = useNavigate();

  // Canvas store functions
  const {
    canvas,
    deleteNode,
    persistNodeDelete,
    clearSelection,
    selectedNodeIds,
    groupSelectedNodes,
    ungroupSelectedGroups,
    deleteGroup,
    updateNodePosition,
    updateCanvasSettings,
    toggleGroupCollapse,
    updateGroupSize,
  } = useCanvasStore();

  // Evidence store functions
  const { addEvidence } = useEvidenceStore();

  // App store functions
  const { user } = useAppStore();

  // React Flow functions
  const {
    screenToFlowPosition,
    setCenter,
    getViewport,
    setViewport: setFlowViewport,
  } = useReactFlow() as any;

  // Pane click handler
  const handlePaneClick = useCallback(() => {
    clearSelection(); // Clear node selection when clicking on empty space
    state.setSelectedGroupIds([]); // Clear group selection when clicking on empty space
  }, [clearSelection, state]);

  // Group management handlers
  const handleToggleCollapse = useCallback(
    (groupId: string) => {
      toggleGroupCollapse(groupId);
    },
    [toggleGroupCollapse]
  );

  const handleUpdateGroupSize = useCallback(
    (groupId: string, size: { width: number; height: number }) => {
      updateGroupSize(groupId, size);
    },
    [updateGroupSize]
  );

  // Selection Panel handlers
  const handleGroupSelectedNodes = useCallback(async () => {
    console.log('🎯 handleGroupSelectedNodes called with:', selectedNodeIds);

    if (selectedNodeIds.length < 2) {
      toast.error('At least 2 nodes must be selected to create a group');
      return;
    }

    try {
      await groupSelectedNodes(selectedNodeIds);
      toast.success(`✅ Grouped ${selectedNodeIds.length} nodes successfully`);
      clearSelection();
      state.setSelectedGroupIds([]);
    } catch (error) {
      console.error('❌ Failed to group nodes:', error);
      toast.error('Failed to group nodes. Please try again.');
    }
  }, [groupSelectedNodes, selectedNodeIds, clearSelection, state]);

  const handleUngroupSelectedGroups = useCallback(async () => {
    if (state.selectedGroupIds.length === 0) {
      toast.error('No groups selected for ungrouping');
      return;
    }

    try {
      await ungroupSelectedGroups(state.selectedGroupIds);
      toast.success(
        `✅ Ungrouped ${state.selectedGroupIds.length} groups successfully`
      );
      clearSelection();
      state.setSelectedGroupIds([]);
    } catch (error) {
      console.error('❌ Failed to ungroup nodes:', error);
      toast.error('Failed to ungroup nodes. Please try again.');
    }
  }, [ungroupSelectedGroups, state, clearSelection]);

  const handleDeleteSelectedItems = useCallback(async () => {
    const allSelectedIds = [...selectedNodeIds];

    try {
      // Delete selected nodes
      for (const nodeId of allSelectedIds) {
        deleteNode(nodeId);
        await persistNodeDelete(nodeId);
      }

      // Delete selected groups
      for (const groupId of state.selectedGroupIds) {
        await deleteGroup(groupId);
      }

      const totalDeleted =
        allSelectedIds.length + state.selectedGroupIds.length;
      toast.success(
        `✅ Deleted ${totalDeleted} item${totalDeleted !== 1 ? 's' : ''} successfully`
      );

      clearSelection();
      state.setSelectedGroupIds([]);
    } catch (error) {
      console.error('❌ Failed to delete selected items:', error);
      toast.error('Failed to delete selected items. Please try again.');
    }
  }, [
    selectedNodeIds,
    state.selectedGroupIds,
    deleteNode,
    persistNodeDelete,
    deleteGroup,
    clearSelection,
    state,
  ]);

  const handleDuplicateSelectedItems = useCallback(() => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate functionality not yet implemented');
  }, []);

  const handleOpenSelectedSettings = useCallback(() => {
    if (selectedNodeIds.length === 1) {
      state.setSettingsCardId(selectedNodeIds[0]);
    }
  }, [selectedNodeIds, state]);

  // Filter handlers
  const handleOpenFilters = useCallback(() => {
    state.setFilterModalOpen(true);
  }, [state]);

  const handleAddEvidence = useCallback(() => {
    // Get current viewport center for better positioning
    const reactFlowInstance =
      state.reactFlowRef.current?.getBoundingClientRect();
    const centerX = reactFlowInstance ? reactFlowInstance.width / 2 : 400;
    const centerY = reactFlowInstance ? reactFlowInstance.height / 2 : 300;

    // Create a new general evidence item
    const newEvidence: EvidenceItem = {
      id: `evidence_${Date.now()}`,
      title: 'New Evidence',
      type: 'Analysis',
      date: new Date().toISOString().split('T')[0],
      owner: user?.email || 'Anonymous User',
      summary: 'Add your evidence summary here',
      hypothesis: '',
      impactOnConfidence: '',
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'anonymous-user',
      context: {
        type: 'general',
        targetName: 'Canvas Evidence',
      },
      position: { x: centerX, y: centerY }, // Center position
      isVisible: true,
      isExpanded: false,
    };

    try {
      // Add to evidence store
      addEvidence(newEvidence);

      // Show success message
      toast.success('Evidence added to canvas');
    } catch (error) {
      console.error('❌ Error adding evidence:', error);
      toast.error('Failed to add evidence');
    }
  }, [addEvidence, state]);

  const handleApplyFilters = useCallback(
    (filters: FilterOptions) => {
      state.setCurrentFilters(filters);

      if (canvas?.nodes && canvas?.edges) {
        const {
          visibleNodeIds: newVisibleNodeIds,
          visibleEdgeIds: newVisibleEdgeIds,
        } = applyFilters(canvas.nodes, canvas.edges, filters);

        state.setVisibleNodeIds(newVisibleNodeIds);
        state.setVisibleEdgeIds(newVisibleEdgeIds);
      }
    },
    [canvas?.nodes, canvas?.edges, state]
  );

  // Layout application
  const handleApplyLayout = useCallback(
    (direction: 'TB' | 'BT' | 'LR' | 'RL') => {
      state.setCurrentLayoutDirection(direction);

      // Persist layout direction to canvas settings
      updateCanvasSettings({
        autoLayout: {
          algorithm: direction,
          enabled: true,
        },
      });

      if (canvas?.nodes && canvas?.edges) {
        const layoutedNodes = applyAutoLayout(
          canvas.nodes.map((node) => ({
            id: node.id,
            position: node.position,
            data: { card: node },
            type: 'metricCard',
          })),
          canvas.edges.map((edge) => ({
            id: edge.id,
            source: edge.sourceId,
            target: edge.targetId,
            data: { relationship: edge },
          })),
          { direction }
        );

        // Update node positions
        layoutedNodes.forEach((node) => {
          updateNodePosition(node.id, node.position);
        });

        console.log(
          `✅ Applied ${direction} layout to canvas and saved to settings`
        );
      }
    },
    [
      canvas?.nodes,
      canvas?.edges,
      updateNodePosition,
      updateCanvasSettings,
      state,
    ]
  );

  // Settings and sheets handlers
  const handleOpenSettingsSheet = useCallback(
    (cardId: string, tab: string = 'data') => {
      state.setSettingsCardId(cardId);
      state.setSettingsInitialTab(tab);
      state.setIsSettingsSheetOpen(true);
    },
    [state]
  );

  const handleCloseSettingsSheet = useCallback(() => {
    state.setIsSettingsSheetOpen(false);
    state.setSettingsCardId(undefined);
  }, [state]);

  const handleSwitchToCard = useCallback(
    (cardId: string, tab: string = 'data') => {
      state.setSettingsCardId(cardId);
      state.setSettingsInitialTab(tab);
    },
    [state]
  );

  const handleOpenRelationshipSheet = useCallback(
    (relationshipId: string) => {
      state.setRelationshipSheetId(relationshipId);
      state.setIsRelationshipSheetOpen(true);
    },
    [state]
  );

  const handleCloseRelationshipSheet = useCallback(() => {
    state.setIsRelationshipSheetOpen(false);
    state.setRelationshipSheetId(undefined);
  }, [state]);

  const handleSwitchToRelationship = useCallback(
    (relationshipId: string) => {
      state.setRelationshipSheetId(relationshipId);
    },
    [state]
  );

  // Collaboration navigation
  useEffect(() => {
    const onCollabNavigate = (e: Event) => {
      const detail: any = (e as CustomEvent).detail || {};
      const nodeId = detail?.context?.nodeId as string | undefined;
      if (!nodeId) return;

      try {
        const node = (useReactFlow() as any).getNode(nodeId);
        if (!node) return;
        const abs = (node as any).positionAbsolute || node.position;
        const width = (node as any).measured?.width ?? node.width ?? 160;
        const height = (node as any).measured?.height ?? node.height ?? 100;
        const cx = abs.x + width / 2;
        const cy = abs.y + height / 2;
        setCenter(cx, cy, { zoom: 1.2, duration: 500 });
      } catch (err) {
        console.warn('collab:navigate setCenter failed', err);
      }
    };

    window.addEventListener('collab:navigate', onCollabNavigate as any);
    return () =>
      window.removeEventListener('collab:navigate', onCollabNavigate as any);
  }, [setCenter]);

  // Listen for temp node additions from AddNodeButton
  useEffect(() => {
    const handler = (e: any) => {
      const node = e?.detail as Node | undefined;
      if (node) {
        state.setExtraNodes((prev) => [...prev, node]);
      }
    };
    window.addEventListener('rf:addTempNode', handler as any);
    return () => window.removeEventListener('rf:addTempNode', handler as any);
  }, [state]);

  return {
    // Pane handlers
    handlePaneClick,

    // Group handlers
    handleToggleCollapse,
    handleUpdateGroupSize,
    handleGroupSelectedNodes,
    handleUngroupSelectedGroups,

    // Selection handlers
    handleDeleteSelectedItems,
    handleDuplicateSelectedItems,
    handleOpenSelectedSettings,

    // Filter handlers
    handleOpenFilters,
    handleApplyFilters,

    // Evidence handlers
    handleAddEvidence,

    // Layout handlers
    handleApplyLayout,

    // Settings and sheets handlers
    handleOpenSettingsSheet,
    handleCloseSettingsSheet,
    handleSwitchToCard,
    handleOpenRelationshipSheet,
    handleCloseRelationshipSheet,
    handleSwitchToRelationship,
  };
}
