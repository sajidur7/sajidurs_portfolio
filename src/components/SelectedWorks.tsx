"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const WORK_ITEMS = [
  { id: "proto-01", title: "Proto. 01", image: "/assets/works/proto-01.png?v=13" },
  { id: "proto-02", title: "Proto. 02", image: "/assets/works/proto-02.png?v=13" },
  { id: "proto-03", title: "Proto. 03", image: "/assets/works/proto-03.png?v=13" },
  { id: "proto-04", title: "Proto. 04", image: "/assets/works/proto-04.png?v=13" },
  { id: "proto-05", title: "Proto. 05", image: "/assets/works/proto-05.png?v=13" },
];

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 10H3.5M8.5 5L3.5 10L8.5 15" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 10H16.5M11.5 5L16.5 10L11.5 15" />
    </svg>
  );
}

export function SelectedWorks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Momentum glide with cubic ease-out (matching snts.im)
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
    setIsDragging(true);
    startX.current = e.clientX;
    startScrollLeft.current = scrollRef.current.scrollLeft;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();

    const now = performance.now();
    const dt = Math.max(1, now - lastTime.current);
    const deltaX = e.clientX - lastX.current;

    if (Math.abs(e.clientX - startX.current) > 3) {
      hasMoved.current = true;
    }

    // Velocity in px/sec (inverted: dragging left = scroll increases)
    velocity.current = (-deltaX / dt) * 1000;

    lastX.current = e.clientX;
    lastTime.current = now;

    // Direct 1:1 tracking
    const totalWalk = e.clientX - startX.current;
    scrollRef.current.scrollLeft = startScrollLeft.current - totalWalk;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    isDown.current = false;
    setIsDragging(false);
    startMomentum();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    isDown.current = false;
    setIsDragging(false);
    startMomentum();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
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

        {/* Carousel Navigation Arrows: 20x20px, 5px gap */}
        <div className="flex items-center gap-[5px]">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            aria-label="Previous work"
            className={`w-[20px] h-[20px] p-0 flex items-center justify-center transition-colors duration-200 ${
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
            className={`w-[20px] h-[20px] p-0 flex items-center justify-center transition-colors duration-200 ${
              canScrollRight
                ? "text-primary cursor-pointer hover:opacity-75"
                : "text-muted cursor-default"
            }`}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* Divider Line (matches other sections: w-full, ending at right column edge) */}
      <div className="mt-[20px] h-[1px] w-full bg-[#8D8D8D]/15" />

      {/* Gallery Track Container: Full screen bleed across viewport (matching snts.im) */}
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
            <div key={item.id} className="shrink-0 w-[585px] group">
              {/* Image Box (585x450px, border-radius: 16px) */}
              <div className="w-[585px] h-[450px] rounded-[16px] overflow-hidden bg-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out group-hover:-translate-y-[2px] group-hover:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.025)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={2340}
                  height={1800}
                  quality={100}
                  unoptimized
                  priority={item.id === "proto-01" || item.id === "proto-02"}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none rounded-[16px]"
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
    </section>
  );
}
