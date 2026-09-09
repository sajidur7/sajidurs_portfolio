"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
];

const SWIPE_THRESHOLD = 50;
/*
  One duration for both directions of the expand. Closing used to run 100ms
  quicker than opening, which was enough to stop the two reading as the same
  gesture.
*/
const FLIP_MS = 560;

/* The caption bar's two repeated pieces. Both inherit the bar's colour, so the
   theme swap is one property on the container rather than eleven. */
/* What the bar calls the set. One word for all five, as the frame shows it —
   swap it for a per-slide field the day the works get their own names. */
const CAPTION_NAME = "Proto";
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
  const slideRefs = useRef<Array<HTMLImageElement | null>>([]);
  const fromRect = useRef<DOMRect | null>(null);
  const bigRef = useRef<HTMLDivElement>(null);
  /* Only an open travels from the thumbnail. Stepping between works while
     expanded changes the same element's contents, and replaying the FLIP there
     would fly the new image in from a card that is nowhere near the screen. */
  const flipping = useRef(false);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  const open = (position: number) => {
    const source = slideRefs.current[position];
    fromRect.current = source ? source.getBoundingClientRect() : null;
    flipping.current = true;
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
    const el = bigRef.current;

    /*
      Measure the thumbnail again instead of reusing the rect captured on the
      way in. The page can scroll while a work is open, and a stale rect sends
      the image home to where the card used to be.
    */
    const live = expanded === null ? null : slideRefs.current[expanded];
    const from = live?.getBoundingClientRect() ?? fromRect.current;

    /*
      The same journey as the open, in reverse, on the same duration and the
      same curve. A mirrored ease-in is the textbook answer here and it was
      wrong for this: it creeps off the mark before it accelerates, which
      reads as a slow close even at an identical duration. Repeating the
      ease-out is what actually makes the two feel like one gesture.
    */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (el && from && !still) {
      const to = el.getBoundingClientRect();
      el.style.willChange = "transform";
      el.style.transition = `transform ${FLIP_MS}ms var(--ease-flip)`;
      el.style.transform = `translate3d(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${
        from.top + from.height / 2 - (to.top + to.height / 2)
      }px, 0) scale(${from.width / to.width})`;
    }

    setClosing(true);
    window.setTimeout(
      () => {
        setExpanded(null);
        setClosing(false);
      },
      /*
        Opening skips the FLIP under reduced motion, so closing has to as well
        — otherwise the two halves of the same gesture disagree, and a phone
        with Reduce Motion on gets an instant open followed by a half-second
        close. Reduce Motion is on by default for far more people on a phone
        than on a desktop, which is where that mismatch shows up.
      */
      still ? 0 : FLIP_MS,
    );
  }, [expanded]);

  /* FLIP: start the big image exactly where the card thumbnail is, then let it
     travel to its natural place. Both share an aspect ratio, so one uniform
     scale is enough and nothing squashes on the way. */
  useLayoutEffect(() => {
    if (expanded === null || closing) return;
    if (!flipping.current) return;
    flipping.current = false;
    const el = bigRef.current;
    const from = fromRect.current;
    if (!el || !from) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const to = el.getBoundingClientRect();

    /*
      The works are 2680x2160 — roughly 23MB of bitmap once decoded. Animating
      a transform on something that size is only smooth if the browser
      rasterises it once and then moves the texture, so the element is promoted
      to its own layer for the duration: `will-change` up front, and a 3D
      transform so the promotion actually happens.

      The hint comes off once the motion is over. Left on, it pins that 23MB
      layer in memory for as long as the work stays open.
    */
    el.style.willChange = "transform";
    el.style.transition = "none";
    el.style.transform = `translate3d(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${
      from.top + from.height / 2 - (to.top + to.height / 2)
    }px, 0) scale(${from.width / to.width})`;

    void el.getBoundingClientRect();

    el.style.transition = `transform ${FLIP_MS}ms var(--ease-flip)`;
    el.style.transform = "translate3d(0, 0, 0)";

    const settle = window.setTimeout(() => {
      el.style.willChange = "";
    }, FLIP_MS + 60);

    return () => window.clearTimeout(settle);
  }, [expanded, closing]);

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

      if (event.key === "Escape" && expanded !== null) {
        close();
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

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
                  ref={(node) => {
                    slideRefs.current[position] = node;
                  }}
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
          className="fixed inset-0 z-[200] flex cursor-zoom-out flex-col items-center justify-center bg-[var(--scrim-modal)] p-[20px] opacity-0 transition-opacity duration-[560ms] ease-[var(--ease-flip)] data-[open=true]:opacity-100 sm:p-[40px]"
        >
          {/* The wrapper shrink-wraps the image and carries the FLIP, so the
              tap zones travel with it instead of sitting still while it
              moves. */}
          <div
            ref={bigRef}
            onClick={(event) => event.stopPropagation()}
            className="relative cursor-default"
          >
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

            A sibling of the image rather than a child: the wrapper carries the
            FLIP, and anything inside it would be scaled along with the work on
            the way in.
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
                  ["Previous work", -1, "/figma/icon-chevron-left.svg"],
                  ["Next work", 1, "/figma/icon-chevron-right.svg"],
                ] as const).map(([label, delta, glyph]) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => step(delta)}
                    className="group flex size-[14px] shrink-0 items-center justify-center"
                  >
                    {/*
                      Masked rather than drawn, so the chevron takes the bar's
                      own colour instead of the accent the file is stroked in.

                      4.48 x 7.98 because the exported artwork carries 0.7 of
                      padding for its own stroke: the glyph inside it lands at
                      the frame's 3.5 x 7, and the 1.4 stroke scales to the
                      0.98 the smaller icon draws.
                    */}
                    <span
                      className="nav-glyph transition-transform duration-300 ease-[var(--ease-smooth)] group-active:scale-90"
                      style={
                        {
                          width: 4.48,
                          height: 7.98,
                          "--glyph": `url(${glyph})`,
                        } as CSSProperties
                      }
                    />
                  </button>
                ))}
              </span>
              <span className={`${CAPTION_DOT} hidden sm:block`} />
            </span>

            <p className={`${CAPTION_TEXT} hidden sm:block`}>esc to close</p>
          </div>
        </div>
      )}
    </section>
  );
}
