export const tcgDesignTokens = {
  colors: {
    paper: "#f6f0e6",
    ink: "#102d4d",
    navy: "#17385e",
    red: "#c83430",
    gold: "#efbd35",
    blue: "#3c8bbd",
  },
  fonts: {
    brand: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    display: '"Roboto Condensed", ui-sans-serif, system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
  motion: {
    fast: "160ms",
    standard: "240ms",
    reducedMotionQuery: "prefers-reduced-motion: reduce",
  },
} as const;

export type TcgDesignTokens = typeof tcgDesignTokens;
