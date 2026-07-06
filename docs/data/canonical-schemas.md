# Canonical schemas (data layer)

The canonical schema package (`src/shared/lib/connectors/canonical/`, CVS-139) is the
shared data contract for **both** ingestion paths:

- **Native connectors** — Metrimap fetches from a source API, normalizes into canonical
  records (CVS-140–150).
- **Agent push** — the user's agent fetches elsewhere and pushes via MCP/API
  (CVS-98–104).

Both validate, bind, and materialize through the same schemas, so metric logic is never
reinvented per integration. Design authority: the vault doc *"PRD/4. Product/5. Canonical
Schemas and Native Connectors"* and the locked decision on Linear **CVS-137**.

## The envelope

Every canonical record carries the same envelope (`envelope.ts`):

| field | meaning |
| --- | --- |
| `schema` | canonical schema name (discriminator), e.g. `payment` |
| `schema_version` | semver of the schema contract (`1.0.0`) |
| `source` | connector id, e.g. `stripe`, `ga4` |
| `source_account_id` | the connected account/property/store id |
| `source_object_id` | the source's id for this object (lineage + dedupe) |
| `workspace_id` | owning workspace (RLS scope) |
| `observed_at` / `occurred_at` | when Metrimap saw it / when it happened (ISO-8601, offset ok) |
| `currency` / `amount` / `amount_unit` | money (see below); present only on money-bearing schemas |
| `attributes` | typed, per-schema fields |
| `lineage` | `{ connector_version, cursor?, normalizer_version }` |

**Money:** `amount` is the record's principal monetary value (payment amount, order total,
invoice total, line total, product price) and is stored in **minor units** by default
(`amount_unit: "minor"`, e.g. cents). `amount` must be an integer when the unit is minor.
Use the `money.ts` helpers (`toMinor` / `toMajor` / `currencyExponent`, which handle
zero-decimal currencies like JPY and three-decimal like KWD).

## MVP schemas (v1)

Only the schemas the Tier-1 connectors need are fully defined; the rest are reserved names
in `registry.ts` (`LATER_SCHEMA_NAMES`) and defined when their connector lands.

| family | schemas |
| --- | --- |
| payments | `payment`, `refund`, `payout`, `subscription`, `invoice` |
| commerce | `commerce_order`, `order_line_item`, `product`, `customer` |
| analytics | `analytics_event`, `page_metric`, `funnel_step`, `cohort` |

Reserved for later (marketing/sales/long tail): `ad_campaign`, `ad_metric`, `lead`, `deal`,
`ticket`, `balance_transaction`, `dispute`, `tax_document`, `ledger_entry`, `inventory_item`,
`session`, `feature_flag`, … (see `LATER_SCHEMA_NAMES`).

Source-specific extras belong in the typed `attributes` object of a schema **only when a
known use case needs them** — not as a dumping ground for raw payload fields. No raw
third-party payloads are stored by default (locked in CVS-137).

## Validating a record

```ts
import { validateRecord, dedupeKey } from '@/shared/lib/connectors/canonical';

const res = validateRecord(record);
if (!res.ok) {
  // res.errors: { path, code, message }[] — surface in a connector run report
} else {
  const key = dedupeKey(res.record); // stable upsert key across runs
}
```

`validateRecord` never throws. Beyond Zod shape validation it enforces two cross-field
rules: the `schema_version` must match the registered version, and `amount` must be an
integer when `amount_unit` is `"minor"`. Error codes include `unknown_schema`,
`schema_not_yet_supported` (a reserved name), `version_mismatch`, and `non_integer_minor`.

## Versioning

`schema_version` is explicit per record and checked on validation. Bump
`CANONICAL_SCHEMA_VERSION` (and a schema's registered `version`) on a breaking change;
normalizers then emit the new version and old records fail fast with `version_mismatch`
rather than silently mis-binding.

## Not here

Manifest/JSON-Schema export (for the connector registry + external contract) is **CVS-140**;
the fetch/normalization/binding runtime is **CVS-141–145**. This package is contracts +
validation only.
