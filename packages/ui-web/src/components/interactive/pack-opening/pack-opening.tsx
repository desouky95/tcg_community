"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { TiltCard } from "./tilt-card";

import { PackOpening2D } from "./pack-opening-2d";

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
  const getRandom = () => {
    return Math.floor(Math.random() * packs.length);
  };
  const [random, setRandom] = useState(() => {
    return getRandom();
  });
  useEffect(() => {
    // -33.33% because we tripled the packs (total width is 300%, one set is 100%)
    const value = "-33.333%";
    controls.current = animate(x, ["0%", value], {
      duration: 30,
      repeat: Infinity,
      ease: "linear",
    });

    return () => controls.current?.stop();
  }, [x]);

  useEffect(() => {
    if (isHovered) {
      controls.current?.pause();
    } else {
      controls.current?.play();
    }
  }, [isHovered]);

  return (
    <div
      className="wax-pack-gallery group"
      aria-label="Featured card packs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="wax-pack-fade wax-pack-fade-left" aria-hidden="true" />
      <div className="wax-pack-fade wax-pack-fade-right" aria-hidden="true" />

      <motion.div className="wax-pack-track" style={{ x }}>
        {duplicatedPacks.map((pack, i) => (
          <div key={i}>
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
