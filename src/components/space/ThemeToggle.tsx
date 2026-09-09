"use client";

import { useSyncExternalStore } from "react";
import { playTone } from "@/lib/sound";

/**
 * Figma nodes 19:587 (sun-03) and its moon counterpart in frame 7:191.
 *
 * Both icons are drawn inline rather than loaded as files so their stroke can
 * follow `currentColor`. The exported strokes are #8D8D8D, which is exactly
 * --color-muted, so `text-muted` reproduces the design in light and lets the
 * icon lift with the palette in dark. Geometry, stroke widths and the 15px box
 * are the design's own:
 *
 *   sun   13.7   × 13.7   at (0.65, 0.65),   stroke-width 1.2
 *   moon  13.075 × 13.075 at (0.9625, …),    stroke-width 1.2
 */
const STORAGE_KEY = "space:theme";

type Theme = "light" | "dark";

function commit(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — the choice still holds for this page view */
  }
}

/**
 * Swaps the theme behind a short cross-fade of the colours themselves — no
 * wipe, no reveal. The class is only present while the fade runs, because as a
 * standing rule it would outrank the Tailwind transition utilities on every
 * hover state and quietly replace them.
 */
function swap(theme: Theme) {
  const root = document.documentElement;

  root.classList.add("theme-switching");
  commit(theme);
  window.setTimeout(() => root.classList.remove("theme-switching"), 340);
}

/*
  The <html> attribute is the source of truth — the inline head script sets it
  before paint, so reading it through an external store keeps the button in step
  without a state copy that could disagree with the DOM. The server snapshot is
  "light", which is what the markup renders.
*/
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);

  const toggle = () => {
    playTone("nav");
    swap(theme === "dark" ? "light" : "dark");
  };

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      title={dark ? "Light theme" : "Dark theme"}
      className="relative block size-[15px] shrink-0 text-muted transition-transform duration-300 ease-[var(--ease-smooth)] hover:scale-110 active:scale-95"
    >
      {dark ? (
        <svg
          viewBox="0 0 13.7 13.7"
          fill="none"
          aria-hidden
          className="absolute left-[0.65px] top-[0.65px] block h-[13.7px] w-[13.7px] max-w-none"
        >
          <path
            d="M9.975 6.85C9.975 8.57589 8.57589 9.975 6.85 9.975C5.12411 9.975 3.725 8.57589 3.725 6.85C3.725 5.12411 5.12411 3.725 6.85 3.725C8.57589 3.725 9.975 5.12411 9.975 6.85Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M6.85 0.6V1.5375M6.85 12.1625V13.1M11.2693 11.2696L10.6063 10.6066M3.09329 3.09329L2.43037 2.43037M13.1 6.85H12.1625M1.5375 6.85H0.6M11.2696 2.43044L10.6066 3.09336M3.09359 10.6067L2.43068 11.2696"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 13.075 13.075"
          fill="none"
          aria-hidden
          className="absolute left-[0.9625px] top-[0.9625px] block h-[13.075px] w-[13.075px] max-w-none"
        >
          <path
            d="M12.475 7.8365C11.7252 8.23687 10.8688 8.46382 9.95947 8.46382C7.0057 8.46382 4.6112 6.06932 4.6112 3.11556C4.6112 2.20619 4.83816 1.34982 5.23852 0.600024C2.57978 1.22314 0.6 3.60948 0.6 6.45822C0.6 9.78121 3.29381 12.475 6.6168 12.475C9.46555 12.475 11.8519 10.4952 12.475 7.8365Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
