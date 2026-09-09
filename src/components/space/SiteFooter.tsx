/* eslint-disable @next/next/no-img-element */
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { StatusDot } from "./StatusDot";

/**
 * Figma node 7:203 — the X mark is 20×18, the other three are 20×20.
 *
 * An entry only renders as a link once it has an `href`, so a profile can be
 * dropped or added without touching the markup.
 */
/* 01997631218 in wa.me form: national leading 0 dropped, Bangladesh's 880 in
   front. wa.me only accepts a full international number with no punctuation. */
const WHATSAPP_URL = "https://wa.me/8801997631218";

const SOCIALS = [
  { src: "/figma/social-linkedin.svg", label: "LinkedIn", href: "https://www.linkedin.com/in/mdsajidur/", w: 20, h: 20 },
  { src: "/figma/social-dribbble.svg", label: "Dribbble", href: "https://dribbble.com/sajidurrahman", w: 20, h: 20 },
  { src: "/figma/social-x.svg", label: "X", href: "https://x.com/incognitoshimul", w: 20, h: 18 },
  { src: "/figma/social-instagram.svg", label: "Instagram", href: "https://www.instagram.com/sajidur_7/", w: 20, h: 20 },
];

/** Figma node 7:193. */
export function SiteFooter() {
  return (
    /*
      A grid rather than two independent rows: the right-hand column is sized
      to its widest content — the caption — so the socials line starts on the
      caption's left edge instead of wherever its own width happens to put it.
      Two flex rows could only line up by coincidence.

      This is why the footer does not use SectionHeading: the heading has to
      share the grid's columns to take part in that alignment.
    */
    <Reveal
      as="footer"
      /* justify-items-start because grid items stretch by default, which
         pulled the pill out to the full width of its column. */
      className="mt-[80px] grid w-full grid-cols-[1fr_max-content] items-center justify-items-start gap-x-[20px] gap-y-[24px] sm:gap-y-[20px]"
    >
      <p
        className="text-trim whitespace-nowrap font-heading text-[16px] font-bold capitalize leading-none tracking-[0.32px] text-ink"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        Sajidur Rahman
      </p>

      <span className="flex items-center gap-[6px] justify-self-end">
        {/* Too long to share a line with the name on a phone; the dot stays. */}
        <span className="text-trim hidden whitespace-nowrap text-right font-body text-[14px] leading-normal text-faint sm:block">
          Currently: designing thoughtful products that feel alive
        </span>
        <StatusDot />
      </span>

      {/* Figma node 38:183 — solid pill, the 17px WhatsApp mark 6px ahead of
          the label. The label runs at the shared 15px rather than the frame's
          14, so it matches Let's Talk and See Portfolio. */}
      <MagneticButton
        href={WHATSAPP_URL}
        external
        label="Start a Chat"
        gap={6}
        icon={
          <img
            src="/figma/whatsapp-mark.png"
            alt=""
            className="block size-[17px] max-w-none object-contain"
          />
        }
      />

      {/* Stays in column two at every size, so on a phone — where the label is
          hidden — the icons share the CTA's row, right-aligned and centred on
          it, rather than dropping below. */}
      <div className="flex w-full flex-wrap items-center justify-between gap-x-[41px] gap-y-[14px]">
        {/* Dropped on a phone — with the label gone the icons fall to the
            start of the row, lining up under the CTA. */}
        <p className="text-trim hidden whitespace-nowrap font-body text-[14px] leading-normal text-ink sm:block">
          {"Find Me Online :"}
        </p>
          <ul className="flex items-center gap-[20px]">
            {SOCIALS.map((social) => {
              const Item = social.href ? "a" : "span";

              return (
                <li key={social.label} className="shrink-0">
                  <Item
                    {...(social.href
                      ? { href: social.href, target: "_blank", rel: "noreferrer" }
                      : {})}
                    aria-label={social.label}
                    className="block transition-transform duration-300 ease-[var(--ease-smooth)] hover:-translate-y-[3px] hover:scale-110"
                  >
                    <img
                      src={social.src}
                      alt=""
                      className="social-mark block max-w-none"
                      style={{ width: social.w, height: social.h }}
                    />
                  </Item>
                </li>
              );
            })}
        </ul>
      </div>
    </Reveal>
  );
}
