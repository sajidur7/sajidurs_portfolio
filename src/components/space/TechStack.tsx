/* eslint-disable @next/next/no-img-element */
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Figma node 7:316. Each logo keeps its own outer box and inner crop — the
 * artwork sits inside its frame at different scales, so a single shared size
 * would distort several of them.
 *
 * The eleven logos total 352px and the frame's 31.8px gaps fill the remaining
 * 318px of the 670 column exactly, so `justify-between` reproduces the design
 * at full width and redistributes on its own as the column narrows. Below that
 * they wrap onto a second row.
 *
 * `label` is what the hover tooltip shows; the design names the Claude mark
 * "Claude AI", so these are product names rather than the bare alt text.
 */
const STACK = [
  { src: "/figma/stack-01.png", label: "Figma", box: { w: 24, h: 34 }, img: { w: 34, h: 34, x: -5, y: 0 } },
  { src: "/figma/stack-02.png", label: "Framer", box: { w: 24, h: 34 }, img: { w: 34, h: 34, x: -5, y: 0 } },
  { src: "/figma/stack-03.png", dark: "/figma/stack-03-dark.png", label: "Spline", box: { w: 32, h: 34 }, img: { w: 36.614, h: 36.125, x: -2.307, y: -1.061 } },
  { src: "/figma/stack-04.png", label: "VS Code", box: { w: 34, h: 34 } },
  { src: "/figma/stack-05.png", label: "Claude AI", box: { w: 34, h: 34 }, img: { w: 36.428, h: 36.428, x: -1.214, y: -1.214 } },
  { src: "/figma/stack-06.png", dark: "/figma/stack-06-dark.png", label: "ChatGPT", box: { w: 34, h: 34 } },
  { src: "/figma/stack-07.png", label: "Jira", box: { w: 34, h: 34 } },
  { src: "/figma/stack-08.png", dark: "/figma/stack-08-dark.png", label: "Notion", box: { w: 34, h: 34 } },
  { src: "/figma/stack-09.png", label: "Slack", box: { w: 34, h: 34 } },
  { src: "/figma/stack-10.png", dark: "/figma/stack-10-dark.png", label: "GitHub", box: { w: 34, h: 34 } },
  { src: "/figma/stack-11.png", dark: "/figma/stack-11-dark.png", label: "Vercel", box: { w: 34, h: 34 } },
];

export function TechStack() {
  return (
    <Reveal as="section" className="mt-[78px] flex w-full flex-col items-start gap-[30px]">
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
            */}
            <span className="relative block size-full overflow-hidden transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:-translate-y-[4px] group-hover:scale-110">
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
            </span>

            {/* Node 7:334 — centred under the icon, 10px clear of it. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full z-30 mt-[10px] flex h-[30px] -translate-x-1/2 translate-y-[4px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-[12px] opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-smooth)] group-hover:translate-y-0 group-hover:opacity-100"
            >
              <span className="text-trim font-body text-[14px] leading-[22px] text-canvas">
                {tool.label}
              </span>
            </span>
          </Reveal>
        ))}
      </ul>
    </Reveal>
  );
}
