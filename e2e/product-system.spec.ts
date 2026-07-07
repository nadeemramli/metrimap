import { expect, test } from '@playwright/test';
import { NO_CREDS, shot, signIn } from './helpers';

// Product System Flow explorer (CVS-301) on Home → Explore: six operating-loop
// tabs, numbered step cards, click-to-inspect detail.

test('product system explorer: flows switch, steps inspect', async ({
  page,
}) => {
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env'
  );
  await signIn(page);
  await page.goto('/?view=explore');
  await page.waitForTimeout(2500);

  const explorer = page.getByLabel('Product system');
  await explorer.scrollIntoViewIfNeeded();
  await expect(explorer).toBeVisible();

  // All six loops are present.
  const tabs = explorer.getByRole('tab');
  await expect(tabs).toHaveCount(6);

  // Default flow: numbered steps + first step's detail.
  await expect(explorer.getByText('01').first()).toBeVisible();
  await expect(
    explorer.getByRole('heading', { name: 'Start from the outcome' })
  ).toBeVisible();
  await shot(page, 'product-system-default');

  // Click a later step → detail updates.
  await explorer.getByRole('button', { name: /Metric impact/ }).click();
  await expect(
    explorer.getByRole('heading', { name: 'Contract the expected impact' })
  ).toBeVisible();

  // Switch to another loop → resets to its first step.
  await explorer.getByRole('tab', { name: 'Agent/MCP → Map' }).click();
  await expect(
    explorer.getByRole('heading', { name: 'An agent asks for context' })
  ).toBeVisible();
  await shot(page, 'product-system-agent-flow');
});
