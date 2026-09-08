import { ProfileSidebar } from "@/components/ProfileSidebar";
import { WorksFeed } from "@/components/WorksFeed";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#F2F2F2] text-[#232323] selection:bg-[#232323] selection:text-[#F2F2F2] overflow-x-clip">
      {/* 1440px Canvas Container matching Figma Canvas 2 (90px left margin, 539px sidebar, 711px works feed, 100px right margin) */}
      <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row justify-center items-start lg:pl-[90px] lg:pr-[100px]">
        {/* Left Column (x=90px to x=629px, 539px wide) */}
        <ProfileSidebar />

        {/* Right Column (x=629px to x=1340px, 711px wide) */}
        <WorksFeed />
      </div>
    </div>
  );
}
