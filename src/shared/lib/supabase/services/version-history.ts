import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CanvasSnapshot } from '../../types/version-history';
import type { Database } from '../types';

// Database type for canvas snapshots
type CanvasSnapshotInsert =
  Database['public']['Tables']['canvas_snapshots']['Insert'];
type CanvasSnapshotUpdate =
  Database['public']['Tables']['canvas_snapshots']['Update'];
type CanvasSnapshotRow =
  Database['public']['Tables']['canvas_snapshots']['Row'];

/**
 * Create a new canvas snapshot
 */
export async function createCanvasSnapshot(
  snapshotData: Omit<CanvasSnapshot, 'id' | 'createdAt'>,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasSnapshot> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    console.log('📸 Creating canvas snapshot in database:', {
      canvasId: snapshotData.canvasId,
      version: snapshotData.version,
      title: snapshotData.title,
    });

    const insertData: CanvasSnapshotInsert = {
      canvas_id: snapshotData.canvasId,
      version: snapshotData.version,
      title: snapshotData.title,
      description: snapshotData.description || null,
      nodes: snapshotData.nodes as any,
      edges: snapshotData.edges as any,
      groups: snapshotData.groups as any,
      metadata: snapshotData.metadata as any,
      created_by: snapshotData.createdBy,
    };

    const { data, error } = await client
      .from('canvas_snapshots')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error creating snapshot:', error);
      throw new Error(`Failed to create snapshot: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from snapshot creation');
    }

    console.log('✅ Canvas snapshot created in database:', data.id);

    return convertSnapshotFromDb(data);
  } catch (error) {
    console.error('❌ Error creating canvas snapshot:', error);
    throw error;
  }
}

/**
 * Get all snapshots for a canvas
 */
export async function getCanvasSnapshots(
  canvasId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasSnapshot[]> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    console.log('🔍 Loading canvas snapshots for:', canvasId);

    const { data, error } = await client
      .from('canvas_snapshots')
      .select('*')
      .eq('canvas_id', canvasId)
      .order('version', { ascending: false });

    if (error) {
      console.error('❌ Database error loading snapshots:', error);
      throw new Error(`Failed to load snapshots: ${error.message}`);
    }

    const snapshots = data?.map(convertSnapshotFromDb) || [];
    console.log('✅ Loaded canvas snapshots:', snapshots.length);

    return snapshots;
  } catch (error) {
    console.error('❌ Error loading canvas snapshots:', error);
    throw error;
  }
}

/**
 * Get a specific snapshot by ID
 */
export async function getCanvasSnapshotById(
  snapshotId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasSnapshot | null> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    const { data, error } = await client
      .from('canvas_snapshots')
      .select('*')
      .eq('id', snapshotId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to get snapshot: ${error.message}`);
    }

    return convertSnapshotFromDb(data);
  } catch (error) {
    console.error('❌ Error getting canvas snapshot:', error);
    throw error;
  }
}

/**
 * Update a snapshot (mainly for title/description)
 */
export async function updateCanvasSnapshot(
  snapshotId: string,
  updates: { title?: string; description?: string },
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasSnapshot> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    const updateData: CanvasSnapshotUpdate = {
      title: updates.title,
      description: updates.description,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('canvas_snapshots')
      .update(updateData)
      .eq('id', snapshotId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update snapshot: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from snapshot update');
    }

    return convertSnapshotFromDb(data);
  } catch (error) {
    console.error('❌ Error updating canvas snapshot:', error);
    throw error;
  }
}

/**
 * Delete a canvas snapshot
 */
export async function deleteCanvasSnapshot(
  snapshotId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<void> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    console.log('🗑️ Deleting canvas snapshot:', snapshotId);

    const { error } = await client
      .from('canvas_snapshots')
      .delete()
      .eq('id', snapshotId);

    if (error) {
      throw new Error(`Failed to delete snapshot: ${error.message}`);
    }

    console.log('✅ Canvas snapshot deleted:', snapshotId);
  } catch (error) {
    console.error('❌ Error deleting canvas snapshot:', error);
    throw error;
  }
}

/**
 * Get snapshots within a date range
 */
