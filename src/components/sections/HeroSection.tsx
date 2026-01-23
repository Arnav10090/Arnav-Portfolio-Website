'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/metadata';
import { trackResumeDownload } from '@/lib/analytics';

export function HeroSection() {
  const scrollToWork = () => {
    const workSection = document.getElementById('experience');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
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
      trackResumeDownload('hero_section');
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

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-gray-900/20 via-transparent to-white/20 dark:to-gray-900/20" aria-hidden="true" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Name and Role */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {personalInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-medium" role="doc-subtitle">
              {personalInfo.role}
            </p>
          </div>
          
          {/* Value Proposition */}
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Software Engineering student at <span className="font-semibold text-primary-600 dark:text-primary-400">IIIT Nagpur</span> with 
              expertise in <span className="font-semibold text-secondary-600 dark:text-secondary-400">React</span> and <span className="font-semibold text-secondary-600 dark:text-secondary-400">.NET MVC</span>. 
              Currently building safety-critical industrial systems at <span className="font-semibold text-primary-600 dark:text-primary-400">Hitachi</span>.
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              Passionate about creating robust, scalable solutions that make a real-world impact. 
              Ready to contribute to your team's success in placement season 2026.
            </p>
          </div>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToWork}
              className="w-full sm:w-auto min-w-[200px]"
              aria-label="Scroll to view my work and experience"
            >
              View My Work
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={downloadResume}
              className="w-full sm:w-auto min-w-[200px]"
              aria-label="Download resume as PDF"
            >
              Download Resume
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-600">
          <span className="text-sm font-medium">Scroll to explore</span>
          <svg
            className="w-6 h-6"
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}