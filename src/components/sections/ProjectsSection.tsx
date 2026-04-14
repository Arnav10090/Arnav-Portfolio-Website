'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { cn } from '@/lib/utils';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const ProjectsSection: React.FC<{ id?: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const rafRef = useRef<number | undefined>(undefined);

  // Check scroll position to update arrow visibility
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll to next/previous project
  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    // Get the width of one card plus gap
    const cardElement = sliderRef.current.querySelector('[role="listitem"]') as HTMLElement;
    if (!cardElement) return;
    
    const cardWidth = cardElement.offsetWidth;
    const gap = 32; // 8 * 4 = 32px (gap-8 in Tailwind)
    const scrollAmount = cardWidth + gap;
    
    const newScrollLeft = direction === 'left' 
      ? sliderRef.current.scrollLeft - scrollAmount
      : sliderRef.current.scrollLeft + scrollAmount;
    
    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Defer animation to next frame for better performance
          rafRef.current = requestAnimationFrame(() => {
            setIsVisible(true);
          });
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Add scroll listener to update arrow visibility
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    checkScrollPosition();
    slider.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      slider.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="py-16 sm:py-20 md:py-24 bg-blue-50/50 dark:bg-background"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Main Content (85%) */}
          <div className="w-full lg:w-[85%]">
            <div className="text-center">
              <h2
                id="projects-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-none"
              >
                Projects
              </h2>
              <p
                className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto -mt-0"
              >
                Problem-solving through code: Real projects with measurable impact
              </p>
            </div>

            {/* Horizontal slider for projects */}
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transition-all duration-300",
                  canScrollLeft 
                    ? "opacity-100 hover:scale-110 hover:bg-blue-50 dark:hover:bg-gray-700" 
                    : "opacity-0 pointer-events-none",
                  "-ml-5 sm:-ml-6"
                )}
                aria-label="Scroll to previous projects"
              >
                <FiChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center transition-all duration-300",
                  canScrollRight 
                    ? "opacity-100 hover:scale-110 hover:bg-blue-50 dark:hover:bg-gray-700" 
                    : "opacity-0 pointer-events-none",
                  "-mr-5 sm:-mr-6"
                )}
                aria-label="Scroll to next projects"
              >
                <FiChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Slider Container */}
              <div
                ref={sliderRef}
                className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                role="list"
              >
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className={cn(
                      "flex-shrink-0 w-full md:w-[calc(50%-1rem)] transition-all duration-600",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                    role="listitem"
                  >
                    <ProjectCard project={project} isFeatured={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Decorative Background (15%) */}
          <div className="hidden lg:block lg:w-[15%] relative min-h-[600px]">
            <DecorativeBackground position="right" variant="compact" className="!static !w-full !h-full" />
          </div>
        </div>

        {/* Call to Action - responsive spacing */}
        <div
          className={cn(
            "text-center mt-16 sm:mt-20 md:mt-24 transition-all duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{
            transitionDelay: `${projects.length * 150}ms`,
          }}
        >
          <p className="text-lg sm:text-xl text-text-secondary mb-6 sm:mb-8">
            Want to see more of my work or discuss a project?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://github.com/Arnav10090?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 sm:h-12 min-h-[44px] px-5 sm:px-6 rounded-xl font-medium transition-all duration-300 ease-out bg-transparent text-text-secondary border border-border hover:bg-surface hover:border-primary-500/30 hover:text-text-primary"
              aria-label="View all projects on GitHub"
            >
              View All Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-11 sm:h-12 min-h-[44px] px-5 sm:px-6 rounded-xl font-medium transition-all duration-300 ease-out bg-primary-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/20"
              aria-label="Navigate to contact section"
            >
              Let's Work Together
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};