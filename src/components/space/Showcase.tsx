"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { playTone } from "@/lib/sound";
import { Reveal } from "./Reveal";

/**
 * Figma nodes 7:220 (card) and 7:284 (pagination), screen 2.
 *
 * The controls sit below the card: bare chevrons at the column's two edges on
 * the same line as the dots. The dots are five equal 6px circles — no active
 * pill — with the current one in accent. Both chevrons are a matched accent
 * pair: the design has the left one at #232323, so icon-chevron-left.svg
 * carries a recoloured stroke with its exported geometry otherwise untouched.
 *
 * The artwork is 2680×2160 — the same 670:540 ratio as the card, so the card
 * can be a fluid `aspect-[670/540]` box at any width with no cropping, and the
 * image still scales into the lightbox without distorting.
 */
const SLIDES = [
  { id: "01", src: "/works/work-01.png", label: "Work 01" },
  { id: "02", src: "/works/work-02.png", label: "Work 02" },
  { id: "03", src: "/works/work-03.png", label: "Work 03" },
  { id: "04", src: "/works/work-04.png", label: "Work 04" },
  { id: "05", src: "/works/work-05.png", label: "Work 05" },
  { id: "06", src: "/works/work-06.png", label: "Work 06" },
  { id: "07", src: "/works/work-07.png", label: "Work 07" },
  { id: "08", src: "/works/work-08.png", label: "Work 08" },
];

const SWIPE_THRESHOLD = 50;
/*
  One duration for both directions of the expand. Closing used to run 100ms
  quicker than opening, which was enough to stop the two reading as the same
  gesture.
*/
/*
  recent.design's own figures, read off their page rather than guessed: opening
  an item there is a 500ms opacity fade on cubic-bezier(0.2, 0, 0, 1), and the
  media inside carries no transform at all. Their container fades; the picture
  is simply there.

  That is the whole animation here now. The backdrop's own fade already covers
  everything inside it — the work and its caption — so one property on one
  element does the work in both directions, and nothing large has to move.
*/
const FADE_MS = 500;

/* The caption bar's two repeated pieces. Both inherit the bar's colour, so the
   theme swap is one property on the container rather than eleven. */
/* Straight from icon-chevron-left/right.svg, geometry untouched. */
const CHEVRON_LEFT =
  "M5.69996 0.700046C5.69996 0.700046 0.700011 4.38249 0.7 5.70009C0.699989 7.01768 5.7 10.7 5.7 10.7";
const CHEVRON_RIGHT =
  "M0.700085 0.700046C0.700085 0.700046 5.70004 4.38249 5.70005 5.70009C5.70006 7.01768 0.700046 10.7 0.700046 10.7";

/* What the bar calls the set. One word for all of them — swap it for a
   per-slide field the day the works get their own names. */
const CAPTION_NAME = "Work";
const CAPTION_TEXT = "text-trim whitespace-nowrap font-body text-[13px] leading-[22px]";
const CAPTION_DOT = "block size-[2px] shrink-0 rounded-full bg-current";
/** Long enough to actually look at a piece, short enough that it keeps moving. */
const AUTOPLAY_MS = 3000;

