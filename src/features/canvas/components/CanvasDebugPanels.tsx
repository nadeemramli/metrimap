/**
 * Canvas Debug Panels
 * Development-only debug information and navigation controls
 */

import { Button } from '@/shared/components/ui/button';
import type { CanvasPageState } from '@/shared/hooks/useCanvasPageState';
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';
import { Panel } from '@xyflow/react';
import { Bug, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

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

  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Development Debug Info - Combined Panel (development only) */}
      {isDevelopment &&
        (isOpen ? (
          <Panel
            position="top-left"
            className="bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="font-semibold">🐛 Debug State</div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-md hover:bg-white/10"
                  title="Collapse"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-md hover:bg-white/10"
                  title="Close"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div>Selected Nodes: {selectedNodeIds.length}</div>
            <div>Selected Groups: {state.selectedGroupIds.length}</div>
            <div>Total Nodes: {canvas?.nodes?.length || 0}</div>
            <div>Total Groups: {canvas?.groups?.length || 0}</div>
            <div className="mt-2 text-yellow-300">
              Shift+Click should work for multi-selection
            </div>
          </Panel>
        ) : (
          <Panel position="top-left" className="bg-black/60 p-1 rounded-md">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 px-2 py-1 rounded-md text-xs flex items-center gap-1"
              title="Open Debug State"
              onClick={() => setIsOpen(true)}
            >
              <Bug className="h-3.5 w-3.5" />
              <span>Debug</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </Panel>
        ))}

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
