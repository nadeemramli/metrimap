import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import type { Page } from '@playwright/test';

// Shared helpers for the e2e visual-automation lane (CVS-272/273/262/255/236).
// Reuse the Clerk sign-in + org-activation + open-canvas flow from canvas.spec.ts
// so each spec stays small and deterministic.

export const E2E_EMAIL = process.env.E2E_TEST_EMAIL;
export const E2E_PASSWORD = process.env.E2E_TEST_PASSWORD;

/** The specs need the prod Clerk secret + a test account. Absent → skip. */
export const NO_CREDS =
  !process.env.CLERK_SECRET_KEY || !E2E_EMAIL || !E2E_PASSWORD;

/**
 * Activate the signed-in user's first org (the app is orgs-only) so their
 * canvases load. Idempotent — no-op if an org is already active.
 */
export async function activateOrg(page: Page) {
  await page.evaluate(async () => {
    const c = (window as { Clerk?: any }).Clerk;
    if (!c?.user || c.organization) return;
    const m = await c.user.getOrganizationMemberships();
    const org = (m?.data ?? m)?.[0]?.organization;
    if (org) await c.setActive({ organization: org.id });
  });
}

/** Full sign-in: Clerk testing token + password sign-in + activate the org. */
export async function signIn(page: Page) {
  await setupClerkTestingToken({ page });
  await page.goto('/');
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: E2E_EMAIL!,
      password: E2E_PASSWORD!,
    },
  });
  await activateOrg(page);
}

/**
 * Open the first canvas from Home (clicks a "Canvas Preview" tile). Returns true
 * if we landed on a /canvas/:id route. Waits for nodes/edges to settle.
 */
export async function openFirstCanvas(page: Page): Promise<boolean> {
  await page.goto('/');
  await page.waitForTimeout(3500);
  await page
    .getByText('Canvas Preview')
    .first()
    .click()
    .catch(() => {});
  await page.waitForURL(/\/canvas\/[^/]+$/, { timeout: 25000 }).catch(() => {});
  const onCanvas = /\/canvas\/[^/]+$/.test(page.url());
  if (onCanvas) await page.waitForTimeout(5000); // let the graph render
  return onCanvas;
}

/**
 * Start collecting console errors + uncaught page errors. Returns a live array +
 * a helper to pull only React #185 (max-update-depth) hits for the no-crash checks.
 */
export function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err?.message ?? err)));
  return {
    errors,
    react185: () => errors.filter((e) => /Minified React error #185|Maximum update depth/i.test(e)),
    matching: (re: RegExp) => errors.filter((e) => re.test(e)),
  };
}

/** Screenshot into e2e/screenshots/ with a clear name (no .png needed). */
export async function shot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png` });
}

/** The ErrorBoundary fallback heading — asserting it is absent = "did not crash". */
export const ERROR_BOUNDARY_TEXT = 'Something went wrong';