export function Showcase() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);

  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  const open = (position: number) => {
    setClosing(false);
    setExpanded(position);
  };

  /*
    Move between works without leaving the expanded view. The carousel behind
    follows, so closing still returns the image to the card it came from — and
    so the position is not lost when the visitor taps out.
  */
  const step = useCallback(
    (delta: number) => {
      if (expanded === null) return;
      const next = (expanded + delta + SLIDES.length) % SLIDES.length;
      setExpanded(next);
      setIndex(next);
    },
    [expanded],
  );

  const close = useCallback(() => {
    /*
      Nothing to unwind. The backdrop carries the fade, so closing is the same
      property running back the other way, and this only has to wait for it
      before unmounting.
    */
    setClosing(true);
    window.setTimeout(() => {
      setExpanded(null);
      setClosing(false);
    }, FADE_MS);
  }, []);

  /*
    Advances on its own, and `index` is a dependency so any manual move — arrow,
    dot, swipe or key — restarts the countdown rather than cutting a slide short.
    It holds while the pointer is over the carousel, while the lightbox is open,
    and while the tab is in the background.
  */
  useEffect(() => {
    if (paused || expanded !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [paused, expanded, index]);

  /*
    Decode the slide in view ahead of time.

    The expanded image decodes synchronously so a work never opens on a blank
    frame — but a cold decode of one of these is 60ms on a desktop and several
    times that on a phone, and it lands inline, on the very frame the expand
    begins. Closing has no decode to do, which is why opening was the half that
    stuttered and closing was fine.

    Warming it here spends that time in the quiet after a slide settles, so by
    the time the work is tapped the synchronous decode finds it already done
    and costs nothing. Only the slide actually in view: these are 22MB of
    bitmap each once decoded, and holding several would trade a stutter for
    memory pressure on the phones this is meant to help.
  */
  useEffect(() => {
    const warm = new Image();
    warm.src = SLIDES[index].src;
    void warm.decode().catch(() => {
      /* a decode that loses its race, or an image that never loads — the
         expand still works, it just pays for the decode itself. */
    });
  }, [index]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const hold = {
    onPointerEnter: () => setPaused(true),
    onPointerLeave: () => setPaused(false),
  };

  // Hold the page still while the lightbox is up.
  useEffect(() => {
    if (expanded === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [expanded]);

  // Arrow keys drive the carousel from anywhere on the page — and the lightbox
  // when it is open — but never while someone is typing. Escape closes.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      /* Element check before closest(): a key event can be targeted at the
         document or the window, and calling closest() on either throws — which
         would take the Escape handling below down with it. */
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      /*
        The tones are asked for here because nothing else will supply them. A
        click on any of these controls gets one from the page-wide pointerdown
        listener; the keyboard has no pointer event behind it, so the same
        actions were silent. Same tones as the controls they stand in for —
        stepping is the lighter one, closing is a click, exactly as the arrows
        and the backdrop sound under a mouse.
      */
      if (event.key === "Escape" && expanded !== null) {
        playTone("click");
        close();
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      playTone("nav");

      const delta = event.key === "ArrowRight" ? 1 : -1;
      if (expanded !== null) {
        /*
          Through step(), like the caption's arrows and the phone's tap zones.
          This used to move `expanded` on its own and drop the captured rect,
          which left the carousel behind sitting on a different slide — so
          closing sent the work flying off to wherever that slide had been
          parked rather than back to the card in view.
        */
        step(delta);
      } else {
        setIndex((current) => (current + delta + SLIDES.length) % SLIDES.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, close, step]);

  return (
    <section id="work" className="scroll-mt-[30px]">
      <Reveal
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected work"
        {...hold}
        onPointerDown={(event: React.PointerEvent) => {
          dragStart.current = event.clientX;
          dragged.current = false;
        }}
        onPointerMove={(event: React.PointerEvent) => {
          if (dragStart.current === null) return;
          if (Math.abs(event.clientX - dragStart.current) > 6) dragged.current = true;
        }}
        onPointerUp={(event: React.PointerEvent) => {
          if (dragStart.current === null) return;
          const delta = event.clientX - dragStart.current;
          dragStart.current = null;
          if (Math.abs(delta) < SWIPE_THRESHOLD) return;
          go(index + (delta < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        className="mt-[40px] aspect-[670/540] w-full overflow-hidden rounded-[20px] bg-card"
      >
        <ul
          className="flex h-full w-full transition-transform duration-[650ms] ease-[var(--ease-smooth)]"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {SLIDES.map((slide, position) => (
            <li
              key={slide.id}
              aria-roledescription="slide"
              aria-label={`${position + 1} of ${SLIDES.length}`}
              aria-hidden={position !== index}
              className="h-full w-full shrink-0 bg-card"
            >
              <button
                type="button"
                aria-label={`Expand ${slide.label}`}
                tabIndex={position === index ? 0 : -1}
                // A swipe ends in a click; only a still pointer should expand.
                onClick={() => {
                  if (dragged.current) return;
                  open(position);
                }}
                className="block size-full"
              >
                <img
                  src={slide.src}
                  alt={slide.label}
                  width={2680}
                  height={2160}
                  draggable={false}
                  /* All eager: the off-screen slides sit outside the card's
                     overflow, so `lazy` would hold them back until the moment
                     you navigate and flash an empty plate. */
                  loading="eager"
                  fetchPriority={position === 0 ? "high" : "low"}
                  className="block size-full select-none object-cover transition-transform duration-[600ms] ease-[var(--ease-smooth)] hover:scale-[1.02]"
                />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* The chevrons overhang the column by 6px so their glyphs land on the
          frame's x-positions rather than their hit areas doing. */}
      <div className="mt-[16px] flex items-center justify-between" {...hold}>
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="group -ml-[6px] flex size-[32px] items-center justify-center"
        >
          <img
            src="/figma/icon-chevron-left.svg"
            alt=""
            className="block h-[11.4px] w-[6.4px] max-w-none transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:-translate-x-[3px] group-active:scale-90"
          />
        </button>

        <div className="flex items-center gap-[6px]">
          {SLIDES.map((slide, position) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${position + 1}`}
              aria-current={position === index}
              onClick={() => go(position)}
              /* after: widens the hit target without changing the 54px row. */
              className={`relative size-[6px] shrink-0 rounded-full transition-[background-color,transform] duration-300 ease-[var(--ease-smooth)] after:absolute after:-inset-[8px] after:content-[''] ${
                position === index ? "bg-accent" : "bg-hairline hover:scale-125 hover:bg-rule"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="group -mr-[6px] flex size-[32px] items-center justify-center"
        >
          <img
            src="/figma/icon-chevron-right.svg"
            alt=""
            className="block h-[11.4px] w-[6.4px] max-w-none transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:translate-x-[3px] group-active:scale-90"
          />
        </button>
      </div>

      {expanded !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${SLIDES[expanded].label}, expanded`}
          onClick={close}
          data-open={!closing}
          /*
            A dark wash rather than a blur — the same backdrop the booking
            panel uses, and it does not follow the theme: an expanded work wants
            a dark ground to sit on either way.
          */
          className="work-veil fixed inset-0 z-[200] flex cursor-zoom-out flex-col items-center justify-center bg-[var(--scrim-modal)] p-[20px] sm:p-[40px]"
        >
          {/* Shrink-wraps the image so the phone's tap zones can sit on its
              edges rather than the screen's. */}
          <div onClick={(event) => event.stopPropagation()} className="relative cursor-default">
            <img
              src={SLIDES[expanded].src}
              alt={SLIDES[expanded].label}
              draggable={false}
              /*
                The carousel already holds this exact file, but a fresh element
                decodes it again — and asynchronously, which is the blank frame
                at the start of the expand. `sync` makes the browser finish the
                decode before it paints, so the work is there on the first
                frame instead of arriving partway through the motion.
              */
              decoding="sync"
              fetchPriority="high"
              /*
                Capped below the viewport so the work sits in some breathing
                room rather than filling the screen edge to edge.

                `max-w-full` rather than a viewport figure, so the cap is the
                backdrop's own padded box: the margin is then exactly the 20px
                inset, and it stays the same 20px whatever the screen. A vw cap
                overflowed that padding and left a different gap on every
                phone.
              */
              className="block max-h-[78vh] max-w-full select-none rounded-[20px] object-contain shadow-[0_40px_90px_-20px_rgba(0,0,0,0.45)] sm:max-w-[80vw]"
            />

            {/*
              Phone-only: the arrows and the keyboard are both out of reach
              once a work fills the screen, so the outer quarter of the image
              on each side steps through the set. A quarter is wide enough to
              hit with a thumb and still leaves half the work as dead space, so
              a tap meant for the picture does not move it.

              They stay out of the way of the backdrop: a tap outside still
              closes, and these stop short of the edge.
            */}
            <button
              type="button"
              aria-label="Previous work"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              className="absolute inset-y-0 left-0 w-1/4 sm:hidden"
            />
            <button
              type="button"
              aria-label="Next work"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              className="absolute inset-y-0 right-0 w-1/4 sm:hidden"
            />
          </div>

          {/*
            Figma nodes 38:715 / 38:773 for the desktop bar, 38:829 / 38:813
            for the phone one — which drops "esc to close" and the divider
            before it, since a phone has no escape key, and tightens the right
            padding to 4 because the arrows end the row there.

            A sibling of the image rather than a child, so it sits under the
            work rather than on top of it.
          */}
          <div
            onClick={(event) => event.stopPropagation()}
            className="mt-[16px] flex shrink-0 cursor-default items-center justify-center gap-[6px] rounded-full py-[4px] pl-[8px] pr-[4px] sm:pr-[8px]"
            style={{ background: "var(--caption-ground)", color: "var(--caption-ink)" }}
          >
            <p className={CAPTION_TEXT}>{CAPTION_NAME}</p>
            <span className={CAPTION_DOT} />
            <p className={CAPTION_TEXT}>
              {expanded + 1} of {SLIDES.length}
            </p>

            <span className="flex items-center gap-[4px]">
              <span className={CAPTION_DOT} />
              <span className="flex items-center gap-[2px]">
                {([
                  ["Previous work", -1, CHEVRON_LEFT],
                  ["Next work", 1, CHEVRON_RIGHT],
                ] as const).map(([label, delta, path]) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => step(delta)}
                    className="group flex size-[14px] shrink-0 items-center justify-center"
                  >
                    {/*
                      Drawn here rather than masked from the file, and the
                      viewBox is padded, because the export has none: its 1.4
                      round-capped stroke touches all four edges exactly. At
                      natural size in an <img> that is fine, but rasterised
                      into a 4.48px mask box the boundary is where the tips
                      lost half a pixel — visible on a phone, where the device
                      ratio makes that half-pixel a real one.

                      Same drawn size as before: the 0.7 scale puts the glyph
                      at the frame's 3.5 x 7 with a 0.98 stroke, now with room
                      around it. currentColor keeps it on the bar's own ink
                      rather than the accent the file is stroked in.
                    */}
                    <svg
                      viewBox="-0.7 -0.7 7.80005 12.8001"
                      width={5.46}
                      height={8.96}
                      fill="none"
                      aria-hidden
                      className="block overflow-visible transition-transform duration-300 ease-[var(--ease-smooth)] group-active:scale-90"
                    >
                      <path
                        d={path}
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}
              </span>
              <span className={`${CAPTION_DOT} hidden sm:block`} />
            </span>

            <p className={`${CAPTION_TEXT} hidden sm:block`}>Esc to close</p>
          </div>
        </div>
      )}
    </section>
  );
}
