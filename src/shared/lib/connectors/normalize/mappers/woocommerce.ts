// WooCommerce source mappers (CVS-143).
//
// A Woo order is one-to-many: it produces a `commerce_order`, one `order_line_item` per
// line, and a `customer` reference when the order carries customer detail. Woo money is in
// major units (decimal strings) so it is converted to canonical minor units per currency.
import { toMinor } from '../../canonical';
import type { CanonicalDraft, SourceMapper } from '../types';
import { asObject, optNum, optStr, requireId, toIso } from './util';

/** WooCommerce order → commerce_order + order_line_item[] + optional customer. */
export const wooOrder: SourceMapper = (input): CanonicalDraft[] => {
  const obj = asObject(input, 'commerce_order');
  const orderId = requireId(obj, ['id'], 'commerce_order');
  const currency = optStr(obj, 'currency');
  const occurred = toIso(obj.date_created_gmt ?? obj.date_created, 'date_created_gmt', 'commerce_order');
  const total = optNum(obj, 'total');
  const customerId = optStr(obj, 'customer_id');
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
        status: obj.status,
        customer_source_id: customerId,
        line_item_count: lines.length,
      },
    },
  ];

  for (const raw of lines) {
    const line = asObject(raw, 'order_line_item');
    const lineId = requireId(line, ['id'], 'order_line_item');
    const qty = optNum(line, 'quantity') ?? 1;
    const lineTotal = optNum(line, 'total');
    const lineMinor = lineTotal !== undefined && currency ? toMinor(lineTotal, currency) : undefined;
    drafts.push({
      schema: 'order_line_item',
      source_object_id: lineId,
      occurred_at: occurred,
      currency,
      amount: lineMinor,
      amount_unit: 'minor',
      attributes: {
        order_source_id: orderId,
        product_source_id: optStr(line, 'product_id'),
        sku: optStr(line, 'sku'),
        title: optStr(line, 'name'),
        quantity: qty,
        unit_amount: lineMinor !== undefined && qty > 0 ? Math.round(lineMinor / qty) : undefined,
      },
    });
  }

  if (customerId) {
    drafts.push({
      schema: 'customer',
      source_object_id: customerId,
      occurred_at: occurred,
      attributes: {
        email: optStr(obj, 'billing_email'),
        name: optStr(obj, 'customer_name'),
      },
    });
  }

  return drafts;
};

export const WOOCOMMERCE_MAPPERS = { orders: wooOrder };
