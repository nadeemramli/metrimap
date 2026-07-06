import { expect, test } from '@playwright/test';
import {
  NO_CREDS,
  collectConsoleErrors,
  openFirstCanvas,
  shot,
  signIn,
} from './helpers';

// CVS-272 — automated coverage for the compact filter popover (CVS-163 s2).
// Asserts: compact anchored popover (not a centered modal), the sections, chip
// toggle → aria-pressed + active-count badge, Clear all, and Apply-closes.

test('CVS-272 filter popover: compact, sections, chip toggle, count, apply', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // Open the popover from the top-right toolbar funnel.
  const funnel = page.getByTitle('Filter & date').first();
  await expect(funnel).toBeVisible({ timeout: 20_000 });
  await funnel.click();

  const pop = page.getByRole('dialog').filter({ hasText: 'Filter canvas' });
  await expect(pop).toBeVisible();
  await shot(page, 'cvs272-filter-popover');

  // Compact + anchored: the popover is a narrow card (w-[340px]), not a full-screen
  // modal. Assert its width is small relative to the viewport.
  const box = await pop.boundingBox();
  expect(box, 'popover has a bounding box').not.toBeNull();
  if (box) expect(box.width).toBeLessThan(420);

  // Sections present.
  await expect(
    pop.getByPlaceholder('Search title, description, tags')
  ).toBeVisible();
  await expect(pop.getByText('Date range')).toBeVisible();
  await expect(pop.getByRole('button', { name: 'Last 30 days' })).toBeVisible();
  await expect(pop.getByText('Categories')).toBeVisible();
  await expect(
    pop.getByRole('checkbox', { name: 'Show only connected nodes' })
  ).toBeVisible();

  // Toggle a category chip → it becomes aria-pressed, and the active-count badge
  // appears on the funnel, and "Clear all" shows in the header.
  const chip = pop.getByRole('button', { name: 'Data/Metric' });
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('filter-active-count')).toBeVisible();
  await expect(pop.getByRole('button', { name: 'Clear all' })).toBeVisible();
  await shot(page, 'cvs272-filter-active');

  // Clear all → chip resets + badge gone.
  await pop.getByRole('button', { name: 'Clear all' }).click();
  await expect(chip).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('filter-active-count')).toHaveCount(0);

  // Apply closes the popover.
  await pop.getByRole('button', { name: 'Apply' }).click();
  await expect(pop).toBeHidden();

  // Mobile: the popover still fits + body scrolls.
  await page.setViewportSize({ width: 390, height: 844 });
  await funnel.click();
  await expect(pop).toBeVisible();
  await shot(page, 'cvs272-filter-mobile');
  const mBox = await pop.boundingBox();
  if (mBox) expect(mBox.width).toBeLessThanOrEqual(390);

  expect(console_.react185(), 'no React #185 during filtering').toEqual([]);
});
