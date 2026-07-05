// WooCommerce → canonical (CVS-143). One order → order + line items + customer
// (the one-to-many case). Woo amounts are major-unit decimal strings.
import { toMinor } from '../../canonical';
import { isoUtc } from '../dates';
import type { CanonicalDraft, Mapper } from '../types';

interface WooLineItem {
  id: number;
  product_id?: number;
  sku?: string;
  name?: string;
  quantity: number;
  total: string; // major units, line total
}

interface WooOrder {
  id: number;
  status: string;
  total: string; // major units, order total
  currency: string;
  date_created: string;
  customer_id?: number;
  billing?: { email?: string };
  line_items?: WooLineItem[];
}

const STATUS: Record<string, string> = {
  pending: 'pending',
  processing: 'paid',
  'on-hold': 'pending',
  completed: 'completed',
  cancelled: 'canceled',
  refunded: 'refunded',
  failed: 'canceled',
};

export const mapWooOrder: Mapper = (raw): CanonicalDraft[] => {
  const o = raw as WooOrder;
  const currency = (o.currency ?? '').toUpperCase();
  const cur = currency || 'USD'; // for the minor-unit math only; the draft keeps `currency`
  const occurred_at = isoUtc(o.date_created ?? '');
  const items = o.line_items ?? [];

  const drafts: CanonicalDraft[] = [
    {
      schema: 'commerce_order',
      source_object_id: String(o.id),
      occurred_at,
      currency,
      amount: toMinor(Number(o.total ?? 0), cur),
      amount_unit: 'minor',
      attributes: {
        status: STATUS[o.status] ?? o.status,
        customer_source_id: o.customer_id ? String(o.customer_id) : undefined,
        line_item_count: items.length,
      },
    },
  ];

  for (const li of items) {
    const qty = li.quantity;
    drafts.push({
      schema: 'order_line_item',
      source_object_id: `${o.id}:${li.id}`,
      occurred_at,
      currency,
      amount: toMinor(Number(li.total ?? 0), cur),
      amount_unit: 'minor',
      attributes: {
        order_source_id: String(o.id),
        product_source_id: li.product_id != null ? String(li.product_id) : undefined,
        sku: li.sku,
        title: li.name,
        quantity: qty,
        unit_amount: qty ? toMinor(Number(li.total ?? 0) / qty, cur) : undefined,
      },
    });
  }

  if (o.customer_id) {
    drafts.push({
      schema: 'customer',
      source_object_id: String(o.customer_id),
      occurred_at,
      attributes: { email: o.billing?.email },
    });
  }

  return drafts;
};
