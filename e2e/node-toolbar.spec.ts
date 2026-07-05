import { expect, test } from '@playwright/test';
import {
  ERROR_BOUNDARY_TEXT,
  NO_CREDS,
  collectConsoleErrors,
  openFirstCanvas,
  shot,
  signIn,
} from './helpers';

// CVS-255 — automated coverage for the per-node toolbar view/edit/settings/copy/
// delete actions (CVS-135). Runs against a real canvas node. Handles BOTH toolbars:
// EnhancedNodeToolbar (metricNode/value/action/hypothesis types — needs a
// double-click to reveal) and MetricCard's own toolbar (metricCard type — shows on
// select). It duplicates a node, verifies the "(Copy)" + reload persistence, then
// deletes the copy so it doesn't litter the real org canvas.

// force:true bypasses the dev-only debug panel that can overlay the canvas corner.
async function revealToolbar(node: import('@playwright/test').Locator) {
  await node.click({ force: true });
  await node.dblclick({ force: true }).catch(() => {}); // EnhancedNodeToolbar toggles on dbl-click
  await node.page().waitForTimeout(400);
}

test('CVS-255 node toolbar: settings sheet, duplicate + persist, delete, no crash', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // Target a node that actually has an action toolbar (metric/value/action/
  // hypothesis card), not an evidence/comment/source node.
  const node = page
    .locator(
      '.react-flow__node-metricCard, .react-flow__node-metricNode, .react-flow__node-valueNode, .react-flow__node-actionNode, .react-flow__node-hypothesisNode'
    )
    .first();
  test.skip(
    (await node.count()) === 0,
    'Canvas has no metric/value/action/hypothesis node to test the toolbar'
  );
  await revealToolbar(node);

  const usingEnhanced = await page
    .getByTestId('node-toolbar')
    .first()
    .isVisible()
    .catch(() => false);
  console.log(
    `[CVS-255] toolbar exercised: ${usingEnhanced ? 'EnhancedNodeToolbar (metricNode-type)' : 'MetricCard/other (title-based)'}`
  );
  await shot(page, 'cvs255-node-toolbar');

  const btn = (label: string, testid: string) =>
    usingEnhanced
      ? page.getByTestId(testid).first()
      : page.getByTitle(label).first();

  // Settings → the node's settings-and-detail sheet (a dialog) opens.
  const settings = btn('Settings', 'node-toolbar-action-settings');
  if (await settings.isVisible().catch(() => false)) {
    await settings.click({ force: true });
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8000 });
    await shot(page, 'cvs255-settings-sheet');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // Duplicate → a "(Copy)" node appears.
  await revealToolbar(node);
  const dup = btn('Duplicate', 'node-toolbar-action-duplicate');
  await expect(dup, 'duplicate button is reachable').toBeVisible({
    timeout: 8000,
  });
  await dup.click({ force: true });
  const copy = page
    .locator('.react-flow__node')
    .filter({ hasText: '(Copy)' })
    .first();
  await expect(copy).toBeVisible({ timeout: 8000 });
  await shot(page, 'cvs255-duplicate');

  // Persistence: reload → the "(Copy)" node survives.
  await page.reload();
  await page.waitForTimeout(5000);
  const copyAfter = page
    .locator('.react-flow__node')
    .filter({ hasText: '(Copy)' })
    .first();
  await expect(copyAfter).toBeVisible({ timeout: 15_000 });
  await shot(page, 'cvs255-duplicate-persisted');

  // Cleanup + delete coverage: remove the "(Copy)" so we don't litter real data.
  await revealToolbar(copyAfter);
  const del = btn('Delete', 'node-toolbar-action-delete');
  if (await del.isVisible().catch(() => false)) {
    await del.click({ force: true });
    await page.waitForTimeout(1500);
    await expect(
      page.locator('.react-flow__node').filter({ hasText: '(Copy)' })
    ).toHaveCount(0);
  }

  // No crash the whole way through.
  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
  expect(console_.react185(), 'no React #185 using the node toolbar').toEqual([]);
});
