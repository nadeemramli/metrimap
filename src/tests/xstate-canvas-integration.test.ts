import { beforeEach, describe, expect, it } from 'vitest';
import { createActor, type ActorRefFrom } from 'xstate';
import { canvasMachine, selectors } from '../lib/machines/canvasMachine';

describe('XState Canvas Integration Tests', () => {
  let actor: ActorRefFrom<typeof canvasMachine>;

  beforeEach(() => {
    actor = createActor(canvasMachine);
    actor.start();
  });

  describe('Environment Switching', () => {
    it('should start in practical mode', () => {
      const snapshot = actor.getSnapshot();
      expect(selectors.getCurrentEnvironment(snapshot)).toBe('practical');
      expect(selectors.isInPracticalMode(snapshot)).toBe(true);
      expect(selectors.isInDesignMode(snapshot)).toBe(false);
      expect(selectors.isWhiteboardActive(snapshot)).toBe(false);
    });

    it('should switch to design mode', () => {
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      const snapshot = actor.getSnapshot();

      expect(selectors.getCurrentEnvironment(snapshot)).toBe('design');
      expect(selectors.isInDesignMode(snapshot)).toBe(true);
      expect(selectors.isInPracticalMode(snapshot)).toBe(false);
      expect(selectors.isWhiteboardActive(snapshot)).toBe(true);
    });

    it('should switch back to practical mode', () => {
      // Switch to design first
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      // Then back to practical
      actor.send({ type: 'SWITCH_TO_PRACTICAL' });

      const snapshot = actor.getSnapshot();
      expect(selectors.getCurrentEnvironment(snapshot)).toBe('practical');
      expect(selectors.isWhiteboardActive(snapshot)).toBe(false);
      expect(selectors.isPassthroughMode(snapshot)).toBe(false);
    });
  });

  describe('Tool Management', () => {
    it('should set navigation tool', () => {
      actor.send({ type: 'SET_NAVIGATION_TOOL', tool: 'hand' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.context.navigationTool).toBe('hand');
    });

    it('should set practical tool in practical mode', () => {
      actor.send({ type: 'SET_PRACTICAL_TOOL', tool: 'connect' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.context.practicalTool).toBe('connect');
      expect(selectors.getCurrentTool(snapshot)).toBe('connect');
    });

    it('should set design tool in design mode', () => {
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      actor.send({ type: 'SET_DESIGN_TOOL', tool: 'rectangle' });
      const snapshot = actor.getSnapshot();

      expect(snapshot.context.designTool).toBe('rectangle');
      expect(selectors.getCurrentTool(snapshot)).toBe('rectangle');
    });
  });

  describe('Passthrough Mode', () => {
    it('should enable passthrough in design mode', () => {
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      actor.send({ type: 'ENABLE_PASSTHROUGH' });

      const snapshot = actor.getSnapshot();
      expect(selectors.isPassthroughMode(snapshot)).toBe(true);
    });

    it('should disable passthrough when switching to practical', () => {
      // Enable passthrough in design mode
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      actor.send({ type: 'ENABLE_PASSTHROUGH' });

      // Switch back to practical
      actor.send({ type: 'SWITCH_TO_PRACTICAL' });

      const snapshot = actor.getSnapshot();
      expect(selectors.isPassthroughMode(snapshot)).toBe(false);
    });
  });

  describe('Drawing Preferences', () => {
    it('should set stroke color', () => {
      actor.send({ type: 'SET_STROKE_COLOR', color: '#ff0000' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.context.strokeColor).toBe('#ff0000');
    });

    it('should set stroke width', () => {
      actor.send({ type: 'SET_STROKE_WIDTH', width: 5 });
      const snapshot = actor.getSnapshot();
      expect(snapshot.context.strokeWidth).toBe(5);
    });

    it('should toggle keep tool active', () => {
      // Initially false
      expect(actor.getSnapshot().context.keepToolActive).toBe(false);

      // Toggle to true
      actor.send({ type: 'TOGGLE_KEEP_TOOL_ACTIVE' });
      expect(actor.getSnapshot().context.keepToolActive).toBe(true);

      // Toggle back to false
      actor.send({ type: 'TOGGLE_KEEP_TOOL_ACTIVE' });
      expect(actor.getSnapshot().context.keepToolActive).toBe(false);
    });
  });

  describe('Viewport Management', () => {
    it('should update viewport', () => {
      const newViewport = { x: 100, y: 200, zoom: 1.5 };
      actor.send({ type: 'UPDATE_VIEWPORT', viewport: newViewport });

      const snapshot = actor.getSnapshot();
      expect(selectors.getViewport(snapshot)).toEqual(newViewport);
    });
  });

  describe('Data Management', () => {
    it('should update practical data', () => {
      const nodes = [{ id: '1', type: 'metric' }];
      const edges = [{ id: '1', source: '1', target: '2' }];

      actor.send({ type: 'UPDATE_PRACTICAL_DATA', nodes, edges });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.practicalNodes).toEqual(nodes);
      expect(snapshot.context.practicalEdges).toEqual(edges);
    });

    it('should update design data', () => {
      const elements = [{ id: '1', type: 'rectangle' }];
      const appState = { theme: 'dark' };

      actor.send({ type: 'UPDATE_DESIGN_DATA', elements, appState });

      const snapshot = actor.getSnapshot();
      expect(snapshot.context.designElements).toEqual(elements);
      expect(snapshot.context.designAppState).toEqual(appState);
    });
  });

  describe('Collaboration', () => {
    it('should add collaborator', () => {
      const collaborator = { id: 'user1', environment: 'practical' as const };
      actor.send({ type: 'ADD_COLLABORATOR', collaborator });

      const snapshot = actor.getSnapshot();
      expect(selectors.getCollaborators(snapshot)).toContain(collaborator);
      expect(snapshot.context.isCollaborationActive).toBe(true);
    });

    it('should remove collaborator', () => {
      // Add collaborator first
      const collaborator = { id: 'user1', environment: 'practical' as const };
      actor.send({ type: 'ADD_COLLABORATOR', collaborator });

      // Remove collaborator
      actor.send({ type: 'REMOVE_COLLABORATOR', collaboratorId: 'user1' });

      const snapshot = actor.getSnapshot();
      expect(selectors.getCollaborators(snapshot)).not.toContain(collaborator);
      expect(snapshot.context.isCollaborationActive).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle error state', () => {
      actor.send({ type: 'ERROR', error: 'Test error' });

      const snapshot = actor.getSnapshot();
      expect(selectors.hasError(snapshot)).toBe(true);
      expect(selectors.getError(snapshot)).toBe('Test error');
    });

    it('should clear error and return to practical mode', () => {
      // Trigger error
      actor.send({ type: 'ERROR', error: 'Test error' });
      // Clear error
      actor.send({ type: 'CLEAR_ERROR' });

      const snapshot = actor.getSnapshot();
      expect(selectors.hasError(snapshot)).toBe(false);
      expect(selectors.getError(snapshot)).toBeUndefined();
      expect(selectors.getCurrentEnvironment(snapshot)).toBe('practical');
    });
  });

  describe('Canvas Reset', () => {
    it('should reset to initial state', () => {
      // Make some changes
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      actor.send({ type: 'SET_STROKE_COLOR', color: '#ff0000' });
      actor.send({ type: 'TOGGLE_KEEP_TOOL_ACTIVE' });

      // Reset
      actor.send({ type: 'RESET_CANVAS' });

      const snapshot = actor.getSnapshot();
      expect(selectors.getCurrentEnvironment(snapshot)).toBe('practical');
      expect(snapshot.context.strokeColor).toBeUndefined();
      expect(snapshot.context.keepToolActive).toBe(false);
    });
  });
});

describe('Canvas State Machine Performance', () => {
  it('should handle rapid environment switching', () => {
    const actor = createActor(canvasMachine);
    actor.start();

    const startTime = performance.now();

    // Rapid switching
    for (let i = 0; i < 100; i++) {
      actor.send({ type: 'SWITCH_TO_DESIGN' });
      actor.send({ type: 'SWITCH_TO_PRACTICAL' });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete in reasonable time (< 100ms)
    expect(duration).toBeLessThan(100);

    // Should end in practical mode
    const snapshot = actor.getSnapshot();
    expect(selectors.getCurrentEnvironment(snapshot)).toBe('practical');
  });

  it('should handle many collaborators efficiently', () => {
    const actor = createActor(canvasMachine);
    actor.start();

    const startTime = performance.now();

    // Add many collaborators
    for (let i = 0; i < 50; i++) {
      actor.send({
        type: 'ADD_COLLABORATOR',
        collaborator: { id: `user${i}`, environment: 'practical' as const },
      });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete in reasonable time
    expect(duration).toBeLessThan(50);

    const snapshot = actor.getSnapshot();
    expect(selectors.getCollaborators(snapshot)).toHaveLength(50);
  });
});
