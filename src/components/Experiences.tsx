import React from "react";
import Image from "next/image";

interface ExperienceItem {
  id: string;
  company: string;
  period: string;
  description: string;
  icon: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "techsfera",
    company: "TechSfera",
    period: "Dec 2024 - Present",
    description:
      "Designing thoughtful digital products that make technology feel simple and intuitive.",
    icon: "/assets/experiences/techsfera.svg",
  },
  {
    id: "freelancer",
    company: "Freelancer",
    period: "Oct 2022 - Present",
    description:
      "Helping clients turn ideas into clear, user-focused digital experiences.",
    icon: "/assets/experiences/freelancer.svg",
  },
  {
    id: "biggorilla",
    company: "BigGorillaApps",
    period: "Aug 2021 - Mar 2022",
    description:
      "Creating data-informed interfaces focused on simple, seamless experiences.",
    icon: "/assets/experiences/biggorilla.svg",
  },
];

export function Experiences() {
  return (
    <section id="experiences" className="mt-[90px]">
      {/* Section Header (Frame 28: y=1219, h=12, gap=8) */}
      <div className="flex items-center gap-[8px]">
        <Image
          src="/assets/section-glyph.svg"
          alt=""
          width={12}
          height={12}
          className="shrink-0 -translate-y-[2px]"
          aria-hidden="true"
        />
        <h2 className="font-display text-[16px] leading-[19px] text-primary font-normal">
          Experiences
        </h2>
      </div>

      {/* Divider Line (Line 7: y=1251, w=906px, exactly 20px below 12px header) */}
      <div className="mt-[20px] h-[1px] w-full bg-[#8D8D8D]/15" />

      {/* Experiences List (Frame 23: y=1281, gap=30px, 30px below Line 7) */}
      <div className="mt-[30px] flex flex-col">
        {EXPERIENCES.map((item, index) => (
          <React.Fragment key={item.id}>
            {/* Experience Item Row (Frame 21 / 20 / 19: h=35px in Figma, items-center) */}
            <div className="flex items-center gap-[12px]">
              {/* Company Logo (34x34 with 100% radius) */}
              <div className="w-[34px] h-[34px] shrink-0 rounded-full overflow-hidden">
                <Image
                  src={item.icon}
                  alt={`${item.company} logo`}
                  width={34}
                  height={34}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* Info Frame (Frame 16: company name + date on row 1, description on row 2) */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                {/* Company Name & Period Row */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[16px] leading-[20px] font-semibold text-primary">
                    {item.company}
                  </span>
                  <span className="font-sans text-[14px] leading-[18px] font-normal text-subtle text-right">
                    {item.period}
                  </span>
                </div>

                {/* Description (font: Duplet 15px/20px #8D8D8D, tight 3px gap to title) */}
                <p className="font-sans text-[15px] leading-[20px] font-normal text-muted m-0 mt-[3px]">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Dashed Separator (Line 16 / Line 17: exactly 30px margin above and below) */}
            {index < EXPERIENCES.length - 1 && (
              <div
                className="w-full h-0 border-t border-dashed border-[#8D8D8D]/30 my-[30px]"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
