// Currency minor-unit helpers for canonical money handling (CVS-139).
//
// Canonical records store money in MINOR units by default (e.g. cents), matching
// how Stripe and most payment APIs represent amounts. These helpers convert to and
// from major units for display and for ingesting sources that report major units.

// ISO 4217 currencies whose minor unit is the same as the major unit (no decimals).
const ZERO_DECIMAL = new Set([
  'JPY', 'KRW', 'VND', 'CLP', 'ISK', 'XOF', 'XAF', 'XPF', 'BIF', 'DJF', 'GNF',
  'KMF', 'MGA', 'PYG', 'RWF', 'UGX', 'VUV', 'XAG', 'XAU',
]);
// Currencies with three minor digits.
const THREE_DECIMAL = new Set(['BHD', 'KWD', 'OMR', 'TND', 'JOD', 'LYD', 'IQD']);

/** Number of minor-unit digits for an ISO 4217 currency (default 2). */
export function currencyExponent(currency: string): number {
  const c = currency.toUpperCase();
  if (ZERO_DECIMAL.has(c)) return 0;
  if (THREE_DECIMAL.has(c)) return 3;
  return 2;
}

/** Convert a major-unit amount (e.g. 12.90) to minor units (e.g. 1290). */
export function toMinor(major: number, currency: string): number {
  return Math.round(major * 10 ** currencyExponent(currency));
}

/** Convert a minor-unit amount (e.g. 1290) to major units (e.g. 12.90). */
export function toMajor(minor: number, currency: string): number {
  return minor / 10 ** currencyExponent(currency);
}

/** Localized currency string from a minor-unit amount; falls back if Intl rejects the code. */
export function formatMoney(minor: number, currency: string): string {
  const major = toMajor(minor, currency);
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(major);
  } catch {
    return `${major} ${currency.toUpperCase()}`;
  }
}
