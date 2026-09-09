/* eslint-disable @next/next/no-img-element */
import { Fragment } from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Figma node 7:231.
 *
 * `href` is empty until the real links arrive: a row with one renders as a
 * link, a row without renders as plain markup, so nothing here is ever a dead
 * anchor. Filling in a URL is all it takes to activate the row.
 *
 * On a narrow column the role and the job meta stack instead of sitting at
 * opposite ends, which keeps the dates from colliding with the title.
 */
const EXPERIENCES = [
  {
    company: "TechSfera",
    role: "Product Designer",
    commitment: "Full-time",
    period: " 12 . 2024 — Present",
    tenure: "21m",
    href: "",
    logo: { src: "/figma/logo-techsfera-orange.svg", background: "#f84620", box: 32, width: 20, height: 20 },
  },
  {
    company: "Fiverr",
    role: "UX/UI Designer",
    commitment: "Part-time",
    period: " 03 . 2022 — Present",
    tenure: "N/A",
    href: "",
    logo: { src: "/figma/logo-fiverr.svg", background: "#1dbf73", box: 34, width: 16, height: 19 },
  },
  {
    company: "BigGorillaApps",
    role: "UI Designer",
    commitment: "Full-time",
    period: " 08 . 2021 — 03 . 2022",
    tenure: "6m",
    href: "",
    logo: { src: "/figma/logo-biggorillaapps.svg", background: "#cd1632", box: 34, width: 22, height: 18 },
  },
];

const meta =
  "text-trim whitespace-nowrap text-center font-body text-[14px] leading-[22px] text-muted";

export function Experiences() {
  // 58 rather than the frame's 78: the chevron hit targets are 32px tall where
  // the design only draws the 11.4px glyph, so the row above is 20px taller
  // than in Figma and that has to come back out here.
  return (
    <Reveal as="section" className="mt-[58px] flex w-full flex-col items-start gap-[30px]">
      <SectionHeading
        title="Experiences"
        caption="Where I’ve worked & the products I’ve brought to life"
      />

      <div className="flex w-full flex-col items-start gap-[20px]">
        {EXPERIENCES.map((item, index) => {
          const Row = item.href ? "a" : "div";

          return (
            <Fragment key={`${item.company}-${item.period}`}>
              {index > 0 && <span aria-hidden className="rule-dashed block w-full" />}

              <Reveal className="w-full" delay={index * 90}>
                <Row
                  {...(item.href ? { href: item.href, target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex w-full items-center gap-[10px] transition-transform duration-300 ease-[var(--ease-smooth)] hover:translate-x-[3px]"
                >
                  {/* Dropped on phones so the row below has the width to run
                      side by side the way it does on desktop. */}
                  <span
                    className="hidden shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:scale-110 sm:flex"
                    style={{
                      width: item.logo.box,
                      height: item.logo.box,
                      backgroundColor: item.logo.background,
                    }}
                  >
                    <img
                      src={item.logo.src}
                      alt=""
                      className="block max-w-none"
                      style={{ width: item.logo.width, height: item.logo.height }}
                    />
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col items-start gap-[12px]">
                    <span className="text-trim block w-full font-body text-[16px] font-semibold leading-[22px] text-ink transition-colors duration-200 group-hover:text-accent">
                      {item.company}
                    </span>
                    <span className="flex w-full items-center justify-between gap-[8px] sm:gap-0">
                      <span className="text-trim block whitespace-nowrap font-body text-[14px] leading-[22px] text-muted sm:w-[117px]">
                        {item.role}
                      </span>
                      {/* 4px on phones buys the ~8px that keeps the longest
                          row on one line down to a 360px screen. */}
                      <span className="flex items-center gap-[4px] sm:gap-[6px]">
                        <span className={meta}>{item.commitment}</span>
                        <span className="h-[10px] w-px shrink-0 bg-rule" />
                        <span className={`${meta} whitespace-pre`}>{item.period}</span>
                        {/* Tenure and its divider are desktop-only: the dates
                            already say how long the role ran, and dropping them
                            is what keeps the row on one line on a phone. */}
                        <span className="hidden h-[10px] w-px shrink-0 bg-rule sm:block" />
                        <span className={`${meta} hidden sm:block`}>{item.tenure}</span>
                      </span>
                    </span>
                  </span>
                </Row>
              </Reveal>
            </Fragment>
          );
        })}
      </div>
    </Reveal>
  );
}
