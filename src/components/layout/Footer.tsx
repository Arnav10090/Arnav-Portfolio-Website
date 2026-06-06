'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';
import { socialLinks, contactInfo } from '@/data/contact';

import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/metadata';
import { trackResumeDownload } from '@/lib/analytics';

export function Footer() {
  const shouldReduce = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const downloadResume = async () => {
    try {
      // Use the API route for proper headers and tracking
      const response = await fetch('/api/resume');

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      // Get the blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'Arnav_Tiwari_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);

      // Track analytics event
      trackResumeDownload('footer');
    } catch (error) {
      console.error('Error downloading resume:', error);
      // Fallback to direct link
      const link = document.createElement('a');
      link.href = personalInfo.resumeUrl;
      link.download = 'Arnav_Tiwari_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="bg-white dark:bg-[#0a0e1a] border-t border-gray-200 dark:border-white/5 pt-16 sm:pt-18 md:pt-20 pb-8 sm:pb-9 md:pb-10 relative overflow-hidden"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three-column layout - stacks single column on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-11 md:mb-12">
          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduce ? 0 : 0.6,
              delay: shouldReduce ? 0 : 0,
            }}
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-4 sm:space-y-5"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-[1.5px]">
              Contact
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Tooltip content={emailCopied ? 'Copied!' : 'Click to copy'}>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleEmailCopy}
                    className="group relative text-gray-600 dark:text-white/70 hover:text-blue-600 dark:hover:text-accent-blue transition-colors duration-300 text-base inline-flex items-center gap-2 min-h-[44px] py-2"
                    aria-label="Copy email to clipboard"
                  >
                    <span className="relative break-all">
                      {contactInfo.email}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-blue group-hover:w-full transition-all duration-300" />
                    </span>
                    {emailCopied && (
                      <span className="text-xs text-accent-green animate-fade-in">
                        ✓
                      </span>
                    )}
                  </motion.button>
                </Tooltip>
              </li>
              <li className="text-gray-600 dark:text-white/70 text-base">
                {contactInfo.location}
              </li>
            </ul>
          </motion.div>

          {/* Connect Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduce ? 0 : 0.6,
              delay: shouldReduce ? 0 : 0.1,
            }}
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-4 sm:space-y-5"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-[1.5px]">
              Connect
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {socialLinks.map(link => {
                // Simple icon mapping based on label
                const getIcon = (label: string) => {
                  const lowerLabel = label.toLowerCase();
                  if (lowerLabel.includes('linkedin'))
                    return (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    );
                  if (lowerLabel.includes('github'))
                    return (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    );
                  if (lowerLabel.includes('email'))
                    return (
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    );
                  if (lowerLabel.includes('twitter'))
                    return (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    );
                  return null;
                };

                return (
                  <li key={link.label}>
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative text-gray-600 dark:text-white/70 hover:text-blue-600 dark:hover:text-accent-blue transition-colors duration-300 text-base inline-flex items-center gap-3 min-h-[44px] py-1"
                      aria-label={link.label}
                    >
                      <span className="text-gray-400 dark:text-white/50 group-hover:text-blue-600 dark:group-hover:text-accent-blue transition-colors duration-300">
                        {getIcon(link.label)}
                      </span>
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-blue group-hover:w-full transition-all duration-300" />
                      </span>
                      {link.external && (
                        <svg
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Resume Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduce ? 0 : 0.6,
              delay: shouldReduce ? 0 : 0.2,
            }}
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-4 sm:space-y-5 sm:col-span-2 md:col-span-1"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-[1.5px]">
              Resume
            </h3>
            <div className="flex flex-col items-start gap-4">
              <p className="text-gray-600 dark:text-white/70 text-base leading-relaxed">
                Grab a copy of my resume to learn more about my experience.
              </p>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="secondary"
                  onClick={downloadResume}
                  className="group relative border-blue-200 dark:border-blue-800 hover:border-blue-600 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-white transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
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
                    Download Resume
                  </span>
                </Button>
              </motion.div>

              <motion.button
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                onClick={scrollToTop}
                className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                aria-label="Back to top"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                  <motion.svg
                    variants={{ hover: { y: -3 } }}
                    className="w-4 h-4 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </motion.svg>
                </div>
                <span>Back to Top</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar with divider - responsive layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: shouldReduce ? 0 : 0.4 }}
          viewport={{ once: true, margin: '-60px' }}
          className="pt-6 sm:pt-7 md:pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
        >
          <p className="text-gray-500 dark:text-white/60 text-sm sm:text-base text-center sm:text-left">
            © {currentYear} Arnav Tiwari. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-white/60 text-sm sm:text-base text-center sm:text-right">
            Open to Software Engineering Roles
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
