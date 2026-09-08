"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { LINKS } from "@/lib/config";

export function Outro() {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(LINKS.EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (e.key === "c" || e.key === "C") {
        copyEmail();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyEmail]);

  return (
    <section id="outro" className="mt-[100px]">
      {/* Section Header Row */}
      <div className="flex items-center justify-between h-[22px]">
        {/* Left: Section Title (Frame 26: y=1802, h=12, gap=8) */}
        <div className="flex items-center gap-[8px]">
          <Image
            src="/assets/section-glyph.svg"
            alt=""
            width={12}
            height={12}
            className="shrink-0 -translate-y-[2px]"
            aria-hidden="true"
          />
          <h2 className="font-display text-[15px] leading-[18px] text-primary font-normal">
            Worth the scroll?
          </h2>
        </div>

        {/* Right: Press [C] to copy hint (Figma: y=1803, Duplet 14px/22px #8D8D8D, cap button 22x22) */}
        <div className="relative flex items-center gap-[6px] text-[14px] leading-[22px] text-muted font-sans select-none">
          {copied ? (
            <span className="inline-flex items-center gap-[6px] text-accent font-sans text-[14px] leading-[22px] font-normal select-none transition-all">
              <span>Email Copied to Clipboard</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 text-accent"
                aria-hidden="true"
              >
                <path
                  d="M1.5 8.5L5.5 12.5L13.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 10.5L11.5 12.5L16.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : (
            <>
              <span>Press</span>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address (or press C)"
                className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full overflow-hidden bg-primary cursor-pointer hover:opacity-90 hover:scale-105 active:scale-90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
              >
                <Image
                  src="/assets/c-cap.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="pointer-events-none"
                  aria-hidden="true"
                />
              </button>
              <span>to copy my email</span>
            </>
          )}
        </div>
      </div>

      {/* Divider Line (Line 9: y=1834, w=906px, exactly 20px below header) */}
      <div className="mt-[20px] h-[1px] w-full bg-[#8D8D8D]/15" />

      {/* Let’s Talk Wordmark (y=1864, exactly 30px below divider line, interactive email link) */}
      <div className="mt-[30px] w-full max-w-[906px]">
        <a
          href={`mailto:${LINKS.EMAIL}`}
          onClick={copyEmail}
          title="Click to email or copy heysajidur@gmail.com"
          aria-label="Send email to Sajidur (heysajidur@gmail.com)"
          className="block group cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.01]"
        >
          <Image
            src="/assets/lets-talk.svg"
            alt="Let’s Talk"
            width={906}
            height={145}
            className="w-full h-auto object-contain select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-95"
            priority
          />
        </a>
      </div>
    </section>
  );
}
