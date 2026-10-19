import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";

const images = [
  "https://ripped.topps.com/wp-content/uploads/2026/02/Arsenal-FC-202526-Team-Set-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/09/20-years-ma-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/09/chase-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/09/hobby-dropping-soon-1-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/02/Dropping-Soon-Manchester-United-202526-Team-Set-1-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/02/Topps-UEFA-Club-Competitions-Knockout-800x1100.webp",
  "https://images.topps.com/v3/assets/bltc7206971cb4b2bfc/blt5d9f40ed231d3b60/6aaabe4c14e384f5b94ea59c/T27MCT_MANCITY_GOLD_VAULT_CRF_2004_-_Sergio_Aguero.jpg",
  "https://images.topps.com/v3/assets/bltc7206971cb4b2bfc/blt1cf9e3512d6ed369/6ac3bdce4e42ee13847fd682/T27ACT_FOR_THE_BADGE_F_ARSENAL_CRF_1107_-_Arsene_Wenger.jpg",
  "https://cdn.sanity.io/images/hj34sz77/development/70c3ba72d07e771e9a3915677571f1ae761f07ea-875x1225.jpg?auto=format&fit=max&w=3840",
];

const ROW_CONFIG = [
  { offset: 0, zIndexClassName: "z-30" },
  { offset: 2, zIndexClassName: "z-20" },
  { offset: 4, zIndexClassName: "z-10" },
] as const;
const ROWS = ROW_CONFIG.map(({ offset, zIndexClassName }) => ({
  zIndexClassName,
  packs: Array.from({ length: 8 }, (_, index) => ({
    id: `${offset}-${index}`,
    src: `${images[(index + offset) % images.length]}`,
  })),
}));
const parentVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: (i: number) => ({
    opacity: 1,
    transition: {
      when: "beforeChildren",
      delayChildren: i * 0.1,
      delay: i * 0.2,
      staggerChildren: 0.06,
    },
  }),

  exit: (i: number) => ({
    opacity: 1,
    transition: {
      when: "afterChildren",
      delayChildren: i * 0.1,
      delay: i * 0.2,
      staggerChildren: 0.06,
    },
  }),
};
const containerVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
    },
  },
};
const cardVariants: Variants = {
  initial: {
    opacity: 0,
    rotateY: -90,
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
  exit: {
    rotateY: 90,
    opacity: [1, 0.5, 0],
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};
export default function Test() {
  const [animate, setAnimate] = useState(true);
  const [rows, setRows] = useState<string[]>();
  return (
    <AnimatePresence
      mode="wait"
      // initial={false}
      onExitComplete={() => console.log("EXIT")}
    >
      {animate && (
        <div
          key={"row"}
          // initial="initial"
          // exit="exit"
          // animate="animate"
          // onAnimationComplete={() => setAnimate(false)}
          // variants={parentVariants}
          className="flex flex-col perspective-distant transform-3d h-screen w-screen overflow-hidden"
        >
          {ROWS.map(({ zIndexClassName, packs }, i) => (
            <motion.div
              initial="initial"
              exit="exit"
              animate="animate"
              className={`flex ${zIndexClassName}`}
              custom={i}
              onAnimationComplete={() => {
                if (i === ROWS.length - 1) {
                  setAnimate(false);
                }
              }}
              transition={
                {
                  // delayChildren: (index) => index * (i + 1) * 0.1,
                }
              }
              variants={parentVariants}
            >
              {packs.map(({ src, id }) => (
                <motion.div
                  key={id}
                  className="w-50 aspect-1/1.1 shrink-0"
                  variants={cardVariants}
                >
                  <img src={src} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </motion.div>
          ))}
          {/* {ROWS[0].packs.map(({ src, id }) => (
            <motion.div
              key={id}
              className="w-50 aspect-1/2 shrink-0"
              variants={cardVariants}
            >
              <img src={src} className="w-full object-cover" />
            </motion.div>
          ))} */}
        </div>
      )}
    </AnimatePresence>
  );
}
