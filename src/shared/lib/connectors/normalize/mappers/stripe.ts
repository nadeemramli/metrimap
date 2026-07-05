// Stripe → canonical (CVS-143). Stripe amounts are already in minor units.
import type { CanonicalDraft, Mapper } from '../types';

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number; // unix seconds
  customer?: string | null;
  payment_method_types?: string[];
}

// Stripe PaymentIntent status → canonical payment status (unknown passes through → rejected).
const STATUS: Record<string, string> = {
  succeeded: 'succeeded',
  canceled: 'canceled',
  processing: 'pending',
  requires_payment_method: 'pending',
  requires_confirmation: 'pending',
  requires_action: 'pending',
  requires_capture: 'pending',
};

export const mapStripePayment: Mapper = (raw): CanonicalDraft[] => {
  const pi = raw as StripePaymentIntent;
  return [
    {
      schema: 'payment',
      source_object_id: pi.id,
      occurred_at: new Date((pi.created ?? 0) * 1000).toISOString(),
      currency: (pi.currency ?? '').toUpperCase(),
      amount: pi.amount,
      amount_unit: 'minor',
      attributes: {
        status: STATUS[pi.status] ?? pi.status,
        customer_source_id: pi.customer ?? undefined,
        payment_method: pi.payment_method_types?.[0],
      },
    },
  ];
};
