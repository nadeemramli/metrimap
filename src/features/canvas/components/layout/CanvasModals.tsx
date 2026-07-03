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
import { TaskPanel } from '@/features/canvas/components/panels/task-panel/TaskPanel';
import { ValueContextPanel } from '@/features/canvas/components/panels/value-panel/ValueContextPanel';
import type { CanvasPageState } from '@/features/canvas/hooks/useCanvasPageState';
import { useCanvasStore } from '@/lib/stores';
import type { MetricCard } from '@/shared/types';

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

  const currentNode = state.settingsCardId
    ? (getNodeById(state.settingsCardId) as MetricCard | undefined)
    : undefined;

  // The detail panel is chosen by the card's CATEGORY, not the React-Flow node
  // type (persisted Action/Value/Hypothesis nodes are all `metricCard` rows).
  // Each node type serves a different purpose, so each gets its own panel.
  const category = currentNode?.category;
  const isTask =
    category === 'Work/Action' || category === 'Ideas/Hypothesis';
  const isValue = category === 'Core/Value';

  return (
    <>
      {isTask ? (
        <TaskPanel
          cardId={state.settingsCardId}
          isOpen={state.isSettingsSheetOpen}
          onClose={onCloseSettingsSheet}
        />
      ) : isValue ? (
        <ValueContextPanel
          cardId={state.settingsCardId}
          isOpen={state.isSettingsSheetOpen}
          onClose={onCloseSettingsSheet}
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
