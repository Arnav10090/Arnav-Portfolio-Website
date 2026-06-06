'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { throttle } from '@/lib/useScrollAnimation';
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
  const visualRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!visualRef.current || shouldReduce) return;

      const scrolled = window.scrollY;
      const section = visualRef.current.closest('section');
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewHeight = window.innerHeight;

      // Only animate when section is in view
      if (
        scrolled + viewHeight > sectionTop &&
        scrolled < sectionTop + sectionHeight
      ) {
        const parallaxOffset = (scrolled - sectionTop) * 0.15; // Milder parallax
        visualRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      }
    }, 16);

    if (visualRef.current && !shouldReduce) {
      visualRef.current.style.willChange = 'transform';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (visualRef.current) {
        visualRef.current.style.willChange = 'auto';
      }
    };
  }, [shouldReduce]);

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
      <div ref={visualRef} className="sticky top-24 w-full h-[600px]">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl opacity-40">
          <div className="gradient-mesh absolute inset-0">
            <div className="absolute w-[300px] h-[300px] rounded-full mix-blend-screen bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] animate-float top-[10%] left-[10%]" />
            <div className="absolute w-[250px] h-[250px] rounded-full mix-blend-screen bg-[radial-gradient(circle,rgba(168,85,247,0.3)_0%,transparent_70%)] animate-float-reverse bottom-[20%] right-[10%]" />
            <div className="absolute w-[200px] h-[200px] rounded-full mix-blend-screen bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] animate-float top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Geometric shapes with heavy color grading */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full h-full max-w-md"
            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
          >
            {/* Rotating square - Heavy Blue */}
            <motion.div
              animate={
                shouldReduce
                  ? {}
                  : {
                      rotateX: [0, 180, 360],
                      rotateY: [0, 180, 360],
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className={cn(
                'absolute w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 border-[6px] border-blue-600/60 dark:border-blue-400/60 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] backdrop-blur-[2px]',
                shapePositions.square
              )}
            ></motion.div>

            {/* Pulsing circle - Heavy Purple */}
            <motion.div
              animate={
                shouldReduce
                  ? {}
                  : { rotateX: [0, 180, 360], y: [-15, 15, -15] }
              }
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-[6px] border-purple-600/60 dark:border-purple-400/60 rounded-full shadow-[0_0_30px_rgba(147,51,234,0.3)] backdrop-blur-[2px]',
                shapePositions.circle
              )}
            ></motion.div>

            {/* Static triangle - Heavy Indigo */}
            <motion.div
              animate={
                shouldReduce
                  ? {}
                  : { rotateY: [0, 180, 360], x: [-15, 15, -15] }
              }
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className={cn(
                'absolute w-0 h-0 border-l-[30px] md:border-l-[35px] lg:border-l-[40px] border-l-transparent border-r-[30px] md:border-r-[35px] lg:border-r-[40px] border-r-transparent border-b-[50px] md:border-b-[60px] lg:border-b-[70px] border-b-indigo-600/50 dark:border-b-indigo-400/50 filter drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]',
                shapePositions.triangle
              )}
            ></motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
