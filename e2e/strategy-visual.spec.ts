import { expect, test } from '@playwright/test';
import { NO_CREDS, openExampleCanvas, openFirstCanvas, signIn } from './helpers';

// Strategy page chrome: single toolbar (group pills · counts · Journey toggle ·
// view switcher) with the value-journey rail collapsed by default and opened
// from the toolbar. Read-only — no canvas mutation, nothing to clean up.
test('strategy toolbar + journey rail toggle', async ({ page }) => {
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL and E2E_TEST_PASSWORD in .env'
  );

  await signIn(page);
  const opened =
    (await openExampleCanvas(page)) || (await openFirstCanvas(page));
  test.skip(!opened, 'No canvas available for this account');

  const canvasUrl = page.url().replace(/\/$/, '');
  await page.goto(`${canvasUrl.match(/\/canvas\/[^/?#]+/)![0]}/strategy`);
  await page.waitForTimeout(4000); // cards + impact summaries settle

  await page.screenshot({
    path: 'e2e/screenshots/strategy-board.png',
    fullPage: true,
  });

  // The journey rail is opt-in: hidden until the toolbar button opens it.
  const journeyButton = page.getByRole('button', { name: 'Journey' });
  if (await journeyButton.isVisible().catch(() => false)) {
    await expect(journeyButton).toHaveAttribute('aria-expanded', 'false');
    await journeyButton.click();
    await expect(journeyButton).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(400);
    await page.screenshot({
      path: 'e2e/screenshots/strategy-journey-open.png',
      fullPage: true,
    });
  }
});
