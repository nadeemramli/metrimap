// XState machine for managing dual-environment canvas (Practical/Design)
// This manages the complex state transitions between React Flow and Excalidraw environments

import { createMachine, assign } from "xstate";

// Canvas environment types
export type CanvasEnvironment = "practical" | "design";
export type NavigationTool = "move" | "hand" | "scale";
export type PracticalTool = "select" | "connect" | "pan" | "zoom";
export type DesignTool =
  | "hand"
  | "selection"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "freedraw"
  | "text"
  | "image"
  | "eraser";

// Canvas context interface
export interface CanvasContext {
  currentEnvironment: CanvasEnvironment;
  navigationTool: NavigationTool;
  practicalTool: PracticalTool;
  designTool: DesignTool;

  // Environment-specific states
  isWhiteboardActive: boolean;
  isPassthroughMode: boolean; // For space-bar panning in design mode
  keepToolActive: boolean;

  // Drawing preferences
  strokeColor?: string;
  strokeWidth?: number;

  // Viewport synchronization
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };

  // Collaboration state
  isCollaborationActive: boolean;
  collaborators: Array<{
    id: string;
    cursor?: { x: number; y: number };
    environment: CanvasEnvironment;
  }>;

  // Canvas data
  practicalNodes: any[];
  practicalEdges: any[];
  designElements: any[];
  designAppState: any;

  // Error state
  error?: string;
}

// Events that can be sent to the machine
export type CanvasEvent =
  | { type: "SWITCH_TO_PRACTICAL" }
  | { type: "SWITCH_TO_DESIGN" }
  | { type: "SET_NAVIGATION_TOOL"; tool: NavigationTool }
  | { type: "SET_PRACTICAL_TOOL"; tool: PracticalTool }
  | { type: "SET_DESIGN_TOOL"; tool: DesignTool }
  | { type: "ENABLE_PASSTHROUGH" }
  | { type: "DISABLE_PASSTHROUGH" }
  | { type: "TOGGLE_KEEP_TOOL_ACTIVE" }
  | { type: "SET_STROKE_COLOR"; color: string }
  | { type: "SET_STROKE_WIDTH"; width: number }
  | {
      type: "UPDATE_VIEWPORT";
      viewport: { x: number; y: number; zoom: number };
    }
  | {
      type: "ADD_COLLABORATOR";
      collaborator: { id: string; environment: CanvasEnvironment };
    }
  | { type: "REMOVE_COLLABORATOR"; collaboratorId: string }
  | { type: "UPDATE_PRACTICAL_DATA"; nodes: any[]; edges: any[] }
  | { type: "UPDATE_DESIGN_DATA"; elements: any[]; appState: any }
  | { type: "SYNCHRONIZE_ENVIRONMENTS" }
  | { type: "RESET_CANVAS" }
  | { type: "ERROR"; error: string }
  | { type: "CLEAR_ERROR" };

// Initial context
const initialContext: CanvasContext = {
  currentEnvironment: "practical",
  navigationTool: "move",
  practicalTool: "select",
  designTool: "selection",
  isWhiteboardActive: false,
  isPassthroughMode: false,
  keepToolActive: false,
  viewport: { x: 0, y: 0, zoom: 1 },
  isCollaborationActive: false,
  collaborators: [],
  practicalNodes: [],
  practicalEdges: [],
  designElements: [],
  designAppState: {},
};

