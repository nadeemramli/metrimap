import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { test } from '@playwright/test';

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

// Activate the signed-in user's first org (the app is orgs-only) so their
// canvases load. Call after clerk.signIn.
export async function activateOrg(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const c = (window as { Clerk?: any }).Clerk;
    if (!c?.user || c.organization) return;
    const m = await c.user.getOrganizationMemberships();
    const org = (m?.data ?? m)?.[0]?.organization;
    if (org) await c.setActive({ organization: org.id });
  });
}

// Open a real canvas and capture the toolbar filter popover (real data).
test('canvas + filter popover', async ({ page }) => {
  test.skip(!process.env.CLERK_SECRET_KEY || !EMAIL || !PASSWORD, 'creds');
  await setupClerkTestingToken({ page });
  await page.goto('/');
  await clerk.signIn({
    page,
    signInParams: { strategy: 'password', identifier: EMAIL!, password: PASSWORD! },
  });
  await activateOrg(page);
  await page.goto('/');
  await page.waitForTimeout(3500);
  await page.getByText('Canvas Preview').first().click().catch(() => {});
  await page.waitForURL(/\/canvas\/[^/]+$/, { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'e2e/screenshots/canvas.png' });
  const fb = page.locator('button[title="Filter & date"]').first();
  if (await fb.isVisible().catch(() => false)) {
    await fb.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: 'e2e/screenshots/filter.png' });
  }
});
