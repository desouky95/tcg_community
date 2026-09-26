import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChecklistCardProps {
  checklist: {
    id: string | number;
    name: string;
    year: number | string;
    totalCards: number;
    type: string;
    category?: {
        name: string;
    };
    subcategory?: {
        name: string;
    };
  };
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({ checklist }) => {
  return (
    <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
    >
        <Link
            to={`/collection/${checklist.id}`}
            className="group bg-card border border-border rounded-3xl p-6 flex flex-col hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-black px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full uppercase tracking-widest text-muted-foreground">
                    {checklist.year}
                </span>
            </div>

            <h3 className="text-xl font-black mb-2 group-hover:text-primary-600 transition-colors">{checklist.name}</h3>

            {checklist.category && (
                <p className="text-sm font-bold text-muted-foreground mb-4 capitalize">
                    {checklist.category.name} {checklist.subcategory ? `• ${checklist.subcategory.name}` : ''}
                </p>
            )}

            <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter">
                    {checklist.totalCards} {checklist.type}s
                </span>
                <div className="flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-primary-600">
                    View <ChevronRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </Link>
    </motion.div>
  );
};
