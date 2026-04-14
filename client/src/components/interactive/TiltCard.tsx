import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  pack: {
    img: string;
    name: string;
    series: string;
  };
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  pack,
  onClick,
  className = "",
  children,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative  w-[300px] aspect-[1/1.2] rounded-none bg-zinc-900 border border-white/10 overflow-hidden cursor-pointer group/pack shadow-2xl ${className}`}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className={`absolute inset-4 rounded-none bg-zinc-800 shadow-lg border border-white/5`}
      >
        {children}
        {!children && (
          <img
            src={pack.img}
            alt={pack.name}
            className="w-full h-full object-cover group-hover/pack:scale-100 transition-transform duration-700"
          />
        )}
        <div
          style={{ transform: "translateZ(150px)" }}
          className="absolute test w-[110%] h-[110%] top-1/2 left-1/2 -translate-1/2 inset-x-0 bottom-0  p-8 bg-linear-to-t from-black via-black/40 to-transparent flex flex-col justify-end h-1/2 opacity-0 group-hover/pack:opacity-100 transition-opacity duration-300 pointer-events-none"
        >
          <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-2">
            {pack.series}
          </p>
          <h3 className="text-2xl font-black text-white leading-tight">
            {pack.name}
          </h3>
        </div>
      </div>

      {/* Glowing Reflection Overlay */}
      <motion.div
        style={{ transform: "translateZ(100px)" }}
        className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover/pack:opacity-100 transition-opacity pointer-events-none"
      />
    </motion.div>
  );
};
