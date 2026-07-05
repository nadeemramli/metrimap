# E2E / visual-verification harness (Playwright + Clerk)

A [Playwright](https://playwright.dev) harness that drives the **real app, signed in as a
real Clerk user**, walks authenticated routes and canvases, and captures screenshots for
visual verification. It exists so a change can be checked end-to-end in a browser (auth →
workspace → canvas), not just via unit tests — complementing the Vitest suite and
`test:rls`.

> Status: this is primarily a **screenshot / visual-verification** harness today (few hard
> assertions). Grow it into assertion-based e2e as flows stabilize.

## TL;DR

```bash
npm run screenshots          # generates the local cert if missing, then runs Playwright
open e2e/screenshots/*.png   # captured output (git-ignored)
```

Requires a one-time local setup (below): `dev.canvasm.app` pointing at localhost, the four
`E2E_*`/Clerk keys in `.env`, and the dev origin allow-listed in Clerk. Without the Clerk
creds the specs **skip** gracefully rather than fail.

## Why it looks the way it does (the localhost + Clerk constraint)

Clerk can't run against a bare `http://localhost`:

- Clerk publishable keys are **domain-locked** and reject `localhost` as an origin.
- Clerk's Web Crypto (`crypto.subtle`) is only defined in a **secure context** — i.e. HTTPS
  (or `localhost`, which we can't use per the point above).

So the harness serves the app over **HTTPS at `https://dev.canvasm.app:3000`** — a
`canvasm.app` subdomain that resolves to your machine — and that exact origin is registered
in the Clerk instance's **allowed origins**. That satisfies both the domain lock and the
secure-context requirement.

- `vite.config.ts` → `server.allowedHosts: ['.canvasm.app']`, and it serves HTTPS **only**
  when `E2E_HTTPS=1` (using the self-signed cert in `e2e/certs/`). Normal `npm run dev`
  stays plain HTTP on `localhost`.
- `playwright.config.ts` → `webServer` boots `npm run dev` with `E2E_HTTPS=1`, and
  `baseURL: https://dev.canvasm.app:3000` with `ignoreHTTPSErrors` (self-signed cert).

The harness uses the **production Clerk instance** (`pk_live`/`sk_live` from `.env`), because
Supabase trusts its JWTs and `https://dev.canvasm.app:3000` was added to that instance's
allowed origins. (`global-setup.ts` also has an idempotent "create the e2e user" path that
only fires for a `sk_test` dev key — a no-op under `sk_live`.)

## One-time local setup

1. **Point `dev.canvasm.app` at your machine.** Add to your hosts file
   (`/etc/hosts`, or `C:\Windows\System32\drivers\etc\hosts`):

   ```
   127.0.0.1   dev.canvasm.app
   ```

2. **Allow the origin in Clerk.** In the Clerk dashboard for the instance whose keys are in
   `.env`, add `https://dev.canvasm.app:3000` to the allowed origins / redirect URLs.

3. **Generate the local TLS cert** (self-signed, git-ignored under `e2e/certs/`). This runs
   automatically as the `prescreenshots` hook, or manually:

   ```bash
   npm run prescreenshots
   ```

4. **Install the Playwright browser** (first run only):

   ```bash
   npx playwright install chrome
   ```

## Environment variables (`.env`, git-ignored — never commit)

The Playwright runner and `clerkSetup` read **non-`VITE_`** keys from `.env` (the config
loads `.env` into the node process itself). Required:

| Var | Purpose |
| --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_live`); the config mirrors it to `CLERK_PUBLISHABLE_KEY` for `clerkSetup`. |
| `CLERK_SECRET_KEY` | Clerk secret (`sk_live`); enables sign-in + the `@clerk/testing` token. If unset, specs **skip**. |
| `E2E_TEST_EMAIL` | Email of the pre-existing Clerk user the specs sign in as. |
| `E2E_TEST_PASSWORD` | That user's password (password sign-in strategy). |

The e2e user must **already exist** in the Clerk instance and be a member of at least one
**organization** (the app is orgs-only; specs call `activateOrg` after sign-in).

`E2E_HTTPS=1` is set automatically by the Playwright `webServer` — you don't set it by hand.

## Running

```bash
npm run screenshots     # = prescreenshots (cert) + `playwright test`
```

Playwright boots its own dev server (`reuseExistingServer: false`), so **stop any running
`npm run dev`** first to free port 3000. Screenshots land in `e2e/screenshots/` (git-ignored).

## What the specs do

- **`e2e/global-setup.ts`** — runs once before all specs: `clerkSetup()` (installs the Clerk
  testing token machinery) and, for a `sk_test` key only, idempotently ensures the e2e user
  exists in the dev pool.
- **`e2e/canvas.spec.ts`** — signs in → `activateOrg` → opens a real canvas → screenshots the
  canvas and the toolbar filter popover. Exports the shared `activateOrg(page)` helper.
- **`e2e/visual.spec.ts`** — signs in → captures a set of authenticated workspace routes
  (`/`, `/?view=explore`, `/catalog`, `/feed`) as screenshots.

Every spec starts with `setupClerkTestingToken({ page })` + `clerk.signIn({ strategy:
'password', ... })`, and `test.skip(...)` when the Clerk creds are absent.

## Adding a new capture / test

- **New authenticated route** → add `{ path, name }` to the `ROUTES` array in
  `visual.spec.ts`.
- **New flow** → new `e2e/<area>.spec.ts`; start with `setupClerkTestingToken` +
  `clerk.signIn` + `activateOrg` (import it from `canvas.spec.ts`), then drive the page.
- Prefer role/text/`title`-based locators (as the existing specs do) over brittle CSS.

## Troubleshooting

- **Specs all skip** → the four Clerk/`E2E_*` vars aren't in `.env`.
- **Sign-in hangs / crypto errors** → app isn't on HTTPS (`E2E_HTTPS` not applied) or the cert
  is missing — re-run `npm run prescreenshots`; confirm the URL is `https://dev.canvasm.app:3000`.
- **Clerk rejects the origin** → `dev.canvasm.app` isn't in the hosts file, or the origin
  isn't allow-listed in the Clerk instance.
- **Port 3000 in use** → stop your local `npm run dev`; the harness starts its own server.
- **Canvas is empty after sign-in** → the e2e user has no org, or `activateOrg` didn't run.

## Files

| File | Role |
| --- | --- |
| `playwright.config.ts` | Runner config: `testDir e2e/`, HTTPS `webServer`, Chrome, `baseURL`. |
| `e2e/global-setup.ts` | `clerkSetup` + (dev-key) test-user provisioning. |
| `e2e/canvas.spec.ts` | Canvas + filter-popover capture; `activateOrg` helper. |
| `e2e/visual.spec.ts` | Authenticated-route captures. |
| `vite.config.ts` | `allowedHosts` + conditional HTTPS (`E2E_HTTPS`). |
| `package.json` | `prescreenshots` (cert) + `screenshots` scripts. |
| `e2e/certs/`, `e2e/screenshots/` | Local, git-ignored (cert + output). |
