# Connector normalization (source JSON → canonical records)

The normalization runtime (`src/shared/lib/connectors/normalize/`, CVS-143) turns raw
source objects into validated **canonical records** (CVS-139). It's the layer that keeps
third-party object shapes out of the product model — connectors fetch, this normalizes.

Sits between the **fetch runtime** (CVS-142, which pages raw records) and **metric
binding** (CVS-144, which materializes accepted records into metric values).

## Pipeline

```
raw source object ──▶ Mapper (source-specific) ──▶ CanonicalDraft[]
                                                       │  engine stamps envelope + lineage
                                                       ▼
                                            validateRecord (CVS-139)
                                          ┌──────────┴───────────┐
                                    accepted (deduped)      rejected (payload-free)
```

- A **`Mapper`** is a source module: `(raw, ctx) => CanonicalDraft[]`. It returns only the
  schema-specific parts (schema, source_object_id, occurred_at, money, attributes) and may
  emit **multiple** records from one object (e.g. a WooCommerce order → `commerce_order` +
  `order_line_item[]` + `customer`).
- **`normalizeRecords(records, mapper, ctx)`** stamps the shared envelope from the
  `NormalizationContext` (source, account, workspace, observed_at, lineage), validates every
  output against its canonical schema, dedupes by `dedupeKey`, and returns a
  `NormalizationReport`.

## Payload-free by construction

Nothing raw is retained or logged. The `NormalizationReport` carries:
- `accepted: CanonicalRecord[]` — handed to the binding sink (CVS-144), not logged.
- `skipped` — in-batch duplicates (same dedupe key).
- `rejected: { index, schema?, source_object_id?, errors[] }[]` — **source ids + validation
  error codes only**, never field values. A mapper that throws yields a fixed
  `mapper_error` message (the thrown text is discarded so it can't echo a payload).

## Plugging into the fetch runtime

`toRecordHandler(mapper, ctx, sink?)` returns the runtime's `RecordHandler`, so a stream run
normalizes each page as it's fetched and reports `{ accepted, skipped, rejected }` into the
run summary:

```ts
import { runStream } from '@/shared/lib/connectors/runtime';
import { toRecordHandler, getMapper } from '@/shared/lib/connectors/normalize';

const mapper = getMapper('stripe', 'payment_intents')!;
await runStream(adapter, stream, {
  /* …credentials, cursorStore, cursorKey… */
  onRecords: toRecordHandler(mapper, ctx, (records) => bindToMetrics(records)),
});
```

## Mappers shipped (Tier-1)

| connector:stream | canonical output |
| --- | --- |
| `stripe:payment_intents` | `payment` |
| `ga4:page_report` | `page_metric` |
| `ga4:events` | `analytics_event` |
| `woocommerce:orders` | `commerce_order` + `order_line_item[]` + `customer` |
| `shopify:orders` | `commerce_order` + `order_line_item[]` |
| `posthog:events` | `analytics_event` |

Resolve one with `getMapper(connectorId, streamName)`. Money is normalized to **minor units**
(`money.ts`); naive source timestamps are read as UTC (`dates.ts`). Adding a stream = add a
mapper + a registry key; the canonical contracts don't change.
