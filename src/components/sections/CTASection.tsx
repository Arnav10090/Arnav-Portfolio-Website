'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { trackResumeDownload } from '@/lib/analytics';
import { resumeDownload } from '@/data/contact';
import { fadeUpVariant } from '@/lib/animation-variants';

export function CTASection() {
  const shouldReduce = useReducedMotion();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = async () => {
    const link = document.createElement('a');
    link.href = resumeDownload.url;
    link.download = resumeDownload.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackResumeDownload('cta_section');
  };

  return (
    <section
      className="relative w-full overflow-hidden py-16 sm:py-20 md:py-24 lg:py-[100px] bg-indigo-50 dark:bg-[rgba(30,41,59,0.3)]"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
      aria-label="Call to action"
    >
      {/* Decorative gradient orb */}
      <motion.div
        className="absolute pointer-events-none blur-[100px]"
        animate={
          shouldReduce
            ? {}
            : {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 90, 180, 270, 360],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '300px',
          height: '300px',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Centered content with responsive max-width */}
      <motion.div
        className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.15 } },
        }}
        style={{ maxWidth: '100%' }}
      >
        {/* Heading - responsive font sizes */}
        <motion.h2
          variants={fadeUpVariant}
          className="text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6 px-4"
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 700,
            lineHeight: '1.2',
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
          }}
        >
          Ready to Build Something Amazing?
        </motion.h2>

        <motion.p
          variants={fadeUpVariant}
          className="text-gray-600 dark:text-white/80 mb-8 sm:mb-9 md:mb-10 px-4"
          style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
          }}
        >
          Let's collaborate on your next project. I'm always open to discussing
          new opportunities and innovative ideas.
        </motion.p>

        {/* Horizontal button layout with responsive gap and stacking */}
        <motion.div
          variants={fadeUpVariant}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4"
        >
          <motion.div
            whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduce ? {} : { scale: 0.96 }}
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToContact}
              className="w-full min-h-[44px] group relative overflow-hidden transition-all duration-300"
            >
              Get In Touch
            </Button>
          </motion.div>

          <motion.div
            whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduce ? {} : { scale: 0.96 }}
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={downloadResume}
              className="w-full min-h-[44px] group relative transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-blue-600 hover:bg-blue-600 text-gray-900 dark:text-white hover:text-white rounded-xl bg-white/60 dark:bg-white/5"
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
        </motion.div>
      </motion.div>
    </section>
  );
}
