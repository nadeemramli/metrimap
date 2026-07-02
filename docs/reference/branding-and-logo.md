# Branding & logo

Where the Metrimap logo (light + dark) lives and how it's wired into the app.

> **Status: wired.** The two logos are in `public/brand/`, rendered through
> `src/shared/components/layout/Logo.tsx`, shown in the home header, and used as
> the favicon. This doc explains how it fits together and how to extend it.

## Where the files live

Raw image files go in **`public/brand/`**. Anything in `public/` is copied
to the site root at build time, so `public/brand/logo-light.svg` is served at
`/brand/logo-light.svg`.

| File                          | Purpose                          |
| ----------------------------- | -------------------------------- |
| `public/brand/logo-light.svg` | full logo, light theme + light-chrome favicon |
| `public/brand/logo-dark.svg`  | full logo, dark / night themes + dark-chrome favicon |

Both are square (2048×2048) SVG badges with their own background fill. A
`viewBox` was added so they scale cleanly when sized with CSS. To add an
icon-only mark or a horizontal wordmark later, follow the same `-light` /
`-dark` naming and extend `Logo.tsx`.

> Why `public/` and not `src/assets/`? `public/` files keep a stable, predictable
> URL and don't go through the bundler — ideal for the favicon and for a logo you
> reference by path. If you'd rather have the bundler hash/optimize them, you can
> instead `import` files from `src/assets/`, but the theme-swap wiring below is
> written for the `public/brand/` path.

## How theming works here (so the swap is correct)

Dark mode is **class-based**. `App.tsx` configures `next-themes` with
`attribute="class"` and themes `['light', 'dark', 'night', 'system']`, so the
`<html>` element gets a class of `dark` or `night` (light adds none). The app's
colors come from CSS-variable overrides under `.dark` / `.night` in
`src/styles/index.css` — **not** from Tailwind's `dark:` utility variant.

> ⚠️ **Gotcha — do not use Tailwind's `dark:` variant for the logo swap.**
> `tailwind.config.ts` sets `darkMode: "class"`, but that JS config is **not
> loaded** into Tailwind v4 (there's no `@config` directive in the CSS). So
> `dark:` falls back to v4's default, `@media (prefers-color-scheme: dark)` — the
> **OS** scheme, which ignores the in-app theme toggle. A `dark:`-based swap
> shows the dark logo whenever the *operating system* is dark, even in the app's
> light theme. Match the real toggle classes explicitly instead.

## The `<Logo/>` component

`src/shared/components/layout/Logo.tsx` renders both logos and lets CSS pick the
visible one, keying off the `.dark` / `.night` classes directly:

```tsx
<span className={className}>
  <img src="/brand/logo-light.svg" alt="Metrimap"
       className="block h-full w-full object-contain [.dark_&]:hidden [.night_&]:hidden" />
  <img src="/brand/logo-dark.svg" alt="Metrimap" aria-hidden
       className="hidden h-full w-full object-contain [.dark_&]:block [.night_&]:block" />
</span>
```

`[.dark_&]:` / `[.night_&]:` are Tailwind arbitrary variants meaning "an ancestor
has class `dark`/`night`" — they follow the in-app toggle regardless of OS scheme
or whether the JS Tailwind config is loaded. Both `<img>`s stay mounted, so
there's no flash on theme change and no dependency on a client-side theme hook.

**Usage** — size it with height/width classes (the logos are square):

```tsx
import { Logo } from '@/shared/components/layout/Logo';

<Logo className="h-8 w-8 rounded-md overflow-hidden" />
```

It's currently used icon-only in the home header (`HomePage.tsx`). Reuse the same
component in the canvas header, sidebar, or auth screens.

## Favicon

`index.html` uses a `prefers-color-scheme` media favicon so the tab icon matches
the user's OS/browser chrome (the favicon can't follow the in-app theme toggle,
only the OS scheme):

```html
<link rel="icon" type="image/svg+xml" href="/brand/logo-light.svg" media="(prefers-color-scheme: light)" />
<link rel="icon" type="image/svg+xml" href="/brand/logo-dark.svg" media="(prefers-color-scheme: dark)" />
<link rel="icon" type="image/svg+xml" href="/brand/logo-light.svg" />
```

## Extending

- **Icon-only mark or horizontal wordmark:** add `logo-mark-{light,dark}.svg`
  (or `wordmark-…`) to `public/brand/`, add a `variant` prop to `Logo.tsx` that
  switches the `src` pair.
- **Show the logo somewhere new:** import `Logo` and size it; no other wiring.
