// Normalization runtime (CVS-143).
//
// Turns raw source objects into validated canonical records: run a source-specific mapper,
// fill the shared envelope, validate against the CVS-139 schemas, dedupe by source id, and
// report counts + payload-free rejections. Validation happens BEFORE any record is returned,
// so nothing downstream (metric binding, CVS-144) ever sees an invalid record.
import {
  CANONICAL_SCHEMA_VERSION,
  dedupeKey,
  validateRecord,
  type CanonicalRecord,
} from '../canonical';
import type { PageOutcome, RecordHandler } from '../runtime';
import {
  MappingError,
  type CanonicalDraft,
  type NormalizeContext,
  type NormalizeReport,
  type NormalizeResult,
  type Rejection,
  type SourceMapper,
} from './types';

/** Fill the shared envelope around a mapper's draft (CVS-139 envelope contract). */
export function assembleRecord(draft: CanonicalDraft, ctx: NormalizeContext, nowIso: string): unknown {
  return {
    schema: draft.schema,
    schema_version: CANONICAL_SCHEMA_VERSION,
    source: ctx.source,
    source_account_id: ctx.source_account_id,
    source_object_id: draft.source_object_id,
    workspace_id: ctx.workspace_id,
    observed_at: draft.observed_at ?? ctx.observed_at ?? nowIso,
    occurred_at: draft.occurred_at,
    ...(draft.currency !== undefined ? { currency: draft.currency } : {}),
    ...(draft.amount !== undefined ? { amount: draft.amount } : {}),
    ...(draft.amount_unit !== undefined ? { amount_unit: draft.amount_unit } : {}),
    attributes: draft.attributes,
    lineage: {
      connector_version: ctx.connector_version,
      normalizer_version: ctx.normalizer_version,
      ...(ctx.cursor !== undefined ? { cursor: ctx.cursor } : {}),
    },
  };
}

function rejectionFromMappingError(err: MappingError): Rejection {
  return {
    schema: err.schema,
    source_object_id: err.sourceObjectId,
    code: err.code,
    path: err.path,
    message: err.path ? `${err.path}: ${err.code}` : err.code,
  };
}

export interface NormalizeOptions {
  source: string;
  stream: string;
  /** Injected clock for deterministic timestamps in tests; defaults to Date.now. */
  now?: () => number;
  /** Dedupe keys already seen in a prior page/run, so cross-page dedupe holds. */
  seen?: Set<string>;
}

/**
 * Normalize a batch of raw source objects for one stream. Returns the accepted canonical
 * records and a payload-free report. Never throws for bad input — a mapper failure or a
 * validation failure becomes a counted rejection.
 */
export function normalizeBatch(
  mapper: SourceMapper,
  inputs: readonly unknown[],
  ctx: NormalizeContext,
  options: NormalizeOptions
): NormalizeResult {
  const nowIso = new Date(options.now?.() ?? Date.now()).toISOString();
  const seen = options.seen ?? new Set<string>();
  const records: CanonicalRecord[] = [];
  const rejections: Rejection[] = [];
  let produced = 0;
  let duplicates = 0;

  for (const input of inputs) {
    let drafts: CanonicalDraft[];
    try {
      drafts = mapper(input, ctx);
    } catch (err) {
      if (err instanceof MappingError) {
        rejections.push(rejectionFromMappingError(err));
        continue;
      }
      rejections.push({ code: 'mapper_error', message: 'mapper_error' });
      continue;
    }

    for (const draft of drafts) {
      produced += 1;
      const candidate = assembleRecord(draft, ctx, nowIso);
      const result = validateRecord(candidate);
      if (!result.ok) {
        rejections.push({
          schema: draft.schema,
          source_object_id: draft.source_object_id,
          code: result.errors[0]?.code ?? 'invalid',
          path: result.errors[0]?.path,
          message: `${draft.schema}: ${result.errors.map((e) => `${e.path}:${e.code}`).join(', ')}`,
        });
        continue;
      }
      const key = dedupeKey(result.record);
      if (seen.has(key)) {
        duplicates += 1;
        continue;
      }
      seen.add(key);
      records.push(result.record);
    }
  }

  const report: NormalizeReport = {
    source: options.source,
    stream: options.stream,
    processed: inputs.length,
    produced,
    accepted: records.length,
    rejected: rejections.length,
    duplicates,
    rejections,
  };
  return { records, report };
}

/**
 * Adapt a mapper into a CVS-142 `RecordHandler` so a live fetch run normalizes each page
 * as it arrives. Accepted records are pushed to `sink`; the run summary's skipped/rejected
 * counts come from dedupe/validation here. A shared `seen` set dedupes across pages.
 */
export function normalizeAsHandler(
  mapper: SourceMapper,
  ctx: NormalizeContext,
  options: NormalizeOptions,
  sink: (records: CanonicalRecord[]) => void
): RecordHandler {
  const seen = options.seen ?? new Set<string>();
  return (pageRecords: unknown[]): PageOutcome => {
    const { records, report } = normalizeBatch(mapper, pageRecords, ctx, { ...options, seen });
    if (records.length) sink(records);
    return { accepted: report.accepted, skipped: report.duplicates, rejected: report.rejected };
  };
}
