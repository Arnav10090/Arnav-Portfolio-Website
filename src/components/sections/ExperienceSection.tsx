import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { ExperienceCard } from '@/components/ExperienceCard';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { experiences } from '@/data/experience';
import { cn } from '@/lib/utils';

interface ExperienceSectionProps {
  className?: string;
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="py-24 bg-white dark:bg-background"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Left side: Decorative Background (30%) - Visual for this section */}
          <div className="hidden lg:block lg:w-[30%] relative min-h-[600px]">
            <DecorativeBackground position="left" variant="sidebar" className="!static !w-full !h-full" />
          </div>

          {/* Right side: Main Content (70%) */}
          <div className="w-full lg:w-[70%]">
            <div className="text-center">
              <h2
                id="experience-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-none"
              >
                Work Experience
              </h2>
              <p
                className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-0 sm:mb-10 md:mb-12 max-w-2xl mx-auto -mt-0"
              >
                Professional journey and key contributions
              </p>
            </div>

            <div className="relative space-y-12">
              {/* Vertical Line for Timeline - hidden on small screens if needed, or adjust positioning */}
              <div className="absolute left-[8px] top-4 bottom-4 w-px bg-gray-200 dark:bg-white/10 md:hidden" />

              {experiences.map((job, index) => (
                <div
                  key={index}
                  className="relative flex flex-col gap-4 animate-fade-up opacity-0"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Mobile/Tablet Layout: Stacked with timeline on left */}
                  {/* Desktop Layout (within 60% col): Similar to before but maybe simplified? 
                       The previous timeline design relied on 4 cols left / 8 cols right.
                       Inside this 60% column, we don't need a complex grid. We can stack Role/Company above Description or use a smaller grid.
                   */}

                  <div className="pl-6 md:pl-0 relative">
                    {/* Mobile Dot */}
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full border-4 border-white dark:border-[#0a0e1a] bg-primary-600 md:hidden" />

                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary tracking-tight">{job.role}</h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">{job.company}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-text-secondary">{job.duration}</p>
                        <p className="text-sm text-text-secondary mt-1">{job.location}</p>
                      </div>
                    </div>

                    <Card variant="base" className="p-6 sm:p-8 hover:border-primary-500/30 transition-colors">
                      <ul className="space-y-3 sm:space-y-4">
                        {job.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start text-text-secondary leading-relaxed text-sm sm:text-base">
                            <span className="mr-3 mt-2 w-1.5 h-1.5 bg-primary-500/50 rounded-full flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}