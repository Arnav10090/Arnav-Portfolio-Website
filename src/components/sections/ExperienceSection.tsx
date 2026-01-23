import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/ExperienceCard';
import { experiences } from '@/data/experience';
import { cn } from '@/lib/utils';

interface ExperienceSectionProps {
  className?: string;
}

export function ExperienceSection({ className }: ExperienceSectionProps) {
  // Sort experiences by priority (high first) and then by duration (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    // Priority order: high > medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // If same priority, sort by duration (assuming more recent experiences come first in data)
    return 0;
  });

  return (
    <section
      id="experience"
      className={cn(
        // Highest visual priority with generous spacing
        'py-24 md:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900',
        className
      )}
      aria-labelledby="experience-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          level={2}
          subtitle="Professional experience building real-world solutions with measurable impact"
          className="mb-16 md:mb-20"
          id="experience-heading"
        >
          Professional Experience
        </SectionHeading>

        <div className="space-y-8 md:space-y-12">
          {sortedExperiences.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              className={cn(
                // Add extra emphasis for high priority experiences (Hitachi)
                experience.priority === 'high' && [
                  'ring-1 ring-blue-100',
                  'shadow-lg hover:shadow-2xl',
                  // Slightly larger scale for high priority
                  'transform hover:scale-[1.02]'
                ]
              )}
            />
          ))}
        </div>

        {/* Call-to-action for more details */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Want to learn more about my experience and technical skills?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Navigate to contact section"
            >
              Get in Touch
            </a>
            <a
              href="/resume.pdf"
              download="Arnav_Tiwari_Resume.pdf"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Download resume as PDF"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}