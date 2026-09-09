"use client";

import { useEffect, useRef, useState } from "react";
import { CURSOR_TOAST, cursorToast, playTone } from "@/lib/sound";

/**
 * Replaces the system pointer with the arrow from the design, fires a spark
 * wherever the visitor clicks, and carries the "copied" confirmation.
 *
 * Only runs on fine pointers — touch devices are left alone entirely, and the
 * `has-custom-cursor` class is applied from here rather than in CSS so the
 * native cursor is never hidden unless this component is actually alive to draw
 * a replacement.
 *
 * The dot chases the real pointer with a light lerp, which is what makes it
 * feel weighted rather than glued to the mouse.
 *
 * The fraction of the remaining distance closed each frame. At 1 the arrow is
 * welded to the pointer and the weight is gone entirely; 0.8 leaves just
 * enough lag to see — two frames, about 30ms — so the arrow still trails
 * rather than snapping.
 */
const EASE = 0.8;
const TICKS = 8;
const EMAIL = "incognitoshimul@gmail.com";
const TOAST_MS = 1800;

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    return true;
  } catch {
    // Older browsers, or a context where the async API is unavailable.
    try {
      const field = document.createElement("textarea");
      field.value = EMAIL;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      const ok = document.execCommand("copy");
      field.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLSpanElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const toastEl = toastRef.current;
    if (!dot || !toastEl) return;

    const fine = window.matchMedia("(pointer: fine)").matches;

    const root = document.documentElement;

    /*
      The arrow is the only part that needs a real pointer. Sparks and the
      toast are just as useful under a finger, so they run everywhere and only
      the drawn cursor — and hiding the native one — is gated on `fine`.
    */
    if (fine) root.classList.add("has-custom-cursor");
    dot.dataset.fine = String(fine);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let started = false;
    let frame = 0;
    let toastTimer = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
      Above the breakpoint the toast trails the pointer, so its position is set
      here every frame. Below it the stylesheet parks the pill above the nav —
      which an inline transform would override, so this stops writing one and
      clears whatever it last wrote.
    */
    const rides = window.matchMedia("(min-width: 640px)");
    const onRidesChange = () => {
      if (!rides.matches) toastEl.style.transform = "";
    };
    rides.addEventListener("change", onRidesChange);
    onRidesChange();

    const spark = (px: number, py: number) => {
      if (reduced) return;

      const burst = document.createElement("span");
      burst.className = "spark";
      burst.style.left = `${px}px`;
      burst.style.top = `${py}px`;
      burst.append(document.createElement("b"));

      for (let i = 0; i < TICKS; i += 1) {
        const tick = document.createElement("i");
        tick.style.setProperty("--a", `${(360 / TICKS) * i}deg`);
        burst.append(tick);
      }

      document.body.append(burst);
      window.setTimeout(() => burst.remove(), 500);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!started) {
        started = true;
        x = targetX;
        y = targetY;
      }
      dot.dataset.active = "true";

      const hot = Boolean(
        (event.target as HTMLElement | null)?.closest("a, button, [role='button']"),
      );
      dot.dataset.hot = String(hot);
    };

    const onLeave = () => {
      dot.dataset.active = "false";
    };
    const onEnter = () => {
      if (started) dot.dataset.active = "true";
    };

    const loop = () => {
      x += (targetX - x) * (reduced ? 1 : EASE);
      y += (targetY - y) * (reduced ? 1 : EASE);
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (rides.matches) toastEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onDown = (event: PointerEvent) => {
      /*
        A tap has no preceding move, so place the dot on the touch point
        immediately — without this the toast would fly in from wherever the
        pointer last was, or from the middle of the screen on first contact.
      */
      targetX = event.clientX;
      targetY = event.clientY;
      if (!started || event.pointerType !== "mouse") {
        started = true;
        x = targetX;
        y = targetY;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (fine) dot.dataset.active = "true";

      spark(event.clientX, event.clientY);
    };

    /* "C" copies the email address. Bare key only — Cmd/Ctrl+C has to keep
       copying the selection, and typing in a field is never a shortcut. */
    const onKeyDown = async (event: KeyboardEvent) => {
      if (event.key !== "c" && event.key !== "C") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (window.getSelection()?.toString()) return;

      if (!(await copyEmail())) return;

      playTone("nav");
      spark(targetX, targetY);
      cursorToast("Email copied to clipboard");
    };

    const onToast = (event: Event) => {
      setToast((event as CustomEvent<string>).detail);
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => setToast(null), TOAST_MS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(CURSOR_TOAST, onToast);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(toastTimer);
      rides.removeEventListener("change", onRidesChange);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(CURSOR_TOAST, onToast);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden>
        {/*
          The supplied artwork, drawn at 20×22 — it carries its own white outline
          and drop shadow, so nothing is re-drawn here.

          The hotspot is the arrow's point, where its two long edges intersect:
          (2.885, 0.853) in the file's native 29×31, which scales to (1.99,
          0.605) at this size. The image is offset by exactly that, so the tip
          sits on the true pointer position.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pointer.svg"
          alt=""
          width={20}
          height={22}
          draggable={false}
          /* No display here: an inline value would outrank the rule that hides
             the arrow on touch. Preflight already makes images block. */
          style={{ marginLeft: -1.99, marginTop: -0.605 }}
        />
      </div>

      {/* Rides at the pointer's head on a desktop; parked above the nav on a
          phone. Outside the arrow because it has to be able to pin itself to
          the viewport, which a transformed ancestor would prevent. */}
      <span ref={toastRef} className="cursor-toast" data-visible={toast !== null} aria-hidden>
        <span className="cursor-toast-pill">{toast}</span>
      </span>
    </>
  );
}
