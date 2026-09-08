import { NavRail } from "@/components/NavRail";
import { Intro } from "@/components/Intro";
import { SelectedWorks } from "@/components/SelectedWorks";
import { Experiences } from "@/components/Experiences";
import { TechStack } from "@/components/TechStack";
import { Outro } from "@/components/Outro";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-canvas text-primary selection:bg-primary selection:text-canvas overflow-x-clip">
      {/* Fixed Left Navigation Rail (Desktop) */}
      <NavRail />

      {/* Main Centered Content Column (906px in Figma Frame 2) */}
      <main
        className="w-full mx-auto"
        style={{
          maxWidth: "var(--site-w)",
          paddingLeft: "var(--content-x)",
          paddingRight: "var(--content-x)",
        }}
      >
        <Intro />
        <SelectedWorks />
        <Experiences />
        <TechStack />
        <Outro />
        <Footer />
      </main>
    </div>
  );
}
