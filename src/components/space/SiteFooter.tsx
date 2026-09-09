/* eslint-disable @next/next/no-img-element */
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

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
    <Reveal as="footer" className="mt-[80px] flex w-full flex-col items-start gap-[20px]">
      <SectionHeading
        as="p"
        title="Sajidur Rahman"
        caption="Currently: designing thoughtful products that feel alive"
      />

      <div className="flex w-full flex-col items-start gap-[24px] sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        {/* Text only — the label carries it, so no brand mark. */}
        <MagneticButton href={WHATSAPP_URL} external label="Send Message" />

        <div className="flex flex-wrap items-center gap-x-[41px] gap-y-[14px]">
          <p className="text-trim whitespace-nowrap font-body text-[14px] leading-normal text-ink sm:text-right">
            Follow me on social media:
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
      </div>
    </Reveal>
  );
}
