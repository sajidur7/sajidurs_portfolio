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
          window (20 clearance + 50 tall), so 100 leaves the footer 30px
          clear of it once the page is scrolled out. */}
      <main className="min-h-screen w-full bg-canvas pb-[100px] sm:pb-[150px]">
        <div className="mx-auto w-full max-w-[670px] px-[20px] sm:px-[28px] lg:px-0">
          <TopBar />
          <Hero />
          <Showcase />
          <Experiences />
          <TechStack />
          <SiteFooter />
        </div>
      </main>

      {/* Every metric and the reason for each mask longhand live with the
          class in globals.css. */}
      <div aria-hidden className="bottom-scrim" />

      <SpaceNav />

      {/* Interaction layer: custom pointer + click spark, and the click tones. */}
      <CustomCursor />
      <SoundEffects />
    </BookingProvider>
  );
}
