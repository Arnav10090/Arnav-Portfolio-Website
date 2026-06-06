'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to trigger animations when elements scroll into view
 * Uses 20% viewport threshold as specified in design system
 * Optimized for performance with GPU acceleration
 */
export function useScrollAnimation() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Skip animation setup if user prefers reduced motion
      return;
    }

    // Create intersection observer with 20% threshold
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add will-change before animation starts
            (entry.target as HTMLElement).style.willChange =
              'transform, opacity';

            entry.target.classList.add('animate-in');

            // Remove will-change after animation completes (600ms animation duration)
            setTimeout(() => {
              (entry.target as HTMLElement).style.willChange = 'auto';
            }, 600);

            // Unobserve after animation to free resources
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // 20% viewport threshold
        rootMargin: '0px',
      }
    );

    // Observe all elements with data-animate attribute
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
}

/**
 * Utility function to add staggered animation delays
 * @param index - Index of the element in a list
 * @param delayMs - Base delay in milliseconds (default: 100ms)
 */
export function getStaggerDelay(index: number, delayMs: number = 100): string {
  return `${index * delayMs}ms`;
}

/**
 * Debounce utility for scroll listeners
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle utility for high-frequency events
 * @param func - Function to throttle
 * @param limit - Minimum time between executions in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
