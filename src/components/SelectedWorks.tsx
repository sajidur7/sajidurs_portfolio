"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const WORK_ITEMS = [
  { id: "proto-01", title: "Proto. 01", image: "/assets/works/proto-01.png?v=7" },
  { id: "proto-02", title: "Proto. 02", image: "/assets/works/proto-02.png?v=7" },
  { id: "proto-03", title: "Proto. 03", image: "/assets/works/proto-03.png?v=7" },
  { id: "proto-04", title: "Proto. 04", image: "/assets/works/proto-04.png?v=7" },
  { id: "proto-05", title: "Proto. 05", image: "/assets/works/proto-05.png?v=7" },
  { id: "proto-06", title: "Proto. 06", image: "/assets/works/proto-06.png?v=7" },
  { id: "proto-07", title: "Proto. 07", image: "/assets/works/proto-07.png?v=7" },
];

export function SelectedWorks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  useEffect(() => {
    return () => stopMomentum();
  }, [stopMomentum]);

  return (
    <section id="works" className="mt-[89px]">
      {/* Section Header (Frame 7: y=456, h=12, gap=8) */}
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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClickCapture={handleClickCapture}
          className={`w-full overflow-x-auto select-none no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x [overscroll-behavior-x:contain] flex items-start gap-[20px] pt-[16px] pb-[20px] ${
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
            <div key={item.id} className="shrink-0 w-[750px] group">
              {/* Image Box (Rectangle 6: 750x575px, border-radius: 24px) */}
              <div className="w-[750px] h-[575px] rounded-[24px] overflow-hidden bg-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out group-hover:-translate-y-[2px] group-hover:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.025)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={3000}
                  height={2300}
                  quality={100}
                  unoptimized
                  priority={item.id === "proto-01" || item.id === "proto-02"}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </div>

              {/* Caption (Frame 10: gap 16px below 575px image, Duplet 14px/18px #C0C0C0) */}
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
