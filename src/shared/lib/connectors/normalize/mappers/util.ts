// Shared helpers for source mappers (CVS-143).
//
// Small, defensive accessors so each mapper reads raw source JSON safely and fails with a
// structured MappingError (never a raw value) when a source object is unmappable. Semantic
// validation (enums, required attributes, money rules) is left to the canonical schemas.
import { MappingError } from '../types';

/** Narrow an unknown source object to a record, or reject it structurally. */
export function asObject(input: unknown, schema?: string): Record<string, unknown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new MappingError('not_an_object', 'Source object is not a JSON object', { schema });
  }
  return input as Record<string, unknown>;
}

/** Optional string (also coerces a number id to string); undefined when absent. */
export function optStr(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return undefined;
}

/** Optional finite number, parsing numeric strings; undefined when absent/unparseable. */
export function optNum(obj: Record<string, unknown>, key: string): number | undefined {
  const v = obj[key];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return undefined;
}

/**
 * Resolve a source object id from the first present key. A missing id is fatal — without
 * it there is no lineage or dedupe — so it rejects with a dedicated code.
 */
export function requireId(obj: Record<string, unknown>, keys: string[], schema?: string): string {
  for (const k of keys) {
    const v = optStr(obj, k);
    if (v) return v;
  }
  throw new MappingError('missing_source_id', `Missing source id (${keys.join('/')})`, { path: keys[0], schema });
}

/** Normalize an epoch (s or ms) or ISO string to an ISO-8601 timestamp, or reject it. */
export function toIso(value: unknown, path: string, schema?: string): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  } else if (typeof value === 'string' && value.trim() !== '') {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  throw new MappingError('invalid_timestamp', `Missing or invalid timestamp at ${path}`, { path, schema });
}
