import {
  canvasMachine,
  type CanvasEnvironment,
  type DesignTool,
  type NavigationTool,
  type PracticalTool,
} from '@/lib/machines/canvasMachine';
import { useMachine } from '@xstate/react';
import { useMemo } from 'react';

/**
 * Canvas state machine hook
 * Provides a typed facade for CanvasPage and related components
 */
export function useCanvasStateMachine() {
  const [state, send] = useMachine(canvasMachine);

  const api = useMemo(() => {
    return {
      // Raw accessors
      state,
      send,

      // Selectors
      get currentEnvironment(): CanvasEnvironment {
        return state.context.currentEnvironment;
      },
      get isInPracticalMode(): boolean {
        return state.context.currentEnvironment === 'practical';
      },
      get isInDesignMode(): boolean {
        return state.context.currentEnvironment === 'design';
      },
      get isWhiteboardActive(): boolean {
        return state.context.isWhiteboardActive;
      },
      get isPassthroughMode(): boolean {
        return state.context.isPassthroughMode;
      },
      get keepToolActive(): boolean {
        return state.context.keepToolActive;
      },
      get navigationTool(): NavigationTool {
        return state.context.navigationTool;
      },
      get practicalTool(): PracticalTool {
        return state.context.practicalTool;
      },
      get designTool(): DesignTool {
        return state.context.designTool;
      },
      get viewport() {
        return state.context.viewport;
      },
      get strokeColor(): string | undefined {
        return state.context.strokeColor;
      },
      get strokeWidth(): number | undefined {
        return state.context.strokeWidth;
      },
      get currentTool(): string {
        return state.context.currentEnvironment === 'practical'
          ? state.context.practicalTool
          : state.context.designTool;
      },
      get collaborators() {
        return state.context.collaborators;
      },
      get isCollaborationActive(): boolean {
        return state.context.isCollaborationActive;
      },
      get practicalNodes() {
        return state.context.practicalNodes;
      },
      get practicalEdges() {
        return state.context.practicalEdges;
      },
      get designElements() {
        return state.context.designElements;
      },
      get designAppState() {
        return state.context.designAppState;
      },
      get error(): string | undefined {
        return state.context.error;
      },
      get hasError(): boolean {
        return Boolean(state.context.error);
      },

      // Environment switches (used by CanvasPage)
      switchToPractical() {
        send({ type: 'SWITCH_TO_PRACTICAL' });
      },
      switchToDesign() {
        send({ type: 'SWITCH_TO_DESIGN' });
      },

      // Tooling
      setNavigationTool(tool: NavigationTool) {
        send({ type: 'SET_NAVIGATION_TOOL', tool });
      },
      setPracticalTool(tool: PracticalTool) {
        send({ type: 'SET_PRACTICAL_TOOL', tool });
      },
      setDesignTool(tool: DesignTool) {
        send({ type: 'SET_DESIGN_TOOL', tool });
      },
      toggleKeepToolActive() {
        send({ type: 'TOGGLE_KEEP_TOOL_ACTIVE' });
      },

      // Drawing prefs
      setStrokeColor(color: string) {
        send({ type: 'SET_STROKE_COLOR', color });
      },
      setStrokeWidth(width: number) {
        send({ type: 'SET_STROKE_WIDTH', width });
      },

      // Passthrough (space-bar pan)
      enablePassthrough() {
        send({ type: 'ENABLE_PASSTHROUGH' });
      },
      disablePassthrough() {
        send({ type: 'DISABLE_PASSTHROUGH' });
      },

      // Viewport & data
      updateViewport(viewport: { x: number; y: number; zoom: number }) {
        send({ type: 'UPDATE_VIEWPORT', viewport });
      },
      updatePracticalData(nodes: any[], edges: any[]) {
        send({ type: 'UPDATE_PRACTICAL_DATA', nodes, edges });
      },
      updateDesignData(elements: any[], appState: any) {
        send({ type: 'UPDATE_DESIGN_DATA', elements, appState });
      },
      synchronizeEnvironments() {
        send({ type: 'SYNCHRONIZE_ENVIRONMENTS' });
      },

      // Collaboration
      addCollaborator(collaborator: {
        id: string;
        environment: CanvasEnvironment;
      }) {
        send({ type: 'ADD_COLLABORATOR', collaborator });
      },
      removeCollaborator(collaboratorId: string) {
        send({ type: 'REMOVE_COLLABORATOR', collaboratorId });
      },

      // Error & lifecycle
      setError(error: string) {
        send({ type: 'ERROR', error });
      },
      clearError() {
        send({ type: 'CLEAR_ERROR' });
      },
      resetCanvas() {
        send({ type: 'RESET_CANVAS' });
      },
    };
  }, [state, send]);

  return api;
}
