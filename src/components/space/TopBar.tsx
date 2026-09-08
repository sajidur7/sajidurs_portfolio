/* eslint-disable @next/next/no-img-element */
import { Clock } from "./Clock";
import { Reveal } from "./Reveal";

/**
 * Figma nodes 7:295 / 7:296 — the "EST . 2026" mark and the clock readout,
 * pinned to the two ends of the column.
 */
export function TopBar() {
  return (
    <Reveal className="flex items-center justify-between pt-[30px]">
      <p className="text-trim whitespace-pre font-body text-[14px] leading-normal text-muted">
        {"EST .  2026"}
      </p>

      <span className="flex items-center gap-[4px]">
        <span className="relative size-[15px] shrink-0 overflow-hidden">
          <img
            src="/figma/icon-clock.svg"
            alt=""
            className="absolute left-[0.65px] top-[0.65px] block h-[13.7px] w-[13.7px] max-w-none"
          />
        </span>
        <Clock />
      </span>
    </Reveal>
  );
}
