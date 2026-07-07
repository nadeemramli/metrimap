import { cn } from '@/shared/utils';

type LogoProps = {
  /** Extra classes controlling size/spacing. The mark is square (e.g. `h-8 w-8`). */
  className?: string;
  /** Accessible label; falls back to the product name. */
  alt?: string;
};

/**
 * Canvasm brand mark — the connected-node "map" glyph, mirrored from the
 * marketing site (canvasm.app) and docs (docs.canvasm.app). Inline SVG using
 * `currentColor`, so it's crisp, ~1KB, and theme-aware (follows the in-app
 * `dark`/`night` foreground) with no image asset to load.
 */
export function Logo({ className, alt = 'Metrimap' }: LogoProps) {
  return (
    <span className={cn('inline-block overflow-hidden text-foreground', className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label={alt}
        className="block h-full w-full"
      >
        <path d="M6 6.5 L12 12 L18 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        <path d="M12 12 L12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        <circle cx="6" cy="6.5" r="2.4" fill="currentColor" opacity="0.85" />
        <circle cx="18" cy="7.5" r="2.4" fill="currentColor" opacity="0.85" />
        <circle cx="12" cy="12" r="2.8" fill="currentColor" />
        <circle cx="12" cy="18.5" r="2.4" fill="currentColor" opacity="0.85" />
      </svg>
    </span>
  );
}
