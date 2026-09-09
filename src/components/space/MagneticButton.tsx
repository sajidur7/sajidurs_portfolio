"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";
import { useBooking } from "./BookingProvider";

/**
 * The page's primary buttons, with a motion of their own.
 *
 * Everything else on the page fades and lifts; these do two things nothing else
 * does — they lean toward the cursor, and an ink circle floods the pill outward
 * from wherever the pointer entered.
 *
 * Both effects were picked because neither disturbs the label: the pull is a
 * transform on the pill, and the flood is an absolutely-positioned circle
 * underneath the text. The type never reflows, so the button stays on its exact
 * Figma metrics while it moves.
 *
 * The pull is deliberately small — the colour flood is the effect doing the
 * work, and the lean is only there to acknowledge the cursor. Raising this much
 * above 2 starts to read as bounce rather than weight.
 *
 * Pass `booking` instead of `href` to open the scheduling panel; the element
 * becomes a real <button> in that case rather than a link to nowhere.
 */
const PULL = 2;

type Variant = "solid" | "outline";

const VARIANTS: Record<Variant, { shell: string; label: string; ink: string }> = {
  /*
    Accent floods the pill. The label has to switch to the on-accent colour on
    hover: in light it already matches, but in dark the resting label is near
    black and would be unreadable once the red arrives.
  */
  solid: {
    shell: "bg-ink",
    label: "text-canvas group-hover:text-on-accent",
    ink: "var(--color-accent)",
  },
  /*
    Ink floods the light pill, so the label has to invert with it.

    The stroke is a ring rather than a border: a border is drawn inside the
    box, so at 40px tall it left this pill a 38px fill against Let's Talk's
    full 40px. The stroke is near-invisible against the canvas, so the eye
    reads the fill and the two buttons looked different heights. A ring sits
    outside and takes no layout space, so both fills are 40px and the row
    height is unchanged.
  */
  outline: {
    shell: "bg-surface ring-1 ring-edge",
    label: "text-ink group-hover:text-canvas",
    ink: "var(--color-ink)",
  },

};

export function MagneticButton({
  href,
  booking = false,
  external = false,
  label,
  icon,
  gap = 8,
  variant = "solid",
}: {
  href?: string;
  booking?: boolean;
  external?: boolean;
  label: ReactNode;
  icon?: ReactNode;
  /** Icon-to-label gap; the frame uses 8 on Let's Talk and 6 on Message Me. */
  gap?: number;
  variant?: Variant;
}) {
  const ref = useRef<HTMLElement>(null);
  const styles = VARIANTS[variant];
  const openBooking = useBooking();

  const track = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // The flood always starts where the pointer actually is.
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.setProperty("--tx", `${((x - rect.width / 2) / (rect.width / 2)) * PULL}px`);
    el.style.setProperty("--ty", `${((y - rect.height / 2) / (rect.height / 2)) * (PULL * 0.4)}px`);
  };

  const release = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  };

  const shared = {
    onPointerMove: track,
    onPointerLeave: release,
    onBlur: release,
    style: { transform: "translate(var(--tx, 0px), var(--ty, 0px))", gap: `${gap}px` },
    className: `group relative isolate flex h-[40px] shrink-0 items-center justify-center overflow-hidden rounded-full px-[15px] py-[10px] transition-[transform,scale] duration-[450ms] ease-[var(--ease-smooth)] active:scale-[0.985] ${styles.shell}`,
  };

  const inner = (
    <>
      <span
        aria-hidden
        style={{ left: "var(--mx, 50%)", top: "var(--my, 50%)", backgroundColor: styles.ink }}
        className="pointer-events-none absolute z-0 size-[300px] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-[600ms] ease-[var(--ease-smooth)] group-hover:scale-100"
      />
      {icon ? <span className="relative z-10 flex shrink-0">{icon}</span> : null}
      <span
        className={`text-trim relative z-10 whitespace-nowrap font-body text-[15px] font-semibold leading-[22px] tracking-[0.15px] transition-colors duration-300 ${styles.label}`}
      >
        {label}
      </span>
    </>
  );

  if (booking) {
    return (
      <button
        {...shared}
        ref={ref as React.RefObject<HTMLButtonElement>}
        type="button"
        onClick={openBooking}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      {...shared}
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
