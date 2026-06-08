'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DecorativeBackgroundProps {
  position: 'left' | 'right';
  className?: string;
  variant?: 'default' | 'compact' | 'sidebar';
}

export function DecorativeBackground({
  position,
  className,
  variant = 'default',
}: DecorativeBackgroundProps) {
  const shouldReduce = useReducedMotion();

  // Define positions based on variant
  const shapePositions =
    variant === 'compact'
      ? {
          square: 'top-[20%] right-[25%]',
          circle: 'top-[50%] left-[65%]',
          triangle: 'bottom-[35%] right-[45%]',
        }
      : variant === 'sidebar'
        ? {
            square: 'top-[20%] right-[25%]',
            circle: 'top-[50%] left-[25%]',
            triangle: 'bottom-[40%] right-[15%]',
          }
        : {
            square: 'top-1/4 left-1/4',
            circle: 'top-1/2 right-1/4',
            triangle: 'bottom-1/3 left-1/3',
          };

  return (
    <div
      className={cn(
        'hidden lg:block absolute top-0 bottom-0 w-[40%] pointer-events-none z-0',
        position === 'left' ? 'left-0' : 'right-0',
        className
      )}
      aria-hidden="true"
    >
      <div className="sticky top-24 w-full h-[600px]">
        {/* Static gradient background to keep scroll rendering light */}
        <div className="absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl opacity-35">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_50%)]" />
          <div className="absolute top-[12%] left-[12%] h-36 w-36 rounded-full bg-blue-500/10" />
          <div className="absolute bottom-[18%] right-[10%] h-28 w-28 rounded-full bg-purple-500/10" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10" />
        </div>

        {/* Lighter geometric shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-w-md">
            <motion.div
              animate={shouldReduce ? {} : { y: [-6, 6, -6], rotate: [0, 4, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'absolute h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-xl border-4 border-blue-500/35',
                shapePositions.square
              )}
            />

            <motion.div
              animate={shouldReduce ? {} : { y: [8, -8, 8] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'absolute h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full border-4 border-purple-500/35',
                shapePositions.circle
              )}
            />

            <motion.div
              animate={shouldReduce ? {} : { x: [-6, 6, -6] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'absolute h-0 w-0 border-l-[30px] md:border-l-[35px] lg:border-l-[40px] border-l-transparent border-r-[30px] md:border-r-[35px] lg:border-r-[40px] border-r-transparent border-b-[50px] md:border-b-[60px] lg:border-b-[70px] border-b-indigo-500/30',
                shapePositions.triangle
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
