// Canvas modals/sheets actually wired into the canvas.
//
// The legacy `components/CanvasModals.tsx` is orphaned (it imports a FilterModal
// that no longer exists after the reorg). This renders only the sheets that
// exist and are wired today: the Card settings sheet, the new-node settings
// router, and the Relationship sheet. Filters / advanced search / shortcuts can
// be re-added here once their state + components are restored.

import {
  CardSettingsSheet,
  RelationshipSheet,
} from '@/features/canvas/components/panels';
import NodeSettingsRouter from '@/features/canvas/components/panels/NodeSettingsRouter';
import type { CanvasPageState } from '@/features/canvas/hooks/useCanvasPageState';
import { useCanvasStore } from '@/lib/stores';
import type { AnyNode } from '@/shared/types';

interface CanvasModalsProps {
  state: CanvasPageState;
  enabledShortcuts?: unknown[];
  availableFilterOptions?: unknown;
  onApplyFilters?: (filters: unknown) => void;
  onSwitchToCard: (cardId: string, tab?: string) => void;
  onSwitchToRelationship: (relationshipId: string) => void;
  onCloseSettingsSheet: () => void;
  onCloseRelationshipSheet: () => void;
}

export default function CanvasModals({
  state,
  onSwitchToCard,
  onSwitchToRelationship,
  onCloseSettingsSheet,
  onCloseRelationshipSheet,
}: CanvasModalsProps) {
  const getNodeById = useCanvasStore((s) => s.getNodeById);
  const persistNodeUpdate = useCanvasStore((s) => s.persistNodeUpdate);

  const currentNode = state.settingsCardId
    ? getNodeById(state.settingsCardId)
    : null;

  // New PRD node types use the dedicated router; everything else (metric cards,
  // etc.) uses the legacy CardSettingsSheet.
  const useNewNodeSettings =
    !!currentNode &&
    ['valueNode', 'actionNode', 'hypothesisNode', 'metricNode'].includes(
      (currentNode as { type?: string }).type || ''
    );

  return (
    <>
      {useNewNodeSettings ? (
        <NodeSettingsRouter
          node={currentNode as unknown as AnyNode}
          isOpen={state.isSettingsSheetOpen}
          onClose={onCloseSettingsSheet}
          onSave={(nodeId: string, updatedData: Partial<AnyNode>) =>
            persistNodeUpdate(nodeId, updatedData as never)
          }
        />
      ) : (
        <CardSettingsSheet
          isOpen={state.isSettingsSheetOpen}
          onClose={onCloseSettingsSheet}
          cardId={state.settingsCardId}
          initialTab={state.settingsInitialTab}
          onSwitchToCard={onSwitchToCard}
        />
      )}

      <RelationshipSheet
        isOpen={state.isRelationshipSheetOpen}
        onClose={onCloseRelationshipSheet}
        relationshipId={state.relationshipSheetId}
        onSwitchToRelationship={onSwitchToRelationship}
      />
    </>
  );
}
