# Canvas Version History - Complete Implementation

## 🎯 Overview

The Canvas Version History system provides comprehensive snapshot and restore functionality for Metrimap canvases, allowing users to:

- **Create manual snapshots** of canvas state with custom titles and descriptions
- **Automatic snapshots** based on configurable thresholds and intervals
- **Restore previous versions** with full canvas state recovery
- **Compare versions** to see what changed between snapshots
- **Manage retention** with configurable cleanup policies
- **Track statistics** about canvas evolution over time

## 🏗️ Architecture

### Core Components

```
src/lib/
├── types/
│   └── version-history.ts              # Type definitions ✅
├── stores/
│   └── version-history/
│       └── useVersionHistoryStore.ts   # State management ✅
├── supabase/services/
│   └── version-history.ts              # Database operations ✅
└── hooks/
    └── useAutoSnapshot.ts               # Auto-snapshot logic ✅

src/components/canvas/
└── version-history/
    ├── VersionHistoryPanel.tsx          # Main UI component ✅
    └── VersionHistoryButton.tsx         # Toolbar integration ✅

docs/database/migrations/
└── canvas_snapshots.sql                # Database schema ✅
```

## 🗄️ Database Schema

### Canvas Snapshots Table

```sql
CREATE TABLE public.canvas_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canvas_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,

    -- Canvas data at snapshot time
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    groups JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Snapshot metadata
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id),

    UNIQUE(canvas_id, version)
);
```

### Key Features:

- **Automatic versioning** per canvas
- **JSONB storage** for efficient canvas data
- **Rich metadata** for context and statistics
- **RLS policies** for secure access control
- **Cleanup functions** for retention management

## 💾 Data Structure

### Snapshot Format

```typescript
interface CanvasSnapshot {
  id: string;
  canvasId: string;
  version: number;
  title: string;
  description?: string;

  // Complete canvas state
  nodes: MetricCard[];
  edges: Relationship[];
  groups: GroupNode[];

  // Rich metadata
  metadata: {
    triggerType: 'manual' | 'auto' | 'milestone';
    nodeCount: number;
    edgeCount: number;
    groupCount: number;
    changesSinceLastSnapshot?: {
      nodesAdded: number;
      nodesModified: number;
      nodesDeleted: number;
      // ... more change tracking
    };
    viewport?: { x: number; y: number; zoom: number };
    userAgent?: string;
  };

  createdAt: string;
  createdBy: string;
}
```

## 🔧 Configuration

### Version History Settings

```typescript
interface VersionHistoryConfig {
  // Auto-snapshot settings
  autoSnapshotEnabled: boolean; // Default: true
  autoSnapshotInterval: number; // Default: 30 minutes
  maxAutoSnapshots: number; // Default: 20

  // Manual snapshot settings
  maxManualSnapshots: number; // Default: 50

  // Retention policy
  retentionDays: number; // Default: 90 days

  // Change thresholds
  changeThresholds: {
    minNodesChanged: number; // Default: 3
    minEdgesChanged: number; // Default: 5
    minTimeElapsed: number; // Default: 15 minutes
  };
}
```

## 🚀 Usage

### Basic Integration

```tsx
import { VersionHistoryButton } from '@/components/canvas/version-history/VersionHistoryButton';
import { useAutoSnapshot } from '@/lib/hooks/useAutoSnapshot';

function CanvasPage({ canvasId }: { canvasId: string }) {
  // Enable auto-snapshots
  useAutoSnapshot({ canvasId, enabled: true });

  return (
    <div>
      {/* Canvas content */}

      {/* Add to toolbar */}
      <VersionHistoryButton canvasId={canvasId} />
    </div>
  );
}
```

### Manual Snapshot Creation

```tsx
import { useVersionHistoryStore } from '@/lib/stores';

function CreateSnapshotExample() {
  const { createSnapshot } = useVersionHistoryStore();

  const handleCreateMilestone = async () => {
    await createSnapshot(
      canvasId,
      'Project Milestone v2.0',
      'Major feature release with new metrics framework',
      'milestone'
    );
  };

  return (
    <button onClick={handleCreateMilestone}>Create Milestone Snapshot</button>
  );
}
```

### Restore Previous Version

