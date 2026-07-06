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
  // Home tiles changed over time: try the legacy "Canvas Preview" text first,
  // then fall back to the current ProjectCard (navigation fires from the
  // title area — data-slot="card-title"). Clicks are timeboxed — an
  // unmatched locator otherwise hangs the test until the suite timeout.
  await page
    .getByText('Canvas Preview')
    .first()
    .click({ timeout: 4000 })
    .catch(async () => {
      await page
        .locator('[data-slot="card-title"]')
        .first()
        .click({ timeout: 4000 })
        .catch(() => {});
    });
  await page.waitForURL(/\/canvas\/[^/]+$/, { timeout: 25000 }).catch(() => {});
  const onCanvas = /\/canvas\/[^/]+$/.test(page.url());
  if (onCanvas) await page.waitForTimeout(5000); // let the graph render
  return onCanvas;
}

/**
 * Open the first canvas from Home that actually contains `selector` (tries up to
 * `max` tiles). Returns true once found + opened. Used by node/edge specs that
 * need a canvas with the right fixture data (metric nodes / relationship edges),
 * so they run green instead of skipping on an arbitrary first canvas.
 */
export async function openCanvasWith(
  page: Page,
  selector: string,
  max = 6
): Promise<boolean> {
  await page.goto('/');
  await page.waitForTimeout(3000);
  const count = Math.min(await page.getByText('Canvas Preview').count(), max);
  for (let i = 0; i < count; i++) {
    await page.goto('/');
    await page.waitForTimeout(2500);
    await page
      .getByText('Canvas Preview')
      .nth(i)
      .click()
      .catch(() => {});
    await page.waitForURL(/\/canvas\/[^/]+$/, { timeout: 20_000 }).catch(() => {});
    if (!/\/canvas\/[^/]+$/.test(page.url())) continue;
    await page.waitForTimeout(4000); // let the graph render
    const has = await page
      .locator(selector)
      .first()
      .isVisible()
      .catch(() => false);
    if (has) return true;
  }
  return false;
}

/**
 * Open a populated EXAMPLE canvas from the Explore view (e.g. "SaaS") — these have
 * real metric cards + typed relationships, unlike the operate-view user canvases.
 * Returns true once on a /canvas/ route.
 */
export async function openExampleCanvas(
  page: Page,
  name = 'SaaS'
): Promise<boolean> {
  await page.goto('/?view=explore');
  await page.waitForTimeout(3000);
  await page
    .getByText(name, { exact: true })
    .first()
    .click()
    .catch(() => {});
  await page.waitForURL(/\/canvas\/[^/]+/, { timeout: 25_000 }).catch(() => {});
  const onCanvas = /\/canvas\/[^/]+/.test(page.url());
  if (onCanvas) await page.waitForTimeout(6000); // nodes + layout settle
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
