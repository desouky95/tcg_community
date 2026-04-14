import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { useTranslation } from "react-i18next";
import { PackOpening2D } from "./PackOpening2D";

export interface Pack {
  name: string;
  series: string;
  img: string;
  color?: string;
  canOpen?: boolean;
  cardImages?: string[];
}

interface PackGalleryProps {
  packs: Pack[];
}

export const PackGallery: React.FC<PackGalleryProps> = ({ packs }) => {
  // Triple the array for seamless infinity
  const duplicatedPacks = [...packs, ...packs, ...packs];
  const x = useMotionValue("0%");
  const controls = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { i18n } = useTranslation();
  const getRandom = () => {
    return Math.floor(Math.random() * packs.length);
  };
  const [random, setRandom] = useState(() => {
    return getRandom();
  });
  useEffect(() => {
    // -33.33% because we tripled the packs (total width is 300%, one set is 100%)
    const value = i18n.language === "ar" ? "33.333%" : "-33.333%";
    controls.current = animate(x, ["0%", value], {
      duration: 30,
      repeat: Infinity,
      ease: "linear",
    });

    return () => controls.current?.stop();
  }, [x, i18n]);

  useEffect(() => {
    if (isHovered) {
      controls.current?.pause();
    } else {
      controls.current?.play();
    }
  }, [isHovered]);

  return (
    <div
      className="relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-20 pointer-events-none" />

      <motion.div className="flex gap-8 px-4 w-max" style={{ x }}>
        {duplicatedPacks.map((pack, i) => (
          <div key={i} className="shrink-0 py-10 perspective-1000">
            <TiltCard pack={pack}>
              {packs[random].name === pack.name &&
                pack.canOpen &&
                pack.cardImages?.length && (
                  <PackOpening2D
                    onReset={() => {
                      setRandom(getRandom());
                    }}
                    cardImages={pack.cardImages}
                    packImage={pack.img}
                  />
                )}
            </TiltCard>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
