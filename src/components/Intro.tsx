"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LINKS } from "@/lib/config";

export function Intro() {
  const [timeStr, setTimeStr] = useState("12: 05: 16 GMT +6");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Format time in Dhaka (GMT+6)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      try {
        const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(now);
        const hh = parts.find((p) => p.type === "hour")?.value.padStart(2, "0") || "12";
        const mm = parts.find((p) => p.type === "minute")?.value.padStart(2, "0") || "00";
        const ss = parts.find((p) => p.type === "second")?.value.padStart(2, "0") || "00";
        setTimeStr(`${hh}: ${mm}: ${ss} GMT +6`);
      } catch {
        setTimeStr("12: 05: 16 GMT +6");
      }
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="intro" className="pt-[30px] select-text">
      {/* Top Meta Bar (Figma: y=30px, Duplet 14px/18px #8D8D8D) */}
      <div className="flex items-center justify-between text-[14px] leading-[18px] text-muted font-sans uppercase">
        <span>EST . 2026</span>
        <span className="tabular-nums text-right">{timeStr}</span>
      </div>

      {/* Profile Photo (Figma: y=70px, 70x70px, rounded 100%, background #000000) */}
      <div className="mt-[22px]">
        <div
          className="relative w-[70px] h-[70px] rounded-full overflow-hidden bg-[#000000] transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-md cursor-pointer"
          style={{
            borderRadius: "100%",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          }}
        >
          <Image
            src="/assets/avatar.png?v=3"
            alt="Sajidur Rahman"
            width={70}
            height={70}
            unoptimized
            quality={100}
            className="object-cover w-full h-full rounded-full transition-transform duration-500 ease-out hover:scale-105"
            style={{ borderRadius: "100%" }}
            priority
          />
        </div>
      </div>

      {/* Name (Figma: y=165px, Mogra 400 36px, letter-spacing 0.02em, text-transform capitalize) */}
      <h1 className="mt-[25px] font-display text-[36px] leading-[36px] tracking-[0.02em] capitalize text-primary font-normal">
        Sajidur Rahman
      </h1>

      {/* Role (Figma: y=215px, Duplet 400 16px/20px #232323) */}
      <p className="mt-[14px] text-[16px] leading-[20px] text-primary font-sans font-normal">
        Product & Experience Designer
      </p>

      {/* Bio and Open to Work Row (Figma: y=256px bio, y=255px Open to Work) */}
      <div className="mt-[21px] flex flex-col md:flex-row md:items-start justify-between gap-6">
        <p className="max-w-[585px] text-[16px] leading-[24px] text-muted font-sans font-normal">
          Hey, I’m Sajidur, a product designer at TechSfera, based in Bangladesh.
          <br className="hidden md:inline" />
          I like taking complicated problems and making them feel simple, clear,{" "}
          <br className="hidden md:inline" />
          and easy to use.
        </p>

        {/* Status: Open to Work (Frame 6: y=255px, gap=8px, text: 14px/18px #232323) */}
        <div className="flex items-center gap-[8px] shrink-0 group cursor-default">
          <Image
            src="/assets/section-glyph.svg"
            alt=""
            width={12}
            height={12}
            className="shrink-0 animate-pulse"
            aria-hidden="true"
          />
          <span className="text-[14px] leading-[18px] text-primary font-sans font-normal group-hover:opacity-80 transition-opacity">
            Open to Work
          </span>
        </div>
      </div>

      {/* Action Links (Figma: y=345px, Duplet 400 16px/22px #8D8D8D) */}
      <p className="mt-[30px] text-[16px] leading-[22px] text-muted font-sans font-normal">
        Find me on{" "}
        <a
          href={LINKS.X}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          X
        </a>
        ,{" "}
        <a
          href={`mailto:${LINKS.EMAIL}`}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          email me
        </a>
        , or{" "}
        <a
          href={LINKS.CV}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-[4px]"
        >
          <span>download my CV</span>
          <Image
            src="/assets/download-glyph.svg"
            alt=""
            width={20}
            height={20}
            className="inline-block shrink-0 -translate-y-[1px]"
            aria-hidden="true"
          />
        </a>
      </p>
    </section>
  );
}
