# Connector normalization runtime (data layer)

The normalization runtime (`src/shared/lib/connectors/normalize/`, CVS-143) turns **raw
source JSON** into **validated canonical records** ([CVS-139](./canonical-schemas.md)). It is
the core of the product bet: third-party object shapes never leak past this boundary — every
connector emits the same canonical contracts, so metric logic is written once.

It sits between the [fetch runtime](./connector-runtime.md) (CVS-142, which delivers pages of
raw records) and metric binding (CVS-144, which consumes canonical records). Validation runs
**before** any record is returned, so nothing downstream sees an invalid record.

## The seam: mapper → draft → record

A **mapper** is a source-specific function that turns one raw object into zero-or-more
**drafts** — the source-specific half of a canonical record (schema, source id, timestamps,
money, attributes). The runtime fills the shared envelope (schema_version, source, account,
workspace, lineage), validates, and dedupes. Mappers never write envelope boilerplate; the
runtime never sees a source shape.

```ts
type SourceMapper = (input: unknown, ctx: NormalizeContext) => CanonicalDraft[];
```

**One-to-many is first-class:** a WooCommerce/Shopify order maps to a `commerce_order`, one
`order_line_item` per line, and a `customer` reference — all from one source object.

## What the runtime guarantees

`normalizeBatch(mapper, inputs, ctx, options)` → `{ records, report }`:

- **Validated output** — each assembled record passes CVS-139 `validateRecord` before it is
  returned; failures become counted rejections, never thrown.
- **Dedupe** — by canonical `dedupeKey` (`source:account:schema:source_object_id`); a `seen`
  set can be shared across pages so a live run dedupes across pagination.
- **Money** — mappers convert major-unit sources (Woo/Shopify) to canonical **minor units**
  via `toMinor`; Stripe (already minor) passes through.
- **Payload-free reporting** — a `Rejection` carries the schema, source object id (an id we
  persist for lineage anyway), a stable `code`, and the field `path` — **never a raw source
  value**. Messages are built from path + code, so a bad enum value can't leak. Verified by
  test.

## Mappers

Registered per connector in `registry.ts` (`getMapper(connectorId, stream)`): **stripe**
(payments), **ga4** (page_metrics, events), **woocommerce** (orders → order+lines+customer),
**shopify** (orders → order+lines), **posthog** (events). Raw input fixtures live in
`fixtures.ts` (reused by the CVS-154 QA suite).

## Wiring into a live run

`normalizeAsHandler(mapper, ctx, options, sink)` returns a CVS-142 `RecordHandler`, so a fetch
run normalizes each page as it arrives — accepted canonical records go to `sink`, and the run
summary's `skipped`/`rejected` counts come from dedupe/validation here. Fetch and normalize
stay separable: swap the handler, reuse the runtime.
