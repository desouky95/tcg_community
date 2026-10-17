"use client";
import { Button, PageHeading } from "@tcg/ui-web";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useMedia } from "react-use";
const packs = [
  "cwc_2025.jpg",
  "football_78.jpg",
  "sonic_panini.png",
  "topps_pl_2026.jpg",
  "ucl_24_25.jpg",
  "world_cup_2006.jpg",
];
export default function UIPage() {
  const isDesktop = useMedia("(min-width: 1024px)");
  const generated_packs = useMemo(() => {
    return Array.from({ length: isDesktop ? 10 : 5 }, (_, i) => ({
      name: `Pack ${i + 1}`,
      img: `/images/packs/${packs[i % packs.length]}`,
    }));
  }, [isDesktop]);

  const generated_packs_2 = useMemo(() => {
    return Array.from({ length: isDesktop ? 10 : 5 }, (_, i) => ({
      name: `Pack ${i + 1}`,
      img: `/images/packs/${packs[i % packs.length]}`,
    }));
  }, [isDesktop]);
  return (
    <div className="p-2">
      <PageHeading title={"Button"}>Button</PageHeading>

      <div className="grid grid-cols-8 gap-1">
        <Button>Click Here</Button>
        <Button variant="ghost">Click Here</Button>
        <Button variant="outline">Click Here</Button>
        <Button tone="accent">Click Here</Button>
        <Button tone="danger">Click Here</Button>
        <Button tone="primary">Click Here</Button>
        <Button variant="outline" className="text-yellow-300">
          Click Here
        </Button>
      </div>
      <div className="h-screen w-screen fixed bg-red-300 top-0 left-0">
        <motion.div
          className="flex items-center"
          initial={{
            translateX: "100%",
          }}
          animate={{
            translateX: "-180%",
            opacity: 1,
            transition: {
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          {generated_packs.map((pack) => (
            <div key={pack.name} className="min-w-60">
              <img src={pack.img} />
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex items-center justify-end"
          initial={{
            translateX: "-140%",
          }}
          animate={{
            translateX: isDesktop ? "180%" : "140%",
            opacity: 1,
            transition: {
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          {generated_packs_2.map((pack) => (
            <div key={pack.name} className="min-w-60">
              <img src={pack.img} />
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{
            translateX: "100%",
          }}
          animate={{
            translateX: "-180%",
            opacity: 1,
            transition: {
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          {generated_packs.map((pack) => (
            <div key={pack.name} className="min-w-60">
              <img src={pack.img} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
