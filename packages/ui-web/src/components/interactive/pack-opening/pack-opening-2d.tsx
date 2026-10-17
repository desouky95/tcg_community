import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PackOpening2DProps {
  packImage: string;
  cardImages: string[];
  className?: string;
  rounded?: boolean;
  holoImage?: string;
  onReset?: () => void;
  withShimmer?: boolean;
}

export const PackOpening2D: React.FC<PackOpening2DProps> = ({
  packImage,
  cardImages,
  className = "",
  rounded,
  holoImage,
  withShimmer = true,
  onReset,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const getRandom = () => {
    const shuffled = [...cardImages].sort(() => 0.5 - Math.random());
    const [item1, item2] = shuffled.slice(0, 2);
    return [item1, item2];
  };
  const [random, setRandom] = useState(() => {
    return getRandom();
  });
  const selectedCard = random;

  const handleRip = () => {
    if (!isOpened) setIsOpened(true);
  };

  const handleReset = () => {
    setRandom(getRandom());
    setIsOpened(false);
    onReset?.();
  };
  // Improved calculation for stickers/cards reveal
  const getCardPosition = (index: number, total: number) => {
    if (total === 1) return { rotation: 0, x: 0, y: -40 };
    const mid = (total - 1) / 2;
    const diff = index - mid;

    // Spread logic: adjust rotation and X based on card count
    const rotation = diff * (25 / Math.max(1, total - 1));
    const xSpread = Math.min(280, total * 50);
    const x = diff * (xSpread / Math.max(1, total - 1));
    const y = -60 + Math.abs(diff) * 15; // Subtle arc upward

    return { rotation, x, y };
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none perspective-2000 ${className}`}
      style={{ transform: "translateZ(100px)", transformStyle: "preserve-3d" }}
      onClick={() => {
        if (isOpened) handleReset();
      }}
    >
      {/* Revealed Stickers/Cards Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence onExitComplete={handleReset}>
          {isOpened &&
            selectedCard.map((image, i) => {
              const { rotation, x, y } = getCardPosition(
                i,
                selectedCard.length,
              );
              return (
                <motion.div
                  key={`${image}-${i}`}
                  initial={{ scale: 0.6, opacity: 0, y: 0, x: 0, rotate: 0 }}
                  animate={{
                    x,
                    y,
                    rotate: rotation,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 0.3 + i * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    },
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`absolute w-36 h-48 ${rounded ? "rounded-lg" : "rounded-none"} border border-white/30 shadow-2xl overflow-hidden bg-zinc-800 group cursor-pointer hover:z-50 hover:scale-110 transition-transform ring-1 ring-white/10`}
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: "translateZ(50px)", // Lift individual stickers
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none" />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Foil Overlay */}
      {withShimmer && (
        <motion.div
          animate={{
            opacity: isOpened ? 0 : 1,
          }}
          className="absolute inset-0 z-10 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)",
            backgroundSize: "250% 250%",
            animation: "shimmer 3s infinite linear",
          }}
        />
      )}

      {/* The Pack */}
      <motion.div
        onClick={handleRip}
        className="relative w-full h-full cursor-pointer group drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
        whileHover={!isOpened ? { scale: 1.02, rotate: 0.5 } : {}}
      >
        {/* Silver Foil Interior */}
        {!isOpened && (
          <div className="absolute inset-[2%] z-0 rounded-sm bg-neutral-300 overflow-hidden opacity-50">
            <div className="absolute inset-0 bg-linear-to-br from-neutral-200 via-neutral-400 to-neutral-200 animate-pulse-slow" />
          </div>
        )}

        <motion.div
          animate={{ opacity: isOpened ? 0 : 1 }}
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)",
            backgroundSize: "250% 250%",
            animation: "shimmer 6s infinite linear",
          }}
        />

        {/* Top Strip Piece */}
        <motion.div
          animate={
            isOpened
              ? {
                  y: -100,
                  x: 100,
                  rotate: -30,
                  opacity: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                }
              : {
                  y: 0,
                  x: 0,
                  rotate: 0,
                  opacity: 1,
                  transition: { duration: 0.4, ease: "easeInOut" },
                }
          }
          className="absolute inset-0 z-30"
          style={{
            backgroundImage: `url(${packImage})`,
            backgroundSize: "cover",
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 15%, 95% 18%, 90% 15%, 85% 19%, 80% 16%, 75% 20%, 70% 17%, 65% 21%, 60% 18%, 55% 22%, 50% 19%, 45% 23%, 40% 20%, 35% 24%, 30% 21%, 25% 25%, 20% 22%, 15% 26%, 10% 23%, 5% 27%, 0% 24%)",
          }}
        >
          {holoImage && (
            <div
              className="absolute h-full w-full bg-amber-200"
              style={{
                backgroundImage: `url(${holoImage})`,
                backgroundSize: "cover",
                backdropFilter: "brightness(1) contrast(1)",
                mixBlendMode: "color-dodge",
                backgroundBlendMode: "multiply",
              }}
            />
          )}
        </motion.div>

        {/* Main Pack Body */}
        <motion.div
          className="absolute inset-0 z-20"
          animate={
            isOpened
              ? {
                  y: 20,
                  scale: 0.95,
                  opacity: 0,
                  transition: { duration: 0.5 },
                }
              : { y: 0, scale: 1, opacity: 1 }
          }
          style={{
            backgroundImage: `url(${packImage})`,
            backgroundSize: "cover",
            clipPath:
              "polygon(0% 24%, 5% 27%, 10% 23%, 15% 26%, 20% 22%, 25% 25%, 30% 21%, 35% 24%, 40% 20%, 45% 23%, 50% 19%, 55% 22%, 60% 18%, 65% 21%, 70% 17%, 75% 20%, 80% 16%, 85% 19%, 90% 15%, 95% 18%, 100% 15%, 100% 100%, 0% 100%)",
          }}
        >
          {holoImage && (
            <div
              className="absolute h-full w-full bg-amber-200"
              style={{
                backgroundImage: `url(${holoImage})`,
                backgroundSize: "cover",
                backdropFilter: "brightness(1) contrast(1)",
                mixBlendMode: "color-dodge",
                backgroundBlendMode: "multiply",
              }}
            />
          )}
        </motion.div>

        {/* Embossed Crimped Edges (Visual Flourish) */}
        <div className="absolute inset-x-0 top-0 h-[5%] z-40 bg-black/10 backdrop-blur-[1px] border-b border-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-[5%] z-40 bg-black/10 backdrop-blur-[1px] border-t border-white/10" />
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        .perspective-2000 { perspective: 2000px; }
      `,
        }}
      />
    </div>
  );
};
