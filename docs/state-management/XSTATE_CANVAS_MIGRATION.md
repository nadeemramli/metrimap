# XState Canvas Migration Guide

This document outlines how to migrate the existing canvas implementation to use XState for better dual-environment state management.

## Overview

The current canvas has complex state management scattered across multiple useState calls and useEffect hooks. XState provides a cleaner, more predictable way to manage the transitions between Practical (React Flow) and Design (Excalidraw) environments.

## Architecture Benefits

### Before (Current State)

```typescript
// Multiple scattered state variables
const [navigationTool, setNavigationTool] = useState<"move" | "hand" | "scale">("move");
const [toolbarMode, setToolbarMode] = useState<"edit" | "draw">("edit");
const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
const [wbPassthrough, setWbPassthrough] = useState(false);
const [drawActiveTool, setDrawActiveTool] = useState<...>(undefined);
const [drawStrokeColor, setDrawStrokeColor] = useState<string | undefined>(undefined);
// ... many more state variables
```

### After (XState)

```typescript
// Centralized state machine
const {
  currentEnvironment,
  switchToPractical,
  switchToDesign,
  currentTool,
  isWhiteboardActive,
  // ... all state managed by machine
} = useCanvasStateMachine();
```

## Migration Steps

### Step 1: Install Dependencies (✅ Complete)

- ✅ `xstate` already installed
- ✅ `@xstate/react` installed

### Step 2: Create State Machine (✅ Complete)

- ✅ Created `src/lib/machines/canvasMachine.ts`
- ✅ Created `src/lib/hooks/useCanvasStateMachine.ts`
- ✅ Created example `src/components/canvas/EnhancedCanvasPage.tsx`

### Step 3: Gradual Migration Strategy

#### Phase 1: Side-by-side Implementation

1. Keep existing `CanvasPage.tsx` as main component
2. Add XState machine alongside existing state
3. Gradually replace state variables one by one

#### Phase 2: Tool Management Migration

```typescript
// Replace this:
const [navigationTool, setNavigationTool] = useState<"move" | "hand" | "scale">(
  "move"
);
const [toolbarMode, setToolbarMode] = useState<"edit" | "draw">("edit");

// With this:
const {
  currentEnvironment,
  setNavigationTool,
  switchToPractical,
  switchToDesign,
} = useCanvasStateMachine();
```

#### Phase 3: Whiteboard State Migration

```typescript
// Replace this:
const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
const [wbPassthrough, setWbPassthrough] = useState(false);
const [drawActiveTool, setDrawActiveTool] = useState(...);

// With this:
const {
  isWhiteboardActive,
  isPassthroughMode,
  enablePassthrough,
  disablePassthrough,
  setDesignTool
} = useCanvasStateMachine();
```

#### Phase 4: Event Handler Migration

```typescript
// Replace complex mode switching logic:
const onChangeMode = (m: "edit" | "draw") => {
  setToolbarMode(m);
  setIsWhiteboardActive(m === "draw");
  // ... other side effects
};

// With simple machine calls:
const handleModeChange = (mode: "practical" | "design") => {
  if (mode === "practical") {
    switchToPractical();
  } else {
    switchToDesign();
  }
};
```

### Step 4: Update Components

#### TopCanvasToolbar.tsx Updates

```typescript
// Update props interface
interface TopCanvasToolbarProps {
  // Replace individual props with machine hook
  canvasState: ReturnType<typeof useCanvasStateMachine>;
  // ... other props
}

// Inside component:
const {
  currentEnvironment,
  switchToPractical,
  switchToDesign,
  setDesignTool,
  currentTool,
} = canvasState;
```

#### WhiteboardOverlay.tsx Integration

```typescript
// No changes needed - just pass machine state
<WhiteboardOverlay
  isActive={isWhiteboardActive}
  passthrough={isPassthroughMode}
  onSceneChange={updateDesignData}
  // ... other props from machine
/>
```

## Implementation Guide

### 1. Add Machine to Existing CanvasPage

```typescript
// In CanvasPage.tsx
import { useCanvasStateMachine } from "@/lib/hooks/useCanvasStateMachine";

function CanvasPageInner() {
  // Add alongside existing state (gradual migration)
  const canvasStateMachine = useCanvasStateMachine();

  // Keep existing state for now
  const [navigationTool, setNavigationTool] = useState<
    "move" | "hand" | "scale"
  >("move");
  const [toolbarMode, setToolbarMode] = useState<"edit" | "draw">("edit");

  // Start using machine state where beneficial
  const {
    currentEnvironment,
    isWhiteboardActive: machineWhiteboardActive,
    switchToPractical,
    switchToDesign,
  } = canvasStateMachine;

  // Sync machine with existing state (temporary)
  useEffect(() => {
    if (toolbarMode === "edit" && currentEnvironment !== "practical") {
      switchToPractical();
    } else if (toolbarMode === "draw" && currentEnvironment !== "design") {
      switchToDesign();
    }
  }, [toolbarMode, currentEnvironment, switchToPractical, switchToDesign]);
}
```

