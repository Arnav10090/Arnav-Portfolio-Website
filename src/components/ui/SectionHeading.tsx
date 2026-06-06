import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeading = React.forwardRef<
  HTMLHeadingElement,
  SectionHeadingProps
>(
  (
    { className, level = 2, children, subtitle, align = 'center', ...props },
    ref
  ) => {
    const baseStyles = 'font-bold tracking-tight leading-none';

    const levelStyles = {
      1: 'text-5xl md:text-6xl lg:text-7xl',
      2: 'text-4xl md:text-5xl lg:text-6xl',
      3: 'text-3xl md:text-4xl',
    };

    const alignmentClass = align === 'left' ? 'text-left' : 'text-center';

    const headingProps = {
      className: cn(
        baseStyles,
        levelStyles[level],
        'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent',
        className
      ),
      ref,
      ...props,
      children,
    };

    return (
      <div className={cn('mb-12 md:mb-16', alignmentClass)}>
        {level === 1 && <h1 {...headingProps} />}
        {level === 2 && <h2 {...headingProps} />}
        {level === 3 && <h3 {...headingProps} />}
        {subtitle && (
          <p
            className={cn(
              '-mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed',
              align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-3xl'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = 'SectionHeading';

export { SectionHeading };
