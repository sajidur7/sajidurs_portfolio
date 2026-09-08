"use client";

import React from "react";
import Image from "next/image";
import { LINKS } from "@/lib/config";

function DownloadArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0 translate-y-[1px]"
      aria-hidden="true"
    >
      <path
        d="M9 2.25V12.75"
        stroke="#FF622F"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8.25L9 12.75L13.5 8.25"
        stroke="#FF622F"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 15.75H14.25"
        stroke="#FF622F"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}



function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="LinkedIn"
    >
      <g clipPath="url(#clip0_2048_392)">
        <path
          d="M17.0392 17.0433H14.0775V12.4025C14.0775 11.2958 14.055 9.87167 12.5342 9.87167C10.99 9.87167 10.7542 11.0758 10.7542 12.3208V17.0433H7.7925V7.5H10.6375V8.80083H10.6758C11.0733 8.05083 12.04 7.25917 13.4842 7.25917C16.485 7.25917 17.04 9.23417 17.04 11.805L17.0392 17.0433ZM4.4475 6.19417C3.99083 6.19417 3.55333 6.01333 3.23083 5.69C2.90833 5.3675 2.7275 4.93 2.72833 4.47333C2.72917 3.52333 3.49917 2.75333 4.44917 2.75417C5.39917 2.755 6.16917 3.525 6.16833 4.475C6.1675 5.425 5.3975 6.195 4.4475 6.19417ZM5.9325 17.0433H2.9625V7.5H5.9325V17.0433ZM18.5208 0H1.47583C0.66 0 0 0.645 0 1.44083V18.5592C0 19.3558 0.66 20 1.47583 20H18.5183C19.3333 20 20 19.3558 20 18.5592V1.44083C20 0.645 19.3333 0 18.5183 0H18.5208Z"
          fill="#232323"
        />
      </g>
      <defs>
        <clipPath id="clip0_2048_392">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Dribbble"
    >
      <g clipPath="url(#clip0_2048_394)">
        <path
          d="M10 20C4.4875 20 0 15.5125 0 10C0 4.4875 4.4875 0 10 0C15.5125 0 20 4.4875 20 10C20 15.5125 15.5125 20 10 20ZM18.4333 11.3683C18.1417 11.2767 15.7917 10.5742 13.1133 11.0033C14.23 14.0733 14.6858 16.5733 14.7733 17.0933C16.7317 15.7717 18.0567 13.7 18.4358 11.3683H18.4333ZM13.3375 17.875C13.21 17.125 12.7125 14.515 11.5125 11.4L11.4575 11.4167C6.6325 13.0958 4.9075 16.4375 4.7575 16.75C6.2525 17.9225 8.09917 18.5583 9.99917 18.555C11.1825 18.555 12.3075 18.3133 13.3325 17.8767L13.3375 17.875ZM3.65417 15.725C3.8475 15.3917 6.19167 11.5125 10.5975 10.0875C10.71 10.05 10.8225 10.0175 10.935 9.9875C10.7183 9.5 10.485 9.015 10.2417 8.5375C5.975 9.8125 1.83833 9.75833 1.46333 9.75L1.46 10.01C1.46 12.2042 2.29167 14.2075 3.655 15.7225L3.65417 15.725ZM1.6375 8.2625C2.02083 8.26917 5.54 8.28417 9.535 7.2225C8.56917 5.52 7.51167 3.87083 6.36833 2.2825C3.94333 3.42417 2.19333 5.635 1.63833 8.2575L1.6375 8.2625ZM8 1.71C8.235 2.02667 9.7875 4.13833 11.185 6.71C14.2225 5.5725 15.51 3.84333 15.6625 3.625C14.1042 2.235 12.0883 1.4675 10 1.47C9.3125 1.47 8.64167 1.55333 8 1.7075V1.71ZM16.6125 4.6125C16.4308 4.85417 15 6.69 11.8425 7.97917C12.0425 8.3875 12.2342 8.8 12.4092 9.2175C12.4758 9.3675 12.5342 9.5175 12.5925 9.65917C15.4342 9.30083 18.2592 9.87583 18.5425 9.93417C18.5258 7.9175 17.8092 6.0675 16.6175 4.6175L16.6125 4.6125Z"
          fill="#232323"
        />
      </g>
      <defs>
        <clipPath id="clip0_2048_394">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="X (formerly Twitter)"
    >
      <g clipPath="url(#clip0_2048_396)">
        <path
          d="M15.7508 0H18.8175L12.1175 7.51909L20 17.7488H13.8283L8.995 11.5437L3.46333 17.7488H0.395L7.56167 9.70609L0 0.000818182H6.32833L10.6975 5.67245L15.7508 0ZM14.675 15.9472H16.3742L5.405 1.70755H3.58167L14.675 15.9472Z"
          fill="#232323"
        />
      </g>
      <defs>
        <clipPath id="clip0_2048_396">
          <rect width="20" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Instagram"
    >
      <g clipPath="url(#clip0_2048_398)">
        <path
          d="M5.85862 0.0707811C4.79445 0.120781 4.06778 0.290781 3.43362 0.539948C2.76612 0.792448 2.16278 1.18661 1.66362 1.69661C1.15612 2.19661 0.763615 2.80161 0.513615 3.46911C0.267782 4.10578 0.100282 4.83411 0.0536153 5.89745C0.00694868 6.96245 -0.00388465 7.30411 0.00111535 10.0191C0.00694868 12.7349 0.0186153 13.0749 0.070282 14.1416C0.121115 15.2058 0.290282 15.9324 0.539449 16.5674C0.796115 17.2249 1.13945 17.7816 1.69612 18.3366C2.19695 18.8441 2.80195 19.2366 3.47028 19.4866C4.10612 19.7324 4.83362 19.8999 5.89778 19.9466C6.96278 19.9933 7.30528 20.0041 10.0203 19.9991C12.7336 19.9933 13.0761 19.9816 14.1419 19.9308C15.2086 19.8808 15.9311 19.7099 16.5669 19.4616C17.2336 19.2091 17.8378 18.8141 18.3361 18.3049C18.8436 17.8041 19.2361 17.1991 19.4861 16.5308C19.7319 15.8949 19.8994 15.1674 19.9453 14.1041C19.9919 13.0374 20.0036 12.6958 19.9978 9.98078C19.9928 7.26661 19.9811 6.92578 19.9303 5.85911C19.8803 4.79245 19.7103 4.06911 19.4603 3.43328C19.2078 2.76661 18.8136 2.16328 18.3044 1.66411C17.8044 1.15578 17.1994 0.763281 16.5311 0.514114C15.8944 0.269114 15.1678 0.100781 14.1028 0.0557811C13.0386 0.00828106 12.6961 -0.00421894 9.98112 0.000781063C7.26528 0.00744773 6.92528 0.0182811 5.85862 0.0707811ZM5.97528 18.1474C5.00028 18.1058 4.47112 17.9433 4.11862 17.8074C3.68445 17.6474 3.29028 17.3924 2.96695 17.0616C2.63362 16.7399 2.37778 16.3474 2.21695 15.9133C2.07945 15.5608 1.91445 15.0316 1.86945 14.0566C1.81945 13.0033 1.80945 12.6866 1.80278 10.0166C1.79778 7.34745 1.80778 7.03161 1.85362 5.97745C1.89528 5.00328 2.05862 4.47328 2.19362 4.12078C2.37362 3.65328 2.59112 3.32078 2.93945 2.96911C3.26112 2.63578 3.65445 2.37995 4.08862 2.21911C4.44112 2.08161 4.96945 1.91828 5.94445 1.87161C6.99862 1.82161 7.31445 1.81161 9.98445 1.80495C12.6528 1.79995 12.9694 1.80995 14.0253 1.85661C14.9986 1.89828 15.5286 2.05995 15.8811 2.19661C16.3478 2.37661 16.6811 2.59245 17.0328 2.94245C17.3836 3.29245 17.6003 3.62328 17.7828 4.09078C17.9203 4.44245 18.0844 4.97078 18.1303 5.94661C18.1803 7.00078 18.1919 7.31745 18.1969 9.98578C18.2011 12.6549 18.1919 12.9716 18.1461 14.0258C18.1036 15.0008 17.9419 15.5299 17.8061 15.8841C17.6261 16.3508 17.4086 16.6841 17.0594 17.0341C16.7378 17.3666 16.3453 17.6233 15.9111 17.7841C15.5594 17.9216 15.0294 18.0858 14.0561 18.1324C13.0011 18.1824 12.6853 18.1924 10.0153 18.1983C7.34528 18.2041 7.03028 18.1924 5.97528 18.1474ZM14.1269 4.65578C14.1278 5.14078 14.4211 5.57828 14.8694 5.76328C15.3186 5.94828 15.8344 5.84495 16.1769 5.50078C16.5194 5.15745 16.6211 4.64078 16.4344 4.19245C16.2478 3.74495 15.8103 3.45328 15.3244 3.45411C14.6619 3.45578 14.1261 3.99328 14.1269 4.65578ZM4.86612 10.0099C4.87195 12.8458 7.17445 15.1399 10.0103 15.1349C12.8461 15.1291 15.1403 12.8258 15.1344 9.98995C15.0936 7.17995 12.8011 4.92495 9.99028 4.92995C7.18028 4.93578 4.89612 7.19995 4.86612 10.0099ZM6.66695 10.0066C6.66278 8.16578 8.15278 6.67078 9.99361 6.66745C11.8344 6.66328 13.3294 8.15245 13.3328 9.99328C13.3369 11.8341 11.8478 13.3299 10.0069 13.3333C9.12278 13.3349 8.27445 12.9858 7.64778 12.3616C7.02112 11.7383 6.66862 10.8908 6.66695 10.0066Z"
          fill="#232323"
        />
      </g>
      <defs>
        <clipPath id="clip0_2048_398">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function EllipseIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 animate-pulse"
      aria-hidden="true"
    >
      <path
        d="M10 5C10 6.19052 9.57521 7.34197 8.80203 8.24724C8.02885 9.15252 6.95803 9.7522 5.78217 9.93844C4.60631 10.1247 3.40259 9.88524 2.38751 9.2632C1.37243 8.64116 0.612607 7.67733 0.244717 6.54509C-0.123172 5.41284 -0.0749883 4.18648 0.380602 3.08658C0.836193 1.98669 1.66929 1.08545 2.73005 0.544968C3.7908 0.00448468 5.0096 -0.13977 6.16723 0.13815C7.32485 0.416071 8.34532 1.09793 9.04508 2.06107L5 5H10Z"
        fill="#FF3B00"
      />
    </svg>
  );
}

