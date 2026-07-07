// First-touch marketing attribution. The marketing site (canvasm.app) links
// into the app with utm_* params; we persist them on the visitor's FIRST
// landing (first-touch wins — later visits never overwrite) and attach them
// to the eventual Clerk sign-up as unsafeMetadata, so signups can be
// attributed back to the campaign that brought them.

const STORAGE_KEY = 'metrimap_attribution';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** document.referrer at first landing (external page that sent the visitor). */
  referrer?: string;
  /** Path + query of the first landing page. */
  landing_page?: string;
  captured_at?: string;
}

/**
 * Capture utm_* params (+ referrer) from the current URL into localStorage.
 * Idempotent and first-touch: does nothing when no utm params are present or
 * when an attribution is already stored. Call once at app boot, before the
 * router gets a chance to rewrite the URL.
 */
export function captureAttribution(): void {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const attribution: Attribution = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) attribution[key] = value;
    }
    if (Object.keys(attribution).length === 0) return;

    if (document.referrer) attribution.referrer = document.referrer;
    attribution.landing_page =
      window.location.pathname + window.location.search;
    attribution.captured_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Storage unavailable (private mode, disabled) — attribution is best-effort.
  }
}

/** The stored first-touch attribution, or null if none was ever captured. */
export function getAttribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
