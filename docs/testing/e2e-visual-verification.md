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

The harness uses the **production Clerk instance** (`pk_live`/`sk_live` from `.env`) — **not**
the dev instance — because **Supabase only trusts the production Clerk issuer**. A `pk_test`
dev JWT is rejected by Supabase's data routes with `PGRST301: No suitable key was found to
decode the JWT`, so authenticated canvases won't load real data. (`global-setup.ts` also has
an idempotent "create the e2e user" path that only fires for a `sk_test` key — a no-op under
`sk_live`.)

`https://dev.canvasm.app:3000` must be in the production Clerk instance's **allowed origins**.
Treat that as a **temporary** production-auth entry — add it only while running the lane and
**remove it when done** (see setup below).

> The owner's Obsidian vault note **"E2E Visual Verification"** is the authoritative
> operational runbook (real org name, temporary-origin procedure, security notes). Keep this
> repo doc in sync with it.

## One-time local setup

1. **Point `dev.canvasm.app` at your machine.** Add to your hosts file
   (`/etc/hosts`, or `C:\Windows\System32\drivers\etc\hosts`):

   ```
   127.0.0.1   dev.canvasm.app
   ```

2. **Temporarily allow the origin in production Clerk** (only while the lane runs). The
   secret comes from `$CLERK_SECRET_KEY` in `.env` — never paste the value:

   ```bash
   # add the local HTTPS origin
   curl -X PATCH https://api.clerk.com/v1/instance \
     -H "Authorization: Bearer $CLERK_SECRET_KEY" -H "Content-Type: application/json" \
     -d '{"allowed_origins":["https://dev.canvasm.app:3000"]}'
   ```

   **Remove it when the lane is done:**

   ```bash
   curl -X PATCH https://api.clerk.com/v1/instance \
     -H "Authorization: Bearer $CLERK_SECRET_KEY" -H "Content-Type: application/json" \
     -d '{"allowed_origins":[]}'
   ```

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
| `E2E_TEST_EMAIL` | Email of the pre-existing Clerk user the specs sign in as. Must belong to the real **Teroka Digital** org. |
| `E2E_TEST_PASSWORD` | That user's password (password sign-in strategy). |
| `E2E_CLERK_PUBLISHABLE_KEY` | Dev Clerk fallback key. Not useful for real data (Supabase rejects dev JWTs). |
| `E2E_CLERK_SECRET_KEY` | Dev Clerk fallback secret. |

The e2e user must **already exist** in the production Clerk instance and be a member of the
real **Teroka Digital** organization (the app is orgs-only; specs call `activateOrg` after
sign-in). Do **not** auto-create production users/orgs from an agent — ask the owner first.

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
- **`e2e/helpers.ts`** — shared, **non-test** module: `signIn(page)`, `activateOrg(page)`,
  `openFirstCanvas(page)`, `collectConsoleErrors(page)` (with a `react185()` filter), `shot()`,
  and `NO_CREDS`. Import shared code from here — Playwright forbids a spec importing another
  spec file.

### Automated-test specs (lane `e2e-visual-automation`)

These turn owner-run visual checks into assertions + screenshots (feature → CVS):

- **`e2e/filter-popover.spec.ts`** — CVS-272: compact anchored filter popover, sections, chip
  toggle (`aria-pressed` + active-count badge), Clear all, Apply-closes, mobile.
- **`e2e/comment-card.spec.ts`** — CVS-273: Figma-style empty thread, post a comment (codename,
  never a raw `user_` id), reload persistence.
- **`e2e/edge-pill.spec.ts`** — CVS-262: tone-aware edge score pill (`data-tone`), hover detail
  + single action toolbar. (Compositional/Exploratory render no pill by design.)
- **`e2e/node-toolbar.spec.ts`** — CVS-255: node-toolbar settings sheet, duplicate `(Copy)` +
  reload persistence, delete, no ErrorBoundary/#185. Handles both toolbar variants.
- **`e2e/evidence-editor.spec.ts`** — CVS-236: single editor (no re-init loop), typed text
  survives, save→reload persists, no ZodError(date).

Every spec starts with `signIn(page)` (= `setupClerkTestingToken` + password sign-in +
`activateOrg`) and `test.skip(NO_CREDS, ...)` when the Clerk creds are absent; canvas-
dependent specs also skip when no canvas/edges/nodes exist on the account.

## Adding a new capture / test

- **New authenticated route** → add `{ path, name }` to the `ROUTES` array in
  `visual.spec.ts`.
- **New flow** → new `e2e/<area>.spec.ts`; `import { signIn, openFirstCanvas } from
  './helpers'` and start with `await signIn(page)`, then drive the page.
- Prefer role/text/`title`/`aria-*` locators; add a minimal `data-testid` only where the UI
  has no stable selector (e.g. the edge pill's `data-tone`, node-toolbar action testids).

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
