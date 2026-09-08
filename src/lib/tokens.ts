/**
 * Figma Design Tokens
 * Matched with pixel-perfect precision to Figma CSS export:
 * Canvas Frame: 1440px x 2119px, background: #F2F2F2
 */

export const COLORS = {
  canvas: "#F2F2F2",
  primary: "#232323",
  muted: "#8D8D8D",
  subtle: "#C0C0C0",
  line: "rgba(141, 141, 141, 0.15)",
  dashedLine: "rgba(141, 141, 141, 0.3)",
  accent: "#F84620",
  accentAlt: "#FF3B00",
  white: "#FFFFFF",
  whiteAlt: "#FEFEFE",
  // Brand accents from experiences
  freelancerGreen: "#1DBF73",
  bigGorillaRed: "#CD1632",
} as const;

export const TYPOGRAPHY = {
  fonts: {
    display: "var(--font-mogra), cursive",
    sans: "var(--font-duplet), sans-serif",
  },
  styles: {
    heroName: {
      fontFamily: "var(--font-mogra)",
      fontSize: "36px",
      fontWeight: 400,
      lineHeight: "36px",
      letterSpacing: "0.02em",
      textTransform: "capitalize" as const,
      color: "#232323",
    },
    sectionTitleWorksExp: {
      fontFamily: "var(--font-mogra)",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "19px",
      color: "#232323",
    },
    sectionTitleTechOutro: {
      fontFamily: "var(--font-mogra)",
      fontSize: "15px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#232323",
    },
    role: {
      fontFamily: "var(--font-duplet)",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "20px",
      color: "#232323",
    },
    bio: {
      fontFamily: "var(--font-duplet)",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "24px",
      color: "#8D8D8D",
    },
    meta: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#8D8D8D",
    },
    status: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#232323",
    },
    link: {
      fontFamily: "var(--font-duplet)",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "22px",
      color: "#8D8D8D",
    },
    navItem: {
      fontFamily: "var(--font-duplet)",
      fontSize: "15px",
      fontWeight: 400,
      lineHeight: "19px",
    },
    experienceCompany: {
      fontFamily: "var(--font-duplet)",
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "22px",
      color: "#232323",
    },
    experienceDate: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#C0C0C0",
    },
    experienceDesc: {
      fontFamily: "var(--font-duplet)",
      fontSize: "15px",
      fontWeight: 400,
      lineHeight: "22px",
      color: "#8D8D8D",
    },
    workCaption: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#C0C0C0",
    },
    pillButton: {
      fontFamily: "var(--font-duplet)",
      fontSize: "15px",
      fontWeight: 600,
      lineHeight: "22px",
      color: "#F2F2F2",
    },
    copyPrompt: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "22px",
      color: "#8D8D8D",
    },
    copyright: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "22px",
      color: "#232323",
    },
    socialLink: {
      fontFamily: "var(--font-duplet)",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "22px",
      textDecoration: "underline",
      color: "#232323",
    },
  },
} as const;

export const LAYOUT = {
  canvasWidth: 1440,
  canvasHeight: 2119,
  contentWidth: 906,
  contentOffsetDesktop: 267,
  navRail: {
    left: 30,
    top: 435,
    activeLineWidth: 40,
    inactiveLineWidth: 28,
    separatorTickWidth: 11,
    separatorTickHeight: 1,
    rowHeight: 12,
    gap: 8,
  },
  works: {
    tileWidth: 750,
    tileHeight: 601,
    imageHeight: 575,
    borderRadius: 24,
    gap: 33,
    dividerWidth: 880,
  },
  techsferaMark: {
    width: 34,
    height: 34,
    restingAngle: 15,
  },
  dinoField: {
    width: 906,
    height: 52,
  },
} as const;
