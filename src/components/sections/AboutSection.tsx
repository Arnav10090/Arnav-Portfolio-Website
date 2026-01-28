'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';

interface AboutSectionProps {
  className?: string;
  id?: string;
}

export function AboutSection({ className, id }: AboutSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 sm:py-28 md:py-32 lg:py-40 bg-white dark:bg-transparent',
        className
      )}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 sm:px-6">

        {/* Asymmetric layout: stacks on mobile/tablet, 30% left + 70% right on desktop */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Left side: Decorative Background (30%) */}
          <div className="hidden lg:block lg:w-[30%] relative min-h-[600px]">
            <DecorativeBackground position="left" className="!static !w-full !h-full" />
          </div>

          {/* Right side: Content (70%) */}
          <div className="w-full lg:w-[70%] max-w-full lg:max-w-[800px]">
            <div className="lg:animate-fade-up">
              <h2
                id="about-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-tight text-center"
              >
                About Me
              </h2>
              <p
                className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 text-center"
              >
                Get to know the person behind the code
              </p>
            </div>

            {/* Glassmorphic content container */}
            <div className="relative">
              {/* Decorative corner elements */}
              <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-primary-500 rounded-sm"></div>
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-sm"></div>

              <div
                className="relative bg-[rgba(30,41,59,0.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12"
                style={{ contain: 'layout style paint' }}
              >
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <p
                    className="text-base sm:text-[17px] text-black dark:text-white highlighted-text lg:animate-fade-up"
                    style={{
                      lineHeight: 1.8,
                      animationDelay: '100ms',
                      opacity: 1
                    }}
                  >
                    I'm a <span className="text-primary-500 font-medium highlight-term">Final-year Computer Science</span> undergraduate at <span className="text-primary-500 font-medium highlight-term">IIIT Nagpur</span> who enjoys turning ambiguous requirements into reliable, production-ready systems.
                  </p>

                  <p
                    className="text-base sm:text-[17px] text-black dark:text-white highlighted-text lg:animate-fade-up"
                    style={{
                      lineHeight: 1.8,
                      animationDelay: '200ms',
                      opacity: 1
                    }}
                  >
                    I've built and deployed <span className="text-primary-500 font-medium highlight-term">full-stack</span> and <span className="text-primary-500 font-medium highlight-term">LLM-powered SaaS applications</span>, including <span className="text-primary-500 font-medium highlight-term">multi-agent AI platforms</span> that generate execution-ready outputs from high-level inputs. My experience spans frontend architecture, backend APIs, database design, and AI workflow orchestration.
                  </p>

                  <p
                    className="text-base sm:text-[17px] text-black dark:text-white highlighted-text lg:animate-fade-up"
                    style={{
                      lineHeight: 1.8,
                      animationDelay: '300ms',
                      opacity: 1
                    }}
                  >
                    I primarily work with <span className="text-primary-500 font-medium highlight-term">React</span>, <span className="text-primary-500 font-medium highlight-term">Next.js</span>, <span className="text-primary-500 font-medium highlight-term">Node.js</span>, <span className="text-primary-500 font-medium highlight-term">Django</span> and <span className="text-primary-500 font-medium highlight-term">MySQL</span> databases and care deeply about system design, performance, and long-term maintainability over quick hacks.
                  </p>

                  <p
                    className="text-base sm:text-[17px] text-black dark:text-white highlighted-text lg:animate-fade-up"
                    style={{
                      lineHeight: 1.8,
                      animationDelay: '400ms',
                      opacity: 1
                    }}
                  >
                    Heading into <span className="text-primary-500 font-medium highlight-term">placement season 2026</span>, I'm seeking software engineering roles where engineering quality matters, problems are complex, and ownership is encouraged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}