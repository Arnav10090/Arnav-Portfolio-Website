'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/metadata';
import { trackResumeDownload } from '@/lib/analytics';
import { throttle } from '@/lib/useScrollAnimation';

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const profileCardRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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

  // Profile card tilt effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!profileCardRef.current) return;

      const card = profileCardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -2; // max 2deg
      const rotateY = ((x - centerX) / centerX) * 2; // max 2deg

      setMousePosition({ x: rotateY, y: rotateX });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const card = profileCardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Parallax scroll effect with throttling for performance
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!heroRef.current) return;

      // Disable parallax on mobile (sm and md breakpoints)
      if (window.innerWidth < 1024) {
        heroRef.current.style.transform = 'translateY(0)';
        return;
      }

      const scrolled = window.scrollY;
      const parallaxSpeed = 0.5;

      // Use transform for GPU acceleration
      heroRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }, 16); // ~60fps

    // Add will-change on mount
    if (heroRef.current) {
      heroRef.current.style.willChange = 'transform';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Remove will-change on unmount
      if (heroRef.current) {
        heroRef.current.style.willChange = 'auto';
      }
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-[120px] pb-20 sm:pb-24 md:pb-28 lg:pb-[40px] bg-gradient-to-b from-blue-50 to-white dark:from-[#0a0e1a] dark:to-[#1a1f2e]"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" aria-hidden="true" />

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Split-screen layout: stacks on mobile, 50/50 on desktop (min 1024px) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">

          {/* Left Column - Text Content with responsive padding and max-width */}
          <div
            className="order-2 lg:order-1 space-y-6 sm:space-y-7 md:space-y-8 text-center lg:text-left lg:pl-12 xl:pl-20 animate-slide-in-left"
            style={{
              maxWidth: '100%'
            }}
          >
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Main name: responsive font sizes */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1]"
                style={{
                  letterSpacing: '-2px',
                  fontFeatureSettings: '"tnum", "lnum"'
                }}
              >
                {personalInfo.name}
              </h1>
              {/* Subtitle: responsive font sizes */}
              <p
                className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-white font-medium"
                style={{
                  opacity: 0.7,
                  letterSpacing: '0.5px'
                }}
              >
                {personalInfo.role}
              </p>
              {/* Status badge */}
              <p
                className="text-lg sm:text-xl md:text-xl text-blue-600 dark:text-blue-400 font-bold"
                style={{
                  fontFeatureSettings: '"tnum", "lnum"',
                  opacity: 0.9,
                  letterSpacing: '0.5px'
                }}
              >
                {personalInfo.status}
              </p>
            </div>

            {/* Body text: responsive font sizes */}
            <div className="max-w-full sm:max-w-[520px] mx-auto lg:mx-0">
              <p
                className="text-base sm:text-lg text-gray-600 dark:text-white"
                style={{
                  lineHeight: '1.7',
                  opacity: 0.8
                }}
              >
                {personalInfo.description}
              </p>
            </div>

            {/* CTA Buttons with hover effects - stack on mobile, row on tablet+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToWork}
                className="w-full sm:w-auto min-h-[44px] group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-floating"
              >
                View My Work
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={downloadResume}
                className="w-full sm:w-auto min-h-[44px] group relative transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-blue-600 hover:bg-blue-600 text-gray-900 dark:text-white hover:text-white rounded-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Resume
                </span>
              </Button>
            </div>
          </div>

          {/* Right Column - Profile Card (vertically centered) - responsive sizing */}
          <div
            className="order-1 lg:order-2 flex justify-center lg:justify-end items-center animate-slide-in-right"
            style={{
              animationDelay: '0.2s'
            }}
          >
            <div
              ref={profileCardRef}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
            >
              {/* Glassmorphism Card with backdrop-blur-xl and rgba(30, 41, 59, 0.5) */}
              <div
                className="absolute inset-0 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                  contain: 'layout style paint'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative">
                  <Image
                    src="/images/me.jpg"
                    alt={personalInfo.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 16rem, (max-width: 768px) 20rem, (max-width: 1024px) 22rem, 32rem"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Animated Scroll Indicator with bounce animation - hide on mobile */}
      <div
        className="hidden sm:flex absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
        aria-hidden="true"
        style={{
          animation: 'bounceSubtle 2s ease-in-out infinite'
        }}
      >
        <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
          <span className="text-xs sm:text-sm font-medium">Scroll to explore</span>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
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