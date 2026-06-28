// Client access layer for Data Source Phase 3 (warehouse connections).
//
// Connection metadata is read directly from `source_connections` (RLS scopes it
// to the owner). Anything touching a credential — save, test, query — goes
// through the `warehouse-proxy` edge function, because the password must never
// be read by the browser (see docs/backlog/data-source-architecture.md).

import type { MetricValue } from '@/shared/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import { seriesFromRows } from '@/features/canvas/utils/sourceBinding';

export interface SourceConnectionInput {
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  ssl?: boolean;
}

export interface SourceConnection extends SourceConnectionInput {
  id: string;
  warehouse_type: string;
  created_at: string;
}

type Client = SupabaseClient<any>;

// `source_connections` isn't in the generated Database types until the migration
// is applied and `npm run prisma:types` is run. Until then, query through `any`.
const asDb = (c?: Client): any => c || supabase();

/** List the caller's saved warehouse connections (no secrets). */
export async function listConnections(
  authenticatedClient?: Client
): Promise<SourceConnection[]> {
  const { data, error } = await asDb(authenticatedClient)
    .from('source_connections')
    .select('id, name, warehouse_type, host, port, database, username, ssl, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as SourceConnection[];
}

/** Test a connection's credentials without saving them. */
export async function testConnection(
  connection: SourceConnectionInput,
  password: string,
  authenticatedClient?: Client
): Promise<void> {
  const client = authenticatedClient || supabase();
  const { data, error } = await client.functions.invoke('warehouse-proxy', {
    body: { action: 'test', connection, password },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
}

/** Save a connection + its credential (credential stored server-side only). */
export async function saveConnection(
  connection: SourceConnectionInput,
  password: string,
  authenticatedClient?: Client
): Promise<string> {
  const client = authenticatedClient || supabase();
  const { data, error } = await client.functions.invoke('warehouse-proxy', {
    body: { action: 'save', connection, password },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data.id as string;
}

/** Delete a connection (cascades to its secret via FK ON DELETE CASCADE). */
export async function deleteConnection(
  id: string,
  authenticatedClient?: Client
): Promise<void> {
  const { error } = await asDb(authenticatedClient)
    .from('source_connections')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Run a query against a saved connection and resolve it to the metric-value
 * contract. The SQL must return columns aliased `period` and `value`.
 */
export async function runWarehouseQuery(
  connectionId: string,
  sql: string,
  authenticatedClient?: Client
): Promise<MetricValue[]> {
  const client = authenticatedClient || supabase();
  const { data, error } = await client.functions.invoke('warehouse-proxy', {
    body: { action: 'query', connectionId, sql },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return seriesFromRows((data?.rows ?? []) as Array<Record<string, unknown>>);
}
