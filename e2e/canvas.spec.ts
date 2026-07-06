import { test } from '@playwright/test';
import { NO_CREDS, openFirstCanvas, shot, signIn } from './helpers';

// Open a real canvas and capture it + the toolbar filter popover (real data).
// Shared sign-in / activate-org / open-canvas helpers now live in ./helpers.ts (a
// non-test module) — Playwright forbids importing one spec file from another, which
// is why activateOrg moved out of here.
test('canvas + filter popover', async ({ page }) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  await shot(page, 'canvas');
  const fb = page.getByTitle('Filter & date').first();
  if (await fb.isVisible().catch(() => false)) {
    await fb.click();
    await page.waitForTimeout(900);
    await shot(page, 'filter');
  }
});
