import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let cached: 'metric_cards_visible' | 'metric_cards' | null = null;

// Reads of the value series must go through the redacting view (hide_value is
// enforced server-side). Falls back to the base table when the view is absent
// (migration not yet applied). Cached per module; reset on a permission error.
export async function cardsReadSource(
  client: SupabaseClient<Database>
): Promise<'metric_cards_visible' | 'metric_cards'> {
  if (cached) return cached;
  const { error } = await client
    // View is absent from the generated Database types; probe it typed as the
    // base table (same row shape). Cast via unknown — the two literal names
    // don't overlap, so a direct `as 'metric_cards'` would be a TS2352 error.
    .from('metric_cards_visible' as unknown as 'metric_cards')
    .select('id')
    .limit(1);
  const missing =
    !!error &&
    (error.code === '42P01' ||
      error.code === 'PGRST205' ||
      /does not exist|could not find the table|schema cache/i.test(
        error.message || ''
      ));
  cached = missing ? 'metric_cards' : 'metric_cards_visible';
  return cached;
}

export function resetCardsReadSource() {
  cached = null;
}
