"use client";

import { useEffect } from "react";
import { playTone, unlockAudio } from "@/lib/sound";

/**
 * Every click anywhere on the page gets a tick — not just the controls — so the
 * whole surface feels responsive rather than only the parts that happen to be
 * interactive.
 *
 * It listens on pointerdown, the same event the click spark fires on, so the
 * sound and the visual land together. Carousel controls get the lighter "nav"
 * tone to distinguish stepping through work from committing to a link.
 *
 * Primary button only: a right-click opening the context menu shouldn't chirp.
 */
export function SoundEffects() {
  useEffect(() => {
    // Opens the audio tap inside the first real gesture, which is the only
    // moment mobile Safari will accept it.
    const unlock = () => unlockAudio();
    document.addEventListener("pointerdown", unlock, { once: true });

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const control = (event.target as HTMLElement | null)?.closest(
        "a, button, [role='button']",
      );

      const isCarousel = Boolean(
        control?.closest("[aria-roledescription='carousel']") ||
          control?.getAttribute("aria-label")?.match(/slide/i),
      );

      playTone(isCarousel ? "nav" : "click");
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
