import { supabase } from '../client';
import type { Tables, TablesInsert } from '../types';

export type ChangelogRow = Tables<'changelog'>;
export type ChangelogInsert = TablesInsert<'changelog'>;

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  targetId: string;
  targetName: string;
  description: string;
  userId?: string;
  projectId?: string;
  metadata?: Record<string, any>;
}

// Transform database row to ChangelogEntry
function transformChangelogEntry(row: ChangelogRow): ChangelogEntry {
  return {
    id: row.id,
    timestamp: row.timestamp || new Date().toISOString(),
    action: row.action,
    target: row.target,
    targetId: row.target_id || '',
    targetName: row.target_name,
    description: row.description,
    userId: row.user_id || undefined,
    projectId: row.project_id || undefined,
    metadata: row.metadata as Record<string, any> || undefined,
  };
}

// Transform ChangelogEntry to database insert
function transformToInsert(entry: Omit<ChangelogEntry, 'id'>): ChangelogInsert {
  return {
    timestamp: entry.timestamp,
    action: entry.action,
    target: entry.target,
    target_id: entry.targetId,
    target_name: entry.targetName,
    description: entry.description,
    user_id: entry.userId || null,
    project_id: entry.projectId || null,
    metadata: entry.metadata || null,
  };
}

// Log a new changelog entry
export async function logChangelogEntry(entry: Omit<ChangelogEntry, 'id'>) {
  const insertData = transformToInsert(entry);
  
  const { data, error } = await supabase
    .from('changelog')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error logging changelog entry:', error);
    throw error;
  }

  return transformChangelogEntry(data);
}

// Get changelog entries for a specific target
export async function getChangelogForTarget(targetId: string, target: string = 'relationship') {
  const { data, error } = await supabase
    .from('changelog')
    .select('*')
    .eq('target_id', targetId)
    .eq('target', target)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching changelog entries:', error);
    throw error;
  }

  return data?.map(transformChangelogEntry) || [];
}

// Get changelog entries for a project
export async function getProjectChangelog(projectId: string, limit?: number) {
  let query = supabase
    .from('changelog')
    .select('*')
    .eq('project_id', projectId)
    .order('timestamp', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching project changelog:', error);
    throw error;
  }

  return data?.map(transformChangelogEntry) || [];
}

// Helper functions for specific relationship events

export async function logRelationshipCreated(
  relationshipId: string,
  relationshipName: string,
  projectId: string,
  userId: string
) {
  return logChangelogEntry({
    timestamp: new Date().toISOString(),
    action: 'created',
    target: 'relationship',
    targetId: relationshipId,
    targetName: relationshipName,
    description: `Relationship "${relationshipName}" was created`,
    userId,
    projectId,
  });
}

export async function logRelationshipUpdated(
  relationshipId: string,
  relationshipName: string,
  changes: Record<string, { from: any; to: any }>,
  projectId: string,
  userId: string
) {
  const changeDescriptions = Object.entries(changes)
    .map(([field, { from, to }]) => `${field}: ${from} → ${to}`)
    .join(', ');

  return logChangelogEntry({
    timestamp: new Date().toISOString(),
    action: 'updated',
    target: 'relationship',
    targetId: relationshipId,
    targetName: relationshipName,
    description: `Relationship settings updated: ${changeDescriptions}`,
    userId,
    projectId,
    metadata: { changes },
  });
}

export async function logEvidenceAdded(
  relationshipId: string,
  relationshipName: string,
  evidenceTitle: string,
  evidenceType: string,
  projectId: string,
  userId: string
) {
  return logChangelogEntry({
    timestamp: new Date().toISOString(),
    action: 'evidence_added',
    target: 'relationship',
    targetId: relationshipId,
    targetName: relationshipName,
    description: `Evidence "${evidenceTitle}" (${evidenceType}) was added to relationship`,
    userId,
    projectId,
    metadata: { evidenceTitle, evidenceType },
  });
}

export async function logAnalysisRun(
  relationshipId: string,
  relationshipName: string,
  analysisType: string,
  results: Record<string, any>,
  projectId: string,
  userId: string
) {
  return logChangelogEntry({
    timestamp: new Date().toISOString(),
    action: 'analysis_run',
    target: 'relationship',
    targetId: relationshipId,
    targetName: relationshipName,
    description: `${analysisType} analysis was performed on relationship`,
    userId,
    projectId,
    metadata: { analysisType, results },
  });
}

export async function logEvidenceRemoved(
  relationshipId: string,
  relationshipName: string,
  evidenceTitle: string,
  projectId: string,
  userId: string
) {
  return logChangelogEntry({
    timestamp: new Date().toISOString(),
    action: 'evidence_removed',
    target: 'relationship',
    targetId: relationshipId,
    targetName: relationshipName,
    description: `Evidence "${evidenceTitle}" was removed from relationship`,
    userId,
    projectId,
    metadata: { evidenceTitle },
  });
}