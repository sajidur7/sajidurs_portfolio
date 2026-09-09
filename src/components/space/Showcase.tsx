"use client";

/* eslint-disable @next/next/no-img-element */
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
];

const SWIPE_THRESHOLD = 50;
const EXIT_MS = 420;
/** Long enough to actually look at a piece, short enough that it keeps moving. */
const AUTOPLAY_MS = 3500;

export function Showcase() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);

  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const slideRefs = useRef<Array<HTMLImageElement | null>>([]);
  const fromRect = useRef<DOMRect | null>(null);
  const bigRef = useRef<HTMLImageElement>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  const open = (position: number) => {
    const source = slideRefs.current[position];
    fromRect.current = source ? source.getBoundingClientRect() : null;
    setClosing(false);
    setExpanded(position);
  };

  const close = useCallback(() => {
    const el = bigRef.current;
    const from = fromRect.current;

    // Run the opening transform in reverse, then unmount once it lands.
    if (el && from) {
      const to = el.getBoundingClientRect();
      el.style.transition = `transform ${EXIT_MS}ms var(--ease-smooth)`;
      el.style.transform = `translate(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${
        from.top + from.height / 2 - (to.top + to.height / 2)
      }px) scale(${from.width / to.width})`;
    }

    setClosing(true);
    window.setTimeout(() => {
      setExpanded(null);
      setClosing(false);
    }, EXIT_MS);
  }, []);

  /* FLIP: start the big image exactly where the card thumbnail is, then let it
     travel to its natural place. Both share an aspect ratio, so one uniform
     scale is enough and nothing squashes on the way. */
  useLayoutEffect(() => {
    if (expanded === null || closing) return;
    const el = bigRef.current;
    const from = fromRect.current;
    if (!el || !from) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const to = el.getBoundingClientRect();
    el.style.transition = "none";
    el.style.transform = `translate(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${
      from.top + from.height / 2 - (to.top + to.height / 2)
    }px) scale(${from.width / to.width})`;

    void el.getBoundingClientRect();

    el.style.transition = "transform 520ms var(--ease-smooth)";
    el.style.transform = "none";
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
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      if (event.key === "Escape" && expanded !== null) {
        close();
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      const step = event.key === "ArrowRight" ? 1 : -1;
      if (expanded !== null) {
        setExpanded((current) => ((current ?? 0) + step + SLIDES.length) % SLIDES.length);
        fromRect.current = null;
      } else {
        setIndex((current) => (current + step + SLIDES.length) % SLIDES.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, close]);

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
        className="mt-[40px] aspect-[670/540] w-full overflow-hidden rounded-[20px] bg-white"
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
              className="h-full w-full shrink-0 bg-white"
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
            Backdrop per screen 3: the page behind is softened, not dimmed.
            Measured off the design's own render — a ~3.7px blur on the card's
            straight edge, and a tint that only reaches ~9% black at the foot of
            the screen rather than a heavy modal scrim.
          */
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-gradient-to-b from-[rgba(35,35,35,0)] to-[rgba(35,35,35,0.09)] p-[20px] opacity-0 backdrop-blur-[4px] transition-opacity duration-[420ms] ease-[var(--ease-smooth)] data-[open=true]:opacity-100 sm:p-[40px]"
        >
          <img
            ref={bigRef}
            src={SLIDES[expanded].src}
            alt={SLIDES[expanded].label}
            draggable={false}
            onClick={(event) => event.stopPropagation()}
            /* Capped below the viewport so the work sits in some breathing
               room rather than filling the screen edge to edge. */
            className="block max-h-[78vh] max-w-[92vw] cursor-default select-none rounded-[20px] object-contain shadow-[0_40px_90px_-20px_rgba(0,0,0,0.45)] sm:max-w-[80vw]"
          />
        </div>
      )}
    </section>
  );
}
