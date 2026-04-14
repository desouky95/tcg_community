import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`bg-primary-600/10 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest mb-6 border border-primary-500/10 w-fit ${className}`}
    >
      {children}
    </motion.div>
  );
};
