import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import {
  ERROR_BOUNDARY_TEXT,
  NO_CREDS,
  collectConsoleErrors,
  openCanvasWith,
  openFirstCanvas,
  shot,
  signIn,
} from './helpers';

// Canvas stability / "no-crash" lane — turns the owner-run soak checks into
// automated coverage. All three tests key on the same hard invariant the harness
// already proves elsewhere: NO React #185 (max-update-depth) and the ErrorBoundary
// fallback ("Something went wrong") never renders while working the canvas.
//
//   CVS-247  React #185 gone — portal dropdowns/dialogs/popovers don't loop the canvas
//   CVS-235  node-source consolidation — all node types still render, no #185
//   CVS-225  Metric/Hypothesis node toolbar opens without crashing (was a ReferenceError)

const NODE_SEL =
  '.react-flow__node-metricCard, .react-flow__node-metricNode, .react-flow__node-valueNode, .react-flow__node-actionNode, .react-flow__node-hypothesisNode';

// The RF node type classes we expect the fixture canvas to render a mix of.
const NODE_TYPE_CLASSES = [
  'metricCard',
  'metricNode',
  'valueNode',
  'actionNode',
  'hypothesisNode',
  'sourceNode',
  'chartNode',
  'operatorNode',
  'commentNode',
  'whiteboardNode',
];

/** Add a core node from the top toolbar "Add Card" dropdown by its menu label. */
async function addNode(page: Page, label: string) {
  const trigger = page.getByRole('button', { name: 'Add Card' }).first();
  await expect(trigger, 'Add Card toolbar button is visible (edit mode)').toBeVisible({
    timeout: 15_000,
  });
  await trigger.click();
  await page.getByRole('menuitem', { name: label }).first().click();
  await page.waitForTimeout(1200); // node mount + store insert
}

/** Reveal a node's toolbar (EnhancedNodeToolbar toggles on double-click). */
async function revealToolbar(node: Locator) {
  await node.click({ force: true });
  await node.dblclick({ force: true }).catch(() => {});
  await node.page().waitForTimeout(400);
}

test('CVS-247/235 canvas soak: menus + dialogs + pan, all node types, no #185/no crash', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // CVS-235: the canvas renders nodes, and we log which node-type classes the
  // fixture exercised (coverage depends on the canvas data).
  const nodeCount = await page.locator('.react-flow__node').count();
  expect(nodeCount, 'canvas rendered at least one node').toBeGreaterThan(0);
  const present: string[] = [];
  for (const t of NODE_TYPE_CLASSES) {
    if (await page.locator(`.react-flow__node-${t}`).count()) present.push(t);
  }
  console.log(`[CVS-235] node-type classes rendered: ${JSON.stringify(present)}`);
  await shot(page, 'cvs235-node-types');

  // CVS-247: exercise every portal surface that used to loop the canvas — a Radix
  // dropdown (Add Card), an anchored popover (Filter), and a node settings dialog —
  // while panning, then assert no #185 / no crash.
  const funnel = page.getByTitle('Filter & date').first();
  if (await funnel.isVisible().catch(() => false)) {
    await funnel.click();
    await page.waitForTimeout(600);
    await page.keyboard.press('Escape');
  }

  const addCard = page.getByRole('button', { name: 'Add Card' }).first();
  if (await addCard.isVisible().catch(() => false)) {
    await addCard.click(); // open the portaled dropdown
    await page.waitForTimeout(400);
    // Pan the canvas while the menu is open — the old bug looped here.
    await page.mouse.move(720, 450);
    await page.mouse.down();
    await page.mouse.move(560, 360, { steps: 8 });
    await page.mouse.up();
    await page.keyboard.press('Escape'); // close without adding
    await page.waitForTimeout(400);
  }

  // Open a node's settings sheet (a portaled dialog) and close it.
  const node = page.locator(NODE_SEL).first();
  if (await node.isVisible().catch(() => false)) {
    await revealToolbar(node);
    const settings = page.getByTestId('node-toolbar-action-settings').first();
    if (await settings.isVisible().catch(() => false)) {
      await settings.click({ force: true });
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8000 });
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  }

  // Short soak: pan around a bit more.
  for (const [x, y] of [
    [600, 400],
    [800, 500],
    [500, 300],
  ] as const) {
    await page.mouse.move(700, 450);
    await page.mouse.down();
    await page.mouse.move(x, y, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(200);
  }
  await shot(page, 'cvs247-soak');

  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
  expect(console_.react185(), 'no React #185 during the canvas soak').toEqual([]);
});

