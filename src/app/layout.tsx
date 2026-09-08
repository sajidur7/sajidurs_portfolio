import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

/**
 * The real Duplet, recovered from the previous portfolio repo. The design uses
 * Regular for body copy and Semibold for button and job labels; Bold is bundled
 * for headings that may want it later.
 */
const duplet = localFont({
  variable: "--font-duplet",
  display: "swap",
  src: [
    { path: "../fonts/Duplet-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Duplet-Semibold.otf", weight: "600", style: "normal" },
    { path: "../fonts/Duplet-Bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Sajidur Rahman — Product & Experience Designer",
  description:
    "Product designer at TechSfera, based in Bangladesh. Taking complicated problems, finding what really matters, and turning them into simple and clear experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${duplet.variable} h-full antialiased`}
    >
      <head>
        {/* Without this the reveal animation would leave the page blank if JS never runs. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
