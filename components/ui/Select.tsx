'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition backdrop-blur-sm appearance-none cursor-pointer';
    
    const selectClasses = cn(
      baseStyles,
      error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
      props.disabled && 'opacity-60 cursor-not-allowed',
      className
    );

    const selectElement = (
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    );

    if (label) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="block text-sm font-medium text-white/90">
              {label}
            </label>
          )}
          {selectElement}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      );
    }

    return selectElement;
  }
);

Select.displayName = 'Select';

export default Select;

