'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, children, ...props }, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(e);
      }
    };

    return (
      <form
        ref={ref}
        className={cn('space-y-5', className)}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

export default Form;

