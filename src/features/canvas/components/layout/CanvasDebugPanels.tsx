/**
 * Canvas Debug Panels
 * Development-only debug information and navigation controls
 */

import type { CanvasPageState } from '@/features/canvas/hooks/useCanvasPageState';
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';
import { Panel } from '@xyflow/react';

interface CanvasDebugPanelsProps {
  state: CanvasPageState;
  selectedNodeIds: string[];
  canvas?: any;
  isDevelopment: boolean;
}

export default function CanvasDebugPanels({
  state,
  selectedNodeIds,
  canvas,
  isDevelopment,
}: CanvasDebugPanelsProps) {
  if (!isDevelopment && !isDevelopmentEnvironment()) {
    return null;
  }

  return (
    <>
      {/* Development Debug Info - Combined Panel (development only) */}
      {isDevelopment && (
        <Panel
          position="top-left"
          className="bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs"
        >
          <div className="font-semibold mb-2">🐛 Debug State</div>
          <div>Selected Nodes: {selectedNodeIds.length}</div>
          <div>Selected Groups: {state.selectedGroupIds.length}</div>
          <div>Total Nodes: {canvas?.nodes?.length || 0}</div>
          <div>Total Groups: {canvas?.groups?.length || 0}</div>
          <div className="mt-2 text-yellow-300">
            Shift+Click should work for multi-selection
          </div>
        </Panel>
      )}

      {/* Navigation Controls - Inside ReactFlow Panel (development only) */}
      {isDevelopmentEnvironment() && (
        <Panel
          position="bottom-right"
          className="bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs"
        >
          <div className="font-semibold mb-2">🎮 Navigation Controls</div>
          <div className="space-y-1">
            <div>
              <kbd className="bg-gray-600 px-1 rounded">Shift</kbd> + scroll =
              Zoom
            </div>
            <div>
              <kbd className="bg-gray-600 px-1 rounded">Space</kbd> + drag = Pan
              canvas
            </div>
            <div>
              <kbd className="bg-gray-600 px-1 rounded">Scroll</kbd> = Pan
              up/down
            </div>
            <div>
              <kbd className="bg-gray-600 px-1 rounded">Shift</kbd> + drag =
              Multi-select
            </div>
          </div>
          <div className="mt-2 text-yellow-300">
            Mode: {state.toolbarMode === 'draw' ? '🎨 Draw' : '🔧 Edit'}
            {state.isTransitioning && ' | ⏳ Transitioning...'}
          </div>
        </Panel>
      )}
    </>
  );
}
