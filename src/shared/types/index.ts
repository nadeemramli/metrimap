// Core types for Metrimap application based on PRD specifications

export type CardCategory =
  | 'Core/Value'
  | 'Data/Metric'
  | 'Work/Action'
  | 'Ideas/Hypothesis'
  | 'Metadata';

export type CardSubCategory = {
  'Core/Value': 'Journey Step' | 'Value Chain' | 'Critical Path';
  'Data/Metric':
    | 'Input Metric'
    | 'Output Metric'
    | 'Leading KPI'
    | 'Lagging KPI'
    | 'Diagnostic Metric'
    | 'North Star Metric';
  'Work/Action':
    | 'Experiment'
    | 'BAU'
    | 'Initiative'
    | 'Scope/Function'
    | 'Business Driver';
  'Ideas/Hypothesis': 'Factor' | 'Seller Solution';
  Metadata: 'Group' | 'Subflow' | 'Reference';
};

export type RelationshipType =
  | 'Deterministic'
  | 'Probabilistic'
  | 'Causal'
  | 'Compositional';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type CausalFactor =
  | 'Component Drift'
  | 'Temporal Variance'
  | 'Influence Drift'
  | 'Dimension Drift'
  | 'Event Shocks';

export type SourceType = 'Manual' | 'Calculated' | 'Random';

export type Dimension =
  | 'Qualitative'
  | 'Quantitative'
  | 'Vanity'
  | 'Actionable'
  | 'Efficiency'
  | 'Effectiveness'
  | 'Strategic'
  | 'Tactical'
  | 'Operational';

// Data structures
export interface MetricValue {
  period: string;
  value: number;
  change_percent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface MetricCard {
  id: string;
  title: string;
  description: string;
  category: CardCategory;
  subCategory?: CardSubCategory[CardCategory];
  tags: string[];
  causalFactors: CausalFactor[];
  dimensions: Dimension[];
  segments?: Segment[];

  // Position on canvas
  position: { x: number; y: number };

  // React Flow subflow support
  parentId?: string; // ID of the group this node belongs to

  // Data for Data/Metric cards
  data?: MetricValue[];
  sourceType?: SourceType;
  formula?: string;

  // Metadata
  owner?: string;
  assignees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Segment {
  id: string;
  name: string;
  dimension: string;
  value: string;
  percentage?: number;
  filters?: SegmentFilter[];
  color?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | [number, number];
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  confidence: ConfidenceLevel;
  weight?: number;

  // Evidence and knowledge
  evidence: EvidenceItem[];
  notes?: string;

  // History for influence drift analysis
  history?: RelationshipHistoryEntry[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipHistoryEntry {
  id: string;
  timestamp: string;
  changeType: 'strength' | 'confidence' | 'type' | 'evidence';
  oldValue: any;
  newValue: any;
  description: string;
  userId?: string;
  annotation?: string; // User can add context for the change
}

export interface EvidenceItem {
  id: string;
  title: string;
  type:
    | 'Experiment'
    | 'Analysis'
    | 'Notebook'
    | 'External Research'
    | 'User Interview';
  date: string;
  owner: string;
  link?: string;
  hypothesis?: string;
  summary: string;
  impactOnConfidence?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  tags?: string[];
  category?: string;

  // Editor.js content for rich editing
  content?: {
    time: number;
    blocks: Array<{
      id: string;
      type: string;
      data: any;
    }>;
    version: string;
  };

  // Context tracking - where this evidence belongs
  context?: {
    type: 'relationship' | 'card' | 'general';
    targetId?: string; // relationship ID, card ID, or null for general
    targetName?: string; // for display purposes
  };

  // Canvas positioning for general evidence
  position?: {
    x: number;
    y: number;
  };

  // UI state for canvas evidence cards
  isVisible?: boolean;
  isExpanded?: boolean;

  // Comments for evidence (as shown in your image)
  comments?: EvidenceComment[];
}

export interface EvidenceComment {
  id: string;
  evidenceId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CanvasSettings {
  dateRange?: {
    from: string;
    to: string;
  };
  autoLayout?: {
    algorithm: 'TB' | 'BT' | 'LR' | 'RL';
    enabled: boolean;
  };
  viewport?: {
    zoom: number;
    center: { x: number; y: number };
  };
  whiteboardScene?: any;
  whiteboardPrefs?: {
    keepToolActive?: boolean;
    lastTool?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}

export interface CanvasProject {
  id: string;
  name: string;
  description: string;
  tags: string[];
  collaborators: string[];

  // Canvas content
  nodes: MetricCard[];
  edges: Relationship[];
  groups: GroupNode[];

  // Canvas settings
  settings?: CanvasSettings;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

export interface GroupNode {
  id: string;
  name: string;
  nodeIds: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  // React Flow subflow properties
  isCollapsed?: boolean;
  zIndex?: number;
}

// Canvas node types for extra nodes (comment, source, chart, operator, whiteboard)
export type CanvasNodeType =
  | 'commentNode'
  | 'sourceNode'
  | 'chartNode'
  | 'operatorNode'
  | 'whiteboardNode';

export interface CanvasNode {
  id: string;
  projectId: string;
  nodeType: CanvasNodeType;
  title?: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Events for changelog
export interface ChangelogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: 'card' | 'relationship' | 'subflow';
  targetName: string;
  description: string;
  canvasId: string;
}

// App state types
export interface AppState {
  currentCanvasId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  preferences: {
    dateRange: {
      start: string;
      end: string;
    };
    theme: 'light' | 'dark' | 'system';
  };
}

export interface CanvasState {
  canvas?: CanvasProject;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  isLoading: boolean;
  error?: string;

  // Canvas view state
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };

  // UI state
  showMiniMap: boolean;
  showControls: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}

// Version history types
export type * from './version-history';
