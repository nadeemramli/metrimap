import { expect, test } from '@playwright/test';
import { NO_CREDS, openFirstCanvas, shot, signIn } from './helpers';

// Left-docked Layers panel: toggles with [ or the toolbar button, lists the
// canvas content top-most first, and a row click selects + zooms the node.

test('layers panel: toggle, select from row, hide toggle', async ({ page }) => {
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env'
  );
  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // Toggle via keyboard shortcut.
  await page.keyboard.press('[');
  await page.waitForTimeout(700);
  const layersPanel = page.getByRole('complementary', { name: 'Layers' });
  await expect(layersPanel).toBeVisible();

  // Contained below the top bar like every dock panel.
  const box = await layersPanel.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.y).toBeGreaterThanOrEqual(38);
  await shot(page, 'layers-panel');

  const cards = page.locator('.react-flow__node-metricCard');
  const cardCount = await cards.count();
  test.skip(cardCount === 0, 'Canvas has no metric cards to exercise rows');

  // Row click selects the node on the canvas (and pans/zooms to it).
  const rows = layersPanel.locator('[role="button"]');
  await expect(rows.first()).toBeVisible();
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);

  const viewportBefore = await page
    .locator('.react-flow__viewport')
    .getAttribute('style');
  await rows.first().click();
  await page.waitForTimeout(900);
  await expect(page.locator('.react-flow__node.selected')).toHaveCount(1);
  const viewportAfter = await page
    .locator('.react-flow__viewport')
    .getAttribute('style');
  expect(viewportAfter).not.toBe(viewportBefore);
  await shot(page, 'layers-select');

  // Eye toggle hides the node (row stays, canvas node goes display:none).
  const selectedId = await page
    .locator('.react-flow__node.selected')
    .getAttribute('data-id');
  await rows.first().hover();
  await rows.first().getByRole('button', { name: 'Hide layer' }).click();
  await page.waitForTimeout(700);
  if (selectedId) {
    await expect(
      page.locator(`.react-flow__node[data-id="${selectedId}"]`)
    ).toBeHidden();
  }
  await shot(page, 'layers-hidden');
  // Restore (self-clean).
  await rows.first().hover();
  await rows.first().getByRole('button', { name: 'Show layer' }).click();
  await page.waitForTimeout(400);

  // Close with the panel's close button.
  await layersPanel.getByRole('button', { name: 'Close panel' }).click();
  await expect(layersPanel).toHaveCount(0);
});
