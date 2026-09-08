"use client";

import React from "react";

export function ProjectPlaceholders() {
  return (
    <section className="w-full lg:w-[711px] shrink-0 border-r border-[#E8E8E8] py-[30px] px-[20px] flex flex-col gap-[20px]">
      {/* Placeholder 1: Rectangle 1612 (671px x 541px, rounded-2xl / 16px, #E8E8E8) */}
      <div
        className="w-full max-w-[671px] h-[340px] sm:h-[420px] md:h-[500px] lg:h-[541px] bg-[#E8E8E8] rounded-[16px] transition-all duration-300 hover:opacity-95 cursor-default relative overflow-hidden"
        aria-label="Project placeholder 1"
      />

      {/* Placeholder 2: Rectangle 1613 (671px x 541px, rounded-2xl / 16px, #E8E8E8) */}
      <div
        className="w-full max-w-[671px] h-[340px] sm:h-[420px] md:h-[500px] lg:h-[541px] bg-[#E8E8E8] rounded-[16px] transition-all duration-300 hover:opacity-95 cursor-default relative overflow-hidden"
        aria-label="Project placeholder 2"
      />
    </section>
  );
}
