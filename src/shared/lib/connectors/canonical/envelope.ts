// Canonical record envelope + schema-definition helper (CVS-139).
//
// Every canonical record — regardless of source (Stripe, GA4, WooCommerce, …) —
// carries the same envelope. Per-schema shapes extend it with a `schema` literal
// and a typed `attributes` object. Validation and versioning rules live in
// `registry.ts`; this file only defines the shared contract. See the locked
// decision on Linear CVS-137 and docs/data/canonical-schemas.md.
import { z } from 'zod';

/** Current envelope + schema contract version. Bump on breaking schema changes. */
export const CANONICAL_SCHEMA_VERSION = '1.0.0';

// ISO-8601 timestamp; accepts both `Z` and numeric offsets like `+08:00`.
const isoDateTime = z.string().datetime({ offset: true });

export const AmountUnit = z.enum(['minor', 'major']);
export type AmountUnit = z.infer<typeof AmountUnit>;

/** Provenance carried on every record so materialized metrics stay traceable. */
export const Lineage = z.object({
  connector_version: z.string().min(1),
  cursor: z.string().optional(),
  normalizer_version: z.string().min(1),
});
export type Lineage = z.infer<typeof Lineage>;

export const SCHEMA_FAMILIES = [
  'payments',
  'commerce',
  'analytics',
  'marketing',
  'sales',
] as const;
export type SchemaFamily = (typeof SCHEMA_FAMILIES)[number];

/** Whether a schema requires the money fields (currency/amount/amount_unit). */
export type MoneyMode = 'required' | 'optional' | 'none';

/**
 * The shared envelope every canonical record carries. Money fields are optional
 * at the base; money-bearing schemas (payment, order, …) re-require them via
 * `moneyRequired`. `amount` is the record's principal monetary value (payment
 * amount, order total, invoice total, line total, product price).
 */
export const canonicalEnvelope = z.object({
  schema: z.string().min(1),
  schema_version: z.string().min(1),
  source: z.string().min(1),
  source_account_id: z.string().min(1),
  source_object_id: z.string().min(1),
  workspace_id: z.string().min(1),
  observed_at: isoDateTime,
  occurred_at: isoDateTime,
  currency: z.string().length(3).optional(),
  amount: z.number().finite().optional(),
  amount_unit: AmountUnit.optional(),
  attributes: z.record(z.unknown()),
  lineage: Lineage,
});
export type CanonicalEnvelope = z.infer<typeof canonicalEnvelope>;

/** Shape fragment that makes the money fields required (spread into `.extend`). */
export const moneyRequired = {
  currency: z.string().length(3),
  amount: z.number().finite(),
  amount_unit: AmountUnit,
} as const;

/** A registered canonical schema: its Zod contract plus metadata. */
export interface CanonicalSchemaDef<Name extends string = string> {
  name: Name;
  version: string;
  family: SchemaFamily;
  mvp: boolean;
  money: MoneyMode;
  schema: z.ZodTypeAny;
}

/** Wrap a built Zod record schema with its registry metadata. */
export function canonical<Name extends string>(
  name: Name,
  family: SchemaFamily,
  schema: z.ZodTypeAny,
  opts: { money?: MoneyMode; mvp?: boolean; version?: string } = {}
): CanonicalSchemaDef<Name> {
  return {
    name,
    family,
    schema,
    money: opts.money ?? 'none',
    mvp: opts.mvp ?? true,
    version: opts.version ?? CANONICAL_SCHEMA_VERSION,
  };
}
