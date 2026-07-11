import { describe, expect, it } from 'vitest';
import { cardOwnerId } from './metric-cards';

// metric_cards.owner_id is an FK to users(id) (Clerk ids). Free-text owner
// input must persist NULL instead of failing the whole save with an FK
// violation, and clearing the field must persist NULL rather than being
// silently dropped.
describe('cardOwnerId', () => {
  it('keeps valid Clerk user ids', () => {
    expect(cardOwnerId('user_abc123')).toBe('user_abc123');
    expect(cardOwnerId('  user_abc123  ')).toBe('user_abc123');
  });

  it('nulls free-text display names', () => {
    expect(cardOwnerId('Alice')).toBeNull();
    expect(cardOwnerId('jane@example.com')).toBeNull();
  });

  it('nulls empty/blank/missing values', () => {
    expect(cardOwnerId('')).toBeNull();
    expect(cardOwnerId('   ')).toBeNull();
    expect(cardOwnerId(undefined)).toBeNull();
    expect(cardOwnerId(null)).toBeNull();
  });

  it('rejects near-miss ids', () => {
    expect(cardOwnerId('user_')).toBeNull();
    expect(cardOwnerId('user_abc 123')).toBeNull();
  });
});
