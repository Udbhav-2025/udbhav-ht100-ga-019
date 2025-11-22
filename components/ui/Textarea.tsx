'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition resize-y';
    
    const textareaClasses = cn(
      baseStyles,
      error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
      props.disabled && 'opacity-60 cursor-not-allowed',
      className
    );

    const textareaElement = (
      <textarea
        ref={ref}
        className={textareaClasses}
        {...props}
      />
    );

    if (label) {
      return (
        <div className="space-y-2">
          {label && (
            <label className="block text-sm font-medium text-white/90">
              {label}
            </label>
          )}
          {textareaElement}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      );
    }

    return textareaElement;
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

