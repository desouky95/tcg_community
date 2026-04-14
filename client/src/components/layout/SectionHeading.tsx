import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../common/Badge";
import { clsx } from "clsx";
interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlight,
  subtitle,
  align = "center",
  className = "",
}) => {
  const classNames = clsx(
    {
      "items-center text-center": align === "center",
      "items-start text-left": align !== "center",
    },
    `flex flex-col mb-20 px-4 ${className}`,
  );
  return (
    <div className={classNames}>
      {badge && <Badge>{badge}</Badge>}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl lg:text-3xl font-black tracking-tighter uppercase leading-[0.9]"
      >
        {title}{" "}
        {highlight && (
          <>
            <span className="text-primary-600">{highlight}</span>
          </>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-2xl mt-6 font-medium leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
