import { readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Load .env into the Playwright (node) process — Vite loads it for the app, but
// the runner + clerkSetup need CLERK_SECRET_KEY / E2E_* (which are NOT VITE_-
// prefixed, so they never reach import.meta.env). Values stay server-side.
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  /* no .env in this checkout — env may be injected directly */
}
// @clerk/testing expects CLERK_PUBLISHABLE_KEY; the app stores it VITE_-prefixed.
if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.VITE_CLERK_PUBLISHABLE_KEY)
  process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  timeout: 90_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chrome',
      // Use the system Google Chrome (installed) instead of downloading Chromium.
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