### 2. Update Mode Switching Logic

```typescript
// Replace existing mode change handler
const onChangeMode = useCallback(
  (m: "edit" | "draw") => {
    if (m === "edit") {
      switchToPractical();
    } else {
      switchToDesign();
    }
    // Keep legacy state sync during migration
    setToolbarMode(m);
    setIsWhiteboardActive(m === "draw");
  },
  [switchToPractical, switchToDesign]
);
```

### 3. Migrate Keyboard Shortcuts

```typescript
// Update keyboard event handlers to use machine
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (currentEnvironment === "practical") {
        switchToDesign();
      } else {
        switchToPractical();
      }
    }

    // Design mode shortcuts
    if (currentEnvironment === "design") {
      switch (e.key) {
        case "v":
          setDesignTool("selection");
          break;
        case "h":
          setDesignTool("hand");
          break;
        // ... other shortcuts
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [currentEnvironment, switchToPractical, switchToDesign, setDesignTool]);
```

### 4. Data Synchronization

```typescript
// Sync React Flow data with machine
const handleNodesChange = useCallback(
  (changes: NodeChange[]) => {
    // Apply changes to React Flow
    setNodes((nds) => applyNodeChanges(changes, nds));

    // Update machine state
    updatePracticalData(nodes, edges);
  },
  [updatePracticalData, nodes, edges]
);

// Sync Excalidraw data with machine
const handleWhiteboardChange = useCallback(
  (scene: any) => {
    updateDesignData(scene.elements, scene.appState);

    // Keep existing persistence logic
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      // Save to database
      persistWhiteboardScene(scene);
    }, 500);
  },
  [updateDesignData]
);
```

## Testing Strategy

### 1. Feature Parity Testing

- [ ] Environment switching (Edit ↔ Draw)
- [ ] Tool selection in each environment
- [ ] Keyboard shortcuts
- [ ] Passthrough mode (Space bar)
- [ ] Viewport synchronization
- [ ] Data persistence

### 2. State Consistency Testing

- [ ] Machine state matches UI state
- [ ] No state conflicts between old and new systems
- [ ] Proper cleanup on unmount

### 3. Performance Testing

- [ ] No performance regression
- [ ] State updates are efficient
- [ ] Memory usage is acceptable

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**: Comment out machine usage, restore original state
2. **Partial Rollback**: Keep machine for specific features, revert others
3. **Feature Flag**: Add environment variable to toggle XState usage

```typescript
// Emergency rollback switch
const USE_XSTATE = process.env.VITE_USE_XSTATE === 'true';

function CanvasPageInner() {
  if (USE_XSTATE) {
    return <EnhancedCanvasPage />;
  }

  // Original implementation
  return <OriginalCanvasImplementation />;
}
```

## Collaboration Integration

The state machine is designed for future collaboration features:

```typescript
// Real-time collaboration hooks
const { addCollaborator, removeCollaborator, collaborators } =
  useCanvasStateMachine();

// Supabase realtime integration
useEffect(() => {
  const channel = supabase
    .channel(`canvas:${canvasId}`)
    .on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      // Update machine with collaborator data
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [canvasId, addCollaborator, removeCollaborator]);
```

## Benefits After Migration

1. **Predictable State**: All canvas state managed by a single machine
2. **Better Testing**: State machine can be tested independently
3. **Easier Debugging**: Visual state machine diagrams
4. **Future-Proof**: Easy to add new states and transitions
5. **Collaboration Ready**: Built-in support for multi-user scenarios
6. **Type Safety**: Full TypeScript support for all state transitions

## Next Steps

1. **Review the implementation**: Check `EnhancedCanvasPage.tsx` example
2. **Start migration**: Begin with Phase 1 (side-by-side)
3. **Test thoroughly**: Ensure feature parity at each step
4. **Gradual rollout**: Replace components one by one
5. **Monitor performance**: Watch for any regressions
6. **Full replacement**: Once stable, replace original implementation

The migration can be done incrementally to minimize risk while gaining the benefits of proper state management.
