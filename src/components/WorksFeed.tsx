"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface WorkItem {
  id: string;
  title: string;
  image: string;
}

export const WORKS_DATA: WorkItem[] = [
  {
    id: "proto-01",
    title: "Proto. 01",
    image: "/assets/works/proto-01.png",
  },
  {
    id: "proto-02",
    title: "Proto. 02",
    image: "/assets/works/proto-02.png",
  },
  {
    id: "proto-03",
    title: "Proto. 03",
    image: "/assets/works/proto-03.png",
  },
  {
    id: "proto-04",
    title: "Proto. 04",
    image: "/assets/works/proto-04.png",
  },
  {
    id: "proto-05",
    title: "Proto. 05",
    image: "/assets/works/proto-05.png",
  },
];

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function WorksFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  // Auto-drift and interaction tracking
  const isHovered = useRef(false);
  const isInteracting = useRef(false);
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const singleSetHeightRef = useRef<number>(0);

  // Drag physics refs
  const isPointerDown = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const hasMoved = useRef(false);

  // Measure single set height accurately
  const updateMetrics = useCallback(() => {
    if (!trackRef.current) return;
    // We render 3 sets of 5 items
    const totalHeight = trackRef.current.scrollHeight;
    singleSetHeightRef.current = totalHeight / 3;
  }, []);

  // Seamless wrap function
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    const singleSet = singleSetHeightRef.current;
    if (!el || singleSet <= 0) return;

    // If scrolled past the second set, wrap back to the first set
    if (el.scrollTop >= singleSet * 2) {
      el.scrollTop -= singleSet;
    } else if (el.scrollTop < singleSet * 0.4) {
      // If scrolled up near the top, wrap forward to the middle set
      el.scrollTop += singleSet;
    }
  }, []);

  // Pause auto-motion on user scroll/touch/wheel
  const onUserActivity = useCallback(() => {
    isInteracting.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 2000);
  }, []);

  // Continuous buttery-smooth auto-motion loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initialize metrics
    updateMetrics();

    // Start in the middle set
    if (singleSetHeightRef.current > 0 && el.scrollTop === 0) {
      el.scrollTop = singleSetHeightRef.current;
    }

    const step = () => {
      if (
        !isHovered.current &&
        !isInteracting.current &&
        !isPointerDown.current &&
        !selectedWork &&
        containerRef.current &&
        singleSetHeightRef.current > 0
      ) {
        // Smooth slow drift (0.45px per frame)
        containerRef.current.scrollTop += 0.45;
        handleScroll();
      }
      animationFrameId.current = requestAnimationFrame(step);
    };

    animationFrameId.current = requestAnimationFrame(step);

    const handleResize = () => {
      updateMetrics();
      handleScroll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, updateMetrics, selectedWork]);

  // Pointer drag events for smooth swipe/drag feel
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isPointerDown.current = true;
    hasMoved.current = false;
    startY.current = e.clientY;
    startScrollTop.current = containerRef.current.scrollTop;
    onUserActivity();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current || !containerRef.current) return;
    const dy = e.clientY - startY.current;

    if (Math.abs(dy) > 6) {
      hasMoved.current = true;
    }

    if (hasMoved.current) {
      containerRef.current.scrollTop = startScrollTop.current - dy;
      handleScroll();
      onUserActivity();
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    setTimeout(() => {
      hasMoved.current = false;
    }, 60);
  };

  const handlePointerCancel = () => {
    isPointerDown.current = false;
    hasMoved.current = false;
  };

  // Keyboard navigation & modal lock
  useEffect(() => {
    if (!selectedWork) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedWork(null);
      } else if (e.key === "ArrowRight") {
        setSelectedWork((curr) => {
          if (!curr) return null;
          const idx = WORKS_DATA.findIndex((w) => w.id === curr.id);
          return WORKS_DATA[(idx + 1) % WORKS_DATA.length];
        });
      } else if (e.key === "ArrowLeft") {
        setSelectedWork((curr) => {
          if (!curr) return null;
          const idx = WORKS_DATA.findIndex((w) => w.id === curr.id);
          return WORKS_DATA[(idx - 1 + WORKS_DATA.length) % WORKS_DATA.length];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedWork]);

  // Triple set for seamless infinite loop
  const infiniteItems = [
    ...WORKS_DATA.map((w) => ({ ...w, instanceKey: `set0-${w.id}` })),
    ...WORKS_DATA.map((w) => ({ ...w, instanceKey: `set1-${w.id}` })),
    ...WORKS_DATA.map((w) => ({ ...w, instanceKey: `set2-${w.id}` })),
  ];

  return (
    <>
      <section
        ref={containerRef}
        onScroll={() => {
          handleScroll();
          onUserActivity();
        }}
        onWheel={onUserActivity}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
        }}
        className="w-full lg:w-[711px] shrink-0 border-r border-[#E8E8E8] py-[30px] px-[20px] lg:h-screen lg:overflow-y-auto no-scrollbar select-none [overscroll-behavior-y:contain] cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Works showcase"
      >
        <div ref={trackRef} className="flex flex-col gap-[20px] w-full items-center">
          {infiniteItems.map((item, idx) => (
            <div
              key={item.instanceKey}
              onClick={() => {
                if (!hasMoved.current) {
                  setSelectedWork(WORKS_DATA.find((w) => w.id === item.id) || null);
                }
              }}
              className="w-full max-w-[671px] aspect-[671/541] rounded-[16px] overflow-hidden bg-[#E8E8E8] relative cursor-zoom-in group shrink-0 transition-transform duration-300 ease-out hover:scale-[1.012] shadow-xs hover:shadow-md"
              aria-label={`Open ${item.title}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 671px"
                priority={idx >= 5 && idx < 7}
                quality={100}
                unoptimized
                className="w-full h-full object-cover rounded-[16px] select-none pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Work Lightbox Modal in New Size (Framer Motion) */}
      <AnimatePresence>
        {selectedWork && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={selectedWork.title}
          >
            {/* Backdrop with smooth blur and dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setSelectedWork(null)}
              className="absolute inset-0 bg-[#F2F2F2]/80 backdrop-blur-md cursor-zoom-out"
            />

            {/* Expanded Card in New 671x541 Aspect Ratio */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 rounded-[16px] overflow-hidden bg-[#E8E8E8] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.22)] cursor-zoom-out flex items-center justify-center group"
              style={{
                width: "min(1006px, 92vw)",
                aspectRatio: "671 / 541",
                maxHeight: "88vh",
              }}
              onClick={() => setSelectedWork(null)}
            >
              <Image
                src={selectedWork.image}
                alt={selectedWork.title}
                fill
                sizes="(max-width: 1200px) 95vw, 1006px"
                quality={100}
                unoptimized
                priority
                className="w-full h-full object-cover rounded-[16px] select-none pointer-events-none"
              />

              {/* Minimalist Prev/Next Navigation Controls */}
              <div
                className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = WORKS_DATA.findIndex((w) => w.id === selectedWork.id);
                    setSelectedWork(WORKS_DATA[(idx - 1 + WORKS_DATA.length) % WORKS_DATA.length]);
                  }}
                  aria-label="Previous work"
                  className="pointer-events-auto w-[40px] h-[40px] rounded-full bg-white/85 hover:bg-white text-[#232323] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 backdrop-blur-xs"
                >
                  <ArrowLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = WORKS_DATA.findIndex((w) => w.id === selectedWork.id);
                    setSelectedWork(WORKS_DATA[(idx + 1) % WORKS_DATA.length]);
                  }}
                  aria-label="Next work"
                  className="pointer-events-auto w-[40px] h-[40px] rounded-full bg-white/85 hover:bg-white text-[#232323] shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 backdrop-blur-xs"
                >
                  <ArrowRightIcon />
                </button>
              </div>

              {/* Subtle top indicator with ESC close hint */}
              <div
                className="absolute top-4 right-4 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedWork(null)}
                  aria-label="Close expanded view"
                  className="px-3 py-1 rounded-full bg-black/60 text-white/90 text-[12px] font-sans hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Esc to close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
