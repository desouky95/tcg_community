import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
        className="absolute h-96 w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#1A232D] shadow-2xl group"
      >
        <img
          src={displayCards[0].src}
          alt={displayCards[0].alt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0F14] via-transparent to-transparent opacity-70" />
        <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">archive / 001</div>
      </motion.div>

      {/* Card 2 (Center) */}
      <motion.div
        style={{ rotate: rotate2 }}
        className="absolute z-10 h-96 w-64 overflow-hidden rounded-2xl border border-primary-500/60 bg-transparent shadow-[0_24px_60px_-20px_rgba(242,107,58,0.55)]"
      >
        <img
          src={displayCards[1].src}
          alt={displayCards[1].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-500/5 mix-blend-overlay" />
        <div className="absolute left-4 top-4 rounded-sm border border-white/40 bg-[#0B0F14]/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white">featured</div>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        style={{ rotate: rotate3, x: x3 }}
        className="absolute h-96 w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#1A232D] shadow-2xl group"
      >
        <img
          src={displayCards[2].src}
          alt={displayCards[2].alt}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0B0F14] via-transparent to-transparent opacity-70" />
        <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">archive / 003</div>
      </motion.div>
    </div>
  );
};
