'use client';

import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'lg',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const rippleRef = useRef<HTMLSpanElement>(null);

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] relative overflow-hidden';

    const variants = {
      // Primary filled variant with lift effect - using darker blue for better contrast
      primary:
        'bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-floating hover:shadow-blue-600/20 active:translate-y-0',
      // Secondary outlined variant with fill-from-left animation
      secondary:
        'bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/20 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/40 before:absolute before:inset-0 before:bg-white/5 before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300',
      ghost:
        'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-10 px-5 text-base',
      lg: 'h-12 px-6 text-base',
    };

    // Ripple effect on click
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.disabled) return;

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 600);

        // Call original onClick handler
        if (onClick) {
          onClick(e);
        }
      },
      [onClick, props.disabled]
    );

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