```tsx
import { useVersionHistoryStore } from '@/lib/stores';

function RestoreExample() {
  const { snapshots, restoreSnapshot } = useVersionHistoryStore();

  const handleRestore = async (snapshotId: string) => {
    // Automatically creates backup before restore
    await restoreSnapshot(snapshotId);
  };

  return (
    <div>
      {snapshots.map((snapshot) => (
        <div key={snapshot.id}>
          <h3>{snapshot.title}</h3>
          <button onClick={() => handleRestore(snapshot.id)}>
            Restore This Version
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Auto-Snapshot Logic

### Trigger Conditions

Auto-snapshots are created when **ALL** conditions are met:

1. **Time threshold**: Minimum time since last snapshot
2. **Change threshold**: Significant changes detected
3. **Configuration**: Auto-snapshots enabled

### Change Detection

```typescript
// Changes are detected by comparing:
- Node count, positions, and update timestamps
- Edge count and update timestamps
- Group positions and sizes
- Overall canvas update timestamp
```

### Smart Batching

- **Debounced**: Changes are debounced to avoid excessive snapshots
- **Throttled**: Minimum time between checks to reduce load
- **Intelligent**: Only creates snapshots for meaningful changes

## 📊 Statistics & Analytics

### History Stats

```typescript
interface HistoryStats {
  totalSnapshots: number;
  oldestSnapshot?: string;
  newestSnapshot?: string;
  averageTimeBetweenSnapshots?: number;
  snapshotsByType: {
    manual: number;
    auto: number;
    milestone: number;
  };
  totalCanvasChanges: number;
}
```

### Usage Patterns

The system tracks:

- **Snapshot frequency** and timing patterns
- **Change volume** over time
- **User behavior** (manual vs auto snapshots)
- **Canvas growth** metrics

## 🛡️ Security & Permissions

### Row Level Security (RLS)

```sql
-- Users can only access snapshots for canvases they own/collaborate on
CREATE POLICY "canvas_snapshots_select_policy" ON canvas_snapshots
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = canvas_snapshots.canvas_id
    AND (p.created_by = auth.uid() OR user_is_collaborator(p.id))
  )
);
```

### Permission Levels

- **Owners**: Full access (create, read, update, delete)
- **Editors**: Can create and restore snapshots
- **Viewers**: Read-only access to snapshots
- **Auto-cleanup**: System-managed retention policies

## 🗄️ Database Operations

### Core Functions

```sql
-- Get next version number for a canvas
SELECT get_next_canvas_version('canvas-uuid');

-- Cleanup old snapshots with retention policy
SELECT cleanup_canvas_snapshots(
  'canvas-uuid',
  retention_days := 90,
  max_auto_snapshots := 20,
  max_manual_snapshots := 50
);

-- Get snapshot statistics
SELECT * FROM canvas_snapshot_stats WHERE canvas_id = 'canvas-uuid';
```

### Performance Optimizations

- **Indexed queries** for fast snapshot retrieval
- **JSONB indexing** for metadata searches
- **Efficient cleanup** with batch operations
- **Optimized RLS** policies for security

## 🔍 Version Comparison

### Diff Algorithm

```typescript
interface SnapshotComparison {
  differences: {
    nodes: {
      added: MetricCard[];
      modified: Array<{
        before: MetricCard;
        after: MetricCard;
        changes: string[];
      }>;
      deleted: MetricCard[];
    };
    edges: {
      /* similar structure */
    };
    groups: {
      /* similar structure */
    };
  };
  summary: {
    totalChanges: number;
    nodesChanged: number;
    edgesChanged: number;
    groupsChanged: number;
  };
}
```

### Change Detection

The system can identify:

- **Added/removed** elements
- **Position changes** for nodes and groups
- **Property modifications** with field-level tracking
- **Relationship updates** including confidence and evidence changes

## 🧹 Cleanup & Retention

### Automatic Cleanup

The system automatically:

- **Deletes old snapshots** beyond retention period
- **Limits auto-snapshots** to configured maximum
- **Preserves milestones** regardless of age
- **Maintains manual snapshots** within limits

### Manual Cleanup

```typescript
// Trigger manual cleanup
await cleanupOldSnapshots(canvasId);

