'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      animated = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
      secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20',
      danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
      ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white',
      outline: 'bg-transparent border border-white/20 hover:border-white/40 text-white hover:bg-white/5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3.5 text-lg',
    };

    const buttonClasses = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </>
    );

    if (animated && !disabled && !isLoading) {
      return (
        <motion.button
          ref={ref}
          className={buttonClasses}
          disabled={disabled || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...(props as MotionProps)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

