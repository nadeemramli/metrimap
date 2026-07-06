import { expect, test } from '@playwright/test';
import {
  ERROR_BOUNDARY_TEXT,
  NO_CREDS,
  collectConsoleErrors,
  openCanvasWith,
  openFirstCanvas,
  shot,
  signIn,
} from './helpers';

// Canvas-interaction lane — selection + toolbar behaviour that needs no data
// mutation (nothing is created/deleted), so it's deterministic and leaves the real
// org canvas untouched.
//
//   CVS-94   pane-click / Esc deselect (single, multi, edge)
//   CVS-96   single-selection toolbar (exactly one bottom panel, Duplicate/Settings/Delete)
//   CVS-133  consolidated toolbar anchored top-right, stays pinned on pan/zoom/resize

const NODE_SEL =
  '.react-flow__node-metricCard, .react-flow__node-metricNode, .react-flow__node-valueNode, .react-flow__node-actionNode, .react-flow__node-hypothesisNode';

test('CVS-94 pane-click / Esc deselect (single, multi, edge)', async ({ page }) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const found = await openCanvasWith(page, NODE_SEL);
  test.skip(!found, 'No canvas with selectable metric-family nodes on this account');

  const pane = page.locator('.react-flow__pane');
  const selected = page.locator('.react-flow__node.selected');
  const panel = page.locator('.react-flow__panel.bottom.center');

  // 1. Select a single node → the bottom selection panel appears.
  await page.locator(NODE_SEL).first().click({ force: true });
  await expect(selected).toHaveCount(1);
  await expect(panel).toBeVisible();
  await shot(page, 'cvs94-selected');

  // Pane-click on empty background → deselects (panel disappears).
  await pane.click({ position: { x: 40, y: 120 }, force: true });
  await expect(selected).toHaveCount(0);
  await expect(panel).toBeHidden();

  // 2. Select again → Esc deselects.
  await page.locator(NODE_SEL).first().click({ force: true });
  await expect(selected).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(selected).toHaveCount(0);

  // 3. Multi-select (shift-click 2 nodes) → pane-click clears ALL.
  const nodes = page.locator(NODE_SEL);
  if ((await nodes.count()) >= 2) {
    await nodes.nth(0).click({ force: true });
    await nodes.nth(1).click({ modifiers: ['Shift'], force: true });
    await expect(selected).toHaveCount(2);
    await pane.click({ position: { x: 40, y: 120 }, force: true });
    await expect(selected).toHaveCount(0);
  }

  // 4. Edge selection also clears on Esc (best-effort — needs an edge on the canvas).
  const edge = page.locator('.react-flow__edge').first();
  if (await edge.isVisible().catch(() => false)) {
    await edge.click({ force: true });
    await page.waitForTimeout(300);
    await page.keyboard.press('Escape');
    await expect(page.locator('.react-flow__edge.selected')).toHaveCount(0);
  }

  // 6. Re-select after clearing still works (no stuck state).
  await page.locator(NODE_SEL).first().click({ force: true });
  await expect(selected).toHaveCount(1);

  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
  expect(console_.react185(), 'no React #185 while (de)selecting').toEqual([]);
});

test('CVS-96 single-selection toolbar: exactly one panel, Duplicate/Settings/Delete', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const found = await openCanvasWith(page, NODE_SEL);
  test.skip(!found, 'No canvas with selectable metric-family nodes on this account');

  const panel = page.locator('.react-flow__panel.bottom.center');

  // 1. Single node → exactly ONE bottom panel (no stacked duplicates).
  await page.locator(NODE_SEL).first().click({ force: true });
  await expect(panel).toHaveCount(1);
  await expect(panel).toBeVisible();

  // 2. Correct count + one each of Duplicate / Settings / Delete.
  await expect(panel.getByText('1 selected')).toBeVisible();
  await expect(panel.getByText(/^1 node$/)).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Duplicate' })).toHaveCount(1);
  await expect(panel.getByRole('button', { name: 'Settings' })).toHaveCount(1);
  await expect(panel.getByRole('button', { name: 'Delete' })).toHaveCount(1);
  await shot(page, 'cvs96-single-selection');

  // 5. The old "N metrics · … · ⋯" panel is gone.
  await expect(page.getByText(/\d+\s+metrics\s+·/)).toHaveCount(0);

  // 4. Multi-select → still one panel, now with a Group action.
  const nodes = page.locator(NODE_SEL);
  if ((await nodes.count()) >= 2) {
    await nodes.nth(1).click({ modifiers: ['Shift'], force: true });
    await expect(panel).toHaveCount(1);
    await expect(panel.getByText('2 selected')).toBeVisible();
    await expect(
      panel.getByRole('button', { name: /Group/ }).first()
    ).toBeVisible();
    await shot(page, 'cvs96-multi-selection');
  }

  // (Delete/Duplicate execution + persistence is covered by CVS-208 / CVS-255 —
  // not re-run here to avoid mutating the real org canvas.)
  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
  expect(console_.react185(), 'no React #185 with the selection toolbar').toEqual([]);
});

test('CVS-133 consolidated toolbar anchored top-right, stays pinned', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // 1. The consolidated toolbar lives in React Flow's top-right Panel (CVS-32).
  const toolbarPanel = page.locator('.react-flow__panel.top.right');
  await expect(toolbarPanel).toBeVisible({ timeout: 15_000 });
  // It carries the consolidated controls (funnel filter is the stable anchor).
  await expect(toolbarPanel.getByTitle('Filter & date').first()).toBeVisible();

  // Right-anchored: the panel sits in the right half of the viewport, flush to the
  // right edge (not top-center any more).
  const vw = page.viewportSize()!.width;
  const box = await toolbarPanel.boundingBox();
  expect(box, 'toolbar panel has a bounding box').not.toBeNull();
  if (box) {
    expect(box.x, 'panel starts in the right half').toBeGreaterThan(vw * 0.5);
    expect(box.x + box.width, 'panel is flush to the right edge').toBeGreaterThan(
      vw - 60
    );
  }
  await shot(page, 'cvs133-toolbar-topright');

  // 3. Stays pinned after a pan.
  await page.mouse.move(700, 450);
  await page.mouse.down();
  await page.mouse.move(500, 620, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const box2 = await toolbarPanel.boundingBox();
  if (box2 && box) {
    expect(Math.abs(box2.x - box.x), 'panel x unchanged after pan').toBeLessThan(4);
  }

  // 5. Narrower window → toolbar stays usable (still top-right, filter reachable).
  await page.setViewportSize({ width: 800, height: 800 });
  await page.waitForTimeout(400);
  await expect(toolbarPanel).toBeVisible();
  await expect(toolbarPanel.getByTitle('Filter & date').first()).toBeVisible();
  const boxN = await toolbarPanel.boundingBox();
  if (boxN) expect(boxN.x + boxN.width).toBeGreaterThan(800 - 60);
  await shot(page, 'cvs133-toolbar-narrow');

  // NB: the Groups fly-out "below with no overlap" (step 2) is left for the owner's
  // visual pass — geometry of the fly-out vs toolbar isn't asserted here.
  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
  expect(console_.react185(), 'no React #185 with the toolbar').toEqual([]);
});
