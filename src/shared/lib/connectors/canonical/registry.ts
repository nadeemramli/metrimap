// Canonical schema registry + validation + dedupe (CVS-139).
//
// One place that knows every canonical schema, validates an unknown record against
// the right one, and derives a stable dedupe key. Both ingestion paths use this:
// native connectors (Metrimap fetches → normalizes) and agent push (MCP/API,
// CVS-98–104). See docs/data/canonical-schemas.md and the locked decision on CVS-137.
import type { z } from 'zod';
import type { CanonicalSchemaDef } from './envelope';
import { MVP_SCHEMA_DEFS, type AnyCanonicalRecord } from './schemas';

/** name → definition, for the MVP (fully-defined) schemas. */
export const CANONICAL_SCHEMAS = Object.fromEntries(
  MVP_SCHEMA_DEFS.map((d) => [d.name, d])
) as Record<(typeof MVP_SCHEMA_DEFS)[number]['name'], CanonicalSchemaDef>;

export type CanonicalSchemaName = keyof typeof CANONICAL_SCHEMAS;
export const CANONICAL_SCHEMA_NAMES = Object.keys(CANONICAL_SCHEMAS) as CanonicalSchemaName[];

/**
 * Schemas named by the design (vault doc) but not yet defined — they get a full
 * definition when their connector lands (Tier-2/3). Kept here so the registry is
 * the single list of canonical names and nothing silently invents a new one.
 */
export const LATER_SCHEMA_NAMES = [
  // payments/finance
  'balance_transaction',
  'dispute',
  'tax_document',
  'ledger_entry',
  // commerce
  'inventory_item',
  'cart',
  'fulfillment',
  // analytics
  'session',
  'feature_flag',
  // marketing
  'ad_campaign',
  'ad_metric',
  'social_post',
  'social_engagement',
  'email_campaign',
  'search_query_metric',
  'video_metric',
  // sales & support
  'lead',
  'deal',
  'company',
  'ticket',
  'customer_health',
] as const;
export type LaterSchemaName = (typeof LATER_SCHEMA_NAMES)[number];

/** Look up a defined schema by name. */
export function getSchemaDef(name: string): CanonicalSchemaDef | undefined {
  return CANONICAL_SCHEMAS[name as CanonicalSchemaName];
}

// --- Validation -----------------------------------------------------------

export interface ValidationError {
  path: string;
  code: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; record: CanonicalRecord; def: CanonicalSchemaDef }
  | { ok: false; errors: ValidationError[] };

/** A validated canonical record — the discriminated union of every MVP schema. */
export type CanonicalRecord = AnyCanonicalRecord;

function issuePath(issue: z.ZodIssue): string {
  return issue.path.length ? issue.path.join('.') : '$';
}

/**
 * Validate an unknown value against its declared canonical schema. Returns a
 * structured result so connector run reports can surface exactly what failed —
 * never throws. Also enforces the two cross-field rules the Zod object can't:
 * schema-version match and integer amounts when `amount_unit` is "minor".
 */
export function validateRecord(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: [{ path: '$', code: 'invalid_type', message: 'Record must be an object' }] };
  }
  const name = (input as { schema?: unknown }).schema;
  if (typeof name !== 'string' || name.length === 0) {
    return { ok: false, errors: [{ path: 'schema', code: 'missing_schema', message: 'Record is missing a "schema" discriminator' }] };
  }
  const def = getSchemaDef(name);
  if (!def) {
    const later = (LATER_SCHEMA_NAMES as readonly string[]).includes(name);
    return {
      ok: false,
      errors: [{
        path: 'schema',
        code: later ? 'schema_not_yet_supported' : 'unknown_schema',
        message: later
          ? `Canonical schema "${name}" is registered but not yet implemented`
          : `Unknown canonical schema "${name}"`,
      }],
    };
  }

  const parsed = def.schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => ({ path: issuePath(i), code: i.code, message: i.message })),
    };
  }
  const record = parsed.data as CanonicalRecord;

  if (record.schema_version !== def.version) {
    return {
      ok: false,
      errors: [{
        path: 'schema_version',
        code: 'version_mismatch',
        message: `Expected ${def.name}@${def.version}, got "${record.schema_version}"`,
      }],
    };
  }
  if (record.amount_unit === 'minor' && record.amount !== undefined && !Number.isInteger(record.amount)) {
    return {
      ok: false,
      errors: [{ path: 'amount', code: 'non_integer_minor', message: 'amount must be an integer when amount_unit is "minor"' }],
    };
  }

  return { ok: true, record, def };
}

// --- Dedupe / lineage -----------------------------------------------------

/**
 * Stable key for deduping and upserting a record across runs. Source object ids
 * are unique per (source, account, schema), so the same object always maps to the
 * same key regardless of when it was fetched.
 */
export function dedupeKey(record: {
  source: string;
  source_account_id: string;
  schema: string;
  source_object_id: string;
}): string {
  return `${record.source}:${record.source_account_id}:${record.schema}:${record.source_object_id}`;
}
