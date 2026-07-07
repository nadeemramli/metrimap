import { expect, test } from '@playwright/test';
import { NO_CREDS, openFirstCanvas, shot, signIn } from './helpers';

// Onboarding guided tour (CVS-114): seed a pending tour in the persisted
// onboarding store, open a canvas, and verify driver.js runs the themed
// spotlight sequence against the real anchors.

test('guided tour launches and steps through anchors', async ({ page }) => {
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env'
  );
  await page.addInitScript(() => {
    localStorage.setItem(
      'metrimap-onboarding',
      JSON.stringify({
        state: {
          firstRunSeen: true,
          tourPending: true,
          tourCompletedAt: null,
          tourSkippedAt: null,
          demoCopyProjectId: null,
          checklistDismissed: true,
          visitedDashboard: false,
          dismissedTips: {},
        },
        version: 0,
      })
    );
  });
  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // The launcher waits ~1.2s after nodes render.
  const popover = page.locator('.driver-popover');
  await expect(popover).toBeVisible({ timeout: 15000 });
  await expect(popover).toContainText('This is a metric tree');
  await shot(page, 'onboarding-tour-step1');

  // Step through two more anchors.
  await page.locator('.driver-popover-next-btn').click();
  await expect(popover).toContainText('building blocks');
  await page.locator('.driver-popover-next-btn').click();
  await expect(popover).toContainText('toolbar');
  await shot(page, 'onboarding-tour-step3');

  // Esc exits and records skip (tour never re-launches this session).
  await page.keyboard.press('Escape');
  await expect(popover).toHaveCount(0);
  await page.waitForTimeout(1500);
  await expect(popover).toHaveCount(0);
});
