/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/**
 * Figma node 7:366 — the floating pill.
 *
 * In the frame it is centred on the 1440 canvas with 30px of clearance below,
 * so it is pinned to the window at that offset and centred on the viewport
 * instead. It stacks above the bottom scrim so it stays crisp while the page
 * blurs past underneath.
 *
 * Portfolio and Playground are the pages still to come: the design renders them
 * greyed and softened by 0.75px rather than hiding them, so they read as "not
 * yet" instead of disabled. They stay spans until those routes exist — giving
 * an entry an `href` is all it takes to turn it into a live link.
 */
const ITEMS = [
  { label: "Space", icon: "/figma/icon-home.svg", size: 14.334, offset: 0.834, href: "/" },
  { label: "Portfolio", icon: "/figma/icon-colors.svg", size: 14.334, offset: 0.834, href: "" },
  { label: "Playground", icon: "/figma/icon-subtitle.svg", size: 13.666, offset: 1.166, href: "" },
];

export function SpaceNav() {
  return (
    <nav
      className="fixed bottom-[30px] left-1/2 z-50 flex max-w-[calc(100vw-24px)] -translate-x-1/2 animate-fade-in flex-col items-start rounded-full bg-surface p-[6px]"
      style={{ animationDelay: "450ms" }}
    >
      <div className="flex items-center">
        {ITEMS.map((item) => {
          const live = Boolean(item.href);
          const content = (
            <>
              <span className="relative size-[16px] shrink-0 overflow-hidden">
                <img
                  src={item.icon}
                  alt=""
                  className="absolute block max-w-none"
                  style={{
                    width: item.size,
                    height: item.size,
                    left: item.offset,
                    top: item.offset,
                  }}
                />
              </span>
              <span
                className={`text-trim whitespace-nowrap font-body text-[14px] leading-[22px] sm:text-[15px] ${
                  live ? "font-semibold text-ink" : "text-faint"
                }`}
              >
                {item.label}
              </span>
            </>
          );

          const shared =
            "flex h-[36px] shrink-0 items-center justify-center gap-[6px] rounded-full bg-canvas px-[11px] py-[10px] transition-transform duration-300 ease-[var(--ease-smooth)] sm:px-[15px]";

          return live ? (
            <Link
              key={item.label}
              href={item.href}
              aria-current="page"
              className={`${shared} hover:scale-[1.04] active:scale-[0.97]`}
            >
              {content}
            </Link>
          ) : (
            <span
              key={item.label}
              aria-disabled="true"
              title={`${item.label} — coming soon`}
              className={`${shared} cursor-default blur-[0.75px] hover:blur-none`}
            >
              {content}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