export function ProfileSidebar() {
  return (
    <aside className="w-full lg:w-[539px] shrink-0 border-r border-[#E8E8E8] border-l lg:border-l border-[#E8E8E8] flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen lg:min-h-[1024px] select-text">
      {/* Top Section */}
      <div className="pt-[30px] px-[20px]">
        {/* Profile Avatar (70x70px, circular, black bg) */}
        <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden bg-[#000000] shadow-xs">
          <Image
            src="/assets/avatar.png?v=4"
            alt="Sajidur Rahman"
            width={70}
            height={70}
            priority
            unoptimized
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Name: Momo Signature Font, 30px */}
        <h1 className="mt-[24px] font-signature text-[30px] leading-[1.1] tracking-[0.02em] capitalize text-[#232323] font-normal">
          Sajidur Rahman
        </h1>

        {/* Role: Duplet, 15px/19px */}
        <p className="mt-[14px] font-sans text-[15px] leading-[19px] text-[#232323] font-normal">
          Product &amp; Experience Designer
        </p>

        {/* Bio Paragraph: Duplet, 15px/24px, #8D8D8D, max-w-[499px] */}
        <p className="mt-[21px] max-w-[499px] font-sans text-[15px] leading-[24px] text-[#8D8D8D] font-normal">
          Hey, I’m Sajidur, a product designer at TechSfera, based in Bangladesh.
          <br />
          I like taking complicated problems, finding what really matters,
          <br />
          and turning them into simple, clear, and easy-to-use digital experiences.
        </p>

        {/* Actions Link: Duplet 15px/22px */}
        <p className="mt-[24px] font-sans text-[15px] leading-[22px] text-[#8D8D8D] font-normal">
          Drop me an{" "}
          <a
            href={`mailto:${LINKS.EMAIL}`}
            className="text-[#232323] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            email me
          </a>
          , or{" "}
          <a
            href={LINKS.CV}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#232323] underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-[4px]"
          >
            <span>download my CV</span>
            <DownloadArrowIcon />
          </a>
        </p>
      </div>

      {/* Bottom Section (Experiences + Divider + Socials & Open to Work) */}
      <div className="mt-[40px] lg:mt-0 flex flex-col">
        {/* Experiences Frame (Frame 342: gap 20px, dashed line separator) */}
        <div className="px-[20px] flex flex-col">
          {/* Experience 1: TechSfera */}
          <div className="flex items-center gap-[10px] w-full">
            {/* TechSfera Logo (34x34 circle #F84620 with burst icon) */}
            <div className="w-[34px] h-[34px] shrink-0 rounded-full overflow-hidden">
              <Image
                src="/assets/experiences/techsfera.svg"
                alt="TechSfera"
                width={34}
                height={34}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#232323]">
                  TechSfera
                </span>
                <span className="font-sans text-[13px] leading-[17px] font-normal text-[#C0C0C0] text-right shrink-0">
                  Dec 2024 - Present
                </span>
              </div>
              <p className="font-sans text-[14px] leading-[20px] text-[#8D8D8D] font-normal m-0">
                Product Designer
              </p>
            </div>
          </div>

          {/* Dashed Separator Line across full 389px (negative margin to span border-to-border) */}
          <div className="-mx-[20px] my-[16px] border-t border-dashed border-[#E8E8E8]" />

          {/* Experience 2: BigGorillaApps */}
          <div className="flex items-center gap-[10px] w-full">
            {/* BigGorillaApps Logo (34x34 circle #CD1632 with gorilla icon) */}
            <div className="w-[34px] h-[34px] shrink-0 rounded-full overflow-hidden">
              <Image
                src="/assets/experiences/biggorilla.svg"
                alt="BigGorillaApps"
                width={34}
                height={34}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#232323]">
                  BigGorillaApps
                </span>
                <span className="font-sans text-[13px] leading-[17px] font-normal text-[#C0C0C0] text-right shrink-0">
                  Aug 2021 - Mar 2022
                </span>
              </div>
              <p className="font-sans text-[14px] leading-[20px] text-[#8D8D8D] font-normal m-0">
                UI Designer
              </p>
            </div>
          </div>
        </div>

        {/* Solid Line 20 (Divider line before footer bar) */}
        <div className="w-full h-[1px] bg-[#E8E8E8] mt-[24px]" />

        {/* Footer Bar: Socials (Frame 337) & Open to Work (Frame 6) */}
        <div className="px-[20px] py-[22px] flex items-center justify-between text-[#232323]">
          {/* Social Icons (Frame 337: 20x20px SVG icons with 20px gap) */}
          <div className="flex items-center gap-[20px]">
            <a
              href={LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="w-[20px] h-[20px] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            >
              <LinkedInIcon />
            </a>
            <a
              href={LINKS.DRIBBBLE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dribbble profile"
              className="w-[20px] h-[20px] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            >
              <DribbbleIcon />
            </a>
            <a
              href={LINKS.X}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) profile"
              className="w-[20px] h-[20px] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            >
              <XIcon />
            </a>
            <a
              href={LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profile"
              className="w-[20px] h-[20px] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            >
              <InstagramIcon />
            </a>
          </div>

          {/* Open to Work Badge: exact 10x10px ellipse SVG with 6px gap */}
          <div className="flex items-center gap-[6px] shrink-0 cursor-default">
            <EllipseIcon />
            <span className="font-sans text-[14px] leading-[18px] text-[#232323] font-normal">
              Open to Work
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
