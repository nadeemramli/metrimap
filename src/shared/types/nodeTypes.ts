/**
 * Node Type Definitions According to PRD
 * Separating the monolithic MetricCard into distinct node types
 */

// Base interface for all nodes
export interface BaseNode {
  id: string;
  title: string;
  description: string;
  tags: string[];
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

// ============================================================================
// CORE NODE TYPES
// ============================================================================

/**
 * Value Node - Represents core business value chain components
 * Forms the backbone of the business's fundamental formula
 */
export interface ValueNode extends BaseNode {
  type: 'valueNode';
  valueType: 'Journey Step' | 'Value Chain' | 'Critical Path';
  // Value-specific properties
  businessImpact?: 'High' | 'Medium' | 'Low';
  stakeholders?: string[];
}

/**
 * Action Node - Maps specific tasks and initiatives
 * Represents either routine BAU activities or new hypothetical initiatives
 */
export interface ActionNode extends BaseNode {
  type: 'actionNode';
  actionType: 'Experiment' | 'BAU' | 'Initiative' | 'Scope/Function' | 'Business Driver';
  // Action-specific properties
  status?: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  priority?: 'High' | 'Medium' | 'Low';
  assignee?: string;
  dueDate?: string;
  effort?: number; // Story points or hours
}

/**
 * Hypothesis Node - Dedicated space for brainstorming and capturing ideas
 * Used for exploring new concepts within the business model
 */
export interface HypothesisNode extends BaseNode {
  type: 'hypothesisNode';
  hypothesisType: 'Factor' | 'Seller Solution';
  // Hypothesis-specific properties
  confidence?: 'High' | 'Medium' | 'Low';
  testable?: boolean;
  assumptions?: string[];
  successCriteria?: string[];
}

// ============================================================================
// ARTIFACT NODE TYPES
// ============================================================================

/**
 * Evidence Node - Block-based text editor for reports
 * Embeds real-time data by referencing other nodes and relationships
 */
export interface EvidenceNode extends BaseNode {
  type: 'evidenceNode';
  // Evidence-specific properties (existing implementation)
  content?: any; // Block editor content
  references?: string[]; // Referenced node IDs
}

/**
 * Metadata Node - Enriches other nodes with additional context
 * Provides descriptions, properties, and contextual information
 */
export interface MetadataNode extends BaseNode {
  type: 'metadataNode';
  metadataType: 'Group' | 'Subflow' | 'Reference';
  // Metadata-specific properties
  targetNodeIds?: string[]; // Nodes this metadata applies to
  properties?: Record<string, any>;
}

// ============================================================================
// DATA/METRIC NODE TYPES
// ============================================================================

/**
 * Metric Node - Data-centric node that stores and acts as proxy for data
 * Serves as primary element for tracking key business metrics
 * Gets data from Source Nodes through data pipeline connections
 */
export interface MetricNode extends BaseNode {
  type: 'metricNode';
  metricType: 'Input Metric' | 'Output Metric' | 'Leading KPI' | 'Lagging KPI' | 'Diagnostic Metric' | 'North Star Metric';
  // Metric-specific properties
  sourceNodeId?: string; // Connected Source Node for data
  unit?: string; // e.g., '$', '%', 'users'
  targetValue?: number;
  currentValue?: number;
  values?: MetricValue[]; // Historical values
  formula?: string; // Calculation formula
  dimensions?: string[]; // Data dimensions
  segments?: string[]; // Data segments
}

/**
 * Source Node - Manages data pipelines and connections
 * Connects to data sources, performs transformations, runs scripts
 */
export interface SourceNode extends BaseNode {
  type: 'sourceNode';
  // Source-specific properties (existing implementation)
  sourceType?: 'Database' | 'API' | 'File' | 'Manual' | 'Calculated';
  connectionString?: string;
  query?: string;
  transformations?: any[];
  refreshRate?: string; // e.g., 'daily', 'hourly'
}

// ============================================================================
// FUNCTIONAL & UTILITY NODE TYPES
// ============================================================================

/**
 * Visualization Node - Pairs with Metric/Source Nodes for charts
 * Creates standard charts and graphs for data visualization
 */
export interface VisualizationNode extends BaseNode {
  type: 'visualizationNode';
  // Visualization-specific properties (existing chartNode implementation)
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  dataSourceIds?: string[]; // Connected Metric or Source Node IDs
  chartConfig?: any; // Chart configuration
}

/**
 * Operative Node - Utility node for managing data flows
 * Applies formulas, boolean operators, conditional paths, delays
 */
export interface OperativeNode extends BaseNode {
  type: 'operativeNode';
  // Operative-specific properties (existing operatorNode implementation)
  operationType?: 'Formula' | 'Filter' | 'Join' | 'Aggregate' | 'Transform';
  operation?: string; // The actual operation/formula
  inputNodeIds?: string[]; // Input nodes
  outputNodeIds?: string[]; // Output nodes
}

// ============================================================================
// UNION TYPE FOR ALL NODES
// ============================================================================

export type AnyNode = 
  | ValueNode 
  | ActionNode 
  | HypothesisNode 
  | EvidenceNode 
  | MetadataNode 
  | MetricNode 
  | SourceNode 
  | VisualizationNode 
  | OperativeNode;

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type NodeType = AnyNode['type'];

export type CoreNodeType = ValueNode | ActionNode | HypothesisNode;
export type ArtifactNodeType = EvidenceNode | MetadataNode;
export type DataNodeType = MetricNode | SourceNode;
export type FunctionalNodeType = VisualizationNode | OperativeNode;

// Helper type to get node interface from node type string
export type NodeByType<T extends NodeType> = Extract<AnyNode, { type: T }>;

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/**
 * Helper to determine new node type from old MetricCard category
 */
export function getNodeTypeFromCategory(category: string): NodeType {
  switch (category) {
    case 'Core/Value':
      return 'valueNode';
    case 'Work/Action':
      return 'actionNode';
    case 'Ideas/Hypothesis':
      return 'hypothesisNode';
    case 'Data/Metric':
      return 'metricNode';
    case 'Metadata':
      return 'metadataNode';
    default:
      return 'metricNode'; // Default fallback
  }
}

/**
 * Helper to get appropriate icon for node type
 */
export function getNodeTypeIcon(nodeType: NodeType): string {
  switch (nodeType) {
    case 'valueNode':
      return '🎯';
    case 'actionNode':
      return '⚡';
    case 'hypothesisNode':
      return '💡';
    case 'evidenceNode':
      return '📄';
    case 'metadataNode':
      return '🏷️';
    case 'metricNode':
      return '📊';
    case 'sourceNode':
      return '🔌';
    case 'visualizationNode':
      return '📈';
    case 'operativeNode':
      return '⚙️';
    default:
      return '📦';
  }
}

/**
 * Helper to get node type display name
 */
export function getNodeTypeDisplayName(nodeType: NodeType): string {
  switch (nodeType) {
    case 'valueNode':
      return 'Value Node';
    case 'actionNode':
      return 'Action Node';
    case 'hypothesisNode':
      return 'Hypothesis Node';
    case 'evidenceNode':
      return 'Evidence Node';
    case 'metadataNode':
      return 'Metadata Node';
    case 'metricNode':
      return 'Metric Node';
    case 'sourceNode':
      return 'Source Node';
    case 'visualizationNode':
      return 'Visualization Node';
    case 'operativeNode':
      return 'Operative Node';
    default:
      return 'Unknown Node';
  }
}
