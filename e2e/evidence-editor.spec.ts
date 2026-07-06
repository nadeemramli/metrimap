import { expect, test } from '@playwright/test';
import { NO_CREDS, openFirstCanvas, shot, signIn } from './helpers';

// CVS-236 — automated coverage for evidence editor stability (CVS-34, PRs #73/#78).
// Verifies: no editor destroy→re-init loop ("Editor ready" fires once), exactly ONE
// editor instance (not two stacked), typed text survives, and save→reload persists
// with no ZodError(date) / editor errors in the console.

test('CVS-236 evidence editor: single editor, no refresh loop, persists', async ({
  page,
}) => {
  test.skip(NO_CREDS, 'Set CLERK_SECRET_KEY, E2E_TEST_EMAIL, E2E_TEST_PASSWORD in .env');

  // Collect ALL console output: count the editor "ready" signal (loop detector) +
  // capture errors (ZodError/date, editor errors) to assert absent.
  const logs: string[] = [];
  const errors: string[] = [];
  page.on('console', (m) => {
    logs.push(m.text());
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e?.message ?? e)));
  const readyCount = () =>
    logs.filter((l) => l.includes('EditorJS ready with comprehensive tools')).length;

  await signIn(page);
  const onCanvas = await openFirstCanvas(page);
  test.skip(!onCanvas, 'No canvas available on this account to open');

  // Canvas-scoped evidence route → DB-backed persistence (createProjectEvidence).
  const canvasUrl = page.url();
  await page.goto(`${canvasUrl.replace(/\/$/, '')}/evidence`);
  await page.waitForLoadState('networkidle').catch(() => {});

  const newBtn = page.getByRole('button', { name: 'New Evidence' }).first();
  await expect(newBtn).toBeVisible({ timeout: 15_000 });
  await newBtn.click();

  // The modal editor toasts "📝 Editor ready!" once. Wait for it, then confirm the
  // editor init signal did NOT fire repeatedly (the old refresh-loop bug).
  await expect(page.getByText('📝 Editor ready!')).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(1500);
  await shot(page, 'cvs236-editor-open');

  // Exactly ONE editor instance (EditorJS builds .codex-editor__redactor per init).
  await expect(page.locator('.codex-editor__redactor')).toHaveCount(1);

  // Type into the first editable block.
  const body = `e2e evidence body ${Date.now()}`;
  const block = page.locator('.ce-paragraph[contenteditable="true"]').first();
  await block.click();
  await page.keyboard.type(body);

  // Required metadata + save.
  const title = `E2E Evidence ${Date.now()}`;
  await page.getByPlaceholder('Evidence title').fill(title);
  // Clear the auto-populated owner NAME: owner_id is a users(id) FK, so persisting a
  // name there fails the insert (separate product bug — filed). A null owner persists
  // fine, which is what we need to exercise editor stability + persistence here.
  await page.getByPlaceholder('Owner', { exact: true }).fill('');

  // Give autosave (3s debounce) a chance to fire — the loop bug would re-init the
  // editor here and wipe the text.
  await page.waitForTimeout(3500);
  await expect(page.locator('.codex-editor__redactor')).toHaveCount(1);
  await expect(block).toContainText(body); // text not wiped by a re-init
  expect(readyCount(), 'editor initialised once, no refresh loop').toBeLessThanOrEqual(1);

  await page.getByRole('button', { name: 'Save' }).first().click();
  await page.waitForTimeout(2000);
  await shot(page, 'cvs236-editor-saved');

  // Editor-stability scope: no ZodError(date) + no EditorJS/re-init/#185 errors.
  // (The owner_id FK create error is a separate product bug, excluded here + filed.)
  const stabilityErrors = errors.filter((e) =>
    /Invalid datetime|Validation error updating evidence item|EditorJS error|Maximum update depth|Minified React error/i.test(
      e
    )
  );
  expect(stabilityErrors, 'no ZodError(date) or editor re-init errors').toEqual([]);

  // Persistence: reload the repository → the saved item is listed.
  await page.reload();
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1500);
  await expect(page.getByText(title).first()).toBeVisible({ timeout: 15_000 });
  await shot(page, 'cvs236-evidence-persisted');
});
