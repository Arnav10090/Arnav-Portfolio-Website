'use client';

import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getBlurPlaceholder } from '@/lib/blur-placeholders';
import { trackProjectClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isFeatured = false,
}) => {
  const {
    id,
    title,
    description,
    problem,
    solution,
    outcome,
    techStack,
    githubUrl,
    liveUrl,
    imageUrl,
    featured,
  } = project;

  const [isVisible, setIsVisible] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | undefined>(undefined);

  // Magnetic cursor effect
  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || window.innerWidth < 1024) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate distance from center
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      // Apply subtle magnetic effect (max 8px movement)
      const moveX = deltaX * 8;
      const moveY = deltaY * 8;

      card.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-8px)`;
    },
    []
  );

  const handleMouseLeave = React.useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
  }, []);

  // Intersection observer for sequential tech tag pop-in animation
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Defer animation to next frame for better performance
          rafRef.current = requestAnimationFrame(() => {
            // Add will-change before animation
            (entry.target as HTMLElement).style.willChange =
              'transform, opacity';

            setIsVisible(true);

            // Remove will-change after animation completes
            setTimeout(
              () => {
                (entry.target as HTMLElement).style.willChange = 'auto';
              },
              techStack.length * 50 + 300
            );
          });

          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [techStack.length]);

  const handleGitHubClick = () => {
    trackProjectClick(id, 'github');
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLiveClick = () => {
    trackProjectClick(id, 'live');
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
  };

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'h-full flex flex-col overflow-hidden group magnetic-item',
        // Apply glassmorphism with adaptive background
        'bg-white dark:bg-[rgba(30,41,59,0.4)] backdrop-blur-md',
        // Adaptive border
        'border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-lg',
        // Card lift 8px on hover with shadow intensification
        'transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]',
        // Featured card gets landscape layout on desktop
        isFeatured && 'lg:flex-row lg:h-[500px]'
      )}
      style={{ contain: 'layout style paint' }}
      role="article"
      aria-label={`${title} project`}
    >
      {/* Project Image - 40% height for standard, 50% width for featured */}
      {imageUrl && (
        <div
          className={cn(
            'relative overflow-hidden border-b border-gray-100 dark:border-white/10',
            isFeatured
              ? 'w-full h-64 lg:w-1/2 lg:h-full lg:border-b-0 lg:border-r'
              : 'w-full h-56'
          )}
        >
          <Image
            src={imageUrl}
            alt={`Screenshot of ${title} showing ${description}`}
            fill
            // Image scale 1.05 zoom effect (800ms ease) on card hover
            className="object-cover transition-transform duration-800 ease-out group-hover:scale-105"
            loading={featured ? 'eager' : 'lazy'}
            sizes={
              isFeatured
                ? '(max-width: 1024px) 100vw, 50vw'
                : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            }
            placeholder="blur"
            blurDataURL={getBlurPlaceholder(project.id)}
            quality={90}
            priority={featured}
          />
          {/* Image overlay gradient (transparent to dark) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Content area - 60% for standard cards */}
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
            {title}
          </CardTitle>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </CardHeader>

        {/* Expandable Content Wrapper */}
        <div
          className={cn(
            'transition-all duration-500 ease-in-out overflow-hidden flex flex-col flex-1',
            // Mobile: Expandable
            'max-h-0 opacity-0 lg:max-h-none lg:opacity-100',
            // Mobile Expanded state
            isExpanded && 'max-h-[1000px] opacity-100'
          )}
        >
          <CardContent className="flex-1 space-y-6">
            {/* Structured Info Blocks with color-coded labels */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-red-500"
                    aria-hidden="true"
                  />
                  <span className="text-red-600 dark:text-red-400">
                    Problem
                  </span>
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {problem}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-blue-500"
                    aria-hidden="true"
                  />
                  <span className="text-blue-600 dark:text-blue-400">
                    Solution
                  </span>
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {solution}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-green-600 dark:text-green-400">
                    Outcome
                  </span>
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {outcome}
                </p>
              </div>
            </div>

            {/* Tech Stack with sequential pop-in animation */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-2" role="list">
                {techStack.map((tech, index) => (
                  <span
                    key={tech}
                    className={cn(
                      'inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm',
                      'bg-blue-50 dark:bg-[rgba(59,130,246,0.15)] text-blue-700 dark:text-blue-400',
                      // Tech tag scale 1.05 with background deepening on hover
                      'transition-all duration-300 hover:bg-blue-100 dark:hover:bg-[rgba(59,130,246,0.3)] hover:scale-105 cursor-default',
                      // Sequential pop-in animation
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    )}
                    style={{
                      transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                    }}
                    role="listitem"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t border-gray-100 dark:border-white/5 mt-auto pb-6 px-6">
            {/* CTA buttons with 12px gap matching hero section */}
            <div className="flex gap-3 w-full">
              {liveUrl && (
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleLiveClick}
                  aria-label={`View ${title} project`}
                >
                  View App
                </Button>
              )}
              {githubUrl && (
                <Button
                  variant="secondary"
                  size="lg"
                  className={liveUrl ? 'flex-1' : 'w-full'}
                  onClick={handleGitHubClick}
                  aria-label={`View ${title} source code on GitHub`}
                >
                  Source Code
                </Button>
              )}
            </div>
          </CardFooter>
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden px-6 pb-4 pt-2 mt-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Show Details
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