export async function getSnapshotsInDateRange(
  canvasId: string,
  startDate: string,
  endDate: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasSnapshot[]> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    const { data, error } = await client
      .from('canvas_snapshots')
      .select('*')
      .eq('canvas_id', canvasId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to get snapshots in date range: ${error.message}`
      );
    }

    return data?.map(convertSnapshotFromDb) || [];
  } catch (error) {
    console.error('❌ Error getting snapshots in date range:', error);
    throw error;
  }
}

/**
 * Get latest snapshot for a canvas
 */
export async function getLatestSnapshot(
  canvasId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<CanvasSnapshot | null> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    const { data, error } = await client
      .from('canvas_snapshots')
      .select('*')
      .eq('canvas_id', canvasId)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No snapshots found
      }
      throw new Error(`Failed to get latest snapshot: ${error.message}`);
    }

    return convertSnapshotFromDb(data);
  } catch (error) {
    console.error('❌ Error getting latest snapshot:', error);
    throw error;
  }
}

/**
 * Cleanup old snapshots based on retention policy
 */
export async function cleanupOldSnapshots(
  canvasId: string,
  retentionDays: number,
  maxAutoSnapshots: number,
  maxManualSnapshots: number,
  authenticatedClient?: SupabaseClient<Database>
): Promise<number> {
  const client = authenticatedClient || getClientForEnvironment();

  try {
    console.log('🧹 Cleaning up old snapshots for canvas:', canvasId);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Delete old snapshots beyond retention period (except milestones)
    const { data: oldSnapshots, error: selectError } = await client
      .from('canvas_snapshots')
      .select('id, metadata')
      .eq('canvas_id', canvasId)
      .lt('created_at', cutoffDate.toISOString());

    if (selectError) {
      throw new Error(`Failed to select old snapshots: ${selectError.message}`);
    }

    const snapshotsToDelete =
      oldSnapshots?.filter((s) => {
        const metadata = s.metadata as any;
        return metadata?.triggerType !== 'milestone';
      }) || [];

    if (snapshotsToDelete.length > 0) {
      const { error: deleteError } = await client
        .from('canvas_snapshots')
        .delete()
        .in(
          'id',
          snapshotsToDelete.map((s) => s.id)
        );

      if (deleteError) {
        throw new Error(
          `Failed to delete old snapshots: ${deleteError.message}`
        );
      }
    }

    // Handle excess auto snapshots
    const { data: autoSnapshots, error: autoError } = await client
      .from('canvas_snapshots')
      .select('id')
      .eq('canvas_id', canvasId)
      .contains('metadata', { triggerType: 'auto' })
      .order('created_at', { ascending: false });

    if (autoError) {
      throw new Error(`Failed to select auto snapshots: ${autoError.message}`);
    }

    if (autoSnapshots && autoSnapshots.length > maxAutoSnapshots) {
      const excessAutoSnapshots = autoSnapshots.slice(maxAutoSnapshots);
      const { error: deleteAutoError } = await client
        .from('canvas_snapshots')
        .delete()
        .in(
          'id',
          excessAutoSnapshots.map((s) => s.id)
        );

      if (deleteAutoError) {
        throw new Error(
          `Failed to delete excess auto snapshots: ${deleteAutoError.message}`
        );
      }
    }

    // Handle excess manual snapshots
    const { data: manualSnapshots, error: manualError } = await client
      .from('canvas_snapshots')
      .select('id')
      .eq('canvas_id', canvasId)
      .contains('metadata', { triggerType: 'manual' })
      .order('created_at', { ascending: false });

    if (manualError) {
      throw new Error(
        `Failed to select manual snapshots: ${manualError.message}`
      );
    }

    if (manualSnapshots && manualSnapshots.length > maxManualSnapshots) {
      const excessManualSnapshots = manualSnapshots.slice(maxManualSnapshots);
      const { error: deleteManualError } = await client
        .from('canvas_snapshots')
        .delete()
        .in(
          'id',
          excessManualSnapshots.map((s) => s.id)
        );

      if (deleteManualError) {
        throw new Error(
          `Failed to delete excess manual snapshots: ${deleteManualError.message}`
        );
      }
    }

    const totalDeleted =
      snapshotsToDelete.length +
      Math.max(0, (autoSnapshots?.length || 0) - maxAutoSnapshots) +
      Math.max(0, (manualSnapshots?.length || 0) - maxManualSnapshots);

    console.log('✅ Cleaned up old snapshots:', totalDeleted);
    return totalDeleted;
  } catch (error) {
    console.error('❌ Error cleaning up snapshots:', error);
    throw error;
  }
}

/**
 * Convert database row to CanvasSnapshot type
 */
function convertSnapshotFromDb(row: CanvasSnapshotRow): CanvasSnapshot {
  return {
    id: row.id,
    canvasId: row.canvas_id,
    version: row.version,
    title: row.title,
    description: row.description || undefined,
    nodes: row.nodes as any,
    edges: row.edges as any,
    groups: row.groups as any,
    metadata: row.metadata as any,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}
