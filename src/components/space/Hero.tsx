/* eslint-disable @next/next/no-img-element */
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { StatusDot } from "./StatusDot";

/**
 * Figma nodes 7:299 (avatar), 7:215 (name), 7:219 (bio), 7:218 + 7:294 (links),
 * 7:221 (buttons) and 7:228 (availability).
 *
 * The avatar is two layers clipped to the same 70×70 circle — Figma expresses
 * that as a pair of mask groups; the offsets below are those masks resolved
 * against a plain `overflow-hidden rounded-full` box.
 *
 * The hero staggers in on load rather than on scroll: everything here is above
 * the fold, so the reveals fire immediately, 60ms apart.
 *
 * The buttons and the availability tag share a row — in the frame they sit at
 * the column's two ends on a common centreline — and that row stacks on narrow
 * screens rather than crushing together.
 */
const CV_URL =
  "https://drive.google.com/file/d/1bvBzQzzxOJoIIQMyemToTTk3oYPbO7Oh/view?usp=sharing";

const EMAIL = "mailto:incognitoshimul@gmail.com";

export function Hero() {
  return (
    <>
      <Reveal
        className="mt-[60px] size-[70px] overflow-hidden rounded-full transition-transform duration-500 ease-[var(--ease-smooth)] hover:scale-[1.06]"
        delay={60}
      >
        <span className="relative block size-full">
          <img
            src="/figma/avatar-ring.png"
            alt=""
            className="absolute left-[-27px] top-[-3px] block h-[100px] w-[133px] max-w-none object-cover"
          />
          <span className="absolute left-[-14.875px] top-[-9.375px] block size-[98.875px] overflow-hidden rounded-full">
            <img
              src="/figma/avatar-photo.png"
              alt="Sajidur Rahman"
              className="absolute left-0 top-[10.76%] size-full max-w-none"
            />
          </span>
        </span>
      </Reveal>

      <Reveal className="mt-[24px] flex flex-col items-start gap-[21px] text-ink" delay={120}>
        <h1
          className="text-trim w-full whitespace-nowrap font-heading text-[26px] font-extrabold capitalize leading-none tracking-[0.6px] sm:text-[30px]"
          style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
        >
          Sajidur Rahman
        </h1>
        <p className="text-trim w-full font-body text-[15px] leading-normal">
          Product &amp; Experience Designer
        </p>
      </Reveal>

      <Reveal
        as="p"
        className="text-trim mt-[30px] max-w-[499px] font-body text-[15px] leading-[24px] text-muted"
        delay={180}
      >
        Hey, I&rsquo;m Sajidur, a product designer at TechSfera, based in Bangladesh.
        {/* The frame's line breaks only apply once the column is wide enough. */}
        <br className="hidden lg:inline" />{" "}
        Taking complicated problems, finding what really matters, and turning
        <br className="hidden lg:inline" />{" "}
        them into simple and clear experiences.
      </Reveal>

      {/*
        The icon trails the text with a fixed 6px gap rather than sitting at its
        own x-coordinate, so it stays glued to "download my CV" whatever width
        the body face renders it at. The -2px lifts the 16px icon box to the
        y-offset it has in the frame, two pixels above the text's cap line.
      */}
      <Reveal className="mt-[23px] flex flex-wrap items-start gap-[6px]" delay={240}>
        <p className="text-trim font-body text-[15px] leading-[22px] text-muted">
          Drop me an{" "}
          <a
            href={EMAIL}
            className="text-ink underline decoration-solid [text-underline-position:from-font] transition-colors duration-200 hover:text-accent"
          >
            email me
          </a>
          , or{" "}
          <a
            href={CV_URL}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-solid [text-underline-position:from-font] transition-colors duration-200 hover:text-accent"
          >
            download my CV
          </a>
        </p>
        {/* The icon is a second route to the same file, not decoration. */}
        <a
          href={CV_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Download my CV"
          className="relative -mt-[2px] block size-[16px] shrink-0 overflow-hidden transition-transform duration-300 ease-[var(--ease-smooth)] hover:scale-110"
        >
          <img
            src="/figma/icon-file-download.svg"
            alt=""
            className="absolute left-[1.733px] top-[0.733px] block h-[14.533px] w-[12.533px] max-w-none"
          />
        </a>
      </Reveal>

      <Reveal
        className="mt-[30.5px] flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[18px]"
        delay={300}
      >
        <span className="flex items-center gap-[10px]">
          <MagneticButton
            booking
            label={<>Let&rsquo;s Talk</>}
            icon={
              <img
                src="/figma/letstalk-video.png"
                alt=""
                className="block h-[13px] w-[16.574px] max-w-none object-cover"
              />
            }
          />
          <MagneticButton href="#work" label="Portfolio" variant="outline" />
        </span>

        <span className="flex items-center gap-[6px]">
          <span className="text-trim whitespace-nowrap font-body text-[14px] leading-normal text-ink">
            Open to Work
          </span>
          <StatusDot />
        </span>
      </Reveal>
    </>
  );
}
