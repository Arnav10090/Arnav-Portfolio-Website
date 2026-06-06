'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';

interface AboutSectionProps {
  className?: string;
  id?: string;
}

export function AboutSection({ className, id }: AboutSectionProps) {
  const shouldReduce = useReducedMotion();

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
            <DecorativeBackground
              position="left"
              className="!static !w-full !h-full"
            />
          </div>

          {/* Right side: Content (70%) */}
          <div className="w-full lg:w-[70%] max-w-full lg:max-w-[800px]">
            <div
              style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 40, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                viewport={{ once: true, margin: '-100px' }}
                id="about-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-tight text-center"
              >
                About Me
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.6,
                  delay: shouldReduce ? 0 : 0.2,
                }}
                viewport={{ once: true, margin: '-100px' }}
                className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 text-center"
              >
                Get to know the person behind the code
              </motion.p>
            </div>

            {/* Glassmorphic content container */}
            <motion.div
              initial={{ opacity: 0, rotateY: -10, x: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{
                duration: shouldReduce ? 0 : 0.8,
                delay: shouldReduce ? 0 : 0.2,
              }}
              viewport={{ once: true, margin: '-100px' }}
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
              className="relative"
            >
              {/* Decorative corner elements */}
              <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-primary-500 rounded-sm"></div>
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-sm"></div>

              <div
                className="relative bg-[rgba(30,41,59,0.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12"
                style={{ contain: 'layout style paint' }}
              >
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {[
                    <React.Fragment key="1">
                      I'm a{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Full Stack Engineer & AI Builder
                      </span>{' '}
                      and final-year{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Computer Science undergraduate at IIIT Nagpur
                      </span>{' '}
                      who turns ambiguous requirements into reliable,
                      production-ready systems — with numbers to prove it.
                    </React.Fragment>,
                    <React.Fragment key="2">
                      At{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Hitachi India
                      </span>
                      , I engineered SLD visualization modules and React +
                      Django interfaces for 5 HICADS systems, contributing to a{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        54% reduction in hazardous incidents
                      </span>{' '}
                      and{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        80% faster document turnaround
                      </span>
                      . At{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Payatu Security
                      </span>
                      , I shipped Next.js interfaces and optimized MySQL-backed
                      APIs, cutting page load times from 3s &rarr; 1.5s (
                      <span className="text-primary-500 font-medium highlight-term">
                        50% faster
                      </span>
                      ) and improving backend response by{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        40%
                      </span>
                      .
                    </React.Fragment>,
                    <React.Fragment key="3">
                      On the AI/ML side, I've built{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        multi-agent LLM orchestration systems
                      </span>{' '}
                      and ML pipelines using{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        scikit-learn
                      </span>
                      ,{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        FAISS
                      </span>
                      ,{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        spaCy
                      </span>
                      , and{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Sentence-Transformers
                      </span>{' '}
                      — including a skill-gap analyzer trained on 2,484 resumes
                      that achieves{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        F1 &gt; 0.82
                      </span>{' '}
                      on skill extraction.
                    </React.Fragment>,
                    <React.Fragment key="4">
                      I primarily work with{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        React
                      </span>
                      ,{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Next.js
                      </span>
                      ,{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Node.js
                      </span>
                      ,{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        Django
                      </span>
                      ,{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        FastAPI
                      </span>{' '}
                      and{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        PostgreSQL / MongoDB
                      </span>
                      , and care deeply about system design, performance, and
                      long-term maintainability over quick hacks.
                    </React.Fragment>,
                    <React.Fragment key="5">
                      Heading into{' '}
                      <span className="text-primary-500 font-medium highlight-term">
                        placement season 2026
                      </span>
                      , I'm looking for software engineering roles where
                      engineering quality matters, problems are complex, and
                      ownership is encouraged.
                    </React.Fragment>,
                  ].map((content, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: shouldReduce ? 0 : 0.5,
                        delay: shouldReduce ? 0 : 0.3 + idx * 0.1,
                      }}
                      viewport={{ once: true, margin: '-100px' }}
                      className="text-base sm:text-[17px] text-black dark:text-white highlighted-text"
                      style={{ lineHeight: 1.8 }}
                    >
                      {content}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
