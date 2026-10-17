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
  packs: Array.from({ length: 10 }, (_, index) => ({
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
  type?: PageTransitionVariant;
};
const Cards = ({ type = "sticker-packs" }: CardsProps) => {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none h-screen w-screen fixed inset-0 z-60 "
    >
      {/* <motion.div
        className="bg-white absolute top-1/2 left-1/2 -translate-1/2 z-60 p-4"
        initial={{
          opacity: 0,
          translateY: "-40%",
        }}
        animate={{
          opacity: 0,
          translateY: "-40%",
        }}
        exit={{
          opacity: 1,
          translateY: '10%',

        }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <motion.h1 className="text-6xl font-bold font-roboto">
          TCG NEXUS
        </motion.h1>
      </motion.div> */}
      {ROWS.map(({ packs, zIndexClassName }, rowIndex) => {
        return (
          <motion.div
            key={`pack-row-${rowIndex}`}
            custom={{ rowIndex, reducedMotion }}
            variants={rowVariants}
            className={`absolute inset-x-0 top-0 flex h-[calc(100dvh/3)] w-max min-w-full justify-center will-change-transform ${zIndexClassName}`}
          >
            {packs.map((pack, index) => (
              <motion.img
                key={pack.id}
                src={pack.src}
                custom={{ reducedMotion, rowIndex: index }}
                alt=""
                variants={imageVariants}
                draggable={false}
                className="h-full w-55 shrink-0 object-cover"
              />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

export { Cards };
