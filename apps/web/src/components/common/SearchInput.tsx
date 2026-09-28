import { Search } from 'lucide-react';
import { Input } from '../ui';
import { cn } from '../../lib/cn';

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
    <div className={cn('relative max-w-md w-full', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:left-auto rtl:right-4" />
      <Input
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl py-4 pl-12 pr-4 shadow-sm rtl:pl-4 rtl:pr-12"
      />
    </div>
  );
};
