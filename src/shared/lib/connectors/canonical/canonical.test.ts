import { describe, it, expect } from 'vitest';
import {
  CANONICAL_SCHEMAS,
  CANONICAL_SCHEMA_NAMES,
  CANONICAL_SCHEMA_VERSION,
  LATER_SCHEMA_NAMES,
  SCHEMA_FAMILIES,
  dedupeKey,
  getSchemaDef,
  validateRecord,
} from './index';
import { currencyExponent, formatMoney, toMajor, toMinor } from './money';
import { SOURCE_FIXTURES } from './fixtures';

describe('canonical registry', () => {
  it('registers the 13 MVP schemas with consistent metadata', () => {
    expect(CANONICAL_SCHEMA_NAMES).toHaveLength(13);
    for (const name of CANONICAL_SCHEMA_NAMES) {
      const def = CANONICAL_SCHEMAS[name];
      expect(def.name).toBe(name);
      expect(def.mvp).toBe(true);
      expect(def.version).toBe(CANONICAL_SCHEMA_VERSION);
      expect(SCHEMA_FAMILIES).toContain(def.family);
      expect(['required', 'optional', 'none']).toContain(def.money);
    }
  });

  it('does not overlap MVP names with the reserved later-schema names', () => {
    const later = new Set<string>(LATER_SCHEMA_NAMES);
    for (const name of CANONICAL_SCHEMA_NAMES) expect(later.has(name)).toBe(false);
  });
});

describe('validateRecord — source fixtures', () => {
  for (const fx of SOURCE_FIXTURES) {
    it(`${fx.source}: accepts a well-formed ${fx.schema}`, () => {
      const res = validateRecord(fx.valid);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.record.schema).toBe(fx.schema);
        expect(res.def.name).toBe(fx.schema);
      }
    });

    it(`${fx.source}: rejects a bad ${fx.schema} (${fx.invalidReason})`, () => {
      const res = validateRecord(fx.invalid);
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.errors.length).toBeGreaterThan(0);
    });
  }
});

describe('validateRecord — structured errors', () => {
  const base = SOURCE_FIXTURES[1].valid as Record<string, unknown>; // stripe payment

  it('flags a non-object input', () => {
    const res = validateRecord(42);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0].code).toBe('invalid_type');
  });

  it('flags a missing schema discriminator', () => {
    const noSchema = Object.fromEntries(Object.entries(base).filter(([k]) => k !== 'schema'));
    const res = validateRecord(noSchema);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0].code).toBe('missing_schema');
  });

  it('flags a totally unknown schema', () => {
    const res = validateRecord({ ...base, schema: 'not_a_thing' });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0].code).toBe('unknown_schema');
  });

  it('flags a reserved-but-unimplemented schema distinctly', () => {
    const res = validateRecord({ ...base, schema: 'ledger_entry' });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0].code).toBe('schema_not_yet_supported');
  });

  it('flags a schema_version mismatch', () => {
    const res = validateRecord({ ...base, schema_version: '2.0.0' });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors[0].code).toBe('version_mismatch');
  });

  it('flags a non-integer amount when amount_unit is "minor"', () => {
    const res = validateRecord({ ...base, amount: 129.5 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.some((e) => e.code === 'non_integer_minor')).toBe(true);
  });
});

describe('validateRecord — defaults', () => {
  it('applies the analytics_event count default', () => {
    const posthog = SOURCE_FIXTURES[4].valid as Record<string, unknown>;
    const attrs = posthog.attributes as Record<string, unknown>;
    const withoutCount = { ...posthog, attributes: { ...attrs, count: undefined } };
    const res = validateRecord(withoutCount);
    expect(res.ok).toBe(true);
    if (res.ok && res.record.schema === 'analytics_event') {
      expect(res.record.attributes.count).toBe(1);
    }
  });
});

describe('dedupeKey', () => {
  it('is stable and namespaced by source/account/schema/object', () => {
    const rec = { source: 'stripe', source_account_id: 'acct_1', schema: 'payment', source_object_id: 'pi_9' };
    expect(dedupeKey(rec)).toBe('stripe:acct_1:payment:pi_9');
    expect(dedupeKey(rec)).toBe(dedupeKey({ ...rec }));
  });
});

describe('getSchemaDef', () => {
  it('returns a def for a known schema and undefined otherwise', () => {
    expect(getSchemaDef('payment')?.name).toBe('payment');
    expect(getSchemaDef('nope')).toBeUndefined();
  });
});

describe('money helpers', () => {
  it('knows minor-unit exponents', () => {
    expect(currencyExponent('USD')).toBe(2);
    expect(currencyExponent('myr')).toBe(2);
    expect(currencyExponent('JPY')).toBe(0);
    expect(currencyExponent('KWD')).toBe(3);
  });

  it('round-trips minor/major across exponents', () => {
    expect(toMinor(12.9, 'MYR')).toBe(1290);
    expect(toMajor(1290, 'MYR')).toBe(12.9);
    expect(toMinor(1000, 'JPY')).toBe(1000);
    expect(toMinor(1.234, 'KWD')).toBe(1234);
  });

  it('formats a minor amount without throwing on odd codes', () => {
    expect(formatMoney(1290, 'MYR')).toContain('12.90');
    expect(() => formatMoney(1000, 'ZZZ')).not.toThrow();
  });
});
