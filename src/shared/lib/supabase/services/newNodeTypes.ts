import type {
  ActionNode,
  AnyNode,
  HypothesisNode,
  MetricNode,
  ValueNode,
} from '@/shared/types/nodeTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

// Database row types (snake_case from database)
interface ValueNodeRow {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  value_type: string;
  business_impact: string | null;
  stakeholders: string[];
  tags: string[];
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface ActionNodeRow {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  action_type: string;
  status: string | null;
  priority: string | null;
  assignee: string | null;
  due_date: string | null;
  effort: number;
  tags: string[];
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface HypothesisNodeRow {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  hypothesis_type: string;
  confidence: string | null;
  testable: boolean;
  assumptions: string[];
  success_criteria: string[];
  tags: string[];
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface MetricNodeRow {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  metric_type: string;
  source_node_id: string | null;
  unit: string | null;
  target_value: number | null;
  current_value: number | null;
  values: any; // JSONB
  formula: string | null;
  dimensions: string[];
  segments: string[];
  tags: string[];
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Conversion functions
function rowToValueNode(row: ValueNodeRow): ValueNode {
  return {
    id: row.id,
    type: 'valueNode',
    projectId: row.project_id,
    title: row.title,
    description: row.description || '',
    valueType: row.value_type as ValueNode['valueType'],
    businessImpact: row.business_impact as ValueNode['businessImpact'],
    stakeholders: row.stakeholders,
    tags: row.tags,
    position: { x: row.position_x, y: row.position_y },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  };
}

function rowToActionNode(row: ActionNodeRow): ActionNode {
  return {
    id: row.id,
    type: 'actionNode',
    projectId: row.project_id,
    title: row.title,
    description: row.description || '',
    actionType: row.action_type as ActionNode['actionType'],
    status: row.status as ActionNode['status'],
    priority: row.priority as ActionNode['priority'],
    assignee: row.assignee || undefined,
    dueDate: row.due_date || undefined,
    effort: row.effort,
    tags: row.tags,
    position: { x: row.position_x, y: row.position_y },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  };
}

function rowToHypothesisNode(row: HypothesisNodeRow): HypothesisNode {
  return {
    id: row.id,
    type: 'hypothesisNode',
    projectId: row.project_id,
    title: row.title,
    description: row.description || '',
    hypothesisType: row.hypothesis_type as HypothesisNode['hypothesisType'],
    confidence: row.confidence as HypothesisNode['confidence'],
    testable: row.testable,
    assumptions: row.assumptions,
    successCriteria: row.success_criteria,
    tags: row.tags,
    position: { x: row.position_x, y: row.position_y },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  };
}

function rowToMetricNode(row: MetricNodeRow): MetricNode {
  return {
    id: row.id,
    type: 'metricNode',
    projectId: row.project_id,
    title: row.title,
    description: row.description || '',
    metricType: row.metric_type as MetricNode['metricType'],
    sourceNodeId: row.source_node_id || undefined,
    unit: row.unit || '',
    targetValue: row.target_value || 0,
    currentValue: row.current_value || 0,
    values: row.values || [],
    formula: row.formula || undefined,
    dimensions: row.dimensions,
    segments: row.segments,
    tags: row.tags,
    position: { x: row.position_x, y: row.position_y },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  };
}

// VALUE NODE CRUD OPERATIONS
export async function createValueNode(
  nodeData: Omit<ValueNode, 'id' | 'createdAt' | 'updatedAt'>,
  client: SupabaseClient
): Promise<ValueNode> {
  console.log('🔍 Attempting to call create_value_node with params:', {
    p_project_id: nodeData.projectId,
    p_title: nodeData.title,
    p_description: nodeData.description || null,
    p_value_type: nodeData.valueType,
    p_business_impact: nodeData.businessImpact || 'Medium',
    p_stakeholders: nodeData.stakeholders || [],
    p_tags: nodeData.tags || [],
    p_position_x: nodeData.position.x,
    p_position_y: nodeData.position.y,
    p_created_by: nodeData.createdBy,
  });

  // Try the main function first
  let { data, error } = await client.rpc('create_value_node', {
    p_project_id: nodeData.projectId,
    p_title: nodeData.title,
    p_description: nodeData.description || null,
    p_value_type: nodeData.valueType,
    p_business_impact: nodeData.businessImpact || 'Medium',
    p_stakeholders: nodeData.stakeholders || [],
    p_tags: nodeData.tags || [],
    p_position_x: nodeData.position.x,
    p_position_y: nodeData.position.y,
    p_created_by: nodeData.createdBy,
  });

  // If the main function fails with schema cache error, try the simple test function
  if (error && error.message.includes('schema cache')) {
    console.log(
      '🔄 Main function failed with schema cache error, trying test function...'
    );
    const testResult = await client.rpc('test_create_value_node', {
      p_project_id: nodeData.projectId,
      p_title: nodeData.title,
    });
    data = testResult.data;
    error = testResult.error;
  }

  if (error) {
    console.error('❌ Error creating value node:', error);
    console.error('❌ Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to create value node: ${error.message}`);
  }

  // Fetch the created node
  const { data: nodeRow, error: fetchError } = await client
    .from('value_nodes')
    .select('*')
    .eq('id', data)
    .single();

  if (fetchError) {
    console.error('Error fetching created value node:', fetchError);
    throw new Error(
      `Failed to fetch created value node: ${fetchError.message}`
    );
  }

  return rowToValueNode(nodeRow);
}

// ACTION NODE CRUD OPERATIONS
export async function createActionNode(
  nodeData: Omit<ActionNode, 'id' | 'createdAt' | 'updatedAt'>,
  client: SupabaseClient
): Promise<ActionNode> {
  const { data, error } = await client.rpc('create_action_node', {
    p_project_id: nodeData.projectId,
    p_title: nodeData.title,
    p_description: nodeData.description || null,
    p_action_type: nodeData.actionType,
    p_status: nodeData.status || 'Planning',
    p_priority: nodeData.priority || 'Medium',
    p_assignee: nodeData.assignee || null,
    p_due_date: nodeData.dueDate || null,
    p_effort: nodeData.effort || 0,
    p_tags: nodeData.tags || [],
    p_position_x: nodeData.position.x,
    p_position_y: nodeData.position.y,
    p_created_by: nodeData.createdBy,
  });

  if (error) {
    console.error('Error creating action node:', error);
    throw new Error(`Failed to create action node: ${error.message}`);
  }

  // Fetch the created node
  const { data: nodeRow, error: fetchError } = await client
    .from('action_nodes')
    .select('*')
    .eq('id', data)
    .single();

  if (fetchError) {
    console.error('Error fetching created action node:', fetchError);
    throw new Error(
      `Failed to fetch created action node: ${fetchError.message}`
    );
  }

  return rowToActionNode(nodeRow);
}

// HYPOTHESIS NODE CRUD OPERATIONS
export async function createHypothesisNode(
  nodeData: Omit<HypothesisNode, 'id' | 'createdAt' | 'updatedAt'>,
  client: SupabaseClient
): Promise<HypothesisNode> {
  const { data, error } = await client.rpc('create_hypothesis_node', {
    p_project_id: nodeData.projectId,
    p_title: nodeData.title,
    p_description: nodeData.description || null,
    p_hypothesis_type: nodeData.hypothesisType,
    p_confidence: nodeData.confidence || 'Medium',
    p_testable: nodeData.testable || false,
    p_assumptions: nodeData.assumptions || [],
    p_success_criteria: nodeData.successCriteria || [],
    p_tags: nodeData.tags || [],
    p_position_x: nodeData.position.x,
    p_position_y: nodeData.position.y,
    p_created_by: nodeData.createdBy,
  });

  if (error) {
    console.error('Error creating hypothesis node:', error);
    throw new Error(`Failed to create hypothesis node: ${error.message}`);
  }

  // Fetch the created node
  const { data: nodeRow, error: fetchError } = await client
    .from('hypothesis_nodes')
    .select('*')
    .eq('id', data)
    .single();

  if (fetchError) {
    console.error('Error fetching created hypothesis node:', fetchError);
    throw new Error(
      `Failed to fetch created hypothesis node: ${fetchError.message}`
    );
  }

  return rowToHypothesisNode(nodeRow);
}

// METRIC NODE CRUD OPERATIONS
export async function createMetricNode(
  nodeData: Omit<MetricNode, 'id' | 'createdAt' | 'updatedAt'>,
  client: SupabaseClient
): Promise<MetricNode> {
  const { data, error } = await client.rpc('create_metric_node', {
    p_project_id: nodeData.projectId,
    p_title: nodeData.title,
    p_description: nodeData.description || null,
    p_metric_type: nodeData.metricType,
    p_source_node_id: nodeData.sourceNodeId || null,
    p_unit: nodeData.unit || null,
    p_target_value: nodeData.targetValue || null,
    p_current_value: nodeData.currentValue || null,
    p_formula: nodeData.formula || null,
    p_dimensions: nodeData.dimensions || [],
    p_segments: nodeData.segments || [],
    p_tags: nodeData.tags || [],
    p_position_x: nodeData.position.x,
    p_position_y: nodeData.position.y,
    p_created_by: nodeData.createdBy,
  });

  if (error) {
    console.error('Error creating metric node:', error);
    throw new Error(`Failed to create metric node: ${error.message}`);
  }

  // Fetch the created node
  const { data: nodeRow, error: fetchError } = await client
    .from('metric_nodes')
    .select('*')
    .eq('id', data)
    .single();

  if (fetchError) {
    console.error('Error fetching created metric node:', fetchError);
    throw new Error(
      `Failed to fetch created metric node: ${fetchError.message}`
    );
  }

  return rowToMetricNode(nodeRow);
}

// UNIFIED NODE CREATION FUNCTION
export async function createNewNodeType(
  nodeType: 'valueNode' | 'actionNode' | 'hypothesisNode' | 'metricNode',
  nodeData: Omit<AnyNode, 'id' | 'createdAt' | 'updatedAt'>,
  client: SupabaseClient
): Promise<AnyNode> {
  switch (nodeType) {
    case 'valueNode':
      return createValueNode(
        nodeData as Omit<ValueNode, 'id' | 'createdAt' | 'updatedAt'>,
        client
      );
    case 'actionNode':
      return createActionNode(
        nodeData as Omit<ActionNode, 'id' | 'createdAt' | 'updatedAt'>,
        client
      );
    case 'hypothesisNode':
      return createHypothesisNode(
        nodeData as Omit<HypothesisNode, 'id' | 'createdAt' | 'updatedAt'>,
        client
      );
    case 'metricNode':
      return createMetricNode(
        nodeData as Omit<MetricNode, 'id' | 'createdAt' | 'updatedAt'>,
        client
      );
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
}
