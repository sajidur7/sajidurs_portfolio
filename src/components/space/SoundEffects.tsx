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

      /*
        The lighter tone is for stepping, not for everything that happens to
        live in the carousel. It used to go by whether the control sat inside
        one, which caught opening a work as well — but opening a work is
        committing to it, the same act as any other click on the page, and it
        should sound like one. Closing already did, since the backdrop is not a
        control at all, so the two halves disagreed.

        Every stepping control says so in its label: previous, next, go to.
      */
      const isStep = Boolean(
        control?.getAttribute("aria-label")?.match(/^(previous|next|go to)\b/i),
      );

      playTone(isStep ? "nav" : "click");
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
