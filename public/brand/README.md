# Brand assets

Static files served from the site root — a file at `public/brand/icon.svg` is
reachable at `/brand/icon.svg` in the app.

See the **branding-and-logo** note in the Obsidian product vault (migrated out of
the repo) for the full brand system.

## Files in use

| File       | When it shows                                             |
| ---------- | --------------------------------------------------------- |
| `icon.svg` | favicon / browser-tab app icon (dark badge, `index.html`) |

`icon.svg` is the Canvasm badge — the connected-node "map" glyph on a dark
rounded square, mirrored from the marketing site (canvasm.app) and docs
(docs.canvasm.app).

The **in-app logo** is not an image asset: `src/shared/components/layout/Logo.tsx`
renders the same glyph as inline SVG using `currentColor`, so it's ~1KB, crisp at
every size, and theme-aware (follows the in-app `dark`/`night` foreground) with
nothing to load. If you add a new brand asset, prefer inline SVG for anything
rendered in-app and reserve this folder for static browser-chrome assets.
