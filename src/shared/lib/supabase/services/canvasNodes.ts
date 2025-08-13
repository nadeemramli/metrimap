import type { SupabaseClient } from '@supabase/supabase-js';
import type { CanvasNode, CanvasNodeType } from '@/shared/types';

// Database row type (matches Supabase schema)
interface CanvasNodeRow {
  id: string;
  project_id: string;
  node_type: string;
  title: string | null;
  position_x: number;
  position_y: number;
  data: any;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Convert database row to application type
function rowToCanvasNode(row: CanvasNodeRow): CanvasNode {
  return {
    id: row.id,
    projectId: row.project_id,
    nodeType: row.node_type as CanvasNodeType,
    title: row.title || undefined,
    position: { x: row.position_x, y: row.position_y },
    data: row.data || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  };
}

// Convert application type to database row
function canvasNodeToRow(node: Omit<CanvasNode, 'id' | 'createdAt' | 'updatedAt'>): Omit<CanvasNodeRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    project_id: node.projectId,
    node_type: node.nodeType,
    title: node.title || null,
    position_x: node.position.x,
    position_y: node.position.y,
    data: node.data,
    created_by: node.createdBy,
  };
}

/**
 * Create a new canvas node
 */
export async function createCanvasNode(
  nodeData: Omit<CanvasNode, 'id' | 'createdAt' | 'updatedAt'>,
  client: SupabaseClient
): Promise<CanvasNode> {
  const row = canvasNodeToRow(nodeData);
  
  const { data, error } = await client
    .from('canvas_nodes')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('Error creating canvas node:', error);
    throw new Error(`Failed to create canvas node: ${error.message}`);
  }

  return rowToCanvasNode(data);
}

/**
 * Get all canvas nodes for a project
 */
export async function getCanvasNodesByProject(
  projectId: string,
  client: SupabaseClient
): Promise<CanvasNode[]> {
  const { data, error } = await client
    .from('canvas_nodes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching canvas nodes:', error);
    throw new Error(`Failed to fetch canvas nodes: ${error.message}`);
  }

  return data.map(rowToCanvasNode);
}

/**
 * Update a canvas node
 */
export async function updateCanvasNode(
  nodeId: string,
  updates: Partial<Pick<CanvasNode, 'title' | 'position' | 'data'>>,
  client: SupabaseClient
): Promise<CanvasNode> {
  const updateData: Partial<CanvasNodeRow> = {};
  
  if (updates.title !== undefined) {
    updateData.title = updates.title || null;
  }
  
  if (updates.position) {
    updateData.position_x = updates.position.x;
    updateData.position_y = updates.position.y;
  }
  
  if (updates.data !== undefined) {
    updateData.data = updates.data;
  }

  const { data, error } = await client
    .from('canvas_nodes')
    .update(updateData)
    .eq('id', nodeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating canvas node:', error);
    throw new Error(`Failed to update canvas node: ${error.message}`);
  }

  return rowToCanvasNode(data);
}

/**
 * Delete a canvas node
 */
export async function deleteCanvasNode(
  nodeId: string,
  client: SupabaseClient
): Promise<void> {
  const { error } = await client
    .from('canvas_nodes')
    .delete()
    .eq('id', nodeId);

  if (error) {
    console.error('Error deleting canvas node:', error);
    throw new Error(`Failed to delete canvas node: ${error.message}`);
  }
}

/**
 * Get a single canvas node by ID
 */
export async function getCanvasNodeById(
  nodeId: string,
  client: SupabaseClient
): Promise<CanvasNode | null> {
  const { data, error } = await client
    .from('canvas_nodes')
    .select('*')
    .eq('id', nodeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching canvas node:', error);
    throw new Error(`Failed to fetch canvas node: ${error.message}`);
  }

  return rowToCanvasNode(data);
}

/**
 * Update canvas node position (optimized for frequent updates)
 */
export async function updateCanvasNodePosition(
  nodeId: string,
  position: { x: number; y: number },
  client: SupabaseClient
): Promise<void> {
  const { error } = await client
    .from('canvas_nodes')
    .update({
      position_x: position.x,
      position_y: position.y,
    })
    .eq('id', nodeId);

  if (error) {
    console.error('Error updating canvas node position:', error);
    throw new Error(`Failed to update canvas node position: ${error.message}`);
  }
}
