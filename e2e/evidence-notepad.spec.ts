import { expect, test } from '@playwright/test';
import { NO_CREDS, openFirstCanvas, shot, signIn } from './helpers';

// CVS-336 — evidence notepad: the docked editor gets the FULL EditorJS block
// set (it used a tool-less stub config = paragraph-only), the right dock is
// drag-resizable, and the chosen width persists per panel kind.

const WIDTH_KEY = 'metrimap.dock.width.evidenceEdit';

test('CVS-336 evidence notepad: full block menu, drag-resizable dock, width persists', async ({
  page,
}) => {
  test.setTimeout(240_000); // two full reload round-trips (CVS-337 DB checks)
  test.skip(
    NO_CREDS,
    'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env'
  );
  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // Deterministic default: no stored width preference.
  await page.evaluate((key) => localStorage.removeItem(key), WIDTH_KEY);

  // Add an evidence pin — it spawns expanded with the title in edit mode.
  // Use .last(): new nodes append to the React Flow node list and render on
  // top, and prior (failed-run) evidence may sit at the same spawn point.
  await page.getByRole('button', { name: 'Add evidence' }).first().click();
  await page.waitForTimeout(800);
  const evidenceCard = page.locator('.react-flow__node-evidenceNode').last();
  await expect(evidenceCard).toBeVisible();

  // Open the docked notepad.
  await evidenceCard.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForTimeout(1000);
  const panel = page.locator('[role="complementary"]').first();
  await expect(panel).toBeVisible();
  await shot(page, 'cvs336-notepad-open');

  // Full block set: the slash menu lists standard + custom notebook blocks
  // (the old stub config registered ZERO tools, so this menu didn't exist).
  const paragraph = panel
    .locator('.ce-paragraph[contenteditable="true"]')
    .first();
  await expect(paragraph).toBeVisible({ timeout: 10_000 });
  await paragraph.click();
  await page.keyboard.type('/');
  const popover = page.locator('.ce-popover--opened').first();
  await expect(popover).toBeVisible({ timeout: 5_000 });
  await expect(popover.getByText('Heading', { exact: true })).toBeVisible();
  await expect(popover.getByText('Note', { exact: true })).toBeVisible();
  await shot(page, 'cvs336-block-menu');
  await page.keyboard.press('Escape'); // close the popover, keep the panel

  // Drag-resize: the handle sits on the dock's inner edge; dragging right
  // shrinks the column, and the width is persisted under the panel's key.
  const host = page.getByTestId('dock-host-right');
  const widthBefore = (await host.boundingBox())?.width ?? 0;
  expect(widthBefore).toBeGreaterThan(300);

  const handle = page.getByRole('separator', { name: 'Resize panel' });
  const handleBox = await handle.boundingBox();
  expect(handleBox).toBeTruthy();
  const startX = handleBox!.x + handleBox!.width / 2;
  const startY = handleBox!.y + handleBox!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 150, startY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);

  const widthAfter = (await host.boundingBox())?.width ?? 0;
  expect(widthAfter).toBeLessThan(widthBefore - 100);
  const stored = await page.evaluate(
    (key) => localStorage.getItem(key),
    WIDTH_KEY
  );
  expect(Number(stored)).toBeGreaterThan(300);
  expect(Math.abs(Number(stored) - widthAfter)).toBeLessThan(10);
  await shot(page, 'cvs336-resized');

  // Reopen: the panel comes back at the stored width, not the 720px default.
  await panel.getByRole('button', { name: 'Close panel' }).click();
  await page.waitForTimeout(600);
  await expect(page.locator('[role="complementary"]')).toHaveCount(0);
  // Clear node selection — the bulk-ops toolbar (bottom center) can overlap
  // the card's footer buttons while the evidence node is selected.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await evidenceCard.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForTimeout(800);
  const widthReopened = (await host.boundingBox())?.width ?? 0;
  expect(Math.abs(widthReopened - Number(stored))).toBeLessThan(10);
  const panel2 = page.locator('[role="complementary"]').first();

  // Notebook layout: metadata is collapsed behind Details; footer shows a
  // word count.
  await expect(panel2.getByText('Details')).toBeVisible();
  await expect(panel2.getByText(/\d+ words?/)).toBeVisible();

  // Name it uniquely so we can find this pin again after a full reload.
  const title = `E2E Notepad ${Date.now()}`;
  await panel2.getByLabel('Evidence title').fill(title);

  // Type body text, then verify flush-on-close: more text typed IMMEDIATELY
  // before closing (inside the 800ms autosave debounce) must survive.
  const body = `notepad body ${Date.now()}`;
  const para = panel2.locator('.ce-paragraph[contenteditable="true"]').first();
  await para.click();
  await page.keyboard.type(body);
  await page.waitForTimeout(1200); // let the debounced autosave land
  await para.click();
  await page.keyboard.press('End'); // clicking centers the caret mid-text
  await page.keyboard.type(' FLUSH-TAIL');
  await panel2.getByRole('button', { name: 'Close panel' }).click(); // < 800ms after typing
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await evidenceCard.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForTimeout(1000);
  await expect(
    page.locator('[role="complementary"]').getByText(`${body} FLUSH-TAIL`)
  ).toBeVisible({ timeout: 5_000 });
  await shot(page, 'cvs336-flush-on-close');

  // DB-backed persistence (CVS-337): the store is no longer in localStorage,
  // so surviving a hard reload proves the evidence_items row + the
  // settings.evidenceLayout position/expansion round-trip.
  await page.waitForTimeout(2500); // evidenceSync (800ms) + layout save (600ms)
  await page.reload();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(3000);
  const reloadedCard = page.locator('.react-flow__node-evidenceNode', {
    hasText: title,
  });
  await expect(reloadedCard).toBeVisible({ timeout: 15_000 });
  await reloadedCard.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForTimeout(1200);
  await expect(
    page.locator('[role="complementary"]').getByText(`${body} FLUSH-TAIL`)
  ).toBeVisible({ timeout: 10_000 });
  const widthAfterReload =
    (await page.getByTestId('dock-host-right').boundingBox())?.width ?? 0;
  expect(Math.abs(widthAfterReload - Number(stored))).toBeLessThan(10);
  await shot(page, 'cvs337-reload-persisted');
  await page
    .getByRole('button', { name: 'Close panel' })
    .first()
    .click()
    .catch(() => {});
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');

  // Deletion removes pin + row: after deleting and reloading, the pin must
  // NOT come back (a store-only delete would resurrect it from the DB).
  await reloadedCard
    .getByRole('button', { name: 'Delete evidence' })
    .first()
    .click();
  await page.getByRole('button', { name: 'Delete', exact: true }).first().click();
  await page.waitForTimeout(1500);
  await page.reload();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(3000);
  await expect(
    page.locator('.react-flow__node-evidenceNode', { hasText: title })
  ).toHaveCount(0);
  await shot(page, 'cvs337-delete-persisted');
  // (The delete step above IS the cleanup — the test evidence is gone.)
});
