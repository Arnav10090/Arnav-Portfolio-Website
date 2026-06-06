'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { resumeDownload } from '@/data/contact';
import { trackResumeDownload } from '@/lib/analytics';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';

/**
 * Resume Section Component
 * Requirements: 3.1, 3.2, 3.3, 3.5
 */
export function ResumeSection({ id }: { id?: string }) {
  const shouldReduce = useReducedMotion();
  // Initialize scroll animations (kept if used by inner elements, though mostly moved to framer motion)
  useScrollAnimation();

  const handleResumeDownload = async () => {
    try {
      const response = await fetch('/api/resume');
      if (!response.ok) throw new Error('Failed to download resume');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resumeDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      trackResumeDownload('resume_section');
    } catch (error) {
      console.error('Error downloading resume:', error);
      const link = document.createElement('a');
      link.href = resumeDownload.url;
      link.download = resumeDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackResumeDownload('resume_section');
    }
  };

  const [formattedDate, setFormattedDate] = React.useState<string>('');

  React.useEffect(() => {
    const date = new Date(resumeDownload.lastUpdated);
    setFormattedDate(
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return (
    <section
      id={id}
      className="py-20 sm:py-24 md:py-28 lg:py-30 bg-white dark:bg-background relative"
      aria-labelledby="resume-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Left side: Decorative Background (30%) */}
          <div className="hidden lg:block lg:w-[30%] relative min-h-[600px]">
            <DecorativeBackground
              position="left"
              variant="sidebar"
              className="!static !w-full !h-full"
            />
          </div>

          {/* Right side: Resume Content (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col items-center lg:items-start justify-center">
            <div className="max-w-xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduce ? 0 : 0.6 }}
                viewport={{ once: true, margin: '-50px' }}
                className="flex flex-col items-center lg:items-center"
              >
                {/* Section heading */}
                <h2
                  id="contact-heading"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-tight text-center"
                >
                  Resume
                </h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto text-center">
                  Download my complete professional resume
                </p>

                {/* Resume card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={
                    shouldReduce ? {} : { scale: 1.02, y: -4, rotateX: 2 }
                  }
                  transition={{ duration: shouldReduce ? 0 : 0.6 }}
                  viewport={{ once: true, margin: '-50px' }}
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                  className="w-full"
                >
                  <div className="group relative bg-white dark:bg-[rgba(30,41,59,0.5)] backdrop-blur-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-6 sm:p-8 flex flex-col items-center text-center shadow-floating transition-all duration-500">
                    {/* Document icon */}
                    <motion.div
                      whileHover={
                        shouldReduce ? {} : { rotateZ: [0, -10, 10, -10, 0] }
                      }
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-blue-50 dark:bg-primary-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-primary-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    >
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </motion.div>

                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-text-primary mb-2">
                      {resumeDownload.filename}
                    </h3>

                    <motion.div
                      whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
                      whileTap={shouldReduce ? {} : { scale: 0.96 }}
                      className="mt-4"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleResumeDownload}
                        className="w-full sm:w-auto min-w-[200px] min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center rounded-xl transition-all duration-300"
                        aria-label="Download resume as PDF"
                      >
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          <span>Download Resume</span>
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
