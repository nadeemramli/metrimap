import { test } from '@playwright/test';
import { NO_CREDS, signIn } from './helpers';

// Authenticated workspace routes to capture. Add more as surfaces land.
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/?view=explore', name: 'home-explore' },
  { path: '/catalog', name: 'catalog' },
  { path: '/feed', name: 'feed' },
  { path: '/settings/connect', name: 'connect-agent' },
];

test('capture workspace routes', async ({ page }) => {
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL and E2E_TEST_PASSWORD in .env'
  );

  await signIn(page);

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
