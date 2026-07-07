/**
 * App-side loop recordings — Playwright signs into the real app (prod Clerk,
 * HTTPS dev server on dev.canvasm.app:3000) and drives one "scene" per
 * operating loop, recording video. ffmpeg turns each take into the marketing
 * site's media contract: <flow-id>.mp4 (muted h264, yuv420p, faststart,
 * 1280×800, crf 27) + <flow-id>.jpg poster, written to e2e/loops/.
 *
 * Same output contract as metrimap-marketing/scripts/record-loops.mjs — the
 * signed-out strategy-to-impact scene lives there; the five authenticated
 * loops live here. Hand the files to the marketing repo's public/loops/.
 *
 * Usage (dev server must already be running with E2E_HTTPS=1):
 *   node e2e/record-loops.mjs                     # all scenes
 *   node e2e/record-loops.mjs teams-to-dashboards # one scene
 *
 * Needs: .env with VITE_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
 * E2E_TEST_EMAIL, E2E_TEST_PASSWORD; ffmpeg on PATH; hosts entry for
 * dev.canvasm.app (see docs/testing/e2e-visual-verification.md).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { clerkSetup, clerk, setupClerkTestingToken } from '@clerk/testing/playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'e2e/loops');
const TMP_DIR = join(ROOT, 'e2e/.loops-tmp');
// Default to PRODUCTION — marketing takes must show the real product without
// dev-only chrome (Debug State / Navigation Controls panels are DEV-gated).
// Set RECORD_BASE_URL=https://dev.canvasm.app:3000 to record unshipped UI.
const BASE_URL = process.env.RECORD_BASE_URL ?? 'https://use.canvasm.app';
const SIZE = { width: 1280, height: 800 };

// .env → process.env (same as playwright.config.ts; runner not used here).
try {
  for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  /* env injected directly */
}
process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/* ── camera / gesture helpers ────────────────────────────────────────── */

/** Eased mouse travel so the injected cursor glides instead of teleporting. */
async function glide(page, to, ms = 700) {
  const from = (await page.evaluate(() => window.__cursorPos)) ?? { x: 640, y: 400 };
  const steps = Math.max(12, Math.round(ms / 16));
  for (let i = 1; i <= steps; i++) {
    const t = easeInOut(i / steps);
    await page.mouse.move(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
    await sleep(ms / steps);
  }
}

/** Glide to a locator's center, pulse the cursor, click. */
async function glideClick(page, locator, ms = 700) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  const box = await locator.boundingBox();
  if (!box) throw new Error(`glideClick: no bounding box for ${locator}`);
  await glide(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, ms);
  await page.evaluate(() => window.__cursorPulse?.());
  await sleep(180);
  await locator.click();
}

/** Smooth drag-pan on the React Flow canvas. */
async function pan(page, from, to, ms = 1400) {
  const steps = Math.max(24, Math.round(ms / 16));
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    const t = easeInOut(i / steps);
    await page.mouse.move(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
    await sleep(ms / steps);
  }
  await page.mouse.up();
}

async function fitView(page, settle = 700) {
  await page.click('.react-flow__controls-fitview').catch(() => {});
  await sleep(settle);
}

async function zoomIn(page, clicks = 1, settle = 450) {
  for (let i = 0; i < clicks; i++) {
    await page.click('.react-flow__controls-zoomin').catch(() => {});
    await sleep(settle);
  }
}

/** Type into a focused field at a human pace. */
async function typeSlow(page, text, delay = 55) {
  await page.keyboard.type(text, { delay });
}

/* ── injected cursor (headless video shows no OS pointer) ────────────── */

const CURSOR_INIT = `
  (() => {
    if (window.top !== window) return;
    // Quiet the first-run onboarding (welcome dialog + tour + checklist) so it
    // never pops mid-take — these clips demo specific loops, not onboarding.
    try {
      localStorage.setItem('metrimap-onboarding', JSON.stringify({
        state: {
          firstRunSeen: true, tourPending: false,
          tourCompletedAt: '2026-07-01T00:00:00.000Z', tourSkippedAt: null,
          demoCopyProjectId: null, checklistDismissed: true,
          visitedDashboard: true,
          dismissedTips: {
            'layers-panel': true, 'dock-panels': true,
            'dashboard-edit': true, 'draw-mode': true,
          },
        },
        version: 0,
      }));
    } catch {}
    const mk = () => {
      const d = document.createElement('div');
      d.id = '__rec-cursor';
      d.style.cssText =
        'position:fixed;z-index:2147483647;width:22px;height:22px;border-radius:50%;' +
        'pointer-events:none;border:2.5px solid rgba(20,20,25,.85);background:rgba(255,255,255,.35);' +
        'box-shadow:0 1px 4px rgba(0,0,0,.3);transform:translate(-50%,-50%);left:-100px;top:-100px;' +
        'transition:width .15s,height .15s';
      document.documentElement.appendChild(d);
      return d;
    };
    let dot = null;
    window.__cursorPos = null;
    window.addEventListener('mousemove', (e) => {
      if (!dot || !dot.isConnected) dot = mk();
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      window.__cursorPos = { x: e.clientX, y: e.clientY };
    }, true);
    window.__cursorPulse = () => {
      if (!dot) return;
      dot.animate(
        [{ boxShadow: '0 0 0 0 rgba(59,130,246,.55)' }, { boxShadow: '0 0 0 14px rgba(59,130,246,0)' }],
        { duration: 380 }
      );
    };
  })();
`;

