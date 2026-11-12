"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
type RowCustom = {
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
const ROW_CONFIG = [
  { offset: 0, zIndexClassName: "z-30" },
  { offset: 2, zIndexClassName: "z-20" },
  { offset: 4, zIndexClassName: "z-10" },
] as const;
const PACKS = [
  "cwc_2025.jpg",
  "football_78.jpg",
  "sonic_panini.png",
  "topps_pl_2026.jpg",
  "ucl_24_25.jpg",
  "world_cup_2006.jpg",
  "spiderman.jpg",
  "toy_story.jpg",
  "efl_2026.jpg",
  "fifa_365_2026.jpg",
  "stitch.jpg",
] as const;

const ROWS = ROW_CONFIG.map(({ offset, zIndexClassName }) => ({
  zIndexClassName,
  packs: Array.from({ length: 12 }, (_, index) => ({
    id: `${offset}-${index}`,
    src: `/images/packs/${PACKS[(index + offset) % PACKS.length]}`,
  })),
}));

const ROW_COUNT = ROWS.length;

const rowVariants: Variants = {
  // All rows reset to the same position above the viewport.
  above: {
    y: "-100%",
    opacity: 1,
    transition: { duration: 0, staggerChildren: 0 },
  },

  // Each row occupies its indexed third of the viewport.
  covered: ({ reducedMotion, rowIndex }: RowCustom) => {
    const delay = reducedMotion ? 0 : rowIndex * motionTokens.stagger.row;
    return {
      y: `${rowIndex * 100}%`,
      opacity: 1,
      // transition: getTransition(custom) as Transition,
      transition: {
        duration: reducedMotion ? 0 : motionTokens.duration.slow,
        delay,
        delayChildren: delay,
        staggerChildren: reducedMotion ? 0 : motionTokens.stagger.image,
        staggerDirection: 1,
        ease: motionTokens.easing.smooth,
      },
    };
  },

  // All rows leave through the bottom.
  below: ({ rowIndex, reducedMotion }: RowCustom) => {
    const delay = reducedMotion ? 0 : rowIndex * motionTokens.stagger.row;

    return {
      y: `${ROW_COUNT * 100}%`,
      transition: {
        duration: reducedMotion ? 0 : motionTokens.duration.slow,
        delay,
        delayChildren: delay,
        staggerChildren: reducedMotion ? 0 : motionTokens.stagger.image,
        staggerDirection: 1,
        ease: motionTokens.easing.smooth,
      },
    };
  },
};
const imageVariants: Variants = {
  above: ({ reducedMotion }: RowCustom) => ({
    y: reducedMotion ? "0%" : "-100%",
    transition: { duration: 0 },
  }),
  covered: ({ reducedMotion }: RowCustom) => ({
    y: "0%",
    transition: {
      duration: reducedMotion ? 0 : motionTokens.duration.normal,
      ease: motionTokens.easing.smooth,
    },
  }),
  below: ({ reducedMotion }: RowCustom) => ({
    y: reducedMotion ? "0%" : "100%",
    transition: {
      duration: reducedMotion ? 0 : motionTokens.duration.normal,
      ease: motionTokens.easing.smooth,
    },
  }),
};

type PageTransitionVariant = "sticker-packs" | "tcg-games";
type CardsProps = {
  images?: string[];
};
const Cards = ({ images }: CardsProps) => {
  const reducedMotion = Boolean(useReducedMotion());
  const _PACKS = !!images && images.length > 0 ? images : PACKS;
  const external = images?.length! > 0;
  const ROWS = ROW_CONFIG.map(({ offset, zIndexClassName }) => ({
    zIndexClassName,
    packs: Array.from({ length: 12 }, (_, index) => {
      const arrIndex = (index + offset) % PACKS.length;
      return {
        id: `${offset}-${index}`,
        src: external ? _PACKS[arrIndex] : `/images/packs/${_PACKS[arrIndex]}`,
      };
    }),
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-60 h-dvh w-full overflow-hidden"
    >
      {ROWS.map(({ packs, zIndexClassName }, rowIndex) => {
        return (
          <motion.div
            key={`pack-row-${rowIndex}`}
            custom={{ rowIndex, reducedMotion }}
            variants={rowVariants}
            className={`absolute inset-x-0 top-0 flex h-[calc((100dvh+2px)/3)] w-full justify-center overflow-hidden ${zIndexClassName}`}
          >
            {packs.map((pack, index) => (
              <motion.img
                key={pack.id}
                src={pack.src}
                custom={{ reducedMotion, rowIndex: index }}
                alt=""
                variants={imageVariants}
                draggable={false}
                className="h-full w-[max(8.333333%,calc(100dvh/4))] shrink-0 object-cover"
              />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

export { Cards };
