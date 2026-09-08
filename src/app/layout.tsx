import type { Metadata } from "next";
import { mogra, duplet, momoSignature } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sajidur's Portfolio",
  description: "Product & Experience Designer at TechSfera, based in Bangladesh.",
  icons: {
    icon: [
      { url: "/icon.png?v=2", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "any" },
    ],
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mogra.variable} ${duplet.variable} ${momoSignature.variable} antialiased`}
    >
      <body className="bg-canvas text-primary font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
