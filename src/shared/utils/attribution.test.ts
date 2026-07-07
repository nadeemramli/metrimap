import { beforeEach, describe, expect, it } from 'vitest';
import { captureAttribution, getAttribution } from './attribution';

function setUrl(search: string) {
  window.history.replaceState(null, '', `/signup${search}`);
}

describe('attribution', () => {
  beforeEach(() => {
    localStorage.clear();
    setUrl('');
  });

  it('captures utm params + landing page on first touch', () => {
    setUrl(
      '?utm_source=canvasm.app&utm_medium=site&utm_campaign=launch&utm_content=home_hero'
    );
    captureAttribution();
    const a = getAttribution();
    expect(a).toMatchObject({
      utm_source: 'canvasm.app',
      utm_medium: 'site',
      utm_campaign: 'launch',
      utm_content: 'home_hero',
    });
    expect(a?.landing_page).toContain('/signup?utm_source=canvasm.app');
    expect(a?.captured_at).toBeTruthy();
  });

  it('first touch wins — later utm visits never overwrite', () => {
    setUrl('?utm_source=first');
    captureAttribution();
    setUrl('?utm_source=second&utm_campaign=other');
    captureAttribution();
    expect(getAttribution()?.utm_source).toBe('first');
  });

  it('stores nothing without utm params (direct visits are not attribution)', () => {
    setUrl('?foo=bar');
    captureAttribution();
    expect(getAttribution()).toBeNull();
  });
});
