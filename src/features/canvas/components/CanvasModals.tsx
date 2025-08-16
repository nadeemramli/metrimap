/**
 * Canvas Modals and Sheets
 * All modal dialogs and sheets used in the canvas
 */

import FilterModal from '@/features/canvas/components/mini-control/FilterModal';
import {
  CardSettingsSheet,
  RelationshipSheet,
} from '@/features/canvas/components/panels';
import AdvancedSearchModal from '@/features/canvas/components/search/AdvancedSearchModal';
import type { CanvasPageState } from '@/features/canvas/hooks/useCanvasPageState';
import { useCanvasStore } from '@/lib/stores';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import KeyboardShortcutsHelp from '@/shared/components/ui/KeyboardShortcutsHelp';
import type { AnyNode } from '@/shared/types';
import type { FilterOptions } from '@/shared/utils/filterUtils';

interface CanvasModalsProps {
  state: CanvasPageState;
  enabledShortcuts: any[];
  availableFilterOptions: any;
  onApplyFilters: (filters: FilterOptions) => void;
  onSwitchToCard: (cardId: string, tab?: string) => void;
  onSwitchToRelationship: (relationshipId: string) => void;
  onCloseSettingsSheet: () => void;
  onCloseRelationshipSheet: () => void;
  onConfirmCategorySelection?: (category: string) => void;
  onCancelCategorySelection?: () => void;
}

export default function CanvasModals({
  state,
  enabledShortcuts,
  availableFilterOptions,
  onApplyFilters,
  onSwitchToCard,
  onSwitchToRelationship,
  onCloseSettingsSheet,
  onCloseRelationshipSheet,
  onConfirmCategorySelection,
  onCancelCategorySelection,
}: CanvasModalsProps) {
  const { getNodeById, persistNodeUpdate } = useCanvasStore();

  // Get the current node for settings
  const currentNode = state.settingsCardId
    ? getNodeById(state.settingsCardId)
    : null;

  // Determine if we should use the new NodeSettingsRouter or legacy CardSettingsSheet
  const useNewNodeSettings =
    currentNode &&
    ['valueNode', 'actionNode', 'hypothesisNode', 'metricNode'].includes(
      currentNode.type || ''
    );

  // Handle save for new node types
  const handleNodeSave = (nodeId: string, updatedData: Partial<AnyNode>) => {
    console.log('💾 Saving node data:', nodeId, updatedData);
    persistNodeUpdate(nodeId, updatedData);
  };
  return (
    <>
      {/* Node Settings - Route to appropriate settings panel */}
      {useNewNodeSettings ? (
        <NodeSettingsRouter
          node={currentNode as AnyNode}
          isOpen={state.isSettingsSheetOpen}
          onClose={onCloseSettingsSheet}
          onSave={handleNodeSave}
        />
      ) : (
        /* Legacy Card Settings Sheet for MetricCard and other existing types */
        <CardSettingsSheet
          isOpen={state.isSettingsSheetOpen}
          onClose={onCloseSettingsSheet}
          cardId={state.settingsCardId}
          initialTab={state.settingsInitialTab}
          onSwitchToCard={onSwitchToCard}
        />
      )}

      {/* Relationship Sheet */}
      <RelationshipSheet
        isOpen={state.isRelationshipSheetOpen}
        onClose={onCloseRelationshipSheet}
        relationshipId={state.relationshipSheetId}
        onSwitchToRelationship={onSwitchToRelationship}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        shortcuts={enabledShortcuts}
        trigger={
          state.showShortcutsHelp ? <div style={{ display: 'none' }} /> : null
        }
      />
      {state.showShortcutsHelp && (
        <div
          className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center"
          onClick={() => state.setShowShortcutsHelp(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <KeyboardShortcutsHelp
              shortcuts={enabledShortcuts}
              trigger={null}
            />
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={state.showAdvancedSearch}
        onClose={() => state.setShowAdvancedSearch(false)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={state.filterModalOpen}
        onClose={() => state.setFilterModalOpen(false)}
        currentFilters={state.currentFilters}
        availableOptions={availableFilterOptions}
        onApplyFilters={onApplyFilters}
      />

      {/* Category Selection for Edge Drop */}
      {state.pendingNodeDrop && (
        <AlertDialog
          open={!!state.pendingNodeDrop}
          onOpenChange={(open) => {
            if (!open) {
              onCancelCategorySelection?.();
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Node</AlertDialogTitle>
              <AlertDialogDescription>
                Choose the category for the new node you want to add.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => onConfirmCategorySelection?.('Metric')}
                className="w-full sm:w-auto"
              >
                📊 Metric
              </Button>
              <Button
                variant="outline"
                onClick={() => onConfirmCategorySelection?.('Work/Action')}
                className="w-full sm:w-auto"
              >
                ⚡ Work/Action
              </Button>
              <Button
                variant="outline"
                onClick={() => onConfirmCategorySelection?.('External Factor')}
                className="w-full sm:w-auto"
              >
                🌐 External Factor
              </Button>
              <Button
                variant="outline"
                onClick={() => onCancelCategorySelection?.()}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
