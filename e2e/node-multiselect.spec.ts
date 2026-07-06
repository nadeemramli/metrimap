import { expect, test } from '@playwright/test';
import {
  ERROR_BOUNDARY_TEXT,
  NO_CREDS,
  collectConsoleErrors,
  openFirstCanvas,
  signIn,
} from './helpers';

// Ctrl+Left-Click adds nodes to the selection one by one (and toggles them
// off). ReactFlow is configured with multiSelectionKeyCode ['Shift','Meta',
// 'Control']; this spec proves the additive path works end-to-end and guards
// it as a regression. The SelectionPanel renders "{n} selected".

test('Ctrl+Click adds nodes to the selection one by one', async ({ page }) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  test.setTimeout(150_000);
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  const nodes = page.locator('.react-flow__node');
  const count = await nodes.count();
  test.skip(count < 2, 'Canvas needs at least 2 nodes for multi-select');

  // Click node A (plain) — selection becomes exactly A.
  await nodes.nth(0).click({ position: { x: 12, y: 12 }, force: true });
  await expect(page.getByText('1 selected')).toBeVisible({ timeout: 5000 });

  // Ctrl+Click node B — ADDS to the selection.
  await nodes.nth(1).click({
    position: { x: 12, y: 12 },
    force: true,
    modifiers: ['Control'],
  });
  await expect(page.getByText('2 selected')).toBeVisible({ timeout: 5000 });

  // Ctrl+Click node B again — toggles it back off.
  await nodes.nth(1).click({
    position: { x: 12, y: 12 },
    force: true,
    modifiers: ['Control'],
  });
  await expect(page.getByText('1 selected')).toBeVisible({ timeout: 5000 });

  expect(console_.react185(), 'no React #185 during multi-select').toEqual([]);
  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
});
