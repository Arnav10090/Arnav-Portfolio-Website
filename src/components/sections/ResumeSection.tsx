'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { resumeDownload } from '@/data/contact';
import { trackResumeDownload } from '@/lib/analytics';

/**
 * Resume Section Component
 * Requirements: 3.1, 3.2, 3.3, 3.5
 */
export function ResumeSection() {
  const handleResumeDownload = async () => {
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
      link.download = resumeDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
      
      // Track analytics event
      trackResumeDownload('resume_section');
    } catch (error) {
      console.error('Error downloading resume:', error);
      // Fallback to direct link
      const link = document.createElement('a');
      link.href = resumeDownload.url;
      link.download = resumeDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Still track the event
      trackResumeDownload('resume_section');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="resume" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900" aria-labelledby="resume-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionHeading subtitle="Download my complete professional resume" id="resume-heading">
            Resume
          </SectionHeading>
          
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-8 h-8 text-primary-500 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{resumeDownload.filename}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">PDF • {resumeDownload.size}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    Complete professional resume with detailed experience, projects, and skills.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Last updated: <time dateTime={resumeDownload.lastUpdated}>{formatDate(resumeDownload.lastUpdated)}</time>
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleResumeDownload}
                    className="min-w-[200px]"
                    aria-label="Download resume as PDF"
                    suppressHydrationWarning
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Resume
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}