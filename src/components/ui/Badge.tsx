import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'strategic' | 'standard' | 'subtle' | 'tech';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'standard', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center rounded-sm border px-2 py-1 text-xs font-medium transition-all duration-300 cursor-default select-none';

    const variants = {
      standard:
        'bg-surface-50 border-white/10 text-white/70 hover:bg-surface-100 hover:text-white hover:scale-105',
      strategic:
        'bg-accent-blue/10 border-accent-blue/20 text-accent-blue hover:bg-accent-blue/20 hover:scale-105',
      subtle:
        'bg-transparent border-white/10 text-white/60 hover:border-white/20 hover:text-white/80',
      // Tech tag variant for project cards
      tech: 'bg-accent-blue/15 border-transparent text-accent-blue hover:bg-accent-blue/25 hover:scale-105 rounded-sm',
    };

    return (
      <div
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
