import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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
  /*
    Social previews need absolute URLs. Using the canonical www.sajidur.space
    avoids 301 redirects that break scrapers on WhatsApp, Twitter, and LinkedIn.
  */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "https://www.sajidur.space"
  ),
  title: "Sajidur Rahman — Product & Experience Designer",
  description:
    "Product designer at TechSfera, based in Bangladesh. Taking complicated problems, finding what really matters, and turning them into simple and clear experiences.",
  openGraph: {
    title: "Sajidur Rahman — Product & Experience Designer",
    description:
      "Product designer at TechSfera, based in Bangladesh. Taking complicated problems, finding what really matters, and turning them into simple and clear experiences.",
    url: "https://www.sajidur.space",
    siteName: "Sajidur Rahman Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sajidur Rahman — Product & Experience Designer",
    description:
      "Product designer at TechSfera, based in Bangladesh. Taking complicated problems, finding what really matters, and turning them into simple and clear experiences.",
    creator: "@incognitoshimul",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
      suppressHydrationWarning because the theme script sets data-theme on this
      element before React hydrates; the attribute is deliberately expected to
      differ from what the server rendered.
    */
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${bricolage.variable} ${duplet.variable} h-full antialiased`}
    >
      <head>
        {/* Without this the reveal animation would leave the page blank if JS never runs. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">
        {/*
          Resolves the theme before hydration. Without it the page paints light
          and then snaps to dark for anyone who chose it. Stored choice wins;
          otherwise it follows the system.
        */}
        <Script id="theme" strategy="beforeInteractive">
          {`(function(){try{var s=localStorage.getItem('space:theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`}
        </Script>
        {children}
      </body>
    </html>
  );
}
