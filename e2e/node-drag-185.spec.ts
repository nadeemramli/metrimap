import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  ERROR_BOUNDARY_TEXT,
  NO_CREDS,
  collectConsoleErrors,
  openFirstCanvas,
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
  // The user's OWN first canvas — editable, so nodes actually drag (example
  // canvases are public/read-only → nodesDraggable=false → no real drag).
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  const node = page.locator('.react-flow__node').first();
  const hasNode = await node.isVisible({ timeout: 15_000 }).catch(() => false);
  test.skip(!hasNode, 'First canvas has no draggable nodes to exercise');

  // Movement must still work now React Flow (not the per-frame store write)
  // drives it: drag once and assert the node actually moved.
  const before = await node.boundingBox();
  if (before) await dragBy(page, before, 160, 110);
  const after = await node.boundingBox();
  if (before && after) {
    const moved = Math.abs(after.x - before.x) + Math.abs(after.y - before.y);
    expect(moved, 'node visibly moved after drag').toBeGreaterThan(40);
  }

  // Move it several more times, back and forth — the interaction that used to
  // re-arm the derive↔control loop.
  for (let i = 0; i < 4; i++) {
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
