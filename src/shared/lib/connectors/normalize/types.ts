// Normalization contracts (CVS-143): source JSON → canonical records.
//
// A `Mapper` is a source-specific module that turns one raw source object into 0..N
// canonical *drafts* (the schema-specific parts). The engine (normalizeStream.ts)
// stamps the shared envelope from `NormalizationContext`, validates against CVS-139,
// dedupes, and produces a payload-free report. See docs/data/connector-normalization.md.
import type { CanonicalRecord } from '../canonical';

/** Envelope context the engine stamps onto every draft (from the connector run). */
export interface NormalizationContext {
  source: string; // connector id, e.g. 'stripe'
  sourceAccountId: string;
  workspaceId: string;
  connectorVersion: string; // e.g. 'stripe@1.0.0'
  observedAt: string; // ISO — when Metrimap fetched
  cursor?: string; // carried into lineage
}

/** The schema-specific part a mapper produces; the engine adds the envelope + lineage. */
export interface CanonicalDraft {
  schema: string;
  source_object_id: string;
  occurred_at: string;
  currency?: string;
  amount?: number;
  amount_unit?: 'minor' | 'major';
  attributes: Record<string, unknown>;
  /** Override the default `<schema>@<version>` normalizer tag when useful. */
  normalizer_version?: string;
}

/** A source-specific normalizer: one raw object → 0..N canonical drafts. */
export type Mapper = (raw: unknown, ctx: NormalizationContext) => CanonicalDraft[];

/** A payload-free record of why one input was rejected — ids + validation errors only. */
export interface RejectedRecord {
  index: number; // position in the input page
  schema?: string;
  source_object_id?: string;
  errors: { path: string; code: string; message: string }[];
}

/** The outcome of normalizing a page: the accepted records + payload-free counts/reasons. */
export interface NormalizationReport {
  accepted: CanonicalRecord[];
  acceptedCount: number;
  skipped: number; // in-batch duplicates (same dedupeKey)
  rejected: RejectedRecord[];
  rejectedCount: number;
}
