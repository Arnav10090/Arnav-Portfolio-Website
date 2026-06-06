import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    const baseStyles =
      'w-full px-4 py-3 text-base bg-surface-glass backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-white/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:border-accent-blue hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-accent-red focus-visible:ring-accent-red focus-visible:border-accent-red'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(baseStyles, errorStyles, className)}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-accent-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const baseStyles =
      'w-full px-4 py-3 text-base bg-surface-glass backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-white/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:border-accent-blue hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[140px] resize-y';

    const errorStyles = error
      ? 'border-accent-red focus-visible:ring-accent-red focus-visible:border-accent-red'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          className={cn(baseStyles, errorStyles, className)}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-accent-red">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
