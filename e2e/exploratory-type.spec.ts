import { expect, test } from '@playwright/test';
import {
  NO_CREDS,
  collectConsoleErrors,
  openExampleCanvas,
  shot,
  signIn,
} from './helpers';

// CVS-256 — Exploratory relationship type (CVS-254). NON-MUTATING: assert the
// relationship sheet's type picker offers "Exploratory" alongside the existing
// four types, and (bonus) log whether any loose/dashed edges render. Does NOT
// change any relationship's type (no writes to real example data).

test('CVS-256 Exploratory type offered in the relationship sheet', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');
  const console_ = collectConsoleErrors(page);

  await signIn(page);
  await openExampleCanvas(page);
  await page.mouse.move(720, 460);
  await page.keyboard.press('Shift+1'); // fit the graph on-screen
  await page.waitForTimeout(1200);

  const pill = page.getByTestId('edge-score-pill').first();
  test.skip(
    (await pill.count()) === 0,
    'Example canvas has no relationship edges to open'
  );

  // Open a relationship's settings sheet (clicking the centre pill opens it).
  await pill.click({ force: true });
  const sheet = page.getByRole('dialog').first();
  await expect(sheet).toBeVisible({ timeout: 10_000 });
  await shot(page, 'cvs256-relationship-sheet');

  // The type picker offers Exploratory as a first-class option alongside the four
  // existing types (CVS-254 migration is applied when the UI offers it).
  await expect(sheet.getByText('Exploratory', { exact: true })).toBeVisible({
    timeout: 8000,
  });
  for (const t of ['Deterministic', 'Probabilistic', 'Causal', 'Compositional']) {
    await expect(sheet.getByText(t, { exact: true })).toBeVisible();
  }
  await shot(page, 'cvs256-type-picker');

  // Non-mutating: close without changing the type.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Bonus (visual QA): log how many pills are loose (dashed/muted). Exploratory
  // edges themselves render no pill (showWeightButton=false); loose covers
  // low-confidence/neutral weighted edges.
  const loose = await page
    .getByTestId('edge-score-pill')
    .evaluateAll(
      (els) => els.filter((e) => e.getAttribute('data-loose') === 'true').length
    );
  console.log(`[CVS-256] loose (dashed/muted) score pills present: ${loose}`);

  await expect(page.getByText('Something went wrong')).toHaveCount(0);
  expect(console_.react185(), 'no React #185 opening the relationship sheet').toEqual([]);
});
