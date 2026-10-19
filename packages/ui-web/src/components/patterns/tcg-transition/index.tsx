"use client";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import {
  motionTokens,
  type MotionRowCustom,
  type PageTransitionVariants,
} from "../../next/page-animate-presence/contract";

type TCGProps = {
  images: string[];
  rows?: number;
};

const parentVariants: PageTransitionVariants = {
  above: {
    opacity: 0,
    transition: { duration: 0, staggerChildren: 0 },
  },
  covered: ({ reducedMotion, rowIndex }: MotionRowCustom) => {
    const delay = reducedMotion ? 0 : rowIndex * motionTokens.stagger.row;
    return {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        duration: reducedMotion ? 0 : motionTokens.duration.slow,
        delay,
        delayChildren: delay,
        staggerChildren: reducedMotion ? 0 : motionTokens.stagger.image,
        staggerDirection: 1,
        ease: motionTokens.easing.smooth,
      },
    };
  },
  below: ({ reducedMotion, rowIndex }: MotionRowCustom) => {
    const delay = reducedMotion ? 0 : rowIndex * motionTokens.stagger.row;
    return {
      opacity: 1,
      transition: {
        when: "afterChildren",
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

const cardVariants: PageTransitionVariants = {
  above: {
    opacity: 0,
    rotateY: -45,
  },
  covered: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
  below: {
    rotateY: 45,
    opacity: [1, 0.5, 0],
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};
const TCG = ({ images, rows = 3 }: TCGProps) => {
  const reduceMotion = Boolean(useReducedMotion());

  const [ROWS] = useState(() => {
    const ROWS = Array.from({ length: rows }).map((_, offset) => ({
      images: Array.from({ length: 10 }, (_, index) => ({
        id: `${offset}-${index}`,
        src: `${images[(index + offset) % images.length]}`,
      })),
    }));
    return ROWS;
  });

  return (
    <div
      key={"row"}
      id="tcg-transition"
      className="flex absolute top-0 inset-s-0 z-999 flex-col perspective-distant transform-3d h-screen w-screen overflow-hidden pointer-events-none"
    >
      {ROWS.map(({ images }, rowIndex) => (
        <motion.div
          className={`flex w-full top-0 inset-s-0`}
          custom={{ rowIndex, reduceMotion }}
          key={rowIndex}
          variants={parentVariants}
        >
          {images.map(({ src, id }) => (
            <motion.div
              key={id}
              className="w-50 aspect-1/1.1 shrink-0"
              variants={cardVariants}
              custom={{ rowIndex, reduceMotion }}
            >
              <img src={src} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export { TCG };
