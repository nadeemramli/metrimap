# Brand assets

Drop the Metrimap logo files here. These are served as static files from the
site root — a file at `public/brand/logo-light.svg` is reachable at
`/brand/logo-light.svg` in the app.

See the **branding-and-logo** note in the Obsidian product vault (migrated out of
the repo) for the naming convention, expected files, and how to wire them into the UI.

## Files in use

| File             | When it shows                             |
| ---------------- | ----------------------------------------- |
| `logo-light.svg` | light theme + light browser chrome favicon |
| `logo-dark.svg`  | dark / night themes + dark chrome favicon  |

Both are square (2048×2048) badge logos with their own background fill, wired
through `src/shared/components/layout/Logo.tsx` and used in the app header and
as the favicon (`index.html`).

SVG is strongly preferred (crisp at every size). If you later add an icon-only
mark or a horizontal wordmark, follow the same `-light` / `-dark` naming and
update `Logo.tsx`.
