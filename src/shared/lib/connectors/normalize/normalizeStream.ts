// Normalization engine (CVS-143): run a mapper over a page of source records, stamp
// the canonical envelope, validate against CVS-139, dedupe, and report — payload-free.
// `toRecordHandler` adapts it to the CVS-142 fetch runtime's `onRecords` seam.
import {
  CANONICAL_SCHEMA_VERSION,
  dedupeKey,
  validateRecord,
  type CanonicalRecord,
} from '../canonical';
import type { PageOutcome, RecordHandler } from '../runtime';
import type { CanonicalDraft, Mapper, NormalizationContext, NormalizationReport, RejectedRecord } from './types';

/** Stamp the shared envelope + lineage onto a schema-specific draft. */
function assemble(draft: CanonicalDraft, ctx: NormalizationContext): Record<string, unknown> {
  return {
    schema: draft.schema,
    schema_version: CANONICAL_SCHEMA_VERSION,
    source: ctx.source,
    source_account_id: ctx.sourceAccountId,
    source_object_id: draft.source_object_id,
    workspace_id: ctx.workspaceId,
    observed_at: ctx.observedAt,
    occurred_at: draft.occurred_at,
    ...(draft.currency !== undefined ? { currency: draft.currency } : {}),
    ...(draft.amount !== undefined ? { amount: draft.amount } : {}),
    ...(draft.amount_unit !== undefined ? { amount_unit: draft.amount_unit } : {}),
    attributes: draft.attributes,
    lineage: {
      connector_version: ctx.connectorVersion,
      ...(ctx.cursor !== undefined ? { cursor: ctx.cursor } : {}),
      normalizer_version: draft.normalizer_version ?? `${draft.schema}@${CANONICAL_SCHEMA_VERSION}`,
    },
  };
}

/**
 * Normalize a page of raw source records into validated canonical records. Every
 * output is validated (CVS-139) before it's accepted; a record that fails — or a
 * mapper that throws — becomes a payload-free rejection (source ids + error codes,
 * never raw data). In-batch duplicates (same dedupeKey) are skipped, not rejected.
 */
export function normalizeRecords(
  records: unknown[],
  mapper: Mapper,
  ctx: NormalizationContext
): NormalizationReport {
  const accepted: CanonicalRecord[] = [];
  const rejected: RejectedRecord[] = [];
  const seen = new Set<string>();
  let skipped = 0;

  records.forEach((raw, index) => {
    let drafts: CanonicalDraft[];
    try {
      drafts = mapper(raw, ctx);
    } catch {
      // Never surface the thrown message — it could echo raw payload data.
      rejected.push({ index, errors: [{ path: '$', code: 'mapper_error', message: 'normalizer failed to map source record' }] });
      return;
    }
    for (const draft of drafts) {
      const res = validateRecord(assemble(draft, ctx));
      if (!res.ok) {
        rejected.push({ index, schema: draft.schema, source_object_id: draft.source_object_id, errors: res.errors });
        continue;
      }
      const key = dedupeKey(res.record);
      if (seen.has(key)) {
        skipped++;
        continue;
      }
      seen.add(key);
      accepted.push(res.record);
    }
  });

  return { accepted, acceptedCount: accepted.length, skipped, rejected, rejectedCount: rejected.length };
}

/** Sink for accepted records (the CVS-144 metric-binding layer implements this). */
export type RecordSink = (records: CanonicalRecord[]) => void | Promise<void>;

/**
 * Adapt a mapper into the fetch runtime's `onRecords` handler: each page is normalized,
 * accepted records go to the sink, and the runtime gets payload-free accepted/skipped/
 * rejected counts for its run report.
 */
export function toRecordHandler(mapper: Mapper, ctx: NormalizationContext, sink?: RecordSink): RecordHandler {
  return async (records: unknown[]): Promise<PageOutcome> => {
    const report = normalizeRecords(records, mapper, ctx);
    if (sink && report.accepted.length) await sink(report.accepted);
    return { accepted: report.acceptedCount, skipped: report.skipped, rejected: report.rejectedCount };
  };
}
