import type { GroupNode, MetricCard, Relationship } from './index';

export interface CanvasSnapshot {
  id: string;
  canvasId: string;
  version: number;
  title: string;
  description?: string;
  nodes: MetricCard[];
  edges: Relationship[];
  groups: GroupNode[];
  metadata: SnapshotMetadata;
  createdAt: string;
  createdBy: string;
}

export interface SnapshotMetadata {
  // Auto-generated snapshots
  triggerType: 'manual' | 'auto' | 'milestone';
  triggerReason?: string;

  // Statistics
  nodeCount: number;
  edgeCount: number;
  groupCount: number;

  // Changes since last snapshot
  changesSinceLastSnapshot?: {
    nodesAdded: number;
    nodesModified: number;
    nodesDeleted: number;
    edgesAdded: number;
    edgesModified: number;
    edgesDeleted: number;
    groupsAdded: number;
    groupsModified: number;
    groupsDeleted: number;
  };

  // Performance data
  canvasSize?: {
    totalNodes: number;
    totalEdges: number;
    boundingBox: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
  };

  // User context
  userAgent?: string;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface VersionHistoryConfig {
  // Auto-snapshot settings
  autoSnapshotEnabled: boolean;
  autoSnapshotInterval: number; // minutes
  maxAutoSnapshots: number;

  // Manual snapshot settings
  maxManualSnapshots: number;

  // Retention policy
  retentionDays: number;

  // Change thresholds for auto-snapshots
  changeThresholds: {
    minNodesChanged: number;
    minEdgesChanged: number;
    minTimeElapsed: number; // minutes
  };
}

export interface VersionHistoryStore {
  // Current state
  snapshots: CanvasSnapshot[];
  isLoading: boolean;
  error: string | undefined;
  config: VersionHistoryConfig;
  lastSnapshotTime: string | undefined;

  // Core operations
  createSnapshot: (
    canvasId: string,
    title: string,
    description?: string,
    triggerType?: 'manual' | 'auto' | 'milestone'
  ) => Promise<CanvasSnapshot>;

  loadSnapshots: (canvasId: string) => Promise<void>;

  restoreSnapshot: (snapshotId: string) => Promise<void>;

  deleteSnapshot: (snapshotId: string) => Promise<void>;

  // Comparison operations
  compareSnapshots: (
    snapshotId1: string,
    snapshotId2: string
  ) => Promise<SnapshotComparison>;

  // Auto-snapshot management
  checkAutoSnapshot: (canvasId: string) => Promise<void>;
  updateConfig: (config: Partial<VersionHistoryConfig>) => void;

  // Utility functions
  getSnapshotById: (snapshotId: string) => CanvasSnapshot | undefined;
  getLatestSnapshot: () => CanvasSnapshot | undefined;
  getSnapshotsSince: (date: string) => CanvasSnapshot[];
  cleanupOldSnapshots: (canvasId: string) => Promise<void>;

  // Statistics
  getHistoryStats: () => HistoryStats;
}

export interface SnapshotComparison {
  snapshot1: CanvasSnapshot;
  snapshot2: CanvasSnapshot;
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
      added: Relationship[];
      modified: Array<{
        before: Relationship;
        after: Relationship;
        changes: string[];
      }>;
      deleted: Relationship[];
    };
    groups: {
      added: GroupNode[];
      modified: Array<{
        before: GroupNode;
        after: GroupNode;
        changes: string[];
      }>;
      deleted: GroupNode[];
    };
  };
  summary: {
    totalChanges: number;
    nodesChanged: number;
    edgesChanged: number;
    groupsChanged: number;
  };
}

export interface HistoryStats {
  totalSnapshots: number;
  oldestSnapshot?: string;
  newestSnapshot?: string;
  averageTimeBetweenSnapshots?: number; // hours
  mostActiveDay?: string;
  snapshotsByType: {
    manual: number;
    auto: number;
    milestone: number;
  };
  totalCanvasChanges: number;
}

// Default configuration
export const DEFAULT_VERSION_HISTORY_CONFIG: VersionHistoryConfig = {
  autoSnapshotEnabled: true,
  autoSnapshotInterval: 30, // 30 minutes
  maxAutoSnapshots: 20,
  maxManualSnapshots: 50,
  retentionDays: 90, // 3 months
  changeThresholds: {
    minNodesChanged: 3,
    minEdgesChanged: 5,
    minTimeElapsed: 15, // 15 minutes minimum between auto-snapshots
  },
};
