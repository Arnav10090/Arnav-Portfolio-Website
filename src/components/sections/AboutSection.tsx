import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { personalInfo } from '@/data/metadata';
import { cn } from '@/lib/utils';

interface AboutSectionProps {
  className?: string;
}

export function AboutSection({ className }: AboutSectionProps) {
  return (
    <section
      id="about"
      className={cn(
        'py-16 md:py-24 bg-white dark:bg-gray-800',
        className
      )}
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          level={2}
          subtitle="Get to know the person behind the code"
          className="mb-12 md:mb-16"
          id="about-heading"
        >
          About Me
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Professional Photo Placeholder */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl flex items-center justify-center shadow-lg" role="img" aria-label="Professional photo placeholder">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <p className="text-sm font-medium">Professional Photo</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Narrative */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I'm a passionate software engineer pursuing my Bachelor's in Computer Science at{' '}
                <a
                  href="https://iiitn.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium underline decoration-primary-200 dark:decoration-primary-800 hover:decoration-primary-300 dark:hover:decoration-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
                  aria-label="Visit IIIT Nagpur website"
                >
                  IIIT Nagpur
                </a>
                , with a graduation target of 2026. Currently, I'm gaining invaluable industry experience as a Software Engineering Intern at{' '}
                <a
                  href="https://www.hitachi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium underline decoration-primary-200 dark:decoration-primary-800 hover:decoration-primary-300 dark:hover:decoration-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
                  aria-label="Visit Hitachi website"
                >
                  Hitachi
                </a>
                , where I build safety-critical industrial systems that impact real-world operations.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                My expertise spans modern web technologies including React and .NET MVC, with a focus on creating robust, scalable solutions. I thrive on solving complex problems and building systems that make a measurable difference. Whether it's developing permit management systems handling hundreds of daily requests or architecting dashboard solutions that reduce audit time by 40%, I'm driven by the opportunity to create meaningful impact through code.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                As I approach placement season 2026, I'm excited to bring my technical skills, problem-solving mindset, and passion for excellence to a dynamic engineering team where I can continue growing while contributing to innovative projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}