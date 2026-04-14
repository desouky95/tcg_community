import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = '' 
}) => {
  return (
    <div className={`relative max-w-md w-full ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:left-auto rtl:right-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 rtl:pl-4 rtl:pr-12 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all shadow-sm"
      />
    </div>
  );
};