/* ── scenes (loop id → authenticated take) ───────────────────────────── */
/* Filled in per loop; each receives a signed-in page at BASE_URL. */

export const SCENES = {};

/* ── auth + record + encode ──────────────────────────────────────────── */

async function activateOrg(page) {
  await page.evaluate(async () => {
    const c = window.Clerk;
    if (!c?.user || c.organization) return;
    const m = await c.user.getOrganizationMemberships();
    const org = (m?.data ?? m)?.[0]?.organization;
    if (org) await c.setActive({ organization: org.id });
  });
}

async function main(sceneIds, scenes) {
  mkdirSync(TMP_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  await clerkSetup({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY });

  const browser = await chromium.launch({ channel: 'chrome' });
  // Sign in ONCE in a throwaway context, then reuse the storage state for
  // every scene — the shared prod Clerk instance rate-limits repeat sign-ins.
  const authCtx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: SIZE,
    baseURL: BASE_URL,
  });
  const authPage = await authCtx.newPage();
  await setupClerkTestingToken({ page: authPage });
  await authPage.goto(BASE_URL + '/');
  await clerk.signIn({
    page: authPage,
    signInParams: {
      strategy: 'password',
      identifier: process.env.E2E_TEST_EMAIL,
      password: process.env.E2E_TEST_PASSWORD,
    },
  });
  await activateOrg(authPage);
  await authPage.waitForTimeout(2000);
  const storageState = await authCtx.storageState();
  await authCtx.close();
  console.log('[record] signed in, storage state captured');

  for (const id of sceneIds) {
    const scene = scenes[id];
    if (!scene) {
      console.error(`[record] no scene for "${id}" — skipping`);
      continue;
    }
    console.log(`[record] ${id} …`);
    const ctx = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: SIZE,
      deviceScaleFactor: 2,
      baseURL: BASE_URL,
      storageState,
      recordVideo: { dir: TMP_DIR, size: SIZE },
    });
    const page = await ctx.newPage();
    await page.addInitScript(CURSOR_INIT);
    const recordStart = Date.now();
    let sceneStart = recordStart;
    let sceneEnd = null;
    // Scenes may call page.__cut() when the take is over — anything after
    // (cleanup of demo litter) is trimmed out of the encoded clip.
    try {
      await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await activateOrg(page).catch(() => {});
      await page.waitForTimeout(3000); // app shell + org settle before the take
      sceneStart = Date.now();
      // Scenes may call page.__start() after slow initial loads so the blank
      // load never makes the clip, and page.__cut() when the take is over.
      page.__start = () => {
        sceneStart = Date.now();
      };
      page.__cut = () => {
        sceneEnd = Date.now();
      };
      await scene(page);
    } catch (err) {
      console.error(`[record] ${id} FAILED: ${err?.message ?? err}`);
      await page.screenshot({ path: join(OUT_DIR, `${id}.failed.png`) }).catch(() => {});
      await ctx.close();
      continue;
    }
    const video = page.video();
    await ctx.close();
    const webm = await video.path();
    const trim = Math.max(0, (sceneStart - recordStart) / 1000 - 0.3);
    const dur = sceneEnd ? (sceneEnd - sceneStart) / 1000 + 0.6 : null;
    encode(id, webm, trim, dur);
  }

  await browser.close();
  rmSync(TMP_DIR, { recursive: true, force: true });
  console.log('[record] done');
}

function encode(flowId, webm, trimSec, durSec = null) {
  const mp4 = join(OUT_DIR, `${flowId}.mp4`);
  const jpg = join(OUT_DIR, `${flowId}.jpg`);
  execFileSync('ffmpeg', [
    '-y', '-ss', trimSec.toFixed(2), '-i', webm, '-an',
    ...(durSec ? ['-t', durSec.toFixed(2)] : []),
    '-vf', 'scale=1280:-2:flags=lanczos',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4,
  ], { stdio: 'pipe' });
  execFileSync('ffmpeg', [
    '-y', '-ss', (trimSec + 0.5).toFixed(2), '-i', webm,
    '-frames:v', '1', '-q:v', '3', jpg,
  ], { stdio: 'pipe' });
  const kb = (f) => Math.round(statSync(f).size / 1024);
  console.log(`[record] ${flowId}: ${mp4} (${kb(mp4)} KB), poster ${kb(jpg)} KB`);
}

export const helpers = { sleep, glide, glideClick, pan, fitView, zoomIn, typeSlow, activateOrg };

// Scenes are defined in e2e/loop-scenes.mjs (kept separate so takes can be
// iterated without touching the harness).
const requested = process.argv.slice(2);
const { defineScenes } = await import('./loop-scenes.mjs');
const scenes = defineScenes(helpers);
await main(requested.length ? requested : Object.keys(scenes), scenes);