// Get cleanup preview
const stats = await getCleanupPreview(canvasId);
console.log(`Will delete ${stats.toDelete} old snapshots`);
```

## 🎛️ Configuration Management

### User Settings

Users can configure:

- **Auto-snapshot frequency** (5 minutes to 24 hours)
- **Change sensitivity** (how many changes trigger snapshot)
- **Retention period** (1 day to 1 year)
- **Snapshot limits** (10 to 200 snapshots)

### System Defaults

```typescript
const DEFAULT_CONFIG = {
  autoSnapshotEnabled: true,
  autoSnapshotInterval: 30, // 30 minutes
  maxAutoSnapshots: 20,
  maxManualSnapshots: 50,
  retentionDays: 90, // 3 months
  changeThresholds: {
    minNodesChanged: 3,
    minEdgesChanged: 5,
    minTimeElapsed: 15, // 15 minutes
  },
};
```

## 🚨 Error Handling

### Graceful Degradation

- **Network failures**: Queue snapshots for retry
- **Storage limits**: Automatic cleanup with user notification
- **Corruption**: Validate snapshots before restore
- **Permissions**: Clear error messages for access issues

### Recovery Strategies

```typescript
// Automatic backup before restore
await createSnapshot(
  canvasId,
  'Auto-backup before restore',
  'Safety backup created automatically',
  'auto'
);

// Validation before restore
const isValid = await validateSnapshot(snapshotId);
if (!isValid) {
  throw new Error('Snapshot data is corrupted');
}
```

## 📱 User Interface

### Main Panel Features

- **📸 Quick snapshot creation** with title and description
- **📋 Snapshot list** with version numbers and metadata
- **📊 Statistics dashboard** showing usage patterns
- **⚙️ Settings panel** for configuration
- **🔄 One-click restore** with confirmation dialogs
- **🗑️ Cleanup controls** for manual management

### Toolbar Integration

- **🏷️ Snapshot count badge** showing total snapshots
- **⚡ Quick snapshot button** for instant saves
- **🔔 Auto-save indicator** showing current status
- **💡 Smart tooltips** with contextual information

## 🎯 Benefits

### For Users

- **😌 Peace of mind** - never lose work
- **🔄 Easy experimentation** - try changes safely
- **📈 Progress tracking** - see canvas evolution
- **👥 Collaboration** - share specific versions

### For System

- **📊 Analytics** - understand usage patterns
- **🛡️ Data integrity** - automatic backups
- **🔧 Debugging** - historical state access
- **📈 Performance** - optimized storage and retrieval

## 🚀 Future Enhancements

### Planned Features

- **🔀 Branch/merge** workflow for collaboration
- **📤 Export/import** snapshots between canvases
- **🏷️ Tagging system** for organizing snapshots
- **📝 Comment threads** on snapshots
- **🔔 Notification system** for auto-snapshots
- **📊 Advanced analytics** dashboard

### Integration Opportunities

- **Git-like workflow** for canvas versioning
- **Real-time collaboration** with live snapshots
- **AI-powered suggestions** for snapshot timing
- **Integration with project management** tools

## ✅ Implementation Status

- [x] **Core data structures** and types
- [x] **Database schema** with migrations
- [x] **State management** with Zustand
- [x] **Supabase integration** with RLS
- [x] **Auto-snapshot logic** with smart triggers
- [x] **User interface** components
- [x] **Toolbar integration** with quick actions
- [x] **Configuration system** with user preferences
- [x] **Statistics dashboard** and analytics
- [x] **Error handling** and recovery
- [x] **Documentation** and examples

## 🎉 Ready for Production!

The Canvas Version History system is **production-ready** and provides:

1. **💾 Comprehensive snapshots** of canvas state
2. **🔄 Intelligent auto-save** with configurable triggers
3. **🎯 One-click restore** with safety backups
4. **📊 Rich analytics** and usage insights
5. **🛡️ Secure access** with proper permissions
6. **🧹 Automatic cleanup** with retention policies
7. **⚡ Optimized performance** for large canvases
8. **📱 Intuitive interface** for easy management

**Canvas version history ensures users never lose their work and can confidently experiment with their metric maps!** 🚀
