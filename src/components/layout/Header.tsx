'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { navigationItems, resumeDownload, socialLinks } from '@/data/contact';
import { trackResumeDownload, trackExternalLink } from '@/lib/analytics';
import { cn } from '@/lib/utils';

// Icon components
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
);
const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
);

const iconMap = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  email: EmailIcon,
  twitter: TwitterIcon,
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sectionIds = navigationItems.map(item => item.href.replace('#', ''));

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66% 0px', // Trigger when section is near top of viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible section
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio and position
        const mostVisible = visibleEntries.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio ? current : prev;
        });
        
        setActiveSection(`#${mostVisible.target.id}`);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Fallback: Also track scroll position
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header height

      for (const item of navigationItems) {
        const sectionId = item.href.replace('#', '');
        const element = document.getElementById(sectionId);
        
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.href);
            break;
          }
        }
      }

      // Clear active section when at the very top
      if (window.scrollY < 100) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSmoothScroll = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
        setActiveSection(href);
      }
    }
  };

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
      trackResumeDownload('header');
    } catch (error) {
      console.error('Error downloading resume:', error);
      const link = document.createElement('a');
      link.href = resumeDownload.url;
      link.download = resumeDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackResumeDownload('header');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-white/20 dark:border-white/10'
          : 'bg-transparent border-transparent'
      )}
      role="banner"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Expanded container width to allow 'extreme' positioning */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Name - Extreme Left */}
          <div className="flex-shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Scroll to top"
            >
              Arnav Tiwari
            </button>
          </div>

          {/* Desktop Navigation - Centered (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleSmoothScroll(item.href)}
                className={cn(
                  'relative text-lg font-medium transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full px-5 py-2 group',
                  activeSection === item.href
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                )}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.href ? 'page' : undefined}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary-500 dark:bg-primary-400 transition-all duration-300',
                    activeSection === item.href
                      ? 'w-1/2'
                      : 'w-0 group-hover:w-1/2'
                  )}
                />
              </button>
            ))}
          </nav>

          {/* Right Section: Social Icons + Theme + Resume */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Social Icons (Hidden on mobile to save space) */}
            <div className="hidden lg:flex items-center gap-5">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon as keyof typeof iconMap];
                if (!Icon) return null;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLink(link.href)}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors"
                    aria-label={link.label}
                  >
                    <Icon />
                  </a>
                );
              })}
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                onClick={handleResumeDownload}
                className="hidden sm:inline-flex items-center justify-center h-10 px-5 text-base rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white hover:-translate-y-0.5 dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900 shadow-md hover:shadow-lg"
                aria-label="Download resume as PDF"
                suppressHydrationWarning
              >
                Download Resume
              </button>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle menu"
                >
                  <span className="sr-only">Open menu</span>
                  <svg
                    className={cn('h-7 w-7 transition-transform', isMenuOpen && 'rotate-90')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden">
          {/* ... existing mobile menu code, but updated styles if needed ... */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            className="fixed top-20 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-2xl animate-in slide-in-from-top duration-300"
            aria-label="Mobile navigation"
          >
            <div className="px-5 py-6 space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleSmoothScroll(item.href)}
                  className={cn(
                    'relative block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300',
                    activeSection === item.href
                      ? 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  )}
                >
                  {item.label}
                  {activeSection === item.href && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 dark:bg-primary-400 rounded-r-full" />
                  )}
                </button>
              ))}

              {/* Mobile Social Links */}
              <div className="flex justify-center gap-6 py-4 border-t border-gray-100 dark:border-gray-800">
                {socialLinks.map((link) => {
                  const Icon = iconMap[link.icon as keyof typeof iconMap];
                  if (!Icon) return null;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResumeDownload}
                  className="w-full h-12 text-lg font-medium rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg"
                >
                  Download Resume
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}