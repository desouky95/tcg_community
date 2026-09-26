import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  highlightColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  highlightColor = 'text-primary-500', 
  className = '' 
}) => {
  return (
    <div className={`bg-input/30 rounded-2xl p-4 ${className}`}>
      <p className={`text-[10px] font-black uppercase tracking-widest ${highlightColor} mb-1`}>
        {label}
      </p>
      <p className="text-3xl font-black tabular-nums">
        {value}
      </p>
    </div>
  );
};
