import { test } from '@playwright/test';
import { NO_CREDS, signIn } from './helpers';

const wait = (p: import('@playwright/test').Page, ms: number) => p.waitForTimeout(ms);

test('cvs-164 visual qa sweep (light + dark)', async ({ page }) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  test.setTimeout(180_000);
  await signIn(page);

  async function capture(theme: 'light' | 'dark') {
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    // Home (shell + tabs)
    await page.goto('/'); await wait(page, 2500);
    await page.screenshot({ path: `e2e/screenshots/qa-home-${theme}.png`, fullPage: true });
    // Explore (examples grid)
    await page.goto('/?view=explore'); await wait(page, 2500);
    await page.screenshot({ path: `e2e/screenshots/qa-explore-${theme}.png`, fullPage: true });
    // Open a populated example canvas
    await page.getByText('SaaS', { exact: true }).first().click().catch(() => {});
    const nav = await page.waitForURL(/\/canvas\/[^/]+/, { timeout: 25000 }).then(() => true).catch(() => false);
    console.log(`CANVAS_${theme} ` + nav + ' ' + page.url());
    await wait(page, 6500); // nodes + layout settle
    await page.screenshot({ path: `e2e/screenshots/qa-canvas-${theme}.png` });
    // Filter popover
    await page.locator('button[title="Filter & date"]').first().click().catch(() => {});
    await wait(page, 900);
    await page.screenshot({ path: `e2e/screenshots/qa-filter-${theme}.png` });
    await page.keyboard.press('Escape').catch(() => {});
  }
  await capture('light');
  await capture('dark');
});
