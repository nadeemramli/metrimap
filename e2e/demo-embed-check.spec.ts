import { expect, test } from '@playwright/test';
import { shot } from './helpers';

// One-off verification: the public demo canvas renders in the read-only embed
// (no auth) and fits to view.
test('demo canvas embed renders publicly', async ({ page }) => {
  await page.goto('/embed/7d0612a7-e9a1-4de1-b75e-dd3b6d9ec715');
  await page.waitForTimeout(6000); // let data + fitView settle
  const nodes = page.locator('.react-flow__node');
  await expect(nodes.first()).toBeVisible({ timeout: 20000 });
  const count = await nodes.count();
  console.log('embed node count:', count);
  expect(count).toBeGreaterThanOrEqual(9);
  await shot(page, 'demo-embed');
});
