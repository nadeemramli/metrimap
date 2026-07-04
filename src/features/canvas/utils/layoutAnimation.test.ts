import { describe, expect, it } from 'vitest';
import { shouldAnimateLayout } from './layoutAnimation';

describe('shouldAnimateLayout', () => {
  it('animates when reduced-motion is not preferred', () => {
    expect(shouldAnimateLayout({ matches: false })).toBe(true);
  });

  it('skips animation when the user prefers reduced motion', () => {
    expect(shouldAnimateLayout({ matches: true })).toBe(false);
  });

  it('animates when no media query is available', () => {
    expect(shouldAnimateLayout(null)).toBe(true);
    expect(shouldAnimateLayout(undefined)).toBe(true);
  });
});
