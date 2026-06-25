# ADR-008: Storybook for Component Development & Testing

- **Status:** Accepted
- **Date:** 2025
- **Deciders:** Core team

## Context

The shared UI library (Radix-based primitives under `src/shared/components/ui/`) is growing. We want to develop components in isolation, document their variants, and run visual/accessibility/interaction tests without spinning up the full app (which requires Clerk auth, Supabase, etc.).

## Decision

Adopt **Storybook 9** (React + Vite builder):

- Config in `src/.storybook/main.ts`; stories matched by `**/*.stories.@(ts|tsx|mdx)`.
- Addons: `addon-essentials` (controls/actions/docs), `addon-a11y` (accessibility), `addon-vitest` (run stories as Vitest tests).
- **Vitest + Playwright** integration runs story-based tests in a headless browser (`vite.config.ts`).
- External dependencies are **mocked** so components render standalone: Clerk (`mocks/clerk-react-router.tsx`), Userback widget, and Supabase env vars.
- Scripts: `npm run storybook` (dev, port 6006), `npm run build-storybook`.

## Alternatives Considered

- **Ladle** — Lighter Vite-native alternative; Storybook chosen for its addon ecosystem (a11y, vitest) and broader familiarity.
- **No isolated environment (test in-app only)** — Rejected: app requires auth/DB, making component iteration and a11y testing slow.

## Consequences

- Components can be built and reviewed in isolation, with a11y checks and interaction tests in CI.
- Cost: maintaining `.storybook` config and the mocks for Clerk/Userback/Supabase as those integrations evolve.

## References

- `src/.storybook/main.ts`, `src/.storybook/mocks/`
- `src/stories/` (e.g. `UiCatalog.stories.tsx`, `Button.stories.tsx`)
- `vite.config.ts` (Storybook + Vitest integration)
