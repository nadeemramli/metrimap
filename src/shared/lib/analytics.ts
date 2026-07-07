import posthog from 'posthog-js';
import { getAttribution } from '@/shared/utils/attribution';

// PostHog product analytics (CVS-115 / CVS-114 slice 5).
//
// The key below is PostHog's PUBLIC project API key (phc_*) — write-only and
// designed to ship in client bundles (like the Clerk publishable key). Env
// vars override it; setting VITE_POSTHOG_KEY="" disables analytics entirely.
// Every helper no-ops when disabled, so the app never depends on PostHog.

const DEFAULT_KEY = 'phc_a9DkDyPOy8mY50pdOXKqeUUcWS5wIYinqD0UuOV8rD7';
const DEFAULT_HOST = 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY ?? DEFAULT_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST ?? DEFAULT_HOST;
  if (!key || initialized || typeof window === 'undefined') return;

  posthog.init(key, {
    api_host: host,
    // SPA: capture route changes as pageviews.
    capture_pageview: 'history_change',
    // Only create person profiles for identified (signed-in) users.
    person_profiles: 'identified_only',
    autocapture: true,
    loaded: (ph) => {
      // First-touch marketing attribution (captured at landing by
      // src/shared/utils/attribution.ts) rides on every event.
      const attribution = getAttribution();
      if (attribution) ph.register(attribution as Record<string, unknown>);
    },
  });
  initialized = true;
}

/** Tie events to the signed-in user. Attribution lands as person properties. */
export function identifyUser(user: {
  id: string;
  email?: string;
  name?: string;
}) {
  if (!initialized) return;
  const attribution = getAttribution();
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    ...(attribution ?? {}),
  });
}

/** Clear the identity on sign-out. */
export function resetAnalytics() {
  if (!initialized) return;
  posthog.reset();
}

/** Capture a product event; silently no-ops when analytics is disabled. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, properties);
}
