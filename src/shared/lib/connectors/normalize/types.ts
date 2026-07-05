// Normalization contracts (CVS-143).
//
// A source-specific mapper turns ONE raw source object into zero-or-more canonical
// *drafts* (the source-specific bits); the runtime fills the shared envelope, validates
// against the CVS-139 schemas, dedupes, and produces a payload-free report. Mappers never
// see the envelope boilerplate and the runtime never sees source shapes — the seam is the
// draft. See docs/data/connector-normalization.md.
import type { AmountUnit, CanonicalRecord } from '../canonical';

/** Run-level context the runtime injects into every canonical record's envelope. */
export interface NormalizeContext {
  /** Connector id, e.g. "stripe" — becomes the record `source`. */
  source: string;
  source_account_id: string;
  workspace_id: string;
  /** Lineage: the connector + normalizer versions that produced the record. */
  connector_version: string;
  normalizer_version: string;
  /** Lineage cursor for the page this object came from. */
  cursor?: string;
  /** When the run observed the data; defaults to now at assembly time. */
  observed_at?: string;
}

/**
 * The source-specific half of a canonical record. The mapper supplies the schema, the
 * source object id, timestamps, money, and typed attributes; the runtime supplies the
 * rest of the envelope (schema_version, source, account, workspace, lineage).
 */
export interface CanonicalDraft {
  schema: string;
  source_object_id: string;
  occurred_at: string;
  observed_at?: string;
  currency?: string;
  amount?: number;
  amount_unit?: AmountUnit;
  attributes: Record<string, unknown>;
}

/** Maps one raw source object to zero-or-more drafts (one-to-many is supported). */
export type SourceMapper = (input: unknown, ctx: NormalizeContext) => CanonicalDraft[];

/** A registered mapper module for one connector, keyed by stream name. */
export type ConnectorMappers = Record<string, SourceMapper>;

/**
 * A payload-free explanation of why a record was dropped. Carries the schema, the source
 * object id (an id we persist for lineage anyway), a stable code, and the field path —
 * never a raw source value.
 */
export interface Rejection {
  schema?: string;
  source_object_id?: string;
  code: string;
  path?: string;
  message: string;
}

/** Payload-free summary of a normalization pass. Counts + rejections, never raw data. */
export interface NormalizeReport {
  source: string;
  stream: string;
  /** Raw source objects processed. */
  processed: number;
  /** Canonical drafts produced by the mapper(s). */
  produced: number;
  accepted: number;
  rejected: number;
  /** Drafts dropped as duplicates of an already-accepted dedupe key. */
  duplicates: number;
  rejections: Rejection[];
}

/** The output of normalizing a batch: the accepted canonical records + a report. */
export interface NormalizeResult {
  records: CanonicalRecord[];
  report: NormalizeReport;
}

/** Thrown by a mapper when a source object cannot be mapped at all (e.g. no id). */
export class MappingError extends Error {
  readonly code: string;
  readonly path?: string;
  readonly schema?: string;
  readonly sourceObjectId?: string;

  constructor(code: string, message: string, opts: { path?: string; schema?: string; sourceObjectId?: string } = {}) {
    super(message);
    this.name = 'MappingError';
    this.code = code;
    this.path = opts.path;
    this.schema = opts.schema;
    this.sourceObjectId = opts.sourceObjectId;
  }
}
