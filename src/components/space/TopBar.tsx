import { Clock } from "./Clock";
import { Reveal } from "./Reveal";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Figma nodes 19:586 (the location mark) and 19:588 / 19:587.
 *
 * The clock glyph that used to lead the time is gone; the readout now runs
 * right-aligned and the theme toggle sits after it, 6px clear — in the frame
 * the text ends at x1034 and the 15px icon starts at x1040, with the group
 * finishing on the column's right edge.
 */
export function TopBar() {
  return (
    <Reveal className="flex items-center justify-between pt-[30px]">
      <p className="text-trim whitespace-nowrap font-body text-[14px] leading-normal text-muted">
        DHAKA, BD
      </p>

      <span className="flex items-center gap-[6px]">
        <Clock />
        <ThemeToggle />
      </span>
    </Reveal>
  );
}
