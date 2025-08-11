# Canvas Store Refactoring Migration Guide

## 🎯 Overview

The Canvas Store has been refactored from a single 1,468-line file into modular, focused stores for better maintainability and testing.

## 📁 New Architecture

### Before (Single File)

```
src/lib/stores/canvasStore.ts (1,468 lines)
├── Node management
├── Edge management
├── Group management
├── Auto-save logic
├── Metric slicing
└── Canvas state
```

### After (Modular)

```
src/lib/stores/
├── canvas/
│   ├── useCanvasStore.ts      # Main orchestrator
│   └── metricSlicing.ts       # Dimension slicing utilities
├── nodes/
│   └── useNodeStore.ts        # Node operations & selection
├── edges/
│   └── useEdgeStore.ts        # Edge operations & history
├── groups/
│   └── useGroupStore.ts       # Group operations & bounds
├── autosave/
│   └── useAutoSaveStore.ts    # Bulletproof saving logic
└── index.ts                   # Clean exports
```

## 🔄 Migration Strategy

### Phase 1: Gradual Migration (Recommended)

The refactored canvas store maintains **100% API compatibility** with the original. You can migrate gradually:

```typescript
// Old import (still works)
import { useCanvasStore } from '@/lib/stores/canvasStore';

// New import (identical API)
import { useCanvasStore } from '@/lib/stores/canvas/useCanvasStore';

// All existing code works unchanged!
const { canvas, selectedNodeIds, createNode, addGroup } = useCanvasStore();
```

### Phase 2: Component-by-Component Migration

For new features, you can use the specialized stores directly:

```typescript
import {
  useNodeStore,
  useEdgeStore,
  useGroupStore,
  useAutoSaveStore,
} from '@/lib/stores';

function NodeComponent() {
  // Use only node-related operations
  const { selectNode, getNodeById, duplicateNode } = useNodeStore();
  // ... component logic
}
```

## 🆕 New Capabilities

### 1. **Independent Store Testing**

```typescript
// Test node operations in isolation
import { useNodeStore } from '@/lib/stores/nodes/useNodeStore';

test('should create node optimistically', () => {
  const store = useNodeStore.getState();
  const result = store.addNodeLocal(mockNode);
  expect(result).toContain(mockNode);
});
```

### 2. **Specialized Hook Creation**

```typescript
// Create focused hooks for specific functionality
function useNodeSelection() {
  return useNodeStore((state) => ({
    selectedNodeIds: state.selectedNodeIds,
    selectNode: state.selectNode,
    clearSelection: state.clearSelection,
  }));
}
```

### 3. **Better Error Handling**

Each store now has focused error handling for its domain:

```typescript
try {
  await nodeStore.createNode(nodeData, canvasId);
} catch (error) {
  // Specific node creation error handling
  console.error('Node creation failed:', error);
}
```

## 🔧 Breaking Changes

### None!

The refactored Canvas Store maintains complete backward compatibility. All existing:

- Function signatures are identical
- State structure is unchanged
- Event handlers work the same way
- Auto-save behavior is preserved

## 🎁 Benefits

### 1. **Improved Maintainability**

- Each store handles one concern (nodes, edges, groups, auto-save)
- Easy to locate and fix issues
- Clear separation of responsibilities

### 2. **Better Testing**

- Test individual operations in isolation
- Mock specific store dependencies
- Faster, more focused unit tests

### 3. **Enhanced Performance**

- Stores can be optimized independently
- Selective subscriptions reduce re-renders
- Better memory management

### 4. **Easier Feature Development**

- Add new node operations to `useNodeStore`
- Extend group functionality in `useGroupStore`
- Modify auto-save logic in `useAutoSaveStore`

## 📝 Implementation Details

### Auto-Save Store

The complex bulletproof saving logic is now isolated in `useAutoSaveStore.ts`:

- UUID validation for database nodes
- Individual node save with error recovery
- Automatic retry for failed saves
- Clear separation of concerns

### Node Store

Handles all node-related operations:

- CRUD operations with Supabase
- Local optimistic updates
- Selection management
- Utility functions (getConnectedNodes, etc.)

### Edge Store

Manages relationships with history tracking:

- Comprehensive change history
- Evidence tracking
- Confidence and weight updates
- Type change logging

### Group Store

Handles group operations and spatial calculations:

- Group creation with bounds calculation
- Node assignment and removal
- Collapse/expand state
- Size updates

## 🚀 Next Steps

### Immediate (No Code Changes Required)

1. ✅ **Current code continues working** - Zero breaking changes
2. ✅ **Import from new location** when convenient
3. ✅ **Test existing functionality** to ensure compatibility

### Short Term (Optional Improvements)

1. **Create specialized hooks** for common operations
2. **Add focused unit tests** for individual stores
3. **Optimize re-renders** with selective subscriptions

### Long Term (Enhanced Architecture)

1. **Add store middleware** for logging, persistence
2. **Implement offline sync** with individual store queues
3. **Add real-time collaboration** with per-store state management

## 🐛 Troubleshooting

### Import Issues

```typescript
// If you see import errors, update to new structure
import { useCanvasStore } from '@/lib/stores'; // ✅ New clean import
```

### Type Issues

```typescript
// All types are preserved and exported
import type { NodeStoreState, EdgeStoreState } from '@/lib/stores';
```

### Performance Issues

```typescript
// Use selective subscriptions for better performance
const selectedNodes = useCanvasStore((state) => state.selectedNodeIds);
```

## 📚 Additional Resources

- **Original Canvas Store**: `src/lib/stores/canvasStore.ts` (preserved as legacy)
- **Migration Tests**: `src/tests/canvas-store-migration.test.ts`
- **API Documentation**: `docs/api/canvas-stores.md`
- **Performance Guide**: `docs/performance/canvas-optimization.md`

The refactored Canvas Store provides a solid foundation for future development while maintaining complete compatibility with existing code! 🎉
