/* eslint-disable @next/next/no-img-element */
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { StatusDot } from "./StatusDot";

/**
 * Figma nodes 7:299 (avatar), 7:215 (name), 7:219 (bio), 7:218 + 7:294 (links),
 * 7:221 (buttons) and 7:228 (availability).
 *
 * The avatar is one square photo clipped to a 70×70 circle. It used to be two
 * layers — a portrait over a separate ring — because the frame's artwork came
 * that way; the supplied photo carries its own background, so the ring and the
 * mask offsets that positioned it are gone.
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
      <Reveal className="mt-[60px] size-[70px]" delay={60}>
        {/*
          The hover lives on its own element, not on the Reveal.

          `.reveal` declares a transition of its own — 0.7s, and a delay taken
          from the stagger, 60ms here — and it outranks the utility alongside
          it, so the scale was inheriting both: a wait before it started and
          then most of a second to finish, in each direction. That is the lag.
          Nested, it keeps the entrance on the wrapper and the hover here,
          where nothing else is competing for the property.
        */}
        <span className="block size-full overflow-hidden rounded-full transition-transform duration-[320ms] ease-[var(--ease-flip)] hover:scale-[1.06]">
          <img
            src="/figma/p.png"
            alt="Sajidur Rahman"
            className="block size-full object-cover"
          />
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
      <Reveal className="mt-[23px] flex flex-wrap items-start gap-[8px]" delay={240}>
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
        {/*
          The icon is a second route to the same file, not decoration.

          Drawn inline from frame 14:69's component so the stroke can take the
          accent token. Its 15.5 viewBox renders into a 12px box — the ink size
          measured off the frame — which scales the 1.5 stroke to the ~1.16 the
          design draws. The box is flush with the artwork, so the row's 8px gap
          is the gap the frame shows between the text and the icon.
        */}
        <a
          href={CV_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Download my CV"
          className="mt-[1px] block shrink-0 text-accent transition-transform duration-300 ease-[var(--ease-smooth)] hover:scale-110"
        >
          <svg width="12" height="12" viewBox="0 0 15.5 15.5" fill="none" className="block">
            <path
              d="M7.75 10.75L7.75 0.75M7.75 10.75C7.04977 10.75 5.74153 8.7557 5.25 8.25M7.75 10.75C8.45023 10.75 9.75847 8.7557 10.25 8.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0.75 14.75H14.7501"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </Reveal>

      <Reveal
        /*
          Five more than the 26.5 this sat at, which is the +5 asked for on the
          desktop measurement. The 26.5 itself came from frame 14:69: the pills
          grew 36→40px and the frame took that out of the space above them
          rather than pushing the card down.

          A phone gets less of the increase. The row below wraps there — the
          buttons and the availability tag stack — so the same addition would
          read as a bigger hole than it does on one line.
        */
        className="mt-[28px] flex flex-wrap items-center justify-between gap-x-[10px] gap-y-[18px] sm:mt-[31.5px]"
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
          {/* Same answer the nav's Portfolio gives, from the same helper —
             the two should never disagree about whether the page exists. */}
          <MagneticButton soon="Portfolio" label="See Portfolio" variant="outline" />
        </span>

        <span className="flex items-center gap-[6px]">
          {/* On a phone the pulsing dot carries the meaning on its own.

              `faint` rather than a literal #c0c0c0: that is what the token
              already resolves to in light, and it keeps the label legible when
              the theme flips instead of leaving it near-invisible on black. */}
          <span className="text-trim hidden whitespace-nowrap font-body text-[14px] leading-normal text-faint sm:inline">
            Open to Work
          </span>
          <StatusDot />
        </span>
      </Reveal>
    </>
  );
}
