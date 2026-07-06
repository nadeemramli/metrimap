import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  ERROR_BOUNDARY_TEXT,
  NO_CREDS,
  collectConsoleErrors,
  openExampleCanvas,
  shot,
  signIn,
} from './helpers';

// CVS-23/65 (ADR-008 step 3): dragging nodes must never trip React #185
// ("Maximum update depth exceeded"). This reproduces the owner-reported crash —
// move nodes around the canvas — and asserts no #185 and no ErrorBoundary after
// the migration to useNodesState.

/** Drag the given node by (dx,dy) in smooth steps. */
async function dragBy(page: Page, box: { x: number; y: number; width: number; height: number }, dx: number, dy: number) {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + dx, cy + dy, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(250);
}

test('CVS-23/65 dragging nodes does not trip React #185', async ({ page }) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  test.setTimeout(150_000);
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  // A populated example canvas (real metric cards) — guarantees draggable nodes.
  const onCanvas = await openExampleCanvas(page, 'SaaS');
  test.skip(!onCanvas, 'Could not open the SaaS example canvas');

  const node = page.locator('.react-flow__node-metricCard').first();
  await expect(node, 'canvas rendered at least one metric card').toBeVisible({ timeout: 20_000 });

  // Move a node several times, back and forth — the exact interaction that
  // used to re-arm the derive↔control loop.
  for (let i = 0; i < 5; i++) {
    const box = await node.boundingBox();
    if (!box) break;
    const dir = i % 2 === 0 ? 1 : -1;
    await dragBy(page, box, 120 * dir, 80 * dir);
  }

  await shot(page, 'cvs23-node-drag');

  expect(
    console_.react185(),
    `React #185 during node drag:\n${console_.react185().join('\n')}`
  ).toEqual([]);
  await expect(
    page.getByText(ERROR_BOUNDARY_TEXT),
    'ErrorBoundary fallback must not render'
  ).toHaveCount(0);
});
