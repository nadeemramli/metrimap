type LogoProps = {
  /** Extra classes controlling size/spacing. Height-based sizing works best
   *  since the logos are square (e.g. `h-7 w-7`). */
  className?: string;
  /** Accessible label; falls back to the product name. */
  alt?: string;
};

/**
 * Theme-aware Metrimap logo.
 *
 * Renders the light logo by default and swaps to the dark logo whenever the
 * document carries the `dark` OR `night` theme class (see App.tsx: next-themes
 * with attribute="class", themes light/dark/night). Both <img>s stay mounted and
 * CSS decides which is visible, so there is no flash on theme change and no
 * dependency on a client-side theme hook (safe during SSR/first paint).
 */
export function Logo({ className, alt = 'Metrimap' }: LogoProps) {
  return (
    <span className={className}>
      <img
        src="/brand/logo-light.svg"
        alt={alt}
        className="block h-full w-full object-contain dark:hidden [.night_&]:hidden"
        draggable={false}
      />
      <img
        src="/brand/logo-dark.svg"
        alt={alt}
        aria-hidden
        className="hidden h-full w-full object-contain dark:block [.night_&]:block"
        draggable={false}
      />
    </span>
  );
}
