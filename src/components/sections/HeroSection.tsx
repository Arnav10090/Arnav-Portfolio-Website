'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/metadata';
import { resumeDownload } from '@/data/contact';
import { trackResumeDownload } from '@/lib/analytics';

export function HeroSection() {
  const shouldReduce = useReducedMotion();
  const profileCardRef = useRef<HTMLDivElement>(null);

  const scrollToWork = () => {
    const workSection = document.getElementById('experience');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = async () => {
    const link = document.createElement('a');
    link.href = resumeDownload.url;
    link.download = resumeDownload.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackResumeDownload('hero_section');
  };

  useEffect(() => {
    let frameId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!profileCardRef.current || shouldReduce) return;

      const card = profileCardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
      const rotateY = ((x - centerX) / centerX) * 6; // max 6deg

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        if (!profileCardRef.current) return;
        profileCardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      if (profileCardRef.current) {
        profileCardRef.current.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    };

    const card = profileCardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [shouldReduce]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-start overflow-x-hidden pt-32 sm:pt-36 md:pt-40 lg:pt-[170px] pb-20 sm:pb-24 md:pb-28 lg:pb-[56px] bg-gradient-to-b from-blue-50 to-white dark:from-[#0a0e1a] dark:to-[#1a1f2e]"
      aria-label="Hero section"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduce ? 0 : 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left Column */}
          <div
            className="order-2 lg:order-1 space-y-6 sm:space-y-7 md:space-y-8 text-center lg:text-left lg:pl-12 xl:pl-20"
            style={{ maxWidth: '100%' }}
          >
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1]"
                style={{
                  letterSpacing: '-2px',
                  fontFeatureSettings: '"tnum", "lnum"',
                  perspective: '800px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {personalInfo.name.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-4 last:mr-0"
                    initial={{ opacity: 0, y: 48, rotateX: 12 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: shouldReduce ? 0 : 0.7,
                      delay: shouldReduce ? 0 : i * 0.08,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.6,
                  delay: shouldReduce ? 0 : 0.45,
                }}
                className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-white font-medium"
                style={{ opacity: 0.7, letterSpacing: '0.5px' }}
              >
                {personalInfo.role}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.6,
                  delay: shouldReduce ? 0 : 0.5,
                }}
                className="text-lg sm:text-xl md:text-xl text-blue-600 dark:text-blue-400 font-bold"
                style={{
                  fontFeatureSettings: '"tnum", "lnum"',
                  opacity: 0.9,
                  letterSpacing: '0.5px',
                }}
              >
                {personalInfo.status}
              </motion.p>
            </div>

            <div className="max-w-full sm:max-w-[520px] mx-auto lg:mx-0">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.6,
                  delay: shouldReduce ? 0 : 0.55,
                }}
                className="text-base sm:text-lg text-gray-600 dark:text-white"
                style={{ lineHeight: '1.7', opacity: 0.8 }}
              >
                {personalInfo.description}
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.5,
                  delay: shouldReduce ? 0 : 0.65,
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={scrollToWork}
                  className="w-full min-h-[44px] group relative overflow-hidden transition-all duration-300"
                >
                  View My Work
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: shouldReduce ? 0 : 0.5,
                  delay: shouldReduce ? 0 : 0.75,
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={downloadResume}
                  className="w-full min-h-[44px] group relative transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-blue-600 hover:bg-blue-600 text-gray-900 dark:text-white hover:text-white rounded-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
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
            </div>
          </div>

          {/* Right Column - Profile Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, rotateY: 12 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                duration: shouldReduce ? 0 : 0.9,
                delay: shouldReduce ? 0 : 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            >
              <div
                ref={profileCardRef}
                className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] transition-transform duration-300 ease-out"
                style={{
                  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                <div
                  className="absolute inset-0 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10"
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    boxShadow:
                      '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                    contain: 'layout style paint',
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
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        animate={shouldReduce ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
          <span className="text-xs sm:text-sm font-medium">
            Scroll to explore
          </span>
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
      </motion.div>
    </section>
  );
}
