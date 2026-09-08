"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const WORK_ITEMS = [
  { id: "proto-01", title: "Proto. 01", image: "/assets/works/proto-01.png?v=17" },
  { id: "proto-02", title: "Proto. 02", image: "/assets/works/proto-02.png?v=17" },
  { id: "proto-03", title: "Proto. 03", image: "/assets/works/proto-03.png?v=17" },
  { id: "proto-04", title: "Proto. 04", image: "/assets/works/proto-04.png?v=17" },
  { id: "proto-05", title: "Proto. 05", image: "/assets/works/proto-05.png?v=17" },
];

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 9.5H3M8 4.5L3 9.5L8 14.5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9.5H16M11 4.5L16 9.5L11 14.5" />
    </svg>
  );
}

export function SelectedWorks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedProto, setSelectedProto] = useState<(typeof WORK_ITEMS)[0] | null>(null);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 5;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    setCanScrollLeft((prev) => (prev !== !atStart ? !atStart : prev));
    setCanScrollRight((prev) => (prev !== !atEnd ? !atEnd : prev));
  }, []);

  // Drag physics refs
  const isDown = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startScrollLeft = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const hasMoved = useRef(false);

  // Stop momentum animation
  const stopMomentum = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  // Momentum glide with cubic ease-out
  const startMomentum = useCallback(() => {
    stopMomentum();
    if (!scrollRef.current) return;

    // Projected glide distance based on release velocity
    const proj = velocity.current * 0.28;
    if (Math.abs(proj) < 2) return;

    const startScroll = scrollRef.current.scrollLeft;
    const startTime = performance.now();
    const duration = 800; // ms

    const glide = (currentTime: number) => {
      if (!scrollRef.current) return;
      const progress = Math.min(1, (currentTime - startTime) / duration);
      // Ease-out cubic: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      scrollRef.current.scrollLeft = startScroll + proj * ease;

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(glide);
      }
    };

    animationFrameId.current = requestAnimationFrame(glide);
  }, [stopMomentum]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    stopMomentum();
    isDown.current = true;
    hasMoved.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startScrollLeft.current = scrollRef.current.scrollLeft;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current || !scrollRef.current) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    // Only classify as a drag gesture if movement exceeds 8px
    if (Math.hypot(dx, dy) > 8) {
      if (!hasMoved.current) {
        hasMoved.current = true;
        setIsDragging(true);
      }
    }

    if (!hasMoved.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastTime.current);
    const deltaX = e.clientX - lastX.current;

    // Velocity in px/sec (inverted: dragging left = scroll increases)
    velocity.current = (-deltaX / dt) * 1000;

    lastX.current = e.clientX;
    lastTime.current = now;

    // Direct 1:1 tracking
    scrollRef.current.scrollLeft = startScrollLeft.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    isDown.current = false;
    setIsDragging(false);

    if (hasMoved.current) {
      startMomentum();
      // Keep hasMoved.current true briefly so any subsequent click event is suppressed
      setTimeout(() => {
        hasMoved.current = false;
      }, 80);
    } else {
      // Direct click/tap detection guarantee across all browsers/devices
      const target = e.target as HTMLElement;
      const cardEl = target.closest<HTMLElement>("[data-proto-id]");
      if (cardEl) {
        const id = cardEl.getAttribute("data-proto-id");
        const found = WORK_ITEMS.find((w) => w.id === id);
        if (found) {
          setSelectedProto(found);
        }
      }
    }
  };

  const handlePointerCancel = () => {
    if (!isDown.current) return;
    isDown.current = false;
    setIsDragging(false);
    if (hasMoved.current) {
      startMomentum();
      setTimeout(() => {
        hasMoved.current = false;
      }, 80);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    stopMomentum();
    scrollRef.current.scrollBy({ left: -601, behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    stopMomentum();
    scrollRef.current.scrollBy({ left: 601, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      window.removeEventListener("resize", updateScrollButtons);
      stopMomentum();
    };
  }, [updateScrollButtons, stopMomentum]);

  // Lock body scroll and handle Escape/Arrow keys when proto is expanded
  useEffect(() => {
    if (!selectedProto) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProto(null);
      } else if (e.key === "ArrowRight") {
        setSelectedProto((curr) => {
          if (!curr) return null;
          const idx = WORK_ITEMS.findIndex((w) => w.id === curr.id);
          return WORK_ITEMS[(idx + 1) % WORK_ITEMS.length];
        });
      } else if (e.key === "ArrowLeft") {
        setSelectedProto((curr) => {
          if (!curr) return null;
          const idx = WORK_ITEMS.findIndex((w) => w.id === curr.id);
          return WORK_ITEMS[(idx - 1 + WORK_ITEMS.length) % WORK_ITEMS.length];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProto]);

  return (
    <section id="works" className="mt-[100px]">
      {/* Section Header (Frame 7: y=456, h=12, gap=8) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Image
            src="/assets/section-glyph.svg"
            alt=""
            width={12}
            height={12}
            className="shrink-0 -translate-y-[2px]"
            aria-hidden="true"
          />
          <h2 className="font-display text-[16px] leading-[19px] text-primary font-normal">
            Selected Works
          </h2>
        </div>

        {/* Carousel Navigation Arrows: 19x19px, 5px gap */}
        <div className="flex items-center gap-[5px]">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            aria-label="Previous work"
            className={`w-[19px] h-[19px] p-0 flex items-center justify-center transition-colors duration-200 ${
              canScrollLeft
                ? "text-primary cursor-pointer hover:opacity-75"
                : "text-muted cursor-default"
            }`}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollRight}
            aria-label="Next work"
            className={`w-[19px] h-[19px] p-0 flex items-center justify-center transition-colors duration-200 ${
              canScrollRight
                ? "text-primary cursor-pointer hover:opacity-75"
                : "text-muted cursor-default"
            }`}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* Divider Line */}
      <div className="mt-[20px] h-[1px] w-full bg-[#8D8D8D]/15" />

      {/* Gallery Track Container: Full screen bleed across viewport */}
      <div
        className="relative mt-[14px]"
        style={{
          width: "100vw",
          marginInline: "calc(50% - 50vw)",
        }}
      >
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClickCapture={handleClickCapture}
          className={`w-full overflow-x-auto select-none no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x [overscroll-behavior-x:contain] flex items-start gap-[16px] pt-[8px] pb-[8px] ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "max(var(--content-x), calc((100vw - var(--site-w)) / 2 + var(--content-x)))",
            paddingRight: "max(var(--content-x), calc((100vw - var(--site-w)) / 2 + var(--content-x)))",
          }}
        >
          {WORK_ITEMS.map((item) => (
            <div
              key={item.id}
              data-proto-id={item.id}
              onClick={() => {
                if (!hasMoved.current) {
                  setSelectedProto(item);
                }
              }}
              className="shrink-0 w-[585px] group cursor-pointer"
            >
              {/* Image Box (585x450px, border-radius: 14px) */}
              <div className="w-[585px] h-[450px] rounded-[14px] overflow-hidden bg-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow duration-300 ease-out group-hover:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.025)] relative cursor-zoom-in">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={2340}
                  height={1800}
                  quality={100}
                  unoptimized
                  priority={item.id === "proto-01" || item.id === "proto-02"}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none rounded-[14px]"
                />
              </div>

              {/* Caption (Frame 10: gap 16px below image, Duplet 14px/18px #C0C0C0) */}
              <div className="mt-[16px] flex items-center justify-between">
                <p className="text-[14px] leading-[18px] text-subtle font-sans font-normal m-0 group-hover:text-primary transition-colors duration-200">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Proto Lightbox Modal (14px radius, clean minimalist expansion, click-to-close) */}
      <AnimatePresence>
        {selectedProto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProto.title}
          >
            {/* Backdrop: smooth blur and wash matching proto_open.mov */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setSelectedProto(null)}
              className="absolute inset-0 bg-[#F2F2F2]/80 backdrop-blur-md cursor-zoom-out"
            />

            {/* Expanded Card: centered, 14px radius, clean presentation, click anywhere to close */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 rounded-[14px] overflow-hidden bg-[#EAEAEA] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] cursor-zoom-out flex items-center justify-center"
              style={{
                width: "min(906px, 90vw, calc(85vh * (585 / 450)))",
                height: "min(697px, 85vh, calc(90vw * (450 / 585)))",
              }}
              onClick={() => setSelectedProto(null)}
            >
              <Image
                src={selectedProto.image}
                alt={selectedProto.title}
                fill
                sizes="(max-width: 954px) 100vw, 906px"
                quality={100}
                unoptimized
                priority
                className="w-full h-full object-cover rounded-[14px] select-none pointer-events-none"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

