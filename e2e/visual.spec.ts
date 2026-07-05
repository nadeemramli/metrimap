import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { test } from '@playwright/test';

const EMAIL = process.env.E2E_TEST_EMAIL;
const PASSWORD = process.env.E2E_TEST_PASSWORD;

// Authenticated workspace routes to capture. Add more as surfaces land.
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/?view=explore', name: 'home-explore' },
  { path: '/catalog', name: 'catalog' },
  { path: '/feed', name: 'feed' },
];

test('capture workspace routes', async ({ page }) => {
  test.skip(
    !process.env.CLERK_SECRET_KEY || !EMAIL || !PASSWORD,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL and E2E_TEST_PASSWORD in .env'
  );

  await setupClerkTestingToken({ page });
  await page.goto('/'); // loads Clerk (redirects to sign-in when signed out)
  await clerk.signIn({
    page,
    signInParams: { strategy: 'password', identifier: EMAIL!, password: PASSWORD! },
  });

  for (const r of ROUTES) {
    await page.goto(r.path);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(600); // let the rail + cards settle
    await page.screenshot({
      path: `e2e/screenshots/${r.name}.png`,
      fullPage: true,
    });
  }
});
