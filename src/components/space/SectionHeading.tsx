import { StatusDot } from "./StatusDot";

/**
 * The title + caption + dot row shared by Experiences (1:49), Tech Stack
 * (1:134) and the footer (1:152).
 */
export function SectionHeading({
  title,
  caption,
  as: Tag = "h2",
}: {
  title: string;
  caption: string;
  as?: "h2" | "p";
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <Tag
        className="text-trim whitespace-nowrap font-heading text-[16px] font-bold capitalize leading-none tracking-[0.32px] text-ink"
        style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
      >
        {title}
      </Tag>
      <div className="flex items-center gap-[6px]">
        {/* The caption is too long to share a line with the title on a phone;
            the dot stays either way. */}
        <p className="text-trim hidden whitespace-nowrap text-right font-body text-[14px] leading-normal text-faint sm:block">
          {caption}
        </p>
        <StatusDot />
      </div>
    </div>
  );
}
