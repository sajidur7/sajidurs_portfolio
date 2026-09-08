/**
 * The 6px accent dot used by "Open to Work" (1:47) and by every section
 * caption (1:53, 1:138, 1:156).
 *
 * The solid dot keeps the design's exact 6px footprint; the pulse is a second
 * ring stacked behind it and positioned absolutely, so it animates without
 * taking any layout space or nudging the text beside it. It is held back under
 * `prefers-reduced-motion`.
 */
export function StatusDot() {
  return (
    <span className="relative flex size-[6px] shrink-0 items-center justify-center">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-accent motion-safe:animate-blip"
      />
      <span className="relative size-[6px] rounded-full bg-accent" />
    </span>
  );
}
