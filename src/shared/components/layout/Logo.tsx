type LogoProps = {
  /** Extra classes controlling size/spacing. Height/width sizing works best
   *  since the logos are square (e.g. `h-8 w-8`). */
  className?: string;
  /** Accessible label; falls back to the product name. */
  alt?: string;
};

/**
 * Theme-aware Metrimap logo.
 *
 * Renders the light logo by default and swaps to the dark logo whenever the
 * document carries the `dark` OR `night` theme class (see App.tsx: next-themes
 * with attribute="class"). We match those classes explicitly via arbitrary
 * variants rather than Tailwind's `dark:` variant — this project doesn't load
 * tailwind.config.ts's `darkMode: "class"` into Tailwind v4, so `dark:` falls
 * back to `prefers-color-scheme` (the OS scheme) and would ignore the in-app
 * theme toggle. Both <img>s stay mounted; CSS picks the visible one, so there's
 * no flash on theme change and no client-side theme hook needed.
 */
export function Logo({ className, alt = 'Metrimap' }: LogoProps) {
  return (
    <span className={className}>
      <img
        src="/brand/logo-light.svg"
        alt={alt}
        className="block h-full w-full object-contain [.dark_&]:hidden [.night_&]:hidden"
        draggable={false}
      />
      <img
        src="/brand/logo-dark.svg"
        alt={alt}
        aria-hidden
        className="hidden h-full w-full object-contain [.dark_&]:block [.night_&]:block"
        draggable={false}
      />
    </span>
  );
}
