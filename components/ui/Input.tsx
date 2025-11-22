'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, rightIcon, error, label, ...props }, ref) => {
    const baseStyles = 'w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm';
    
    const paddingLeft = leftIcon ? 'pl-10' : 'pl-4';
    const paddingRight = rightIcon ? 'pr-10' : 'pr-4';
    
    const inputClasses = cn(
      baseStyles,
      paddingLeft,
      paddingRight,
      error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
      props.disabled && 'opacity-60 cursor-not-allowed',
      className
    );

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
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
          {inputElement}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = 'Input';

export default Input;

