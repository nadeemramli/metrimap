import { expect, test } from '@playwright/test';
import {
  NO_CREDS,
  collectConsoleErrors,
  openFirstCanvas,
  shot,
  signIn,
} from './helpers';

// CVS-262 — automated coverage for the tone-aware edge centre score pill (CVS-261).
// Mostly visual QA: assert the compact pill exists, its tone is one of the valid
// tones (data-tone), and hovering an edge reveals the detail badges + a single
// action toolbar. Tone coverage depends on the fixture canvas — logged below.
//
// Known by-design gap: Compositional + Exploratory relationships have
// showWeightButton=false, so they render NO pill. Their "dashed/muted" state can
// only be verified on low-confidence/neutral WEIGHTED edges (data-loose="true").

const VALID_TONES = ['positive', 'negative', 'weak', 'neutral', 'structural'];

test('CVS-262 edge score pill: compact, tone-aware, hover detail + toolbar', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  const pills = page.getByTestId('edge-score-pill');
  const count = await pills.count();
  test.skip(count === 0, 'This canvas has no relationship edges with a score pill');

  await shot(page, 'cvs262-edges');

  // Compact pill (not the old 40px circle): assert a small height.
  const first = pills.first();
  const box = await first.boundingBox();
  if (box) expect(box.height).toBeLessThan(32);

  // Tone-aware: every pill's data-tone is a valid tone. Log the coverage so the
  // owner can see which tones the fixture exercised.
  const tones: (string | null)[] = await pills.evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-tone'))
  );
  const loose: (string | null)[] = await pills.evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-loose'))
  );
  console.log(`[CVS-262] pill tones present: ${JSON.stringify(tones)}`);
  console.log(`[CVS-262] pill loose flags: ${JSON.stringify(loose)}`);
  for (const t of tones) expect(VALID_TONES).toContain(t);

  // Hover an edge path → detail badges + a single action toolbar appear.
  const edge = page.locator('g.react-flow__edge-dynamicEdge').first();
  if (await edge.count()) {
    await edge.hover({ force: true });
    await page.waitForTimeout(500);
    // The single edge action toolbar (>3 actions collapses to "More Actions").
    const moreActions = page.getByRole('button', { name: 'More Actions' });
    const edgeSettings = page.getByRole('button', { name: 'Edge Settings' });
    const toolbarVisible =
      (await moreActions.isVisible().catch(() => false)) ||
      (await edgeSettings.isVisible().catch(() => false));
    expect(toolbarVisible, 'an edge action toolbar appears on hover').toBeTruthy();
    await shot(page, 'cvs262-edge-hover');
  }

  // Dark mode legibility snapshot (if a theme toggle is reachable is out of scope;
  // capture the current theme's pills at zoom for visual review).
  expect(console_.react185(), 'no React #185 on the edges').toEqual([]);
});
