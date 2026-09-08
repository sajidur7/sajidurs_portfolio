import localFont from "next/font/local";

export const mogra = localFont({
  src: "../fonts/Mogra-Regular.ttf",
  variable: "--font-mogra",
  display: "swap",
});

export const duplet = localFont({
  src: [
    {
      path: "../fonts/Duplet-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Duplet-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Duplet-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-duplet",
  display: "swap",
});
