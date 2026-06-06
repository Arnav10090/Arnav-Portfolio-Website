import React from 'react';
import { cn } from '@/lib/utils';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'accent' | 'subtle';
  underline?: boolean;
  children: React.ReactNode;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant = 'default', underline = true, children, ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center gap-1 transition-colors duration-300 relative focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2 rounded';

    const variants = {
      default: 'text-white hover:text-accent-blue',
      accent: 'text-accent-blue hover:text-accent-purple',
      subtle: 'text-white/60 hover:text-white',
    };

    // Underline animation styles
    const underlineStyles = underline
      ? 'after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'
      : '';

    return (
      <a
        className={cn(
          baseStyles,
          variants[variant],
          underlineStyles,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export { Link };
