import type { Metadata } from "next";
import { mogra, duplet } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sajidur's Portfolio",
  description: "Product & Experience Designer at TechSfera, based in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mogra.variable} ${duplet.variable} antialiased`}
    >
      <body className="bg-canvas text-primary font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
