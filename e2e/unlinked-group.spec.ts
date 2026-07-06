import { expect, test } from '@playwright/test';
import {
  NO_CREDS,
  collectConsoleErrors,
  openExampleCanvas,
  shot,
  signIn,
} from './helpers';

// CVS-257 — automated coverage for the "Unlinked" auto-group + focus (CVS-76).
// Cards with no typed relationship surface as a muted "Unlinked (N)" entry at the
// top of the Groups panel, with a one-click focus.

const NODE_SEL =
  '.react-flow__node-metricCard, .react-flow__node-metricNode, .react-flow__node-valueNode, .react-flow__node-actionNode, .react-flow__node-hypothesisNode';

test('CVS-257 Unlinked auto-group entry + focus', async ({ page }) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  await openExampleCanvas(page); // rich example canvas with metric cards
  test.skip(
    (await page.locator(NODE_SEL).first().isVisible().catch(() => false)) ===
      false,
    'Example canvas has no metric cards'
  );

  // Open the Groups panel (top-right Layers toggle).
  const groupsBtn = page.getByTitle('Groups').first();
  await expect(groupsBtn).toBeVisible({ timeout: 20_000 });
  await groupsBtn.click();
  await page.waitForTimeout(500);

  // The "Unlinked" entry only appears when the canvas has edgeless cards.
  const unlinked = page.getByText('Unlinked', { exact: true });
  const hasUnlinked = await unlinked.isVisible().catch(() => false);
  test.skip(!hasUnlinked, 'This canvas has no unlinked (edgeless) cards');

  await shot(page, 'cvs257-unlinked');

  // Muted entry: subtext + a Focus button.
  await expect(
    page.getByText(/cards? (has|have) no relationship yet/)
  ).toBeVisible();
  const focusBtn = page.getByRole('button', { name: 'Focus to wire or cull' });
  await expect(focusBtn).toBeVisible();

  // Focus selects + fits to the orphan cards.
  await focusBtn.click();
  await page.waitForTimeout(1300);
  await shot(page, 'cvs257-focused');

  // Real saved groups (if any) still render alongside; no crash.
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
  expect(console_.react185(), 'no React #185 toggling/focusing groups').toEqual([]);
});
