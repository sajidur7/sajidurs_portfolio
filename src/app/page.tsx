import { ProfileSidebar } from "@/components/ProfileSidebar";
import { WorksFeed } from "@/components/WorksFeed";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#F2F2F2] text-[#232323] selection:bg-[#232323] selection:text-[#F2F2F2] overflow-x-clip">
      {/* 1440px Canvas Container with 1100px framed layout (389px left column + 711px right column) */}
      <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row justify-center items-start">
        {/* Left Column (x=160px to x=549px, 389px wide) */}
        <ProfileSidebar />

        {/* Right Column (x=549px to x=1260px, 711px wide) */}
        <WorksFeed />
      </div>
    </div>
  );
}
