"use client";

/* eslint-disable @next/next/no-img-element */
import { cursorToast } from "@/lib/sound";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Figma node 7:316. Each logo keeps its own outer box and inner crop — the
 * artwork sits inside its frame at different scales, so a single shared size
 * would distort several of them.
 *
 * The eleven logos total 309px and the frame's 36.1px gaps fill the remaining
 * 361px of the 670 column exactly, so `justify-between` reproduces the design
 * at full width and redistributes on its own as the column narrows. Below that
 * they wrap onto a second row.
 *
 * The inner crops are the frame's percentages resolved against each new box —
 * Figma states them as a share of the frame, so they have to be recomputed
 * whenever the boxes change rather than scaled by eye.
 *
 * `label` is the product name, used for the alt text and the key. `tip` is what
 * the tooltip actually says — the mark already identifies the tool, so repeating
 * its name on hover tells the visitor nothing they cannot see.
 */
const STACK = [
  { src: "/figma/stack-01.png", label: "Figma", tip: "Making things pretty", box: { w: 21, h: 30 }, img: { w: 29.75, h: 30, x: -4.375, y: 0 } },
  { src: "/figma/stack-02.png", label: "Framer", tip: "Pixels go live", box: { w: 21, h: 30 }, img: { w: 29.75, h: 30, x: -4.375, y: 0 } },
  { src: "/figma/stack-03.png", dark: "/figma/stack-03-dark.png", label: "Cursor", tip: "My coding sidekick", box: { w: 27, h: 30 }, img: { w: 30.893, h: 31.875, x: -1.947, y: -0.936 } },
  { src: "/figma/stack-04.png", label: "VS Code", tip: "When things get serious", box: { w: 30, h: 30 } },
  { src: "/figma/stack-05.png", label: "Claude", tip: "Second opinion, always", box: { w: 30, h: 30 }, img: { w: 32.142, h: 32.142, x: -1.071, y: -1.071 } },
  { src: "/figma/stack-06.png", dark: "/figma/stack-06-dark.png", label: "ChatGPT", tip: "My 2AM coworker", box: { w: 30, h: 30 } },
  { src: "/figma/stack-07.png", label: "Jira", tip: "Tasks go to multiply", box: { w: 30, h: 30 } },
  { src: "/figma/stack-08.png", dark: "/figma/stack-08-dark.png", label: "Notion", tip: "Organized chaos, mostly", box: { w: 30, h: 30 } },
  { src: "/figma/stack-09.png", label: "Slack", tip: "“Quick call?” Sure", box: { w: 30, h: 30 } },
  { src: "/figma/stack-10.png", dark: "/figma/stack-10-dark.png", label: "GitHub", tip: "Code lives here", box: { w: 30, h: 30 } },
  { src: "/figma/stack-11.png", dark: "/figma/stack-11-dark.png", label: "Vercel", tip: "Ship it and pray", box: { w: 30, h: 30 } },
];

export function TechStack() {
  return (
    <Reveal
      as="section"
      className="mt-[78px] flex w-full flex-col items-start gap-[30px] sm:mt-[88px]"
    >
      <SectionHeading title="Tech Stack" caption="Tools I Use as a Designer" />

      {/* justify-between only once the row fits on one line, otherwise the
          wrapped last row gets stretched across the full width. */}
      <ul className="flex w-full flex-wrap items-center gap-x-[26px] gap-y-[22px] lg:justify-between lg:gap-x-0">
        {STACK.map((tool, position) => (
          <Reveal
            as="li"
            key={tool.label}
            className="group relative shrink-0"
            delay={position * 45}
            style={{ width: tool.box.w, height: tool.box.h }}
          >
            {/*
              The crop lives on its own element so it cannot clip the tooltip,
              and so the hover lift moves the logo without moving the tooltip.

              A button, because on a phone this is the only way to reach the
              line: the tooltip is hover-only, and there is no hover there.
              Tapping sends it to the cursor toast instead, which parks above
              the nav and fades the same way the nav's own replies do — so the
              phone gets the same line as the desktop, in the one place a
              message already appears.
            */}
            <button
              type="button"
              aria-label={`${tool.label} — ${tool.tip}`}
              onClick={() => {
                /* Only where the tooltip cannot reach. Above the breakpoint
                   hovering already shows it, and a toast as well would say the
                   same thing twice. */
                if (!window.matchMedia("(min-width: 640px)").matches) {
                  cursorToast(tool.tip, "ink");
                }
              }}
              className="relative block size-full overflow-hidden transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:-translate-y-[4px] group-hover:scale-110 active:scale-95"
            >
              {(() => {
                const geometry = tool.img
                  ? { width: tool.img.w, height: tool.img.h, left: tool.img.x, top: tool.img.y }
                  : ({ inset: 0, width: "100%", height: "100%", objectFit: "cover" } as const);

                return (
                  <>
                    <img
                      src={tool.src}
                      alt={tool.label}
                      className={`absolute max-w-none ${tool.dark ? "logo-light" : ""}`}
                      style={geometry}
                    />
                    {/* Near-black marks are invisible on dark; the design ships
                        white versions, which take over with the theme. */}
                    {tool.dark ? (
                      <img
                        src={tool.dark}
                        alt=""
                        aria-hidden
                        className="logo-dark absolute max-w-none"
                        style={geometry}
                      />
                    ) : null}
                  </>
                );
              })()}
            </button>

            {/*
              Node 7:334 — centred under the icon, 10px clear of it.

              Pointer sizes only. The taglines are far longer than the names
              they replaced, and centred under an icon at the start of a
              wrapped row they hang off the left of a phone screen. There is no
              hover on a phone to ask for one anyway — what showed them was
              sticky hover after a tap.
            */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full z-30 mt-[10px] hidden h-[30px] -translate-x-1/2 sm:flex translate-y-[4px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-[12px] opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-smooth)] group-hover:translate-y-0 group-hover:opacity-100"
            >
              <span className="text-trim font-body text-[13px] leading-[22px] text-canvas">
                {tool.tip}
              </span>
            </span>
          </Reveal>
        ))}
      </ul>
    </Reveal>
  );
}
