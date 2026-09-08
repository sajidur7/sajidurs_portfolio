import Image from "next/image";

interface ToolItem {
  id: string;
  label: string;
  icon: string;
  width: number;
  height: number;
}

const TOOLS: ToolItem[] = [
  { id: "figma", label: "Figma", icon: "/assets/tech-stack/figma.png", width: 24, height: 34 },
  { id: "framer", label: "Framer", icon: "/assets/tech-stack/framer.png", width: 24, height: 34 },
  { id: "cursor", label: "Cursor", icon: "/assets/tech-stack/nextjs.png", width: 32, height: 34 },
  { id: "vscode", label: "VS Code", icon: "/assets/tech-stack/vscode.png", width: 34, height: 34 },
  { id: "claude", label: "Claude", icon: "/assets/tech-stack/claude.png", width: 34, height: 34 },
  { id: "chatgpt", label: "ChatGPT", icon: "/assets/tech-stack/chatgpt.png", width: 34, height: 34 },
  { id: "jira", label: "Jira", icon: "/assets/tech-stack/cursor.png", width: 34, height: 34 },
  { id: "notion", label: "Notion", icon: "/assets/tech-stack/notion.png", width: 34, height: 34 },
  { id: "slack", label: "Slack", icon: "/assets/tech-stack/slack.png", width: 34, height: 34 },
];

export function TechStack() {
  return (
    <section id="tech-stack" className="mt-[100px]">
      {/* Section Header (Frame 22: y=1606, h=12, gap=8) */}
      <div className="flex items-center gap-[8px]">
        <Image
          src="/assets/section-glyph.svg"
          alt=""
          width={12}
          height={12}
          className="shrink-0 -translate-y-[2px]"
          aria-hidden="true"
        />
        <h2 className="font-display text-[15px] leading-[18px] text-primary font-normal">
          Tech Stack
        </h2>
      </div>

      {/* Divider Line (Line 8: y=1638, exactly 20px below header) */}
      <div className="mt-[20px] h-[1px] w-full bg-[#8D8D8D]/15" />

      {/* Tools Row (Frame 24: y=1668, h=34px, gap=30px) */}
      <div className="mt-[30px] flex items-center gap-[30px] overflow-visible pb-2 pt-1">
        {TOOLS.map((tool) => (
          <div
            key={tool.id}
            tabIndex={0}
            aria-label={tool.label}
            className="group relative shrink-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
            style={{ width: tool.width, height: tool.height }}
          >
            {/* Tooltip Pill on Hover (below icon, matching user screenshot) */}
            <div className="pointer-events-none absolute top-full mt-[12px] left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 transition-all duration-150 ease-out px-[16px] h-[36px] flex items-center justify-center rounded-[11px] bg-primary text-canvas font-sans text-[14px] leading-[18px] font-medium whitespace-nowrap shadow-md z-30">
              {tool.label}
            </div>

            <Image
              src={tool.icon}
              alt={tool.label}
              width={tool.width}
              height={tool.height}
              className="object-contain max-h-[34px] transition-transform duration-200 pointer-events-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
