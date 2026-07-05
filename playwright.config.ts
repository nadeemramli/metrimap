import { readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Load .env into the Playwright (node) process — Vite loads it for the app, but
// the runner + clerkSetup need the E2E_* keys (not VITE_-prefixed). Server-side.
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  /* no .env in this checkout — env may be injected directly */
}

// Drive e2e against the Clerk DEVELOPMENT instance (pk_test): production keys
// (pk_live) are domain-locked to canvasm.app and refuse localhost, and Web
// Crypto needs a secure context — localhost qualifies, dev.canvasm.app:3000 (http)
// does not. So point clerkSetup + the app at the dev instance on localhost.
const E2E_PK = process.env.E2E_CLERK_PUBLISHABLE_KEY;
const E2E_SK = process.env.E2E_CLERK_SECRET_KEY;
process.env.CLERK_PUBLISHABLE_KEY = E2E_PK || process.env.VITE_CLERK_PUBLISHABLE_KEY;
if (E2E_SK) process.env.CLERK_SECRET_KEY = E2E_SK;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  timeout: 90_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'https://dev.canvasm.app:3000',
    ignoreHTTPSErrors: true, // self-signed local cert
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'https://dev.canvasm.app:3000',
    ignoreHTTPSErrors: true,
    // Serve HTTPS (E2E_HTTPS) + use the dev pk_test for the e2e server only.
    // Vite gives real env vars priority over .env files, so this wins.
    env: {
      E2E_HTTPS: '1',
      ...(E2E_PK ? { VITE_CLERK_PUBLISHABLE_KEY: E2E_PK } : {}),
    },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
