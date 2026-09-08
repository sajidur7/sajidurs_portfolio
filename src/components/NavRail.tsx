"use client";

import React, { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "intro", label: "Sajidur’s Intro", href: "#intro" },
  { id: "works", label: "Selected Work", href: "#works" },
  { id: "experiences", label: "Experiences", href: "#experiences" },
  { id: "tech-stack", label: "Tech Stack", href: "#tech-stack" },
  { id: "outro", label: "Outro", href: "#outro" },
];

export function NavRail() {
  const [activeId, setActiveId] = useState("intro");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Update active section
      const scrollPosition = scrollY + 220;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(NAV_ITEMS[i].id);
          break;
        }
      }

      // Hide immediately if at top hero
      if (scrollY < 120) {
        setIsScrolling(false);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        return;
      }

      // Active scroll: reveal nav rail
      setIsScrolling(true);

      // Reset timer: hide when scrolling has stopped for 1 second
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      setActiveId(targetId);
    }
  };

  const shouldShow = isScrolling || isHovered;

  return (
    <nav
      aria-label="Page navigation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-[435px] hidden xl:block z-40 select-none transition-all duration-300 ease-out ${
        shouldShow
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
      style={{ left: "max(24px, calc(50% - 453px - 237px))" }}
    >
      <ul className="flex flex-col m-0 p-0 list-none">
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <React.Fragment key={item.id}>
              {/* Item Row: 12px height with vertically centered line and text */}
              <li className="h-[12px] flex items-center">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className="flex items-center group py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                >
                  {/* Indicator Line: Active 40px, Inactive 28px, Hover expands to 36-40px */}
                  <span
                    className={`h-[1px] block shrink-0 transition-all duration-300 ease-out ${
                      isActive
                        ? "w-[40px] bg-primary"
                        : "w-[28px] bg-[#8D8D8D]/30 group-hover:w-[36px] group-hover:bg-[#8D8D8D]"
                    }`}
                  />
                  <span className="w-[8px] shrink-0" />
                  {/* Label: Smooth hide/reveal transition */}
                  <span
                    className={`text-[15px] leading-[19px] font-sans whitespace-nowrap transition-all duration-200 ease-out origin-left ${
                      isActive
                        ? "text-primary font-normal opacity-100 translate-x-0"
                        : isHovered
                        ? "text-subtle font-normal opacity-90 group-hover:text-primary group-hover:opacity-100 group-hover:translate-x-1"
                        : "text-subtle font-normal opacity-60 group-hover:text-primary group-hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>

              {/* Two Separator ticks between items (each on a 12px pitch, matching Figma Group 5) */}
              {index < NAV_ITEMS.length - 1 && (
                <>
                  <li aria-hidden="true" className="h-[12px] flex items-center pointer-events-none">
                    <span className="w-[11px] h-[1px] bg-[#8D8D8D]/30 block shrink-0 transition-opacity duration-200" />
                  </li>
                  <li aria-hidden="true" className="h-[12px] flex items-center pointer-events-none">
                    <span className="w-[11px] h-[1px] bg-[#8D8D8D]/30 block shrink-0 transition-opacity duration-200" />
                  </li>
                </>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
