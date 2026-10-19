import type { Variants } from "motion/react";

export type PageTransitionState = "above" | "covered" | "below";

export type PageTransitionVariants = Record<
  PageTransitionState,
  Variants[string]
>;


export type MotionRowCustom = {
  rowIndex: number;
  reducedMotion: boolean;
};

export const motionTokens = {
  duration: {
    normal: 0.35,
    slow: 0.8,
  },
  easing: {
    smooth: [0.65, 0, 0.35, 1] as const,
  },
  stagger: {
    row: 0.12,
    image: 0.06,
  },
} as const;