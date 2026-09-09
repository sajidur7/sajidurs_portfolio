import { BookingProvider } from "@/components/space/BookingProvider";
import { CustomCursor } from "@/components/space/CustomCursor";
import { Experiences } from "@/components/space/Experiences";
import { Hero } from "@/components/space/Hero";
import { Showcase } from "@/components/space/Showcase";
import { SiteFooter } from "@/components/space/SiteFooter";
import { SoundEffects } from "@/components/space/SoundEffects";
import { SpaceNav } from "@/components/space/SpaceNav";
import { TechStack } from "@/components/space/TechStack";
import { TopBar } from "@/components/space/TopBar";

/**
 * "Sajidur's Space" — Figma node 1:28 / 7:191.
 *
 * The design is a 1440 frame with every layer pinned to it, but all of its
 * content lives in a single 670px column centred on that frame. So the page is
 * built as that column instead of as a fixed canvas: at 670px and above every
 * element lands on its exact Figma coordinate, and below that the column simply
 * narrows.
 *
 * Vertical rhythm is carried by margins on each section, tuned so the desktop
 * result reproduces the frame's y-positions.
 *
 * The scrim and the nav sit outside the column because they are pinned to the
 * viewport rather than to the layout — they span the full window at any size,
 * and the page scrolls underneath them.
 */
export default function Home() {
  return (
    <BookingProvider>
      {/* On a phone the nav's top edge sits 70px off the bottom of the
          window (20 clearance + 50 tall), so 90 leaves the footer 20px
          clear of it once the page is scrolled out. */}
      <main className="min-h-screen w-full bg-canvas pb-[90px] sm:pb-[150px]">
        <div className="mx-auto w-full max-w-[670px] px-[20px] sm:px-[28px] lg:px-0">
          <TopBar />
          <Hero />
          <Showcase />
          <Experiences />
          <TechStack />
          <SiteFooter />
        </div>
      </main>

      {/*
        Node 7:212 — full-bleed scrim locked to the bottom of the window. The
        mask ramps the blur and the tint in from nothing at the top edge to full
        strength at the bottom, so content resolves out of the haze as it
        scrolls up rather than crossing a hard line.

        Its height is the nav's clearance twice over plus the nav itself —
        30 + 50 + 30 on a desktop, 20 + 50 + 20 on a phone — so the pill sits
        centred in the haze with equal air above and below. Change the nav's
        height and this has to follow, or the top gap drifts.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 z-40 h-[90px] w-full sm:h-[110px] bg-[linear-gradient(to_bottom,transparent,var(--scrim))] backdrop-blur-[3.5px] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_70%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_70%)]"
      />

      <SpaceNav />

      {/* Interaction layer: custom pointer + click spark, and the click tones. */}
      <CustomCursor />
      <SoundEffects />
    </BookingProvider>
  );
}
