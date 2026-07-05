// Shopify source mappers (CVS-143).
//
// Assumes the connector adapter (CVS-149) has already flattened the GraphQL Admin order
// node into plain fields (ids, ISO timestamps, major-unit money strings, a line_items
// array). A Shopify order is one-to-many: order + line items, mirroring WooCommerce.
import { toMinor } from '../../canonical';
import type { CanonicalDraft, SourceMapper } from '../types';
import { asObject, optNum, optStr, requireId, toIso } from './util';

/** Shopify order → commerce_order + order_line_item[]. */
export const shopifyOrder: SourceMapper = (input): CanonicalDraft[] => {
  const obj = asObject(input, 'commerce_order');
  const orderId = requireId(obj, ['id'], 'commerce_order');
  const currency = optStr(obj, 'currency');
  const occurred = toIso(obj.created_at ?? obj.createdAt, 'created_at', 'commerce_order');
  const total = optNum(obj, 'total_amount') ?? optNum(obj, 'total_price');
  const lines = Array.isArray(obj.line_items) ? obj.line_items : [];

  const drafts: CanonicalDraft[] = [
    {
      schema: 'commerce_order',
      source_object_id: orderId,
      occurred_at: occurred,
      currency,
      amount: total !== undefined && currency ? toMinor(total, currency) : undefined,
      amount_unit: 'minor',
      attributes: {
        status: obj.status ?? obj.displayFulfillmentStatus,
        customer_source_id: optStr(obj, 'customer_id'),
        line_item_count: lines.length,
      },
    },
  ];

  for (const raw of lines) {
    const line = asObject(raw, 'order_line_item');
    const lineId = requireId(line, ['id'], 'order_line_item');
    const qty = optNum(line, 'quantity') ?? 1;
    const unit = optNum(line, 'unit_amount') ?? optNum(line, 'unit_price');
    const unitMinor = unit !== undefined && currency ? toMinor(unit, currency) : undefined;
    drafts.push({
      schema: 'order_line_item',
      source_object_id: lineId,
      occurred_at: occurred,
      currency,
      amount: unitMinor !== undefined ? unitMinor * qty : undefined,
      amount_unit: 'minor',
      attributes: {
        order_source_id: orderId,
        product_source_id: optStr(line, 'product_id'),
        sku: optStr(line, 'sku'),
        title: optStr(line, 'title'),
        quantity: qty,
        unit_amount: unitMinor,
      },
    });
  }

  return drafts;
};

export const SHOPIFY_MAPPERS = { orders: shopifyOrder };
