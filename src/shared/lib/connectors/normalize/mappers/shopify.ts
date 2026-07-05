// Shopify GraphQL Admin → canonical (CVS-143). Money is major-unit decimal strings
// in `shopMoney`. One order → order + line items.
import { toMinor } from '../../canonical';
import { isoUtc } from '../dates';
import type { CanonicalDraft, Mapper } from '../types';

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyLineItem {
  id: string;
  sku?: string;
  title?: string;
  quantity: number;
  originalTotalSet?: { shopMoney: ShopifyMoney };
}

interface ShopifyOrder {
  id: string; // gid://shopify/Order/123
  displayFinancialStatus?: string;
  processedAt?: string;
  createdAt?: string;
  totalPriceSet?: { shopMoney: ShopifyMoney };
  customer?: { id: string } | null;
  lineItems?: { nodes: ShopifyLineItem[] };
}

const STATUS: Record<string, string> = {
  PAID: 'paid',
  PARTIALLY_PAID: 'paid',
  PENDING: 'pending',
  AUTHORIZED: 'pending',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'refunded',
  VOIDED: 'canceled',
};

export const mapShopifyOrder: Mapper = (raw): CanonicalDraft[] => {
  const o = raw as ShopifyOrder;
  const money = o.totalPriceSet?.shopMoney;
  const currency = (money?.currencyCode ?? '').toUpperCase();
  const cur = currency || 'USD';
  const occurred_at = isoUtc(o.processedAt ?? o.createdAt ?? '');
  const items = o.lineItems?.nodes ?? [];

  const drafts: CanonicalDraft[] = [
    {
      schema: 'commerce_order',
      source_object_id: o.id,
      occurred_at,
      currency,
      amount: toMinor(Number(money?.amount ?? 0), cur),
      amount_unit: 'minor',
      attributes: {
        status: o.displayFinancialStatus ? (STATUS[o.displayFinancialStatus] ?? o.displayFinancialStatus.toLowerCase()) : 'pending',
        customer_source_id: o.customer?.id ?? undefined,
        line_item_count: items.length,
      },
    },
  ];

  for (const li of items) {
    const m = li.originalTotalSet?.shopMoney;
    const liCur = (m?.currencyCode ?? currency).toUpperCase() || 'USD';
    drafts.push({
      schema: 'order_line_item',
      source_object_id: `${o.id}:${li.id}`,
      occurred_at,
      currency: (m?.currencyCode ?? currency).toUpperCase() || undefined,
      amount: m ? toMinor(Number(m.amount ?? 0), liCur) : undefined,
      amount_unit: m ? 'minor' : undefined,
      attributes: {
        order_source_id: o.id,
        sku: li.sku,
        title: li.title,
        quantity: li.quantity,
        unit_amount: m && li.quantity ? toMinor(Number(m.amount ?? 0) / li.quantity, liCur) : undefined,
      },
    });
  }

  return drafts;
};
