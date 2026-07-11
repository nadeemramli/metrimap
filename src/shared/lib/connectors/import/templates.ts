// Import template registry (CVS-151). A template is DATA: a header fingerprint plus
// a declarative field mapping into one canonical schema — adding a new export format
// is a new entry, never an engine change. Matching is case/space-insensitive on
// header names; confidence = required+optional header coverage.
//
// Marketplace templates (Shopee/Lazada/TikTok/CHIP) land once real anonymized export
// files exist to fingerprint (CVS-321 addendum) — fabricating their headers from
// memory would produce silently-wrong matches, which is worse than no match.

export type FieldRef = string | { fixed: string };

export interface ImportTemplate {
  id: string;
  label: string;
  /** Connector id for lineage (`source` on the canonical record). */
  source: string;
  /** Canonical schema every mapped row lands in. */
  schema: string;
  /** All of these headers must be present (normalized comparison). */
  requiredHeaders: string[];
  /** Presence strengthens the match score. */
  optionalHeaders?: string[];
  fields: {
    /** Header carrying the stable source id; falls back to a row hash when absent. */
    sourceObjectId?: string;
    occurredAt: string;
    amount?: string;
    currency?: FieldRef;
    /** Attribute name → header (or fixed value). */
    attributes?: Record<string, FieldRef>;
    /** Map a raw status column into the schema's status enum. */
    statusMap?: { header: string; attribute: string; map: Record<string, string>; default?: string };
  };
}

export function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[\s_()./-]+/g, ' ').trim();
}

/** Stripe Dashboard → Payments → Export (unified payments CSV). */
const stripePayments: ImportTemplate = {
  id: 'stripe_payments_export',
  label: 'Stripe payments export',
  source: 'stripe',
  schema: 'payment',
  requiredHeaders: ['id', 'Created date (UTC)', 'Amount', 'Currency', 'Status'],
  optionalHeaders: ['Amount Refunded', 'Fee', 'Description', 'Customer ID', 'Captured'],
  fields: {
    sourceObjectId: 'id',
    occurredAt: 'Created date (UTC)',
    amount: 'Amount',
    currency: 'Currency',
    attributes: {
      customer_source_id: 'Customer ID',
      description: 'Description',
    },
    statusMap: {
      header: 'Status',
      attribute: 'status',
      map: {
        paid: 'succeeded',
        succeeded: 'succeeded',
        pending: 'pending',
        failed: 'failed',
        refunded: 'refunded',
        'partially refunded': 'partially_refunded',
        canceled: 'canceled',
        cancelled: 'canceled',
      },
      default: 'pending',
    },
  },
};

/** Generic bank/e-wallet statement (date, description, debit, credit, balance). */
const bankStatement: ImportTemplate = {
  id: 'generic_bank_statement',
  label: 'Bank statement',
  source: 'csv_manual',
  schema: 'payment',
  requiredHeaders: ['Date', 'Description', 'Credit'],
  optionalHeaders: ['Debit', 'Balance', 'Reference'],
  fields: {
    occurredAt: 'Date',
    amount: 'Credit',
    attributes: { description: 'Description', status: { fixed: 'succeeded' } },
  },
};

export const IMPORT_TEMPLATES: ImportTemplate[] = [stripePayments, bankStatement];

export interface TemplateMatch {
  template: ImportTemplate;
  /** 0..1 — required coverage gates the match; optional coverage raises the score. */
  score: number;
}

/** Match headers against the registry. Null unless every required header is present. */
export function matchTemplate(
  headers: string[],
  templates: ImportTemplate[] = IMPORT_TEMPLATES
): TemplateMatch | null {
  const have = new Set(headers.map(normalizeHeader));
  let best: TemplateMatch | null = null;
  for (const template of templates) {
    const required = template.requiredHeaders.map(normalizeHeader);
    if (!required.every((h) => have.has(h))) continue;
    const optional = (template.optionalHeaders ?? []).map(normalizeHeader);
    const optionalHits = optional.filter((h) => have.has(h)).length;
    const score =
      (required.length + optionalHits) / (required.length + optional.length || 1);
    if (!best || score > best.score) best = { template, score };
  }
  return best;
}
