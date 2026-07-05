// Stripe source mappers (CVS-143).
//
// Stripe amounts are already in minor units and timestamps are epoch seconds, so mapping
// is mostly a rename into the canonical `payment` shape. Semantic checks (status enum,
// integer-minor amount) are enforced by the canonical schema, not here.
import type { CanonicalDraft, SourceMapper } from '../types';
import { asObject, optStr, optNum, requireId, toIso } from './util';

/** Stripe PaymentIntent/Charge → canonical `payment`. */
export const stripePayment: SourceMapper = (input): CanonicalDraft[] => {
  const obj = asObject(input, 'payment');
  const id = requireId(obj, ['id'], 'payment');
  return [
    {
      schema: 'payment',
      source_object_id: id,
      occurred_at: toIso(obj.created, 'created', 'payment'),
      currency: typeof obj.currency === 'string' ? obj.currency.toUpperCase() : undefined,
      amount: optNum(obj, 'amount'),
      amount_unit: 'minor',
      attributes: {
        status: obj.status,
        customer_source_id: optStr(obj, 'customer'),
        payment_method: optStr(obj, 'payment_method_type') ?? optStr(obj, 'payment_method'),
      },
    },
  ];
};

export const STRIPE_MAPPERS = { payments: stripePayment };
