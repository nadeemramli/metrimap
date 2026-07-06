import { expect, test } from '@playwright/test';
import { NO_CREDS, openFirstCanvas, shot, signIn } from './helpers';

// Docked right-panel system: panels render in a dock column BELOW the 40px
// top bar (never overlapping it), the canvas resizes to make room, only one
// right panel is open at a time, and Escape closes it.

test('right dock: contained under the top bar, exclusive, esc-closes', async ({
  page,
}) => {
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env'
  );
  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  const flowPane = page.locator('.react-flow').first();
  const widthBefore = (await flowPane.boundingBox())?.width ?? 0;

  // Open the collaboration panel from the top bar.
  await page.getByRole('button', { name: 'Comments' }).first().click();
  await page.waitForTimeout(800);

  const collabPanel = page.getByRole('complementary', {
    name: 'Collaboration',
  });
  await expect(collabPanel).toBeVisible();

  // Contained: the panel starts below the 40px top bar (no viewport overlay).
  const panelBox = await collabPanel.boundingBox();
  expect(panelBox).toBeTruthy();
  expect(panelBox!.y).toBeGreaterThanOrEqual(38);

  // Docked: the canvas gave up width for the panel column.
  const widthOpen = (await flowPane.boundingBox())?.width ?? 0;
  expect(widthOpen).toBeLessThan(widthBefore - 200);
  await shot(page, 'dock-collaboration');

  // Exclusivity: opening a card's settings replaces the collaboration panel.
  // (Same event the per-node toolbar Settings button dispatches.)
  const card = page.locator('.react-flow__node-metricCard').first();
  if (await card.isVisible().catch(() => false)) {
    const nodeId = await card.getAttribute('data-id');
    await page.evaluate((id) => {
      window.dispatchEvent(
        new CustomEvent('canvas:open-node-settings', { detail: { nodeId: id } })
      );
    }, nodeId);
    await page.waitForTimeout(1200);
    const anyPanel = page.locator('[role="complementary"]');
    await expect(anyPanel).toHaveCount(1);
    await expect(collabPanel).toHaveCount(0);
    await shot(page, 'dock-card-settings');
  }

  // Escape closes the panel and the canvas gets its width back.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  await expect(page.locator('[role="complementary"]')).toHaveCount(0);
  const widthAfter = (await flowPane.boundingBox())?.width ?? 0;
  expect(widthAfter).toBeGreaterThan(widthOpen);
});
