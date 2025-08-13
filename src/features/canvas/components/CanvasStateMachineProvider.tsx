// Canvas State Machine Provider - Feature structure implementation
import { useCanvasStateMachine } from '@/features/canvas/hooks/useCanvasStateMachine';
import React, { createContext, useContext, useEffect } from 'react';

type CanvasStateMachineHook = ReturnType<typeof useCanvasStateMachine>;

const CanvasStateMachineContext = createContext<CanvasStateMachineHook | null>(
  null
);

export interface CanvasStateMachineProviderProps {
  children: React.ReactNode;
  canvasId?: string;
  onEnvironmentChange?: (environment: 'practical' | 'design') => void;
  onError?: (error: string) => void;
}

export function CanvasStateMachineProvider({
  children,
  canvasId,
  onEnvironmentChange,
  onError,
}: CanvasStateMachineProviderProps) {
  const stateMachine = useCanvasStateMachine();

  useEffect(() => {
    if (onEnvironmentChange) {
      onEnvironmentChange(stateMachine.currentEnvironment);
    }
  }, [stateMachine.currentEnvironment, onEnvironmentChange]);

  useEffect(() => {
    if (stateMachine.hasError && onError) {
      onError(stateMachine.error || 'Unknown canvas error');
    }
  }, [stateMachine.hasError, stateMachine.error, onError]);

  return (
    <CanvasStateMachineContext.Provider value={stateMachine}>
      {children}
    </CanvasStateMachineContext.Provider>
  );
}

export function useCanvasStateMachineContext(): CanvasStateMachineHook {
  const context = useContext(CanvasStateMachineContext);
  if (!context) {
    throw new Error(
      'useCanvasStateMachineContext must be used within a CanvasStateMachineProvider'
    );
  }
  return context;
}

// Legacy compatibility hook - mirrors pre-refactor state API
export function useLegacyCanvasState() {
  const machine = useCanvasStateMachineContext();

  return {
    toolbarMode: machine.currentEnvironment === 'practical' ? 'edit' : 'draw',
    setToolbarMode: (mode: 'edit' | 'draw') => {
      if (mode === 'edit') machine.switchToPractical();
      else machine.switchToDesign();
    },

    isWhiteboardActive: machine.isWhiteboardActive,
    setIsWhiteboardActive: (active: boolean) => {
      if (active) machine.switchToDesign();
      else machine.switchToPractical();
    },

    navigationTool: machine.navigationTool,
    setNavigationTool: machine.setNavigationTool,

    wbPassthrough: machine.isPassthroughMode,
    setWbPassthrough: (passthrough: boolean) => {
      if (passthrough) machine.enablePassthrough();
      else machine.disablePassthrough();
    },

    drawActiveTool: machine.designTool,
    setDrawActiveTool: machine.setDesignTool,

    drawStrokeColor: machine.strokeColor,
    setDrawStrokeColor: machine.setStrokeColor,
    drawStrokeWidth: machine.strokeWidth,
    setDrawStrokeWidth: machine.setStrokeWidth,

    keepToolActive: machine.keepToolActive,
    setKeepToolActive: (active: boolean) => {
      if (active !== machine.keepToolActive) machine.toggleKeepToolActive();
    },

    machine,
  };
}

export interface EnhancedToolbarProps {
  currentEnvironment: 'practical' | 'design';
  onSwitchEnvironment: (env: 'practical' | 'design') => void;
  activeTool: string;
  onSelectTool: (tool: string) => void;
  strokeColor?: string;
  strokeWidth?: number;
  onSetStrokeColor?: (color: string) => void;
  onSetStrokeWidth?: (width: number) => void;
  keepToolActive: boolean;
  onToggleKeepToolActive: () => void;
  collaborators: Array<{ id: string; environment: 'practical' | 'design' }>;
}

export function useEnhancedToolbarProps(): EnhancedToolbarProps {
  const machine = useCanvasStateMachineContext();

  return {
    currentEnvironment: machine.currentEnvironment,
    onSwitchEnvironment: (env) => {
      if (env === 'practical') machine.switchToPractical();
      else machine.switchToDesign();
    },
    activeTool: machine.currentTool,
    onSelectTool: (tool) => {
      if (machine.currentEnvironment === 'practical')
        machine.setPracticalTool(tool as any);
      else machine.setDesignTool(tool as any);
    },
    strokeColor: machine.strokeColor,
    strokeWidth: machine.strokeWidth,
    onSetStrokeColor: machine.setStrokeColor,
    onSetStrokeWidth: machine.setStrokeWidth,
    keepToolActive: machine.keepToolActive,
    onToggleKeepToolActive: machine.toggleKeepToolActive,
    collaborators: machine.collaborators,
  };
}

export function CanvasStateMachineDebug() {
  const machine = useCanvasStateMachineContext();
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background border rounded-lg shadow-lg max-w-sm">
      <h3 className="font-semibold mb-2">Canvas State Machine (Debug)</h3>
      <div className="space-y-1 text-sm">
        <div>
          Environment: <strong>{machine.currentEnvironment}</strong>
        </div>
        <div>
          Tool: <strong>{machine.currentTool}</strong>
        </div>
        <div>
          Whiteboard:{' '}
          <strong>{machine.isWhiteboardActive ? 'Active' : 'Inactive'}</strong>
        </div>
        <div>
          Passthrough:{' '}
          <strong>{machine.isPassthroughMode ? 'On' : 'Off'}</strong>
        </div>
        <div>
          Keep Tool: <strong>{machine.keepToolActive ? 'On' : 'Off'}</strong>
        </div>
        <div>
          Stroke:{' '}
          <strong>
            {machine.strokeColor} / {machine.strokeWidth}px
          </strong>
        </div>
        <div>
          Collaborators: <strong>{machine.collaborators.length}</strong>
        </div>
        {machine.hasError && (
          <div className="text-destructive">Error: {machine.error}</div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={machine.switchToPractical}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
        >
          Practical
        </button>
        <button
          onClick={machine.switchToDesign}
          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
        >
          Design
        </button>
        {machine.hasError && (
          <button
            onClick={machine.clearError}
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
          >
            Clear Error
          </button>
        )}
      </div>
    </div>
  );
}
