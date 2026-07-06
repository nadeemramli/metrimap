// Data ingest (CVS-102): agent-pushed series / CSV → RLS-scoped staging (TTL) →
// map → materialize onto a metric card (card.data drives the canvas; catalogued
// cards also sync to metric_values). Staging tables: import_batches / import_rows
// (migration 20260704140000). Idempotent materialize (replaces card.data + upserts
// the tracked series); staging auto-expires.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/shared/lib/supabase/types';
import type { MetricValue } from '@/shared/types';
import { updateMetricCard } from '@/shared/lib/supabase/services/metric-cards';
import { syncCardValuesToCatalog } from '@/shared/lib/supabase/services/trackedMetrics';
import {
  MaterializeInput,
  StageSeriesInput,
  UploadCsvInput,
} from './schemas';

type Client = SupabaseClient<Database>;

/** Minimal CSV parser: handles quoted fields, escaped quotes ("") and CRLF. */
export function parseCsv(text: string): {
  columns: string[];
  rows: Array<Record<string, string>>;
} {
  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQuotes = false;
        } else cur += ch;
      } else if (ch === '"') inQuotes = true;
      else if (ch === ',') {
        out.push(cur);
        cur = '';
      } else cur += ch;
    }
    out.push(cur);
    return out.map((c) => c.trim());
  };

  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((l) => l.length > 0);
  if (lines.length === 0) return { columns: [], rows: [] };
  const columns = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const row: Record<string, string> = {};
    columns.forEach((col, i) => {
      row[col] = cells[i] ?? '';
    });
    return row;
  });
  return { columns, rows };
}

export interface IngestReport {
  batchId: string;
  cardId: string;
  materialized: number;
  skipped: number;
  errors: string[];
}

export function createIngest(client: Client, userId: string) {
  async function insertBatch(insert: {
    project_id: string;
    kind: 'series' | 'csv';
    filename?: string;
    columns?: string[];
    row_count: number;
  }): Promise<string> {
    const { data, error } = await client
      .from('import_batches')
      .insert({
        user_id: userId,
        project_id: insert.project_id,
        kind: insert.kind,
        filename: insert.filename ?? null,
        columns: insert.columns ?? null,
        row_count: insert.row_count,
      })
      .select('id')
      .single();
    if (error) throw new Error(`stage batch failed: ${error.message}`);
    return data.id;
  }

  async function insertRows(
    batchId: string,
    rows: Array<Record<string, unknown>>
  ): Promise<void> {
    if (!rows.length) return;
    const payload = rows.map((data, row_index) => ({
      batch_id: batchId,
      row_index,
      data: data as unknown as Json,
    }));
    const { error } = await client.from('import_rows').insert(payload);
    if (error) throw new Error(`stage rows failed: ${error.message}`);
  }

  return {
    /** Stage a structured series (period/value rows) for later materialization. */
    stageSeries: async (input: unknown) => {
      const v = StageSeriesInput.parse(input);
      const batchId = await insertBatch({
        project_id: v.projectId,
        kind: 'series',
        row_count: v.series.length,
      });
      await insertRows(batchId, v.series);
      return { batchId, kind: 'series' as const, rowCount: v.series.length };
    },

    /** Stage raw CSV — parsed into columns + rows for a mapping step. */
    uploadCsv: async (input: unknown) => {
      const v = UploadCsvInput.parse(input);
      const { columns, rows } = parseCsv(v.csv);
      if (!columns.length) throw new Error('CSV had no header row');
      const batchId = await insertBatch({
        project_id: v.projectId,
        kind: 'csv',
        filename: v.filename,
        columns,
        row_count: rows.length,
      });
      await insertRows(batchId, rows);
      return { batchId, kind: 'csv' as const, columns, rowCount: rows.length };
    },

    /** Map a staged batch onto a metric card and materialize the series. */
    materialize: async (input: unknown): Promise<IngestReport> => {
      const v = MaterializeInput.parse(input);
      const errors: string[] = [];

      const { data: batch, error: bErr } = await client
        .from('import_batches')
        .select('id, kind, status')
        .eq('id', v.batchId)
        .maybeSingle();
      if (bErr) throw new Error(bErr.message);
      if (!batch) throw new Error('Batch not found or expired');

      const { data: rows, error: rErr } = await client
        .from('import_rows')
        .select('data')
        .eq('batch_id', v.batchId)
        .order('row_index', { ascending: true });
      if (rErr) throw new Error(rErr.message);

      const { periodColumn, valueColumn, cardId } = v.mapping;
      let skipped = 0;
      const series: MetricValue[] = [];
      for (const { data } of (rows ?? []) as unknown as Array<{
        data: Record<string, unknown>;
      }>) {
        const period =
          batch.kind === 'csv'
            ? String(data[periodColumn ?? 'period'] ?? '')
            : String(data.period ?? '');
        const rawValue =
          batch.kind === 'csv' ? data[valueColumn ?? 'value'] : data.value;
        const value = Number(rawValue);
        if (!period || Number.isNaN(value)) {
          skipped++;
          continue;
        }
        series.push({
          period,
          value,
          change_percent: Number(data.change_percent ?? 0) || 0,
          trend: (data.trend as MetricValue['trend']) ?? 'neutral',
        });
      }

      if (batch.kind === 'csv' && (!periodColumn || !valueColumn)) {
        throw new Error('CSV materialize requires mapping.periodColumn and mapping.valueColumn');
      }

      try {
        // card.data drives the canvas; catalogued cards also sync to metric_values.
        await updateMetricCard(cardId, { data: series }, client);
        const { data: card } = await client
          .from('metric_cards')
          .select('tracked_metric_id')
          .eq('id', cardId)
          .maybeSingle();
        await syncCardValuesToCatalog(
          card?.tracked_metric_id ?? null,
          series,
          'import',
          client
        );
        await client
          .from('import_batches')
          .update({ status: 'materialized', materialized_count: series.length, updated_at: new Date().toISOString() })
          .eq('id', v.batchId);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(msg);
        await client
          .from('import_batches')
          .update({ status: 'failed', error: msg, updated_at: new Date().toISOString() })
          .eq('id', v.batchId);
      }

      return { batchId: v.batchId, cardId, materialized: series.length, skipped, errors };
    },
  };
}

export type MetrimapIngest = ReturnType<typeof createIngest>;
