import { cn } from '@/shared/utils';

type LogoProps = {
  /** Extra classes controlling size/rounding/spacing. The badge is square
   *  (e.g. `h-7 w-7 rounded-md`). */
  className?: string;
  /** Accessible label; falls back to the product name. */
  alt?: string;
};

/**
 * The connected-node "map" glyph, sized to fill its square badge. Drawn with
 * `currentColor` so it takes whatever text color the badge sets. Geometry is
 * mirrored from the marketing/docs app icon (`public/brand/icon.svg`), and the
 * ~19% inset baked into the 32-unit viewBox gives the badge its padding.
 */
function MapGlyph() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className="block h-full w-full">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55">
        <path d="M9 10 L16 16 L23 11" />
        <path d="M16 16 L16 23" />
      </g>
      <g fill="currentColor">
        <circle cx="9" cy="10" r="3" />
        <circle cx="23" cy="11" r="3" />
        <circle cx="16" cy="16" r="3.4" />
        <circle cx="16" cy="23.5" r="3" />
      </g>
    </svg>
  );
}

/**
 * Canvasm brand mark — the connected-node "map" glyph on a rounded badge,
 * mirrored from the marketing site (canvasm.app) and docs (docs.canvasm.app).
 *
 * The badge paints `bg-foreground` with a `text-background` glyph, so it
 * inverts with the theme (dark badge / light glyph in light mode; the reverse
 * in `dark`/`night`) and always contrasts with the surface it sits on — which
 * keeps the `rounded-md` badge shape visible in every theme. Inline SVG, ~1KB,
 * no image asset to load.
 */
export function Logo({ className, alt = 'Metrimap' }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn(
        'inline-flex items-center justify-center overflow-hidden bg-foreground text-background',
        className,
      )}
    >
      <MapGlyph />
    </span>
  );
}

/**
 * Full lockup: the {@link Logo} badge followed by the "Canvasm" wordmark.
 * Use where a labelled brand is wanted (e.g. a login screen or top nav);
 * keep {@link Logo} for square, mark-only placements.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      <Logo className="h-6 w-6 rounded-md" alt="Canvasm" />
      <span className="text-[15px]">Canvasm</span>
    </span>
  );
}
