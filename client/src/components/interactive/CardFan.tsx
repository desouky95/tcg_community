import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card3D } from "./Card3D";

interface CardFanProps {
  cards?: { src: string; alt: string }[];
}

export const CardFan: React.FC<CardFanProps> = ({ cards }) => {
  const { scrollYProgress } = useScroll();
  const rotate1 = useTransform(scrollYProgress, [0, 0.2], [0, -15]);
  const rotate2 = useTransform(scrollYProgress, [0, 0.2], [0, 0]);
  const rotate3 = useTransform(scrollYProgress, [0, 0.2], [0, 15]);
  const x1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const x3 = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  // Default cards if none provided
  const displayCards = cards || [
    { src: "/images/landing/messi.jpg", alt: "Lionel Messi UCL Card" },
    {
      src: "/images/landing/ronaldinho.jpg",
      alt: "Ronaldinho Hall of Fame Card",
    },
    { src: "/images/landing/yamal.jpg", alt: "Lamine Yamal Fever Dream Card" },
  ];

  return (
    <div className="relative h-[500px] w-full flex items-center justify-center">
      {/* Card 1 */}
      <motion.div
        style={{ rotate: rotate1, x: x1 }}
        className="absolute w-64 h-96 bg-zinc-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden group"
      >
        <img
          src={displayCards[0].src}
          alt={displayCards[0].alt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
      </motion.div>

      {/* Card 2 (Center) */}
      <motion.div
        style={{ rotate: rotate2 }}
        className="absolute w-64 h-96 bg-transparent rounded-3xl border-0 border-primary-500 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] z-10 overflow-hidden"
      >
        <img
          src={displayCards[1].src}
          alt={displayCards[1].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-500/5 mix-blend-overlay" />
      </motion.div>

      {/* Card 3 */}
      <motion.div
        style={{ rotate: rotate3, x: x3 }}
        className="absolute w-64 h-96 bg-zinc-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden group"
      >
        <img
          src={displayCards[2].src}
          alt={displayCards[2].alt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
      </motion.div>
    </div>
  );
};
