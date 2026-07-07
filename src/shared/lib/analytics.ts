import posthog, { type PostHogInterface } from 'posthog-js';
import { getAttribution } from '@/shared/utils/attribution';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

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
    loaded: (ph: PostHogInterface) => {
      // First-touch marketing attribution (captured at landing by
      // src/shared/utils/attribution.ts) rides on every event.
      const attribution = getAttribution();
      if (attribution) ph.register(attribution as Record<string, unknown>);
    },
  });
  initialized = true;
}

// --- Google Tag Manager (use.canvasm.app container) -----------------------
//
// Loads the app's GTM container behind VITE_GTM_ID and no-ops when unset —
// the same opt-in gating as PostHog above, so previews/local dev stay clean.
// The container (GTM-KJWN2F2L) holds the SHARED GA4 Google tag (G-F98ELRQJMT);
// this module just loads it and feeds the flat dataLayer contract from the
// analytics runbook. The marketing site (canvasm.app) and the app share the
// GA4 property + the `.canvasm.app` `_ga` cookie, so GA4 stitches the
// pre-login anonymous history to the identified user with no linker config.

let gtmInitialized = false;

// Fire the login/sign_up event at most once per browser session (a signed-in
// SPA mounts this on every page load — we must not inflate login counts).
const AUTH_EVENT_KEY = 'metrimap_gtm_auth_fired';
// Remember that sign_up already fired for an id so a later login on the same
// browser never re-counts it as a conversion.
const SIGNUP_FIRED_KEY = 'metrimap_gtm_signup_fired';
// A recent Clerk account is treated as a fresh sign-up rather than a login.
const SIGNUP_WINDOW_MS = 5 * 60 * 1000;

function dataLayerPush(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function initGtm() {
  const id = import.meta.env.VITE_GTM_ID;
  if (!id || gtmInitialized || typeof window === 'undefined') return;

  // Standard GTM bootstrap snippet, script-injected (CSP allows
  // www.googletagmanager.com in vercel.json).
  window.dataLayer = window.dataLayer || [];
  dataLayerPush({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
  gtmInitialized = true;
}

/**
 * Push the GA4 identity to the dataLayer: keep `user_id` current for every
 * subsequent hit, and emit a single login/sign_up event per session. New Clerk
 * accounts (created within SIGNUP_WINDOW_MS) count as `sign_up` — the real
 * conversion — once ever per browser; everything else is `login`.
 */
function pushAuthEvent(userId: string, createdAt?: Date) {
  if (!gtmInitialized) return;
  const attribution = getAttribution();

  // Persist user_id for GA4 config + subsequent event tags.
  dataLayerPush({ user_id: userId });

  let alreadyFired = false;
  let signupFired = false;
  try {
    alreadyFired = sessionStorage.getItem(AUTH_EVENT_KEY) === userId;
    signupFired = localStorage.getItem(SIGNUP_FIRED_KEY) === userId;
  } catch {
    // Storage blocked (private mode) — best-effort single push below.
  }
  if (alreadyFired) return;

  const recentlyCreated =
    createdAt != null && Date.now() - createdAt.getTime() < SIGNUP_WINDOW_MS;
  const isSignup = recentlyCreated && !signupFired;

  dataLayerPush({
    event: isSignup ? 'sign_up' : 'login',
    user_id: userId,
    ...(attribution ?? {}),
  });

  try {
    sessionStorage.setItem(AUTH_EVENT_KEY, userId);
    if (isSignup) localStorage.setItem(SIGNUP_FIRED_KEY, userId);
  } catch {
    // ignore — the event was still pushed.
  }
}

/** Tie events to the signed-in user. Attribution lands as person properties. */
export function identifyUser(user: {
  id: string;
  email?: string;
  name?: string;
  createdAt?: Date;
}) {
  // PostHog identity (attribution rides along as person properties).
  if (initialized) {
    const attribution = getAttribution();
    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      ...(attribution ?? {}),
    });
  }
  // GA4 identity + login/sign_up via the GTM dataLayer (independent of PostHog).
  pushAuthEvent(user.id, user.createdAt);
}

/** Clear the identity on sign-out. */
export function resetAnalytics() {
  if (initialized) posthog.reset();
  if (gtmInitialized) {
    // Drop the GA4 user_id and let a fresh login re-fire next session.
    dataLayerPush({ user_id: undefined });
    try {
      sessionStorage.removeItem(AUTH_EVENT_KEY);
    } catch {
      // ignore
    }
  }
}

/** Capture a product event; silently no-ops when analytics is disabled. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (initialized) posthog.capture(event, properties);
  // Mirror the same product events to the GTM dataLayer (flat { event, ...props }
  // per the runbook contract). The app container decides which reach GA4.
  if (gtmInitialized) dataLayerPush({ event, ...(properties ?? {}) });
}