// Canvas state machine
export const canvasMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAFQEkB5AVQFEBtABgF1FQAHAPawCAF0L8QAD0QBaAOwB2WQBYAjPPkAOeeQGYFAdnUB6ASDlKKigGwBWEztxKQqMRB3gAXBhA8eABYSi8+Pf4Aygl5BF0FYOdnX3kE4yMXACgEUwgcEwCsHx8rW3tHWAw7I0QAMyNMzKsUpNyXJLyXIpNrFGd3fVR3fQNAuPc6xWcclyC9RGNfZODI2LGLSCt7PDQ-Aggy-U6O7t6+wcJh0fHJkZnLOedEAx9kzpKypOTz5LSLgpxRSKZT+OSyZSHdqaA6-MDTY7+dT3XQLMJ7B5OGGo-YrCGwy5IrYhHZOAKyFSqR6vdyuJz+FzMwjsxRIjQyFwaV4KV56PLHQqIhKwLHwyE0o4EjFOOGoxFOQHJMByOTEjQ0rQKFpuFEuFryFn+QJMzrynRktyinTaRJyvKuJR0xWqyJhCJRTKw6kzDIKQFKBnhE2uZwKNqGuwI5QKSJ7SK9S1YnWJOUhUIuCUyvVMrQuyWEzKeTQaZTyg2uo3ek3wy2LdYhG14xMJ1PJKOZhleUFBvNqIu2+R3EKl9oyeQKXwKdTy4LudT5YKqZQN5tNVrD4tBaKt0MJhNJlOj1ZLDLOIFSyKGUFg7eXOmZVzc-l2vmOLO8hdSJdO4KHxP7mRQKNAcKQfJAXQgdMwyGCNJmgRJOWnHRzkRO11B0A4dFyLQXDceE-w3UEIV0FxdFuJ49weRMjSNVJJhvRJqXZfR6VdAdkgcDwlBcNDzktJwlEFIJrSo2idwDQiL2Iq9rybFl3FrdoSVyOlKSwxQwl9FwFGUe5ZBUZwFxgjQV0VIIlG0eE8O3GNQ3De8I0TFMVKjdM-xaQFEk-Lt8gKKlECwlsglkJ4Z0VRBmWgyVV1zfND1TLN30-dkfz8HSuLZBLCMaPJwg+IySPSSzxgwsw3DvZ8M2TSMHKi5yYoc7MnPC8LCJbb8PmHCxAJUYlkqyOsAu9NodEyzLhMgUSYufOLMuci8c0vD8vOwn8kpnNxEOKQqSvbdk9Aa3dmt3VrE2TFNeuixqutczrkuiWbBPHOb5MnYI8hUOTCJ6LQgwOaD5CgxRFHBNRgv0IrSIW+bv0c38AtikCKKWu9QIotQZrdfbjsOwq9t3Pa7EI8SipOo6DqUo6J1Ok7xzOwQsL0LQFo0RV4XBOU8LBIJxdBfTJtNa+Hvp2s97rOqNksup7hOLdHKL+ljivIjRzr+zRwi8D4FZ6DcZb4h6jNOqz3r8z6KfB4mXsGECdvKfQCvU6mdZKD5wfcZGhoxqaJZl1c5cJomfoNvb3xS9KufOjzqM8ZIAWHfJCOVpQEJ0z5duVjyGJe1G3ueg2TdWs39vpwrK3AraQNUEo4SyBSdC0QMdAyR5+0xzt6cDu3nfe9m2YtrQcf0Jm2xZMIEV0FmAjgpc6Q97RNHNKKWwBz2vrFoPvPM9vkZNZz9nI-2H4Wm24LnWrcsI9BzjAJQJpG4pNVrN7r42jBJzomv3UO19N7JCBNzC6bZ3DsnkESR6o4KgwQcNBN64J6iwmKA4LohQfhgOgvfP+IC75w1Wl4e+7s9K7gkOzU8ndODiAgWlSW6MZwFBrFOZhPo6EQN-lAy4sgnAZBuEwl0LAFyYOUAhGCz4g6YOAfbAqOhbg8h0HBFGdxrjeD0HkFQ6IMjeHyCo7REj8GyPevI5RAjFHfgKk+YWQF7j7FuLIK4ykULAQLJAa4Sg7j1k0GUGhzZNEaOiOI1RmiLHbw6gYgJRiRZ-goUYoJOC+r5R7LfJJKJNxjh0HTYmGSJ7SLNnI8BXUHGKJ9KBFw-xKT6GcOpJo5ScG0iMXUExJAgnBOcRbfR0gDHpLVok7WKT0kEwyVkkJoFaZHhODfHJGJgqSCpOo2cOhVJ0j8TfQpVSanKOgTnfJ9T3H2LAbowWGgJDyAOPCDQwJYTjkePiPJeS1F5IMWY-RjiQDGNMa8qOx5AQXHAtCLo6hsJGwUfkSkeg-h5CyXstZ6zdnwwaY4sFryCmHKxiHBpGgoRdyqGVCWlT9EGyqapfYWhuiAlVqPOlzy8WsteSQ0l8znSfJctA0kUCCTZOLKCE4-SxUjIKWoO+0qxmmOhcKiyHzyrTnOS5HEVkwTXGnCCJEhRrjFj3AUYsIJiwfPuNKyl8rGWsLacXc5Ii27qMleq9xWqtVXOsdqjOGLNJBWSJcDo+jdAFjBJq9QWTglnIKdq9p3KbJGpsaQyVjkJXaA7PoTdJ4tAgmOOlJ4Ohmxoqlfkmt-LHWGLFSQ1t8KkKmIdHyHQcF-wTgKGCJWqRtIFG+FkfQhZZAJqUYm-Nhz-WOuFSqstkrxnKi+LCKyQILhJFVrcbQKMmQjl0LBYl1b42oq1eGr5UalUGPLYfA6hk8hy0OPOEsoJwfC3UFyawMIEY0XfEbCtg6LYgqvpq9OWrtH5oPbsXOl6m2ym1rBMdcEPgGU-HWnkSMkTJTQQ+rqfSy58NvuI2g6p76pUdqNcCeEqZNDFmyWUDGn5YJ2oKIrXsShVA1sA4BqDwHYOJKCHkfIxkyzWRkB8YsGQVAKD-ImbLCHxkbPVWBjZnyt3ztAKoG4sJcgZGHXzDo7o8g6D-NOBN6rRNLIo3s9DHzN30dXQJ5txLzJEQKq6Gda7jhpFTBOiXHGzkKrfUprF9bSNFvo0CneGSDFXqeLoKw8g4bKdIxp8ToQtOUZHSJj0HAXBaRfQLGl1Erl0pZCpxjdWWgLhxCiJGsY1YAmOdJidyWdNXqEy58Tk6+D4K6dSbJnNa27kfKWyxD7n35F8EbTl4RYxYtHRaJr3HnCOE3JcGz1zms+q7VJuTfbWtuYazOo0Q4K1VB+MBc5EE4zMQUJ1+zo67Mubk15hTamJP-mSp8MrC7K2Ahe+-c5O29DxgxrFFa6FEjAq67xqF1t4v9d9Wpp0VQHjwhhNsw8JkJyFGKMWYonQXqZGgil5jqKVP5vVfN77D66VabOa8LI7Qc2Oig+mhk0gKxpBdE-PQ2ghTQYUGvGbwEDt6mIQCMrBMjjjNh8PCX6ukm0lPHYCKp+jPYLDKBcKzHJGJswQlnD4TaAw6waWyA1YfLB2pz7p29tQe7+PVtAMAVq2g-lFCPKoAs+w1nZXBKzEFzGhzDo2ikhCEgLhvAAr3Yk6XZdOCuH7s41aKlWuUJr9k-Hj3tWn7OFNaR0DlH6mjwY6rTmq5YMH66IvfuHEgF8WW-xayghtq8Q4qZKSFPZ1X+uNfe8N5fBAkT0-n4+BHjJwsKTJGUSGsAJJQ+HG7Bn7IHFg-E5QZxazyC5jfHUjQwJ0lB9B5DKCKN-D-YSA-Azc-YCMRbyOQHsHdJZa3OZIfAQP5MQQFKfEWfJfJGWaWfJXLNhFhQLQ4VQ6yNQ4uTQnlXlWqBlO8VqYENg8dKwJCBQRwFQT4RSczK8WzB8KmJQZg9Q3zUWCmBCVyYrNyUEXCdyefEJdyWrU-B-H-KeRyFOZrKyEoO4SFY-aLBKJmN4CAkKLnM5S9c+bzerc9H7YAlQQHK2KwTNYHYAp9MPeJGPe3JhZSTuFyB5DJL4PwfwfJJGOCYqA3fkAhRJEhO3bJJLRxDzCyfbQLGPaeTg9TG+Z8MdDcKoQNRcaDbKSwIo8mEo8gMozXPyezNOBvSPBuaoKKfI9rPI4Bb1YjU-P1PkOqZ4FwGhQDGDAJLcUqLcWCNGQ8WsVrCWOjNFa9NuSyZQPg1BOkLHa4L4UEcrbLF3MRaPC1PVQQT8L4P-UrEw-5M-ZrVYoQu-KWfJJGFGUTfJSfaDWrO8Y1YEpbBnBTJLMbZ3NqKKAKWAzsAYh-arQgaWSffAyyYcyyNyVqVCEfQNBCPuOwvuSfJWZU9zTUyYn4zdMdErczfzLQwLO1OdWKOyO4FTZnVhN6YDKQ4Y-gxJEY6yYCKyVyTyd4W+Q-G8R-GrDlN-KA4LZzGwOzb-ZzJU9YzQho+AvUzfTo01PbD0lnE7SJGVHQkHMLMLEotY9AjY5YpJezDyFwOCdQ9-K4y7N-UJD-MWAhJUwol8KlFzYhKJAfX4cKEhGVCVOsIqAqAAA */
  id: "canvas",

  context: initialContext,

  initial: "practical",

  states: {
    practical: {
      id: "practical",
      entry: assign({
        currentEnvironment: "practical",
        isWhiteboardActive: false,
      }),

      on: {
        SWITCH_TO_DESIGN: {
          target: "design",
          actions: assign({
            isWhiteboardActive: true,
          }),
        },

        SET_PRACTICAL_TOOL: {
          actions: assign({
            practicalTool: ({ event }) => event.tool,
          }),
        },

        SET_NAVIGATION_TOOL: {
          actions: assign({
            navigationTool: ({ event }) => event.tool,
          }),
        },

        UPDATE_PRACTICAL_DATA: {
          actions: assign({
            practicalNodes: ({ event }) => event.nodes,
            practicalEdges: ({ event }) => event.edges,
          }),
        },
      },

      states: {
        idle: {},
        selecting: {},
        connecting: {},
        panning: {},
        zooming: {},
      },

      initial: "idle",
    },

    design: {
      id: "design",
      entry: assign({
        currentEnvironment: "design",
        isWhiteboardActive: true,
      }),

      on: {
        SWITCH_TO_PRACTICAL: {
          target: "practical",
          actions: assign({
            isWhiteboardActive: false,
            isPassthroughMode: false,
          }),
        },

        SET_DESIGN_TOOL: {
          actions: assign({
            designTool: ({ event }) => event.tool,
          }),
        },

        ENABLE_PASSTHROUGH: {
          actions: assign({
            isPassthroughMode: true,
          }),
        },

        DISABLE_PASSTHROUGH: {
          actions: assign({
            isPassthroughMode: false,
          }),
        },

        TOGGLE_KEEP_TOOL_ACTIVE: {
          actions: assign({
            keepToolActive: ({ context }) => !context.keepToolActive,
          }),
        },

        SET_STROKE_COLOR: {
          actions: assign({
            strokeColor: ({ event }) => event.color,
          }),
        },

        SET_STROKE_WIDTH: {
          actions: assign({
            strokeWidth: ({ event }) => event.width,
          }),
        },

        UPDATE_DESIGN_DATA: {
          actions: assign({
            designElements: ({ event }) => event.elements,
            designAppState: ({ event }) => event.appState,
          }),
        },
      },

      states: {
        idle: {},
        drawing: {},
        selecting: {},
        passthrough: {
          // For space-bar panning mode
        },
      },

      initial: "idle",
    },

    synchronizing: {
      // State for syncing data between environments
      on: {
        SYNCHRONIZE_ENVIRONMENTS: {
          // Custom logic for syncing data
        },
      },
    },

    error: {
      entry: assign({
        error: ({ event }) =>
          event.type === "ERROR" ? event.error : "Unknown error",
      }),

      on: {
        CLEAR_ERROR: {
          target: "practical",
          actions: assign({
            error: undefined,
          }),
        },
      },
    },
  },

  on: {
    UPDATE_VIEWPORT: {
      actions: assign({
        viewport: ({ event }) => event.viewport,
      }),
    },

    ADD_COLLABORATOR: {
      actions: assign({
        collaborators: ({ context, event }) => [
          ...context.collaborators,
          event.collaborator,
        ],
        isCollaborationActive: true,
      }),
    },

    REMOVE_COLLABORATOR: {
      actions: assign({
        collaborators: ({ context, event }) =>
          context.collaborators.filter((c) => c.id !== event.collaboratorId),
        isCollaborationActive: ({ context, event }) =>
          context.collaborators.filter((c) => c.id !== event.collaboratorId)
            .length > 0,
      }),
    },

    RESET_CANVAS: {
      actions: assign(initialContext),
    },

    ERROR: {
      target: ".error",
    },
  },
});

// Type for the machine service
export type CanvasService = typeof canvasMachine;

// Selector functions for common state queries
export const selectors = {
  getCurrentEnvironment: (state: any) => state.context.currentEnvironment,
  isInPracticalMode: (state: any) =>
    state.context.currentEnvironment === "practical",
  isInDesignMode: (state: any) => state.context.currentEnvironment === "design",
  isWhiteboardActive: (state: any) => state.context.isWhiteboardActive,
  isPassthroughMode: (state: any) => state.context.isPassthroughMode,
  getCurrentTool: (state: any) =>
    state.context.currentEnvironment === "practical"
      ? state.context.practicalTool
      : state.context.designTool,
  getViewport: (state: any) => state.context.viewport,
  getCollaborators: (state: any) => state.context.collaborators,
  hasError: (state: any) => !!state.context.error,
  getError: (state: any) => state.context.error,
};
