// Unified Source resolver — the one place a Source Node's config becomes a
// MetricValue[] series, whatever the origin. Each branch reuses the Phase 1
// contract (sourceBinding) so the output is identical regardless of path.
//
//   manual    -> rows the user typed
//   generate  -> trend/seasonality/noise model
//   file      -> DuckDB SQL over an uploaded CSV/Parquet (browser-only)
//   warehouse -> SQL via the warehouse-proxy edge function (server-side creds)

import type { MetricValue } from '@/shared/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  deriveSeries,
  generateSeries,
  seriesFromRows,
  type GenerateOptions,
  type RawPoint,
} from './sourceBinding';
import { queryFile } from './duckdbEngine';
import { runWarehouseQuery } from '@/shared/lib/supabase/services/sourceConnections';

export type SourceOrigin = 'manual' | 'generate' | 'file' | 'warehouse';

export interface ManualConfig {
  origin: 'manual';
  rows: RawPoint[];
}
export interface GenerateConfig {
  origin: 'generate';
  options: Omit<GenerateOptions, 'anchor'>;
}
export interface FileConfig {
  origin: 'file';
  fileName?: string; // for display; the File itself is transient (not persisted)
  sql: string;
}
export interface WarehouseConfig {
  origin: 'warehouse';
  connectionId: string;
  sql: string;
}
export type SourceConfig =
  | ManualConfig
  | GenerateConfig
  | FileConfig
  | WarehouseConfig;

/** The persisted shape of a Source Node's `data` (canvas_nodes.data JSONB). */
export interface SourceNodeData {
  title?: string;
  config?: SourceConfig;
  series?: MetricValue[]; // last resolved series — fed downstream + previewed
  refreshedAt?: string;
  // Orphaned-binding state: set when a refresh fails (e.g. the connection was
  // removed) but a last-known series exists. The node keeps showing that series
  // and surfaces a "stale" badge — never silently zeroes/deletes. Cleared on a
  // successful refresh.
  stale?: boolean;
  lastError?: string;
  // Legacy v0 fields kept for back-compat reads: { sourceType, sample }
  sourceType?: string;
  sample?: unknown[];
}

export interface ResolveContext {
  client?: SupabaseClient<any>;
  /** Transient uploaded file for `file` origin (cannot be persisted). */
  file?: File;
}

/** Resolve a Source Node config to the metric-value contract. */
export async function resolveSource(
  config: SourceConfig,
  ctx: ResolveContext = {}
): Promise<MetricValue[]> {
  switch (config.origin) {
    case 'manual':
      return deriveSeries(config.rows);

    case 'generate':
      return generateSeries(config.options);

    case 'file': {
      if (!ctx.file) {
        throw new Error('Upload a file before running the query.');
      }
      const rows = await queryFile(ctx.file, config.sql);
      return seriesFromRows(rows);
    }

    case 'warehouse':
      return runWarehouseQuery(config.connectionId, config.sql, ctx.client);

    default: {
      // Exhaustiveness guard.
      const _never: never = config;
      throw new Error(`Unknown source origin: ${JSON.stringify(_never)}`);
    }
  }
}