test('CVS-225 Metric + Hypothesis node toolbars open without crashing', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // Add a Metric node and a Hypothesis node — the two types that used to throw a
  // ReferenceError → ErrorBoundary when their toolbar opened (CVS-224 fix). We add
  // fresh ones (rather than relying on fixture data) then delete them again so the
  // real org canvas isn't littered.
  for (const [label, cls] of [
    ['Metric Node', 'metricNode'],
    ['Hypothesis Node', 'hypothesisNode'],
  ] as const) {
    await addNode(page, label);
    const node = page.locator(`.react-flow__node-${cls}`).last();
    await expect(node, `${label} was added to the canvas`).toBeVisible({
      timeout: 8000,
    });

    // Double-click to open the toolbar — before the fix this crashed the node.
    await revealToolbar(node);
    const toolbar = page.getByTestId('node-toolbar').first();
    await expect(toolbar, `${label} toolbar opened (no crash)`).toBeVisible({
      timeout: 8000,
    });
    // The actions the issue calls out are present.
    await expect(page.getByTestId('node-toolbar-action-settings').first()).toBeVisible();
    await expect(page.getByTestId('node-toolbar-action-delete').first()).toBeVisible();
    await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    await shot(page, `cvs225-${cls}-toolbar`);

    // Cleanup: delete the node we just added.
    const del = page.getByTestId('node-toolbar-action-delete').first();
    await del.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Sanity (issue step 4): Value + Action toolbars were already fine — if the
  // fixture has any, they must still open without crashing. Best-effort.
  for (const cls of ['valueNode', 'actionNode'] as const) {
    const existing = page.locator(`.react-flow__node-${cls}`).first();
    if (await existing.isVisible().catch(() => false)) {
      await revealToolbar(existing);
      await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
    }
  }

  expect(console_.react185(), 'no React #185 opening node toolbars').toEqual([]);
});

test('CVS-208 canvas stores smoke: add node persists across reload, then deletes', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  // Need a canvas whose toolbar is in edit mode (has an Add Card button).
  const found = await openCanvasWith(page, 'button:has-text("Add Card")');
  test.skip(!found, 'No editable canvas (Add Card) available on this account');

  const before = await page.locator('.react-flow__node-valueNode').count();
  await addNode(page, 'Value Node');
  const after = await page.locator('.react-flow__node-valueNode').count();
  expect(after, 'a Value node was inserted into the store').toBeGreaterThan(before);

  // Persistence: the store autosaves → the node survives a reload.
  await page.waitForTimeout(2500); // autosave debounce
  await page.reload();
  await page.waitForTimeout(6000);
  const persisted = await page.locator('.react-flow__node-valueNode').count();
  expect(persisted, 'the added node persisted across reload').toBeGreaterThanOrEqual(
    after
  );
  await shot(page, 'cvs208-persisted');

  // Delete it again (cleanup + delete-path coverage) so we don't litter the canvas.
  const node = page.locator('.react-flow__node-valueNode').last();
  await revealToolbar(node);
  const del = page.getByTestId('node-toolbar-action-delete').first();
  if (await del.isVisible().catch(() => false)) {
    await del.click({ force: true });
    await page.waitForTimeout(1500);
    const remaining = await page.locator('.react-flow__node-valueNode').count();
    console.log(`[CVS-208] value nodes after delete: ${remaining} (was ${persisted})`);
  }

  await expect(page.getByText(ERROR_BOUNDARY_TEXT)).toHaveCount(0);
  expect(console_.react185(), 'no React #185 mutating the store').toEqual([]);
});
